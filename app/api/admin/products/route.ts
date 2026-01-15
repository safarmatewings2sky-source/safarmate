import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    // Validate price
    if (body.basePrice === undefined || body.basePrice < 0.01) {
      return NextResponse.json(
        { error: "Price is required and must be at least ₹0.01" },
        { status: 400 }
      )
    }

    const product = {
      _id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("products").insertOne(product)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("_id")
    const body = await request.json()
    const db = await getDatabase()

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Validate price
    if (body.basePrice !== undefined && body.basePrice < 0.01) {
      return NextResponse.json({ error: "Price must be at least ₹0.01" }, { status: 400 })
    }

    const { _id, ...updateData } = body
    delete updateData._id // Remove _id from update data

    const result = await db.collection("products").updateOne(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product updated successfully" })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection("products").deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
