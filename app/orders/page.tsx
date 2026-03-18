"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Package, ChevronRight } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Order {
  _id: string
  items: { name: string; image: string; quantity: number }[]
  totalPrice: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
}

const statusColor: Record<string, string> = {
  new:        "bg-blue-100 text-blue-800",
  confirmed:  "bg-indigo-100 text-indigo-800",
  processing: "bg-yellow-100 text-yellow-800",
  shipped:    "bg-purple-100 text-purple-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
}

const paymentColor: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-800",
  paid:     "bg-green-100 text-green-800",
  failed:   "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, hydrated } = useStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hydrated) return
    if (!user) { router.push("/login"); return }
    fetchOrders()
  }, [hydrated, user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) { router.push("/login"); return }

      const res = await fetch(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) return
      const data = await res.json()
      setOrders(data)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="mb-12 text-center text-3xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
            My Orders
          </h1>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse border border-border bg-secondary" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">You have no orders yet</p>
              <Link
                href="/"
                className="border border-foreground px-8 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="flex items-center gap-4 border border-border p-5 transition-colors hover:bg-secondary"
                >
                  {/* Images */}
                  <div className="flex flex-shrink-0 -space-x-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="h-14 w-11 border border-border bg-secondary"
                        style={{ zIndex: 3 - i }}
                      >
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
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-14 w-11 items-center justify-center border border-border bg-secondary text-xs text-muted-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {order.items.length === 1
                          ? order.items[0].name
                          : `${order.items[0].name} +${order.items.length - 1} more`}
                      </p>
                      <p className="flex-shrink-0 text-sm font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full ${statusColor[order.status] || ""}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full ${paymentColor[order.paymentStatus] || ""}`}>
                        {order.paymentMethod === "cash" ? "Cash" : order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}