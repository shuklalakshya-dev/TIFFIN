"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { redirectToFrontendUrl } from "@/lib/url-helpers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(email, password)

    if (success) {
      if (user && user.role === "admin") {        toast({
          title: "Admin login successful",
          description: "Welcome to the product management dashboard",
        })
        router.push("/admin/products")
      } else {
        // If not admin, show error
        toast({
          title: "Access denied",
          description: "This login is only for administrators",
          variant: "destructive",
        })        // Logout the non-admin user
        localStorage.removeItem("token")
        redirectToFrontendUrl('/admin/login')
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-800 text-white">
        <CardHeader className="text-center border-b border-gray-700 pb-6">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Log In to Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded-md">
            <p className="text-sm font-medium mb-2 text-gray-300">Admin Demo Account:</p>
            <p className="text-xs text-gray-400">Email: admin@demo.com</p>
            <p className="text-xs text-gray-400">Password: admin123</p>
          </div>
        </CardContent>        <CardFooter className="border-t border-gray-700 flex justify-between pt-4">
          <Link href="/admin/signup" className="text-sm text-gray-400 hover:text-white">
            Create Admin Account
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            Return to Main Site
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
