"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface Category {
  _id: string
  name: string
  description: string
  image: string
  order: number
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    order: 0,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.url) {
        setFormData({ ...formData, image: data.url })
        setImagePreview(data.url)
      } else {
        alert(data.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", description: "", image: "", order: 0 })
        setImagePreview("")
        await fetchCategories()
        alert("Category added successfully!")
      } else {
        alert("Failed to create category")
      }
    } catch (error) {
      console.error("Failed to create category:", error)
      alert("Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-6">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., School Bags"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Brief description of the category"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-input">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-accent border-muted-foreground/30"
                  onClick={() => {
                    setImagePreview("")
                    setFormData({ ...formData, image: "" })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
                  </div>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            )}
            {uploading && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Upload className="h-4 w-4 animate-pulse" />
                Uploading...
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              placeholder="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
            />
          </div>

          <Button type="submit" disabled={loading || uploading} className="w-full">
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Categories ({categories.length})</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category._id} className="bg-card p-4 rounded-lg border flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Order: {category.order}
                  </span>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                )}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No categories yet. Create your first category above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
