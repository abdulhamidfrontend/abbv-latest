"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Truck, MapPin, Loader2 } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Location {
  lat: number
  lng: number
  address: string
}

export default function PaymentPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, user } = useStore()
  const shipping = cartTotal >= 200 ? 0 : 15
  const total = cartTotal + shipping
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<Location | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    telegramUsername: "",
    address: "",
    city: "",
    region: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Leaflet yuklash
  useEffect(() => {
    if (mapInstanceRef.current) return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => setMapReady(true)
    document.head.appendChild(script)
  }, [])

  // Map init
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return

    const L = (window as any).L

    const map = L.map(mapRef.current).setView([41.2995, 69.2401], 12)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map)

    const marker = L.marker([41.2995, 69.2401], { draggable: true })

    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      if (!map.hasLayer(marker)) marker.addTo(map)
      reverseGeocode(lat, lng)
    })

    marker.on("dragend", (e: any) => {
      const { lat, lng } = e.target.getLatLng()
      reverseGeocode(lat, lng)
    })

    mapInstanceRef.current = map
    markerRef.current = marker
  }, [mapReady])

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await res.json()
      const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setLocation({ lat, lng, address })
      updateField("address", address)
    } catch {
      setLocation({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
    }
  }

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15)
          markerRef.current.setLatLng([lat, lng])
          if (!mapInstanceRef.current.hasLayer(markerRef.current)) {
            markerRef.current.addTo(mapInstanceRef.current)
          }
        }
        reverseGeocode(lat, lng)
      },
      () => toast.error("Could not get your location")
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please sign in to checkout")
      router.push("/login")
      return
    }

    const { firstName, lastName, phone, address, city } = formData
    if (!firstName || !lastName || !phone || !address || !city) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!location) {
      toast.error("Please select your location on the map")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    setLoading(true)
    try {
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            region: formData.region,
            phone: formData.phone,
          },
          telegramUsername: formData.telegramUsername.replace("@", ""),
          location: {
            lat: location.lat,
            lng: location.lng,
            address: location.address,
          },
          paymentMethod: "cash",
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        toast.error(orderData.message || "Failed to place order")
        return
      }

      clearCart()
      toast.success("Order placed successfully!")
      router.push(`/orders/${orderData._id}`)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
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
            <p className="mt-3 text-sm text-muted-foreground">Your bag is empty</p>
            <Link href="/" className="mt-6 inline-block border border-foreground px-8 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background">
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
          <Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
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
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em]">Contact</h2>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder="First name *"
                      disabled={loading}
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      placeholder="Last name *"
                      disabled={loading}
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Phone number *"
                    disabled={loading}
                    className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                    <input
                      type="text"
                      value={formData.telegramUsername}
                      onChange={(e) => updateField("telegramUsername", e.target.value.replace("@", ""))}
                      placeholder="Telegram username"
                      disabled={loading}
                      className="w-full border border-border bg-transparent pl-8 pr-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Map */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium uppercase tracking-[0.2em]">
                      Delivery Location *
                    </h2>
                    <button
                      type="button"
                      onClick={getUserLocation}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      Use my location
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Click on the map to select your delivery address
                  </p>

                  <div
                    ref={mapRef}
                    className="h-72 w-full border border-border"
                    style={{ zIndex: 0 }}
                  >
                    {!mapReady && (
                      <div className="flex h-full items-center justify-center gap-2 bg-secondary text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading map...
                      </div>
                    )}
                  </div>

                  {location && (
                    <div className="flex items-start gap-2 border border-border p-3">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                      <span className="text-xs text-muted-foreground">{location.address}</span>
                    </div>
                  )}
                </div>

                {/* Address details */}
                <div className="flex flex-col gap-5">
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em]">Address Details</h2>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Street address *"
                    disabled={loading}
                    className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                  />
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City *"
                      disabled={loading}
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => updateField("region", e.target.value)}
                      placeholder="Region"
                      disabled={loading}
                      className="flex-1 border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Payment */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em]">Payment</h2>
                  <div className="flex items-center gap-3 border border-foreground p-4">
                    <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-96">
                <div className="sticky top-6 border border-border p-8">
                  <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em]">Your Order</h2>

                  <div className="flex flex-col gap-5">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-20 w-16 flex-shrink-0 bg-secondary">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-foreground text-[10px] text-background">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.size && (
                              <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                            )}
                          </div>
                          <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-lg">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !location}
                    className="mt-8 flex w-full items-center justify-center gap-2 bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>

                  {!location && (
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      Please select location on map
                    </p>
                  )}
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