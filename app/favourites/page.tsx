"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard, type BackendProduct } from "@/components/product-card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function FavouritesPage() {
  const { user, hydrated } = useStore()
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hydrated) return
    if (!user) { setLoading(false); return }
    fetchWishlist()
  }, [user, hydrated])

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
            Favourites
          </h1>

          {loading ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="aspect-[3/4] animate-pulse bg-secondary" />
                  <div className="h-3 w-2/3 animate-pulse bg-secondary" />
                  <div className="h-3 w-1/3 animate-pulse bg-secondary" />
                </div>
              ))}
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <p className="text-sm text-muted-foreground">
                Please sign in to view your favourites
              </p>
              <Link
                href="/login"
                className="border border-foreground px-8 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
              >
                Sign In
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <p className="text-sm text-muted-foreground">
                You have no saved items yet
              </p>
              <Link
                href="/"
                className="border border-foreground px-8 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}