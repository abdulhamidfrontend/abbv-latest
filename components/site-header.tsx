"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react"
import { useStore } from "@/lib/store-context"

const navLinks = [
  { href: "/", label: "Shop" },
  { href: "/#new", label: "New Arrivals" },
  { href: "/#about", label: "About" },
]

export function SiteHeader() {
  const { cartCount, favourites, user } = useStore()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-[0.2em] transition-colors hover:text-foreground ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-[0.3em] font-[family-name:var(--font-space-grotesk)]"
        >
          ABBV
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <Link href={user ? "/account" : "/login"} aria-label="Account">
            <User className="h-[18px] w-[18px] transition-colors hover:text-muted-foreground" />
          </Link>
          <Link href="/favourites" className="relative" aria-label="Favourites">
            <Heart
              className={`h-[18px] w-[18px] transition-colors hover:text-muted-foreground ${
                favourites.length > 0 ? "fill-foreground" : ""
              }`}
            />
            {favourites.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-foreground text-[10px] text-background">
                {favourites.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative" aria-label="Shopping bag">
            <ShoppingBag className="h-[18px] w-[18px] transition-colors hover:text-muted-foreground" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-foreground text-[10px] text-background">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border px-6 py-6 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
