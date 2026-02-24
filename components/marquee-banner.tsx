export function MarqueeBanner() {
  const text = "FREE SHIPPING ON ORDERS OVER $200"
  const repeats = Array.from({ length: 10 })

  return (
    <div className="overflow-hidden border-b border-border bg-foreground py-2.5 text-background">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeats.map((_, i) => (
          <span
            key={i}
            className="mx-8 inline-block text-[11px] uppercase tracking-[0.3em]"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
