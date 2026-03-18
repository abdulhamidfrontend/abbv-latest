"use client"

import { useEffect, useState } from "react"
import { ProductCard, type BackendProduct } from "./product-card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export function ProductGrid() {
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=100`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Collection
        </span>
        <h2 className="text-3xl font-bold uppercase tracking-[0.1em] md:text-4xl font-[family-name:var(--font-space-grotesk)]">
          All Products
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-[3/4] animate-pulse bg-secondary" />
              <div className="h-3 w-2/3 animate-pulse bg-secondary" />
              <div className="h-3 w-1/3 animate-pulse bg-secondary" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No products found</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}