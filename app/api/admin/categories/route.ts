import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    const category = {
      _id: `cat_${Date.now()}`,
      ...body,
      createdAt: new Date(),
    }

    await db.collection("categories").insertOne(category)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    const { _id, ...updateData } = body

    await db.collection("categories").updateOne({ _id }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    const db = await getDatabase()
    await db.collection("categories").deleteOne({ _id: id })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
