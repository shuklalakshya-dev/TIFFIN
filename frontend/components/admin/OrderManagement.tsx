"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { apiRequest } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/utils"

interface Order {
  _id: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "delivered"
  createdAt: string
}

interface OrderManagementProps {
  onStatsUpdate: () => void
}

export function OrderManagement({ onStatsUpdate }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      const data = await apiRequest<Order[]>({
        url: "/api/admin/orders",
        backendUrl: "https://tiffin-backend-tvjj.onrender.com/api/admin/orders",
        token
      })
      
      if (data) {
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem("token")
      
      await apiRequest({
        url: `/api/admin/orders/${orderId}`,
        backendUrl: `https://tiffin-backend-tvjj.onrender.com/api/admin/orders/${orderId}`,
        method: "PATCH",
        body: { status },
        token
      })
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: status as any } : order
        )
      )
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${status}`,
      })
      
      // Update dashboard stats
      onStatsUpdate()
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-600">No orders found</h3>
          <p className="text-gray-500 mt-1">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <div className={`h-2 ${
                order.status === 'pending' ? 'bg-orange-500' :
                order.status === 'confirmed' ? 'bg-blue-500' :
                order.status === 'preparing' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}></div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center gap-2">
                    <p className="text-sm font-medium">Status:</p>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order._id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Name:</span> {order.customerInfo.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {order.customerInfo.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> {order.customerInfo.phone}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Address:</span> {order.customerInfo.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <hr />
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
