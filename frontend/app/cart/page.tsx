"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2, Tag } from "lucide-react"
import Image from "next/image"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 ? 40 : 0

  // Calculate discount if promo code is applied
  let total = subtotal + deliveryFee;
  let discount = 0;

  if (appliedPromo === "TIFFIN") {
    // If promo code is applied, set TOTAL to exactly ₹70
    total = 70;
    // Calculate the discount as everything being removed except for ₹70
    discount = (subtotal + deliveryFee) - 70;
  }

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "TIFFIN") {
      setAppliedPromo("TIFFIN")
      toast({
        title: "Promo code applied!",
        description: "Your total order amount is now exactly ₹70",
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid",
        variant: "destructive",
      })
    }
    setPromoCode("")
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    toast({
      title: "Promo code removed",
      description: "The promo code has been removed from your order",
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Button asChild>
              <a href="/">Continue Shopping</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex border-b pb-4"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-gray-500 text-sm">₹{item.price.toFixed(2)} each</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearCart()}
              >
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              {/* Promo code input */}
              {!appliedPromo ? (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex space-x-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1"
                    />
                    <Button onClick={handleApplyPromo} size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        {appliedPromo} applied!
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePromo}
                      className="h-6 w-6 p-0 rounded-full"
                    >
                      ×
                    </Button>
                  </div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-green-600 mt-1">
                    TIFFIN code applied! Your total is now ₹70.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
