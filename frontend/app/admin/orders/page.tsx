import { OrderManagement } from "@/components/admin/OrderManagement"
import React from "react"


export default function AdminOrdersPage() {
  // you can pass a real stats‐update fn here if needed
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <OrderManagement onStatsUpdate={() => {}} />
    </div>
  )
}