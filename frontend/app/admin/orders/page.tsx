"use client"

import { OrderManagement } from "@/components/admin/OrderManagement"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"


export default function AdminOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Check admin access via PIN
    const adminPin = document.cookie.split('; ').find(row => row.startsWith('adminPin='))?.split('=')[1]
    
    if (adminPin !== "admin123") {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to view this page",
        variant: "destructive"
      })
      router.push("/admin/pin")
      return
    }
    
    setHasAccess(true)
    setLoading(false)
  }, [router, toast])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }
  
  if (!hasAccess) return null
    return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>
      <OrderManagement onStatsUpdate={() => {}} />
    </div>
  )
}