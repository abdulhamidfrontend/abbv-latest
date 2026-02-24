import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { MarqueeBanner } from "@/components/marquee-banner"
import { ProductGrid } from "@/components/product-grid"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <MarqueeBanner />
      <main className="flex-1">
        <Hero />
        <ProductGrid />

        {/* About section */}
        <section id="about" className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-24 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              About
            </span>
            <h2 className="max-w-2xl text-balance text-3xl font-bold uppercase tracking-[0.1em] md:text-4xl font-[family-name:var(--font-space-grotesk)]">
              Designed with Intention
            </h2>
            <p className="max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
              ABBV is built on the belief that great clothing is quiet. Each piece is crafted from premium materials with meticulous attention to fit, fabric, and finish. No logos, no noise -- just clothes that work.
            </p>
          </div>
        </section>

        {/* Newsletter */}
        <section id="new" className="border-t border-border bg-foreground text-background">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-24 text-center">
            <span className="text-xs uppercase tracking-[0.3em] opacity-60">
              Stay Updated
            </span>
            <h2 className="text-3xl font-bold uppercase tracking-[0.1em] font-[family-name:var(--font-space-grotesk)]">
              New Arrivals
            </h2>
            <p className="max-w-md text-sm leading-relaxed opacity-60">
              Be the first to know about new collections and exclusive drops. No spam, just clothes.
            </p>
            <div className="mt-4 flex w-full max-w-md">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 border border-background/30 bg-transparent px-4 py-3 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-background"
              />
              <button className="border border-background bg-background px-6 py-3 text-sm uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-transparent hover:text-background">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
