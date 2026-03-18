"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle, Package, Truck, MapPin, Phone } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Order {
  _id: string
  items: {
    _id: string
    name: string
    image: string
    price: number
    quantity: number
  }[]
  shippingAddress: {
    street: string
    city: string
    region?: string
    phone: string
  }
  totalPrice: number
  shippingPrice: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
}

const statusSteps = ["new", "confirmed", "processing", "shipped", "delivered"]

const statusLabel: Record<string, string> = {
  new:        "Order Placed",
  confirmed:  "Confirmed",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
}

const statusColor: Record<string, string> = {
  new:        "text-blue-600",
  confirmed:  "text-indigo-600",
  processing: "text-yellow-600",
  shipped:    "text-purple-600",
  delivered:  "text-green-600",
  cancelled:  "text-red-600",
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, hydrated } = useStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hydrated) return
    if (!user) { router.push("/login"); return }
    fetchOrder()
  }, [hydrated, user])

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) { router.push("/login"); return }

      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) { router.push("/orders"); return }
      const data = await res.json()
      setOrder(data)
    } catch {
      router.push("/orders")
    } finally {
      setLoading(false)
    }
  }

  if (loading || !hydrated) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="flex flex-col gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse bg-secondary" />
              ))}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!order) return null

  const currentStep = statusSteps.indexOf(order.status)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">

          {/* Header */}
          <div className="mb-12 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h1 className="text-2xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
              Order Confirmed
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>

          {/* Status tracker */}
          {order.status !== "cancelled" && (
            <div className="mb-10 border border-border p-6">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex flex-1 flex-col items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors ${
                      i <= currentStep
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <p className={`hidden text-center text-[10px] uppercase tracking-wider sm:block ${
                      i <= currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {statusLabel[step]}
                    </p>
                    {i < statusSteps.length - 1 && (
                      <div className={`absolute hidden`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center">
                <span className={`text-sm font-medium ${statusColor[order.status] || ""}`}>
                  {statusLabel[order.status]}
                </span>
              </div>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="mb-10 border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
              This order has been cancelled
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Items */}
            <div className="border border-border p-6">
              <h2 className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                <Package className="h-4 w-4" /> Items
              </h2>
              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="h-16 w-12 flex-shrink-0 bg-secondary">
                      <img
                        src={
                          item.image
                            ? item.image.startsWith("http")
                              ? item.image
                              : `http://localhost:5000${item.image}`
                            : "/placeholder.jpg"
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.totalPrice - order.shippingPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shippingPrice === 0 ? "Free" : `$${order.shippingPrice}`}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="border border-border p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                <Truck className="h-4 w-4" /> Shipping Address
              </h2>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    {order.shippingAddress.region && `, ${order.shippingAddress.region}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border border-border p-6">
              <h2 className="mb-4 text-xs uppercase tracking-[0.2em]">Payment</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span>{order.paymentMethod === "cash" ? "Cash on Delivery" : "Payme"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${
                  order.paymentStatus === "paid" ? "text-green-600" :
                  order.paymentStatus === "pending" ? "text-yellow-600" : "text-red-600"
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="flex-1 border border-border py-4 text-center text-xs uppercase tracking-[0.25em] transition-colors hover:border-foreground"
            >
              All Orders
            </Link>
            <Link
              href="/"
              className="flex-1 bg-foreground py-4 text-center text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  )
}