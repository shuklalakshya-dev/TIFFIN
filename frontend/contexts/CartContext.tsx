"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  appliedPromo: string | null
  setAppliedPromo: (promo: string | null) => void
  getDiscountAmount: () => number
  getFinalTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedPromo = localStorage.getItem("appliedPromo")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
    if (savedPromo) {
      setAppliedPromo(savedPromo)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem("appliedPromo", appliedPromo)
    } else {
      localStorage.removeItem("appliedPromo")
    }
  }, [appliedPromo])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.productId === item.productId)
      if (existingItem) {
        return prev.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    setAppliedPromo(null)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getDiscountAmount = () => {
    if (appliedPromo === "TIFFIN") {
      const subtotal = getTotalPrice()
      const deliveryFee = subtotal > 0 ? 50 : 0
      const totalBeforeDiscount = subtotal + deliveryFee
      // Set total to exactly ₹70 with TIFFIN promo
      return Math.max(0, totalBeforeDiscount - 70)
    }
    return 0
  }

  const getFinalTotal = () => {
    const subtotal = getTotalPrice()
    const deliveryFee = subtotal > 0 ? 50 : 0
    const discount = getDiscountAmount()
    return subtotal + deliveryFee - discount
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        appliedPromo,
        setAppliedPromo,
        getDiscountAmount,
        getFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
