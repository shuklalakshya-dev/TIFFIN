export interface User {
  _id?: string
  name: string
  email: string
  password: string
  role: "user" | "admin"
  createdAt: Date
}

export interface Product {
  _id?: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  createdAt: Date
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  _id?: string
  userId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: CartItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "delivered"
  createdAt: Date
}
