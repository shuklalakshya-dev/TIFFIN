"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiRequest } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      apiRequest({
        url: "/api/auth/verify",
        backendUrl: "http://localhost:5000/api/auth/verify",
        token
      })
        .then((data) => {
          if (data.user && data.user.role !== 'admin') {
            setUser({
              id: data.user._id || data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: 'user' // Always set as user
            })
          }
        })
        .catch(error => {
          console.error("Token verification error:", error)
          // If verification fails on both APIs, remove the token
          localStorage.removeItem("token")
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiRequest({
        url: "/api/auth/login",
        backendUrl: "http://localhost:5000/api/auth/login",
        method: "POST",
        body: { email, password }
      })
      
      if (data && data.token) {
        // Store token in localStorage for API calls
        localStorage.setItem("token", data.token)
        
        // Also set in cookie for middleware
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 30}`
        
        // Handle differences between Next.js API and backend API responses
        // Only allow regular user login, not admin
        let userData;
        
        if (data.user) {
          // Next.js API format
          userData = data.user;
        } else {
          // Backend API format
          userData = {
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
          };
        }
        
        if (userData.role !== 'admin') {
          // Only set user if not an admin
          setUser({
            ...userData,
            role: 'user' // Always set as user
          });
        } else {
          // If admin login attempted, just fail
          localStorage.removeItem("token");
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          return false;
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
