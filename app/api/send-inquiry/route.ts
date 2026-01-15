import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Send to Web3Forms
    const web3FormData = new FormData()
    web3FormData.append("access_key", process.env.WEB3FORMS_API_KEY || "")
    web3FormData.append("subject", `SafarMate Bulk Order Inquiry - ${body.buyerName}`)
    web3FormData.append("from_name", "SafarMate")
    web3FormData.append("email", body.email)
    web3FormData.append(
      "message",
      `
      Buyer Name: ${body.buyerName}
      Company Name: ${body.companyName}
      Email: ${body.email}
      Phone: ${body.phone}
      Product: ${body.productName}
      Quantity: ${body.quantity}
      Colors Required: ${body.colors}
      Additional Notes: ${body.notes}
    `,
    )

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    return NextResponse.json({ success: true, message: "Inquiry sent successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 })
  }
}
