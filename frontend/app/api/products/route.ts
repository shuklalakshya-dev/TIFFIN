import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Get all products
export async function GET() {
  try {
    console.log("GET /api/products: Fetching all products")
    const db = await getDatabase()
    const products = await db.collection("products").find({}).toArray()
    console.log(`GET /api/products: Retrieved ${products.length} products`)
    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/products Error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Create a new product
export async function POST(request: Request) {
  console.log("POST /api/products: Received product creation request")
  
  try {
    const productData = await request.json()
    console.log("POST /api/products: Product data received:", productData)
    
    // Validate required fields
    const requiredFields = ["name", "description", "price", "category", "image"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        console.log(`POST /api/products: Missing required field: ${field}`)
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Format the data
    const newProduct = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      offerPrice: productData.offerPrice ? parseFloat(productData.offerPrice) : undefined,
      category: productData.category,
      image: productData.image,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    console.log("POST /api/products: Formatted product data:", newProduct)
    
    // Connect to database and insert product
    const db = await getDatabase()
    console.log("POST /api/products: Connected to database")
    
    const result = await db.collection("products").insertOne(newProduct)
    
    if (!result.acknowledged) {
      console.log("POST /api/products: Insert operation not acknowledged")
      return NextResponse.json(
        { message: "Failed to create product" },
        { status: 500 }
      )
    }
    
    console.log(`POST /api/products: Product created with ID: ${result.insertedId}`)
    
    // Return success response
    return NextResponse.json({ 
      message: "Product created successfully",
      productId: result.insertedId
    })
    
  } catch (error) {
    console.error("POST /api/products Error:", error)
    return NextResponse.json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

// Add this to support editing products
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }
    
    const productData = await request.json()
    
    // Format the data
    const updatedProduct = {
      ...productData,
      price: parseFloat(productData.price),
      offerPrice: productData.offerPrice ? parseFloat(productData.offerPrice) : undefined,
      updatedAt: new Date(),
    }
    
    const db = await getDatabase()
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }
    
    const db = await getDatabase()
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
