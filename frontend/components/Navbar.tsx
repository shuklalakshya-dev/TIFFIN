"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="#13d88c" d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32L8.6 224C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z"/>
            </svg>
            <Link href="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 truncate">
              <span className="hidden sm:inline">SwadRich Tiffin Service</span>
              <span className="sm:hidden">SwadRich</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors">
                About Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">
                Contact
              </Link>
            </motion.div>
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <Link href="/cart">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Cart </span>({getTotalItems()})
                    </Button>
                  </Link>
                </motion.div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="max-w-20 truncate">{user.name}</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
                    <Link href="/login">Login</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button asChild size="sm" className="text-xs sm:text-sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Cart Button */}
            {user && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/cart">
                  <Button variant="outline" size="sm" className="relative p-2">
                    <ShoppingCart className="h-4 w-4" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link 
                  href="/about" 
                  className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  About Us
                </Link>
                <Link 
                  href="/contact" 
                  className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </div>

              {/* Mobile User Controls */}
              {user ? (
                <div className="pt-3 border-t border-gray-200 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Welcome, {user.name}</span>
                  </div>
                  
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full justify-start">
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={closeMobileMenu}>
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
