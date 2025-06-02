"use client"

import { useState, useEffect } from "react"
import ProductManagement from "@/components/admin/ProductManagement"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, LogOut } from "lucide-react"

// Define stats interface
interface Stats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0
  })

  useEffect(() => {
    // Check if authenticated via cookies
    const adminCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('adminAuthenticated='))
      ?.split('=')[1]
    
    const isAuthenticated = adminCookie === 'true' || 
                         sessionStorage.getItem("adminAuthenticated") === "true"
    
    if (!isAuthenticated) {
      router.push("/admin/pin")
      return
    }
    
    setLoading(false)
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      // Fetch product stats from API
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalProducts: data.totalProducts || 0,
          inStockProducts: data.inStockProducts || 0,
          outOfStockProducts: data.outOfStockProducts || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleLogout = () => {
    // Clear admin authentication
    document.cookie = "adminAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    sessionStorage.removeItem("adminAuthenticated")
    router.push("/admin/pin")
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            </div>

            <ProductManagement onStatsUpdate={fetchStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
