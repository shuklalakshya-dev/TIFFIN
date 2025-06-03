"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import ProductManagement from "@/components/admin/ProductManagement" // ← import it
import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Stats {
  totalProducts: number
  inStockProducts: number
  outOfStockProducts: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
  })

  // fetch stats on mount and on refresh
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      if (res.ok) {
        const data = await res.json()
        setStats({
          totalProducts: data.totalProducts,
          inStockProducts: data.inStockProducts,
          outOfStockProducts: data.outOfStockProducts,
        })
      }
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Total Products
              <Package className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              In Stock
              <Package className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inStockProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Out of Stock
              <Package className="h-5 w-5 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.outOfStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Product Management Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
        {/* this component will show each product with image, details, edit & delete buttons */}
        <ProductManagement onStatsUpdate={fetchStats} />
      </div>

      <Button asChild>
        <Link href="/admin/orders">Order Management</Link>
      </Button>
    </div>
  )
}