import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative flex h-[85vh] items-center justify-center overflow-hidden bg-foreground text-background">
      <Image
        src="/images/hero.jpg"
        alt="ABBV Collection"
        fill
        priority
        className="object-cover opacity-60"
        sizes="100vw"
      />
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <span className="text-xs uppercase tracking-[0.4em] opacity-80">
          New Collection
        </span>
        <h1 className="max-w-3xl text-balance text-5xl font-bold uppercase tracking-[0.15em] md:text-7xl lg:text-8xl font-[family-name:var(--font-space-grotesk)]">
          Less is More
        </h1>
        <p className="max-w-md text-pretty text-sm leading-relaxed opacity-70">
          Essential pieces designed with intention. Our latest collection strips away the unnecessary, leaving only what matters.
        </p>
        <Link
          href="/#products"
          className="mt-4 border border-background px-10 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-background hover:text-foreground"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
