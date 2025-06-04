"use client"

import { OrderManagement } from "@/components/admin/OrderManagement"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export default function AdminOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [hasAccess, setHasAccess] = useState(false)
  
  useEffect(() => {
    // Check admin access
    const token = localStorage.getItem("token")
    const adminPin = document.cookie.split('; ').find(row => row.startsWith('adminPin='))
    
    if (!token || !adminPin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to view this page",
        variant: "destructive"
      })
      router.push("/admin/pin")
      return
    }
    
    setHasAccess(true)
  }, [router, toast])
  
  if (!hasAccess) return null
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <OrderManagement onStatsUpdate={() => {}} />
    </div>
  )
}