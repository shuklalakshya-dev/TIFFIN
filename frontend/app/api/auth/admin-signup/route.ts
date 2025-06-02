import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Ensure role is admin
    if (role !== "admin") {
      return NextResponse.json({ message: "Invalid role specified" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "admin", // Ensure role is set to admin
      createdAt: new Date(),
    }
    
    const result = await db.collection("users").insertOne(newUser)
    
    // Generate a token for the new admin user
    const token = generateToken({
      userId: result.insertedId,
      email: email,
      role: "admin",
    })

    // Return user data and token
    return NextResponse.json({
      message: "Admin user created successfully",
      token,
      user: {
        id: result.insertedId,
        name,
        email,
        role: "admin"
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Admin signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
