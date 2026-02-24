"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }
    login(email, email.split("@")[0])
    toast.success("Welcome back")
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
              Login
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Welcome back to ABBV
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.2em]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs uppercase tracking-[0.2em]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <Link
              href="/register"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {"Don't have an account?"}{" "}
              <span className="underline underline-offset-4">Register</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
