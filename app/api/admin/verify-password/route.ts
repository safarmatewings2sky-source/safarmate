import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@safarmate.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check against environment variables (simple auth)
    // In production, you should hash passwords and store in database
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: true, token: "admin-token" },
        {
          status: 200,
          headers: {
            "Set-Cookie": `adminToken=true; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict`,
          },
        },
      )
    }

    // Optional: Check against database for multiple admins
    try {
      const db = await getDatabase()
      const admin = await db.collection("admins").findOne({ email, password })
      
      if (admin) {
        return NextResponse.json(
          { success: true, token: "admin-token" },
          {
            status: 200,
            headers: {
              "Set-Cookie": `adminToken=true; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict`,
            },
          },
        )
      }
    } catch (dbError) {
      // Database check failed, continue with env check
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify credentials" }, { status: 500 })
  }
}
