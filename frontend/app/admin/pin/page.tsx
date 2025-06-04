"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function AdminPinPage() {
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (pin === "admin123") {
      // persist for 1 day
      document.cookie = `adminPin=${pin}; path=/; max-age=${60*60*24}`
      toast({ title: "Access granted", description: "Redirecting to dashboard…" })
      router.push("/admin/dashboard")
    } else {
      toast({ title: "Wrong PIN", variant: "destructive" })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md space-y-4 w-80">
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>
        <Input
          type="password"
          placeholder="Enter admin PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" >
          {loading ? "Verifying…" : "Enter Dashboard"}
        </Button>
      </form>
    </div>
  )
}