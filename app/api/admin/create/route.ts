import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Check if admin with this email already exists
    const existingAdmin = await db.collection("admins").findOne({ email })
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      )
    }

    // Create admin document
    const admin = {
      _id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      email,
      password, // In production, hash this password using bcrypt
      name: name || email.split("@")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    // Insert admin into database
    await db.collection("admins").insertOne(admin)

    // Return admin without password
    const { password: _, ...adminResponse } = admin

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully",
        admin: adminResponse,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    )
  }
}

// GET endpoint to list all admins (optional, for testing)
export async function GET() {
  try {
    const db = await getDatabase()
    const admins = await db
      .collection("admins")
      .find({})
      .project({ password: 0 }) // Exclude password from response
      .toArray()

    return NextResponse.json({ admins }, { status: 200 })
  } catch (error) {
    console.error("Get admins error:", error)
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}
