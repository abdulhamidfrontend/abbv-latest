"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LogOut, Package, Heart, User } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const router = useRouter()
  const { user, logout } = useStore()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/")
  }

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
              Welcome, {user.name}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 border border-border p-5">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Profile</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-4 border border-border p-5 transition-colors hover:bg-secondary"
            >
              <Package className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Shopping Bag</p>
                <p className="text-xs text-muted-foreground">View your bag and checkout</p>
              </div>
            </Link>

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
