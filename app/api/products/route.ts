import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    const db = await getDatabase()
    const query = categoryId ? { categoryId } : {}

    const products = await db.collection("products").find(query).toArray()

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
