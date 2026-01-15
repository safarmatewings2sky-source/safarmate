import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Clear the admin token cookie
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `adminToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`,
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
}
