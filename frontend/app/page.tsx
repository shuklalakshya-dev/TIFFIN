"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import FooterMain from "@/components/FooterMain"
import { redirectToFrontendUrl } from "@/lib/url-helpers"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingCart, 
  ChevronRight, 
  Tag, 
  Package, 
  TrendingUp, 
  ArrowRight,
  Minus,
  Plus,
  Sparkles
} from "lucide-react"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  offerPrice?: number
  image: string
  category: string
  inStock: boolean
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [animateCart, setAnimateCart] = useState(false)
  const { items, addToCart, updateQuantity } = useCart()
  const { user } = useAuth()

  // Get featured products (products with discount)
  const featuredProducts = products.filter(p => p.offerPrice && p.inStock).slice(0, 3)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data: Product[] = await res.json()
      setProducts(data)
      setCategories(Array.from(new Set(data.map(p => p.category))))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to add items to your cart",
        variant: "destructive",
      })
      return
    }
    
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.offerPrice ?? product.price,
      image: product.image,
    })
    
    // Trigger cart animation
    setAnimateCart(true)
    setTimeout(() => setAnimateCart(false), 1000)
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  // Calculate discount percentage
  const calculateDiscount = (price: number, offerPrice: number) => {
    return Math.round(((price - offerPrice) / price) * 100)
  }

  // Filter products by selected category
  const filtered = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products

  // Loading skeleton
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero skeleton */}
        <div className="w-full h-80 bg-gray-200 animate-pulse rounded-2xl mb-8 mt-6"></div>
        
        {/* Categories skeleton */}
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"></div>
          ))}
        </div>
        
        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-1/2"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded mt-4 mb-2 w-1/3"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded-full mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar/>
      
      {/* Hero Section with Video Background */}
      <div className="relative overflow-hidden h-[80vh]">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/tiffin.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Delicious Home Cooked Meals Delivered To Your Door
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Fresh, authentic Indian cuisine prepared daily with premium ingredients. 
              Experience the taste of tradition with SwadRich Tiffin Service.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
                onClick={() => window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                })}
              >
                Order Now
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-black hover:bg-white/20 px-8 py-6 text-lg"
                onClick={() => redirectToFrontendUrl('/menu')}
              >
                View Menu
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { delay: 1.5, duration: 1 },
              y: { delay: 1.5, duration: 1.5, repeat: Infinity }
            }}
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <motion.div 
                className="w-1.5 h-3 bg-white rounded-full mt-2" 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features Bar */}
      <div className="bg-white border-y border-gray-200 shadow-sm py-4 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
              <Package className="h-4 w-4 text-indigo-600" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
              <Tag className="h-4 w-4 text-indigo-600" />
              <span>Best prices guaranteed</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span>New products weekly</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Exclusive deals</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Categories
          </h2>
          <div className="flex flex-wrap gap-3 pb-2">
            <Button 
              size="sm" 
              variant={!selectedCategory ? "default" : "outline"}
              onClick={() => setSelectedCategory("")}
              className={`rounded-full px-6 ${!selectedCategory ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button 
                key={cat} 
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-6 ${selectedCategory === cat ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </motion.section>

        {/* Products Grid */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            {selectedCategory ? `${selectedCategory} Products` : "All Products"}
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {filtered.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <h3 className="text-xl font-medium">No products found</h3>
                  <p className="mt-2">Try selecting a different category</p>
                </div>
              ) : (
                filtered.map((product) => {
                  const cartItem = items.find(i => i.productId === product._id)
                  const hasDiscount = product.offerPrice && product.offerPrice < product.price
                  
                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden h-full bg-white border-0 rounded-xl shadow-sm transition-shadow hover:shadow-md">
                        <div className="aspect-square relative overflow-hidden group">
                          {hasDiscount && (
                            <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                              {calculateDiscount(product.price, product.offerPrice!)}% OFF
                            </div>
                          )}
                          
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                              <span className="bg-red-600 text-white px-3 py-1.5 rounded-full font-medium">Out of Stock</span>
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                          
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                          />
                        </div>

                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1 uppercase">
                                {product.category}
                              </p>
                              <CardTitle className="text-lg line-clamp-1 mb-2">
                                {product.name}
                              </CardTitle>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {product.description}
                          </p>
                          
                          <div className="flex items-baseline">
                            <span className="font-bold text-lg text-indigo-600">
                              ₹{(product.offerPrice ?? product.price).toFixed(2)}
                            </span>
                            {product.offerPrice && (
                              <span className="text-gray-500 line-through ml-2 text-sm">
                                ₹{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          {!cartItem ? (
                            <Button
                              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              {product.inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>
                          ) : (
                            <div className="flex items-center justify-between w-full px-2 py-1 bg-indigo-50 rounded-full">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full bg-white shadow-sm text-indigo-600 hover:text-indigo-700"
                                onClick={() => updateQuantity(product._id, Math.max(0, cartItem.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium text-indigo-700">{cartItem.quantity}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full bg-white shadow-sm text-indigo-600 hover:text-indigo-700"
                                onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>
        
        {/* Newsletter Section */}
        {/* <motion.section 
          className="mt-24 mb-12 py-12 px-6 bg-gradient-to-r from-violet-400 to-indigo-500 rounded-2xl text-white text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Join our Newsletter</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-6">
            Stay updated with our latest products and special offers. 
            Subscribe to our newsletter for exclusive deals!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-white"
            />
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-6">
              Subscribe
            </Button>
          </div>
        </motion.section> */}
      </div>
      
      {/* Animation for cart icon */}
      {animateCart && (
        <motion.div
          initial={{ scale: 1, x: "50%", y: "0%" }}
          animate={{ scale: 0, x: "100%", y: "-100%" }}
          transition={{ duration: 0.5 }}
          className="fixed z-50 top-10 right-10 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
        >
          <ShoppingCart className="h-6 w-6" />
        </motion.div>
      )}
      <FooterMain/>
    </div>
  )
}
