import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get cookies from request headers
    const cookieHeader = request.headers.get("cookie")
    
    if (!cookieHeader) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Parse cookies
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=")
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    const adminToken = cookies["adminToken"]

    if (adminToken && adminToken === "true") {
      return NextResponse.json({ authenticated: true }, { status: 200 })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
