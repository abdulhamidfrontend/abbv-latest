"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
            Shopping Bag
          </h1>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <p className="text-sm text-muted-foreground">Your bag is empty</p>
              <Link
                href="/"
                className="border border-foreground px-8 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
              {/* Cart items */}
              <div className="flex-1">
                <div className="flex flex-col">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-6 border-b border-border py-8 first:border-t"
                    >
                      {/* Image */}
                      <Link href={`/product/${item.product.id}`} className="relative h-32 w-24 flex-shrink-0 bg-secondary">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-1">
                            <Link href={`/product/${item.product.id}`} className="text-sm font-medium tracking-wide">
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              Size: {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between">
                          {/* Quantity */}
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-secondary"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="flex h-9 w-9 items-center justify-center border-x border-border text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-secondary"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <p className="text-sm font-medium">
                            ${item.product.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:w-80">
                <div className="border border-border p-8">
                  <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em]">
                    Order Summary
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{cartTotal >= 200 ? "Free" : "$15"}</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total</span>
                        <span>
                          ${cartTotal >= 200 ? cartTotal : cartTotal + 15}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/payment"
                    className="mt-8 flex w-full items-center justify-center bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/"
                    className="mt-4 flex w-full items-center justify-center border border-border py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:border-foreground"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
