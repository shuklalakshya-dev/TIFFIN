"use client"

import { useState, useEffect, FormEvent } from "react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Pencil, Trash2, Plus } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  offerPrice?: number
  category: string
  image: string
  inStock: boolean
}

interface ProductManagementProps {
  onStatsUpdate?: () => void
}

export default function ProductManagement({ onStatsUpdate }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "",
    image: "",
    inStock: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, inStock: checked }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      offerPrice: "",
      category: "",
      image: "",
      inStock: true,
    })
    setEditingProduct(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : undefined,
      }
      
      let response
      
      if (editingProduct) {
        // Update existing product
        response = await fetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      } else {
        // Create new product
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      }
      
      if (response.ok) {
        toast({
          title: editingProduct ? "Product Updated" : "Product Created",
          description: editingProduct ? "Product successfully updated" : "Product successfully added",
        })
        resetForm()
        fetchProducts()
        if (onStatsUpdate) onStatsUpdate()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Error processing product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process product",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete product")
      }

      toast({
        title: "Deleted",
        description: "Product has been removed.",
      })

      // refresh list and stats
      fetchProducts()
      onStatsUpdate?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not delete product",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      offerPrice: product.offerPrice ? product.offerPrice.toString() : "",
      category: product.category,
      image: product.image,
      inStock: product.inStock,
    })
  }

  const calculateDiscount = (price: number, offerPrice?: number) => {
    if (!offerPrice || offerPrice >= price) return null
    const discount = ((price - offerPrice) / price) * 100
    return Math.round(discount)
  }

  return (
    <div className="space-y-8">
      {/* Add Product Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="productForm" className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price ($) (Optional)</Label>
                <Input 
                  id="offerPrice" 
                  name="offerPrice" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.offerPrice} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inStock" className="block mb-2">In Stock</Label>
                <Switch 
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={4}
                required 
              />
            </div>
            
            {formData.image && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Image Preview:</p>
                <div className="relative h-40 w-40 border rounded overflow-hidden">
                  <Image
                    src={formData.image}
                    alt="Product preview"
                    layout="fill"
                    objectFit="cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.jpg"
                    }}
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button type="submit" form="productForm">
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </CardFooter>
      </Card>

      {/* Products List */}
      <h2 className="text-xl font-semibold mt-8 mb-4">All Products</h2>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p>No products found. Add your first product using the form above.</p>
          ) : (
            products.map((product) => (
              <Card key={product._id} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                      <p className="text-white font-bold">Out of Stock</p>
                    </div>
                  )}
                  
                  {product.offerPrice && product.offerPrice < product.price && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                      -{calculateDiscount(product.price, product.offerPrice)}%
                    </div>
                  )}
                  
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.jpg"
                    }}
                  />
                </div>
                
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
                        {/* <Pencil className="h-4 w-4" /> */}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0 flex-1">
                  <p className="text-sm truncate-3">{product.description}</p>
                  
                  <div className="mt-2 flex items-center">
                    {product.offerPrice ? (
                      <>
                        <span className="font-bold text-lg">₹{product.offerPrice.toFixed(2)}</span>
                        <span className="ml-2 line-through text-gray-500">₹{product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-bold text-lg">₹{product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></span>
                    <span className="text-sm">{product.inStock ? "In Stock" : "Out of Stock"}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .truncate-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  )
}
