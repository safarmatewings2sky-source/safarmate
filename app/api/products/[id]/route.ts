import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Try different query formats since _id might be stored as string or ObjectId
    let product = null

    // First try direct match (for custom IDs like prod_123456)
    product = await db.collection("products").findOne({ _id: id })

    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      // Try with ObjectId if id is a valid ObjectId format (24 hex characters)
      try {
        product = await db.collection("products").findOne({ _id: new ObjectId(id) })
      } catch (objectIdError) {
        console.error("ObjectId conversion error:", objectIdError)
      }
    }

    if (!product) {
      // Try finding by any field that might match (fallback)
      const allProducts = await db.collection("products").find({}).toArray()
      product = allProducts.find((p: any) => 
        p._id?.toString() === id || 
        p._id === id ||
        (p._id && p._id.toString && p._id.toString() === id)
      )
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
