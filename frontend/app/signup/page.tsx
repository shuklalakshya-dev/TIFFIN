"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }

    try {
      // Try to register using our API helper which will attempt Next.js API first
      // and then fall back to the backend API if needed
      const response = await apiRequest({
        url: "/api/auth/signup",
        backendUrl: "https://tiffin-backend-tvjj.onrender.com/api/auth/register", // Note: backend uses "register" endpoint
        method: "POST",
        body: userData
      })

      // If we get here, the registration was successful
      toast({
        title: "Account created",
        description: "Welcome to the platform!",
      })
      
      // Auto-login the user
      const loginSuccess = await login(formData.email, formData.password);
      
      if (loginSuccess) {
        // Wait a moment for the auth context to update
        setTimeout(() => {
          router.push("/");
        }, 100);
      } else {
        // If auto-login fails, redirect to login page
        router.push("/login");
      }
    } catch (error: any) {
      // Handle specific error messages
      const errorMessage = error?.message || "Something went wrong";
      
      toast({
        title: "Signup failed",
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
