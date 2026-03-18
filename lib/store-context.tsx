"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  size: string
  quantity: number
}

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

interface StoreContextType {
  cart: CartItem[]
  favourites: string[]
  user: User | null
  hydrated: boolean
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleFavourite: (productId: string) => void
  isFavourite: (productId: string) => boolean
  login: (email: string, name: string) => void
  logout: () => void
  cartTotal: number
  cartCount: number
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [favourites, setFavourites] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Refresh bo'lganda localStorage dan o'qish
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("token")
      if (storedUser && token) {
        const parsed = JSON.parse(storedUser)
        setUser({
          id: parsed.id || parsed._id || "",
          email: parsed.email || "",
          name: parsed.name || "",
          isAdmin: parsed.isAdmin || false,
        })
      }
    } catch {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }

    try {
      const storedFavs = localStorage.getItem("favourites")
      if (storedFavs) setFavourites(JSON.parse(storedFavs))
    } catch {
      localStorage.removeItem("favourites")
    }

    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) setCart(JSON.parse(storedCart))
    } catch {
      localStorage.removeItem("cart")
    }

    setHydrated(true)
  }, [])

  // Cart o'zgarganda localStorage ga saqlash
  useEffect(() => {
    if (hydrated) localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart, hydrated])

  // Favourites o'zgarganda localStorage ga saqlash
  useEffect(() => {
    if (hydrated) localStorage.setItem("favourites", JSON.stringify(favourites))
  }, [favourites, hydrated])

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.productId === item.productId && i.size === item.size)
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter(i => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter(i => i.id !== id))
      return
    }
    setCart((prev) => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleFavourite = useCallback((productId: string) => {
    setFavourites((prev) =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }, [])

  const isFavourite = useCallback(
    (productId: string) => favourites.includes(productId),
    [favourites]
  )

  const login = useCallback((email: string, name: string) => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser({
          id: parsed.id || parsed._id || "",
          email: parsed.email || email,
          name: parsed.name || name,
          isAdmin: parsed.isAdmin || false,
        })
      } else {
        setUser({ id: "", email, name, isAdmin: false })
      }
    } catch {
      setUser({ id: "", email, name, isAdmin: false })
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCart([])
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
  }, [])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <StoreContext.Provider value={{
      cart, favourites, user, hydrated,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleFavourite, isFavourite,
      login, logout,
      cartTotal, cartCount,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within a StoreProvider")
  return context
}