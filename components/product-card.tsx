"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useStore } from "@/lib/store-context"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  const { toggleFavourite, isFavourite } = useStore()
  const fav = isFavourite(product.id)

  return (
    <div className="group relative flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>

      {/* Favourite button */}
      <button
        onClick={() => toggleFavourite(product.id)}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-background/80 backdrop-blur transition-colors hover:bg-background"
        aria-label={fav ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart
          className={`h-4 w-4 ${fav ? "fill-foreground" : ""}`}
        />
      </button>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium tracking-wide">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <p className="mt-1 text-sm font-medium">${product.price}</p>
      </div>
    </div>
  )
}
