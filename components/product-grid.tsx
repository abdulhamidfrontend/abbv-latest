"use client"

import { products } from "@/lib/products"
import { ProductCard } from "./product-card"

export function ProductGrid() {
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
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
