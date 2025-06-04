import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = verifyAdminPin(request)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { status } = await request.json()

    const db = await getDatabase()
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
