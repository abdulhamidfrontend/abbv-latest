"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Minus, Plus } from "lucide-react"
import { products } from "@/lib/products"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { toast } from "sonner"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)
  const { addToCart, toggleFavourite, isFavourite } = useStore()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link href="/" className="mt-4 inline-block text-sm text-muted-foreground underline">
              Back to shop
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const fav = isFavourite(product.id)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize)
    }
    toast.success(`${product.name} added to bag`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Back */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to shop
          </Link>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
            {/* Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary lg:w-1/2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-8 lg:w-1/2 lg:py-8">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {product.category}
                </p>
                <h1 className="text-3xl font-bold uppercase tracking-[0.05em] md:text-4xl font-[family-name:var(--font-space-grotesk)]">
                  {product.name}
                </h1>
                <p className="mt-2 text-2xl font-medium">${product.price}</p>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Size selector */}
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.2em]">Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-12 w-12 items-center justify-center border text-sm transition-colors ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.2em]">Quantity</span>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-secondary"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="flex h-12 w-12 items-center justify-center border-x border-border text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-secondary"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => toggleFavourite(product.id)}
                  className={`flex h-[52px] w-[52px] items-center justify-center border border-border transition-colors hover:border-foreground ${
                    fav ? "bg-foreground text-background" : ""
                  }`}
                  aria-label={fav ? "Remove from favourites" : "Add to favourites"}
                >
                  <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-4 border-t border-border pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Material</span>
                  <span>Premium Cotton</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fit</span>
                  <span>Relaxed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Care</span>
                  <span>Machine Wash Cold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related products */}
          <section className="mt-24 border-t border-border pt-16">
            <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-[0.1em] font-[family-name:var(--font-space-grotesk)]">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
