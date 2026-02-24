"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "sonner"

export default function PaymentPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useStore()
  const shipping = cartTotal >= 200 ? 0 : 15
  const total = cartTotal + shipping

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const required = Object.values(formData)
    if (required.some((v) => !v.trim())) {
      toast.error("Please fill in all fields")
      return
    }
    clearCart()
    toast.success("Order placed successfully!")
    router.push("/")
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-[0.1em] font-[family-name:var(--font-space-grotesk)]">
              Nothing to checkout
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your bag is empty
            </p>
            <Link
              href="/"
              className="mt-6 inline-block border border-foreground px-8 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/cart"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to bag
          </Link>

          <h1 className="mb-12 text-3xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
            Checkout
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
              {/* Form */}
              <div className="flex-1 flex flex-col gap-10">
                {/* Contact */}
                <div className="flex flex-col gap-5">
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em]">
                    Contact
                  </h2>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Email address"
                    className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                </div>

                {/* Shipping */}
                <div className="flex flex-col gap-5">
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em]">
                    Shipping Address
                  </h2>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder="First name"
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      placeholder="Last name"
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Address"
                    className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City"
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      placeholder="Postal code"
                      className="w-1/3 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="Country"
                    className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                </div>

                {/* Payment */}
                <div className="flex flex-col gap-5">
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em]">
                    Payment
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Secure encrypted payment</span>
                  </div>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => updateField("cardName", e.target.value)}
                    placeholder="Name on card"
                    className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      updateField(
                        "cardNumber",
                        e.target.value
                          .replace(/\D/g, "")
                          .replace(/(\d{4})/g, "$1 ")
                          .trim()
                          .slice(0, 19)
                      )
                    }
                    placeholder="Card number"
                    maxLength={19}
                    className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={formData.expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "")
                        if (val.length >= 2) {
                          val = val.slice(0, 2) + " / " + val.slice(2, 4)
                        }
                        updateField("expiry", val.slice(0, 7))
                      }}
                      placeholder="MM / YY"
                      maxLength={7}
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.cvc}
                      onChange={(e) =>
                        updateField(
                          "cvc",
                          e.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      placeholder="CVC"
                      maxLength={4}
                      className="w-1/3 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary sidebar */}
              <div className="lg:w-96">
                <div className="border border-border p-8">
                  <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em]">
                    Your Order
                  </h2>

                  <div className="flex flex-col gap-5">
                    {cart.map((item) => (
                      <div
                        key={`${item.product.id}-${item.size}`}
                        className="flex gap-4"
                      >
                        <div className="relative h-20 w-16 flex-shrink-0 bg-secondary">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-foreground text-[10px] text-background">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Size: {item.size}
                            </p>
                          </div>
                          <p className="text-sm">
                            ${item.product.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-lg">${total}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-8 flex w-full items-center justify-center bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
