import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    const inquiry = {
      ...body,
      createdAt: new Date(),
      status: "new",
    }

    const result = await db.collection("inquiries").insertOne(inquiry)

    return NextResponse.json({ id: result.insertedId, ...inquiry }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDatabase()
    const inquiries = await db.collection("inquiries").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(inquiries)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}
