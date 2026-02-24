import Link from "next/link"

const footerLinks = {
  Shop: [
    { label: "New Arrivals", href: "/" },
    { label: "Outerwear", href: "/" },
    { label: "Tops", href: "/" },
    { label: "Trousers", href: "/" },
  ],
  Help: [
    { label: "Shipping", href: "/" },
    { label: "Returns", href: "/" },
    { label: "Size Guide", href: "/" },
    { label: "Contact", href: "/" },
  ],
  Company: [
    { label: "About", href: "/" },
    { label: "Careers", href: "/" },
    { label: "Privacy", href: "/" },
    { label: "Terms", href: "/" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-bold tracking-[0.3em] font-[family-name:var(--font-space-grotesk)]">
              ABBV
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Minimal luxury clothing. Essential pieces designed for the modern wardrobe.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-4">
                <span className="text-xs font-medium uppercase tracking-[0.2em]">
                  {category}
                </span>
                <nav className="flex flex-col gap-3" aria-label={`${category} links`}>
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {'2026 ABBV. All rights reserved.'}
          </p>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/abbv.uz" className="text-xs text-muted-foreground">Instagram</a>
            <div className="h-4 bg-gray-400 w-[1px]"></div>
            <a href="https://t.me/abbv_uz" className="text-xs text-muted-foreground">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
