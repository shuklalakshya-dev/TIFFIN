"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    image: "",
    category: "",
    inStock: true,
  })

  // Check admin PIN authentication on component mount
  useEffect(() => {
    const adminPinCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('adminPin='))
      ?.split('=')[1]

    if (!adminPinCookie || adminPinCookie !== 'admin123') {
      toast({
        title: "Authentication Required",
        description: "Redirecting to PIN entry.",
        variant: "destructive",
      })
      router.push('/admin/pin')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, inStock: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Basic Client-Side Validation
      if (!formData.name.trim() || !formData.description.trim() || !formData.price.trim() || !formData.category.trim() || !formData.image.trim()) {
        throw new Error("Please fill all required fields: Name, Description, Price, Category, and Image URL.")
      }
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        throw new Error("Price must be a positive number.")
      }
      if (formData.offerPrice.trim() && (isNaN(parseFloat(formData.offerPrice)) || parseFloat(formData.offerPrice) <= 0)) {
        throw new Error("Offer Price, if provided, must be a positive number.")
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : undefined,
        category: formData.category.trim(),
        image: formData.image.trim(),
        inStock: formData.inStock,
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || res.statusText)

      toast({ title: "Success", description: data.message || "Product added." })

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        offerPrice: "",
        image: "",
        category: "",
        inStock: true,
      })
      setImagePreview("")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1500)

    } catch (error: any) {
      console.error("Error in handleSubmit:", error)
      toast({
        title: "Operation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update image preview when URL changes
  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image)
    } else {
      setImagePreview("")
    }
  }, [formData.image])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Electronics, Books"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price">Regular Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 199.99"
                  />
                </div>
                <div>
                  <Label htmlFor="offerPrice">Offer Price (₹) - Optional</Label>
                  <Input
                    id="offerPrice"
                    name="offerPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.offerPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 149.99 (leave empty if no offer)"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm mb-1 font-medium">Image Preview:</p>
                  <div className="relative h-40 w-40 border rounded overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={() => {
                        console.warn("Image preview error for URL:", imagePreview)
                        setImagePreview("") // Clear preview if image fails to load
                        toast({
                          title: "Image Load Error",
                          description: "Could not load image preview. Check URL.",
                          variant: "destructive"
                        })
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3 pt-2">
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="inStock" className="cursor-pointer">
                  Product is In Stock
                </Label>
              </div>
              
              <Button type="submit" className="w-full !mt-8" disabled={loading}>
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
