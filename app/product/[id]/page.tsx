"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Minus, Plus } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard, type BackendProduct } from "@/components/product-card"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addToCart, toggleFavourite, isFavourite } = useStore()
  const [product, setProduct] = useState<BackendProduct | null>(null)
  const [related, setRelated] = useState<BackendProduct[]>([])
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`)
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        setProduct(data)

        // Related products
        const relRes = await fetch(`${API_URL}/products?limit=4`)
        const relData = await relRes.json()
        setRelated((relData.products || []).filter((p: BackendProduct) => p._id !== id).slice(0, 4))
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const fav = product ? isFavourite(product._id) : false

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      id: `${product._id}-${selectedSize}`,
      productId: product._id,
      name: product.name,
      image: product.images?.[0]
        ? product.images[0].startsWith("http")
          ? product.images[0]
          : `http://localhost:5000${product.images[0]}`
        : "/placeholder.jpg",
      price: product.discountPrice ?? product.price,
      size: selectedSize,
      quantity,
    })
    toast.success(`${product.name} added to bag`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
              <div className="aspect-[3/4] w-full animate-pulse bg-secondary lg:w-1/2" />
              <div className="flex flex-col gap-6 lg:w-1/2 lg:py-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse bg-secondary" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

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

  const displayPrice = product.discountPrice ?? product.price
  const hasDiscount = product.discountPrice && product.discountPrice < product.price

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
              <img
                src={
                  product.images?.[0]
                    ? product.images[0].startsWith("http")
                      ? product.images[0]
                      : `http://localhost:5000${product.images[0]}`
                    : "/placeholder.jpg"
                }
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <span className="text-xs uppercase tracking-[0.2em]">Sold Out</span>
                </div>
              )}
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
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-2xl font-medium">${displayPrice}</p>
                  {hasDiscount && (
                    <p className="text-lg text-muted-foreground line-through">${product.price}</p>
                  )}
                </div>
                {product.stock > 0 && product.stock < 10 && (
                  <p className="text-xs text-red-500">Only {product.stock} left</p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}

              {/* Quantity */}
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.2em]">Quantity</span>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-secondary"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="flex h-12 w-12 items-center justify-center border-x border-border text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-secondary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? "Sold Out" : "Add to Bag"}
                </button>
                <button
                  onClick={() => toggleFavourite(product._id)}
                  className={`flex h-[52px] w-[52px] items-center justify-center border border-border transition-colors hover:border-foreground ${
                    fav ? "bg-foreground text-background" : ""
                  }`}
                >
                  <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="border border-border px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-col gap-4 border-t border-border pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span>{product.rating > 0 ? `${product.rating} / 5` : "No reviews yet"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Likes</span>
                  <span>{product.likesCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">In Stock</span>
                  <span>{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-24 border-t border-border pt-16">
              <h2 className="mb-10 text-center text-2xl font-bold uppercase tracking-[0.1em] font-[family-name:var(--font-space-grotesk)]">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}