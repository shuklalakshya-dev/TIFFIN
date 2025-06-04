import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

async function verifyAdminPin(request: NextRequest) {
  // Check for admin PIN in cookies or headers
  const cookies = request.headers.get("cookie")
  if (cookies && cookies.includes("adminPin=admin123")) {
    return true
  }
  
  // Also check for admin PIN in request headers (for API calls)
  const adminPin = request.headers.get("x-admin-pin")
  if (adminPin === "admin123") {
    return true
  }
  
  return false
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = verifyAdminPin(request)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const db = await getDatabase()
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB ObjectId to string for JSON serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
    }))

    return NextResponse.json(serializedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
