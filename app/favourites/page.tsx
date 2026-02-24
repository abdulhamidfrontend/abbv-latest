"use client"

import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { products } from "@/lib/products"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"

export default function FavouritesPage() {
  const { favourites } = useStore()
  const favouriteProducts = products.filter((p) => favourites.includes(p.id))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
            Favourites
          </h1>

          {favouriteProducts.length === 0 ? (
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
              {favouriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
