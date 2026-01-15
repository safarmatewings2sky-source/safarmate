import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Send to Web3Forms
    const web3FormData = new FormData()
    web3FormData.append("access_key", process.env.WEB3FORMS_API_KEY || "")
    web3FormData.append("subject", `SafarMate Contact Form - ${body.subject}`)
    web3FormData.append("from_name", "SafarMate Contact Form")
    web3FormData.append("email", body.email)
    web3FormData.append(
      "message",
      `
New Contact Form Submission from SafarMate Website

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${body.name}
Email: ${body.email}
${body.phone ? `Phone: ${body.phone}` : ""}

Message Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: ${body.subject}

Message:
${body.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This message was submitted through the SafarMate contact form.
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
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Send contact error:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
