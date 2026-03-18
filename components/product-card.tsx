"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface BackendProduct {
  _id: string
  name: string
  description: string
  price: number
  discountPrice?: number
  category: string
  images: string[]
  likesCount: number
  rating: number
  numReviews: number
  stock: number
  sold: number
  tags: string[]
  comments?: any[]
}

export function ProductCard({ product }: { product: BackendProduct }) {
  const { toggleFavourite, isFavourite } = useStore();
  const fav = isFavourite(product._id);

  const handleFavourite = async () => {
    toggleFavourite(product._id);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${API_URL}/wishlist/${product._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // silent fail — local state already toggled
    }
  };

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group relative flex flex-col">
      {/* Image */}
      <Link
        href={`/product/${product._id}`}
        className="relative aspect-[3/4] overflow-hidden bg-secondary"
      >
        // Image o'rniga
        <img
          src={
            product.images?.[0]
              ? product.images[0].startsWith("http")
                ? product.images[0]
                : `http://localhost:5000${product.images[0]}`
              : "/placeholder.jpg"
          }
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="text-xs uppercase tracking-[0.2em]">Sold Out</span>
          </div>
        )}
      </Link>

      {/* Favourite button */}
      <button
        onClick={handleFavourite}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-background/80 backdrop-blur transition-colors hover:bg-background"
        aria-label={fav ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart className={`h-4 w-4 ${fav ? "fill-foreground" : ""}`} />
      </button>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-1">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-sm font-medium tracking-wide">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm font-medium">${displayPrice}</p>
          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">
              ${product.price}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
