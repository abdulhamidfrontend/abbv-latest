"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Product } from "./products"

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

interface User {
  email: string
  name: string
}

interface StoreContextType {
  cart: CartItem[]
  favourites: string[]
  user: User | null
  addToCart: (product: Product, size: string) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
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

  const addToCart = useCallback((product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      )
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, size, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, size)
        return
      }
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      )
    },
    [removeFromCart]
  )

  const clearCart = useCallback(() => setCart([]), [])

  const toggleFavourite = useCallback((productId: string) => {
    setFavourites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const isFavourite = useCallback(
    (productId: string) => favourites.includes(productId),
    [favourites]
  )

  const login = useCallback((email: string, name: string) => {
    setUser({ email, name })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{
        cart,
        favourites,
        user,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavourite,
        isFavourite,
        login,
        logout,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
