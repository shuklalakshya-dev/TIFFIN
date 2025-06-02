"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/api"
import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

export default function AdminSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: ""
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login, user } = useAuth()

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin/products")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    // Validate admin code (you can replace this with your desired admin registration code)
    if (formData.adminCode !== "admin123") {
      toast({
        title: "Invalid admin code",
        description: "The admin registration code is incorrect",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "admin" // Explicitly set role to admin
    }

    try {
      // Register the admin user
      const response = await apiRequest({
        url: "/api/auth/admin-signup",
        backendUrl: "http://localhost:5000/api/auth/admin-register",
        method: "POST",
        body: userData
      })

      toast({
        title: "Admin account created",
        description: "Your admin account has been registered successfully!",
      })
      
      // Auto-login the admin
      const loginSuccess = await login(formData.email, formData.password)
      
      if (loginSuccess) {
        // Wait a moment for the auth context to update
        setTimeout(() => {
          router.push("/admin/products")
        }, 100)
      } else {
        // If auto-login fails, redirect to admin login page
        router.push("/admin/login")
      }
    } catch (error: any) {
      // Handle specific error messages
      const errorMessage = error?.message || "Something went wrong"
      
      toast({
        title: "Admin signup failed",
        description: errorMessage.includes("already exists") 
          ? "Email is already registered" 
          : errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-800 text-white">
        <CardHeader className="text-center border-b border-gray-700 pb-6">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Create Admin Account</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="adminCode" className="text-gray-300">Admin Registration Code</Label>
              <Input
                id="adminCode"
                type="password"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
              <p className="text-gray-400 text-xs mt-1">Enter the admin registration code provided by system administrator</p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
          <Link href="/admin/login" className="text-gray-400 hover:text-white flex items-center text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Login
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            Return to Main Site
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
