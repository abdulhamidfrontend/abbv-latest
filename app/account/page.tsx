"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LogOut, Package, Heart, User } from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface UserInfo {
  name: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    region?: string
  }
  isAdmin?: boolean
  createdAt?: string
}

export default function AccountPage() {
  const router = useRouter()
  const { user, logout, hydrated } = useStore()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hydrated) return          // localStorage hali o'qilmagan — kutish
    if (!user) {
      router.push("/login")
      return
    }
    fetchUserInfo()
  }, [user, hydrated, router])

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        if (res.status === 401) {
          logout()
          router.push("/login")
          return
        }
        return
      }

      const data = await res.json()
      setUserInfo(data)
    } catch {
      // server xatosi — local user bilan davom etadi
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    logout()
    router.push("/")
  }

  // hydration tugaguncha yoki user yo'q bo'lsa — hech narsa ko'rsatma
  if (!hydrated || !user) return null

  const displayName = userInfo?.name || user.name
  const displayEmail = userInfo?.email || user.email

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
              My Account
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Welcome, {displayName}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Profile */}
            <div className="flex items-center gap-4 border border-border p-5">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                {loading ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{displayEmail}</p>
                    {userInfo?.phone && (
                      <p className="text-xs text-muted-foreground">{userInfo.phone}</p>
                    )}
                    {userInfo?.address?.city && (
                      <p className="text-xs text-muted-foreground">
                        {[userInfo.address.street, userInfo.address.city, userInfo.address.region]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {userInfo?.isAdmin && (
                      <span className="mt-1 inline-block text-xs text-foreground underline underline-offset-2">
                        Admin
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Orders */}
            <Link
              href="/orders"
              className="flex items-center gap-4 border border-border p-5 transition-colors hover:bg-secondary"
            >
              <Package className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">My Orders</p>
                <p className="text-xs text-muted-foreground">View your order history</p>
              </div>
            </Link>

            {/* Favourites */}
            <Link
              href="/favourites"
              className="flex items-center gap-4 border border-border p-5 transition-colors hover:bg-secondary"
            >
              <Heart className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Favourites</p>
                <p className="text-xs text-muted-foreground">Your saved items</p>
              </div>
            </Link>

            {/* Admin panel link */}
            {userInfo?.isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-4 border border-border p-5 transition-colors hover:bg-secondary"
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Admin Panel</p>
                  <p className="text-xs text-muted-foreground">Manage products and orders</p>
                </div>
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 border border-border p-5 text-left transition-colors hover:bg-secondary"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-muted-foreground">Log out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}