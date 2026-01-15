"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ProductGrid from "./product-grid"

interface Category {
  _id: string
  name: string
  description: string
  image: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data)
        if (data.length > 0) {
          setSelectedCategory(data[0]._id)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>
  }

  return (
    <section id="categories" className="py-16 md:py-24 bg-background">
      {/* Remove top margin/padding from container */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Products</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Browse our wide range of premium bagpacks organized by category
        </p>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              variant={selectedCategory === category._id ? "default" : "outline"}
              size="lg"
              className="min-w-[150px] cursor-pointer"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {selectedCategory && <ProductGrid categoryId={selectedCategory} />}
      </div>
    </section>
  )
}