import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    const db = await getDatabase()

    // Check if data already exists
    const existingAdmin = await db.collection("users").findOne({ email: "admin@demo.com" })
    if (existingAdmin) {
      return NextResponse.json({ message: "Database already seeded" })
    }

    // Create admin user
    const adminPassword = await hashPassword("admin123")
    await db.collection("users").insertOne({
      name: "Admin User",
      email: "admin@demo.com",
      password: adminPassword,
      role: "admin",
      createdAt: new Date(),
    })

    // Create demo user
    const userPassword = await hashPassword("user123")
    await db.collection("users").insertOne({
      name: "Demo User",
      email: "user@demo.com",
      password: userPassword,
      role: "user",
      createdAt: new Date(),
    })

    // Create sample products
    const products = [
      {
        name: "Rajma Chawal",
        description: "Traditional kidney beans curry with steamed rice, served with pickle and papad",
        price: 120,
        image: "/placeholder.svg?height=200&width=300",
        category: "North Indian",
        inStock: true,
        createdAt: new Date(),
      },
      {
        name: "Dal Tadka with Roti",
        description: "Yellow lentil curry with fresh wheat flatbread and butter",
        price: 100,
        image: "/placeholder.svg?height=200&width=300",
        category: "North Indian",
        inStock: true,
        createdAt: new Date(),
      },
      {
        name: "Sambar Rice",
        description: "South Indian lentil curry with rice, vegetables, and coconut chutney",
        price: 110,
        image: "/placeholder.svg?height=200&width=300",
        category: "South Indian",
        inStock: true,
        createdAt: new Date(),
      },
      {
        name: "Chole Bhature",
        description: "Spicy chickpea curry with fried bread, onions, and pickle",
        price: 140,
        image: "/placeholder.svg?height=200&width=300",
        category: "North Indian",
        inStock: true,
        createdAt: new Date(),
      },
      {
        name: "Paneer Butter Masala",
        description: "Creamy cottage cheese curry with basmati rice and naan",
        price: 160,
        image: "/placeholder.svg?height=200&width=300",
        category: "North Indian",
        inStock: true,
        createdAt: new Date(),
      },
      {
        name: "Vegetable Biryani",
        description: "Aromatic basmati rice with spiced vegetables, raita, and boiled egg",
        price: 180,
        image: "/placeholder.svg?height=200&width=300",
        category: "Biryani",
        inStock: true,
        createdAt: new Date(),
      },
      {
        name: "Masala Dosa",
        description: "Crispy rice crepe with spiced potato filling, sambar, and chutneys",
        price: 90,
        image: "/placeholder.svg?height=200&width=300",
        category: "South Indian",
        inStock: true,
        createdAt: new Date(),
      },
      {
        name: "Aloo Gobi with Chapati",
        description: "Spiced potato and cauliflower curry with fresh wheat flatbread",
        price: 95,
        image: "/placeholder.svg?height=200&width=300",
        category: "North Indian",
        inStock: true,
        createdAt: new Date(),
      },
    ]

    await db.collection("products").insertMany(products)

    // Create sample orders
    const sampleOrders = [
      {
        customerInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          address: "123 Main St, City, State"
        },
        items: [
          {
            productId: "product1",
            name: "Rajma Chawal",
            price: 120,
            quantity: 2
          },
          {
            productId: "product2", 
            name: "Dal Tadka with Roti",
            price: 100,
            quantity: 1
          }
        ],
        totalAmount: 340,
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        customerInfo: {
          name: "Jane Smith",
          email: "jane@example.com", 
          phone: "+1987654321",
          address: "456 Oak Ave, City, State"
        },
        items: [
          {
            productId: "product3",
            name: "Vegetable Biryani",
            price: 180,
            quantity: 1
          }
        ],
        totalAmount: 180,
        status: "confirmed",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        customerInfo: {
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "+1122334455", 
          address: "789 Pine St, City, State"
        },
        items: [
          {
            productId: "product4",
            name: "Masala Dosa",
            price: 90,
            quantity: 2
          },
          {
            productId: "product5",
            name: "Aloo Gobi with Chapati",
            price: 95,
            quantity: 1
          }
        ],
        totalAmount: 275,
        status: "preparing",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        customerInfo: {
          name: "Sarah Wilson",
          email: "sarah@example.com",
          phone: "+1555666777",
          address: "321 Elm St, City, State"
        },
        items: [
          {
            productId: "product1",
            name: "Rajma Chawal",
            price: 120,
            quantity: 1
          }
        ],
        totalAmount: 120,
        status: "delivered", 
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        customerInfo: {
          name: "David Brown",
          email: "david@example.com",
          phone: "+1777888999",
          address: "654 Maple Dr, City, State"
        },
        items: [
          {
            productId: "product3",
            name: "Vegetable Biryani",
            price: 180,
            quantity: 1
          }
        ],
        totalAmount: 180,
        status: "pending",
        createdAt: new Date() // Current time
      }
    ]

    await db.collection("orders").insertMany(sampleOrders)

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        users: 2,
        products: products.length,
        orders: sampleOrders.length,
      },
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json(
      {
        message: "Error seeding database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
