import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.username || !body.email || !body.contact || !body.category || !body.quantity) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    // Send to Web3Forms
    const web3FormData = new FormData()
    web3FormData.append("access_key", process.env.WEB3FORMS_API_KEY || "")
    web3FormData.append("subject", `SafarMate Bulk Order Inquiry - ${body.username}`)
    web3FormData.append("from_name", "SafarMate Lead Form")
    web3FormData.append("email", body.email)
    web3FormData.append(
      "message",
      `
New Bulk Order Inquiry from SafarMate Website

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${body.username}
Email: ${body.email}
Contact Number: ${body.contact}

Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: ${body.category}
Quantity Required: ${body.quantity} pieces

${body.message ? `Additional Requirements:\n${body.message}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This inquiry was submitted through the SafarMate website lead form.
    `.trim(),
    )

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    })

    const responseData = await response.json()

    if (!response.ok || !responseData.success) {
      console.error("Web3Forms error:", responseData)
      return NextResponse.json(
        { error: "Failed to send inquiry. Please try again later." },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { success: true, message: "Inquiry sent successfully" },
      { status: 200 },
    )
  } catch (error) {
    console.error("Send lead error:", error)
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 })
  }
}
