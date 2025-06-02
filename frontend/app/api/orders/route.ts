import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token) as any

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { customerInfo, items, totalAmount } = await request.json()

    const db = await getDatabase()
    const result = await db.collection("orders").insertOne({
      userId: new ObjectId(decoded.userId),
      customerInfo,
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Order placed successfully", orderId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
