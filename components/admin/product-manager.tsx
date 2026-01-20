"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X, Image as ImageIcon, Plus, Edit2, Trash2 } from "lucide-react"

interface Product {
  _id: string
  name: string
  categoryId: string
  moq: number
  basePrice: number
  colors: string[]
  images?: string[]
}

interface Category {
  _id: string
  name: string
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    moq: 10,
    basePrice: 0.01,
    images: [] as string[],
    colors: [""],
    specifications: {
      material: "",
      capacity: "",
      weight: "",
      compartments: 1,
      warranty: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([])
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products", { credentials: "include" }),
        fetch("/api/categories", { credentials: "include" })
      ])
      setProducts(await productsRes.json())
      setCategories(await categoriesRes.json())
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)

    const newImages = [...formData.images]
    const newImageFiles = [...imageFiles]

    if (index !== undefined) {
      newImages[index] = previewUrl
      newImageFiles[index] = file
    } else {
      newImages.push(previewUrl)
      newImageFiles.push(file)
    }

    setFormData({ ...formData, images: newImages })
    setImageFiles(newImageFiles)

    // Allow selecting the same file again if needed
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newImageFiles = imageFiles.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
    setImageFiles(newImageFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate price
    if (formData.basePrice < 0.01) {
      alert("Price must be at least ₹0.01")
      return
    }
    
    setLoading(true)

    try {
      // Prepare final image URLs: upload any new files to Cloudinary, reuse existing URLs
      let finalImageUrls: string[] = []
      const hasNewImages = imageFiles.some((file) => file)

      if (hasNewImages) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !uploadPreset) {
          console.error("Cloudinary env vars NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET are missing")
          alert("Image upload is not configured. Please contact the site administrator.")
          return
        }

        for (let i = 0; i < formData.images.length; i++) {
          const file = imageFiles[i]
          if (file) {
            const uploadForm = new FormData()
            uploadForm.append("file", file)
            uploadForm.append("upload_preset", uploadPreset)

            const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
              method: "POST",
              body: uploadForm,
            })

            const uploadData = await uploadResponse.json()

            if (uploadResponse.ok && uploadData.secure_url) {
              finalImageUrls.push(uploadData.secure_url as string)
            } else {
              console.error("Cloudinary upload failed", uploadData)
              alert(uploadData.error?.message || "Failed to upload image to Cloudinary")
              return
            }
          } else {
            const existingUrl = formData.images[i]
            if (existingUrl) {
              finalImageUrls.push(existingUrl)
            }
          }
        }
      } else {
        finalImageUrls = formData.images.filter(Boolean)
      }

      const url = editingProductId 
        ? `/api/admin/products?_id=${editingProductId}`
        : "/api/admin/products"
      const method = editingProductId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          images: finalImageUrls,
          colors: formData.colors.filter(Boolean),
          ...(editingProductId && { _id: editingProductId }),
        }),
      })

      if (response.ok) {
        setFormData({
          categoryId: "",
          name: "",
          description: "",
          moq: 10,
          basePrice: 0.01,
          images: [],
          colors: [""],
          specifications: {
            material: "",
            capacity: "",
            weight: "",
            compartments: 1,
            warranty: "",
          },
        })
        setImageFiles([])
        setEditingProductId(null)
        await fetchData()
        alert(editingProductId ? "Product updated successfully!" : "Product added successfully!")
      } else {
        const data = await response.json()
        alert(data.error || `Failed to ${editingProductId ? "update" : "create"} product`)
      }
    } catch (error) {
      console.error("Failed to save product:", error)
      alert(`Failed to ${editingProductId ? "update" : "create"} product`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProductId(product._id)
    setFormData({
      categoryId: product.categoryId || "",
      name: product.name,
      description: (product as any).description || "",
      moq: product.moq,
      basePrice: product.basePrice,
      images: product.images || [],
      colors: product.colors && product.colors.length > 0 ? product.colors : [""],
      specifications: {
        material: (product as any).specifications?.material || "",
        capacity: (product as any).specifications?.capacity || "",
        weight: (product as any).specifications?.weight || "",
        compartments: (product as any).specifications?.compartments || 1,
        warranty: (product as any).specifications?.warranty || "",
      },
    })
    setImageFiles(new Array((product.images || []).length).fill(null))
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setEditingProductId(null)
    setFormData({
      categoryId: "",
      name: "",
      description: "",
      moq: 10,
      basePrice: 0.01,
      images: [],
      colors: [""],
      specifications: {
        material: "",
        capacity: "",
        weight: "",
        compartments: 1,
        warranty: "",
      },
    })
    setImageFiles([])
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        await fetchData()
        alert("Product deleted successfully!")
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Failed to delete product")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-6">
          {editingProductId ? "Edit Product" : "Add New Product"}
        </h2>
        {editingProductId && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelEdit}
            className="mb-4"
          >
            Cancel Edit
          </Button>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              {categories.length === 0 ? (
                <div className="p-3 border border-dashed border-muted-foreground/30 rounded-md text-sm text-muted-foreground text-center">
                  No categories available. Please create a category first.
                </div>
              ) : (
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full px-3 py-2 h-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground cursor-pointer"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
              {categories.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Go to the Categories tab to create categories first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Premium School Backpack"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Detailed product description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moq">MOQ (Minimum Order Quantity) *</Label>
              <Input
                id="moq"
                type="number"
                placeholder="10"
                min="10"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: Number.parseInt(e.target.value) || 10 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Base Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={formData.basePrice}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value) || 0.01
                  setFormData({ ...formData, basePrice: Math.max(0.01, value) })
                }}
                required
              />
              {formData.basePrice < 0.01 && (
                <p className="text-xs text-muted-foreground">Price must be at least ₹0.01</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((image, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-input">
                  <Image
                    src={image}
                    alt={`Product image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-accent border-muted-foreground/30"
                    onClick={() => removeImage(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <label className="relative aspect-square border-2 border-dashed border-input rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Image</span>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Upload product images (PNG, JPG, WEBP up to 5MB each)</p>
          </div>

          <div className="space-y-2">
            <Label>Available Colors</Label>
            <div className="space-y-2">
              {formData.colors.map((color, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Color ${idx + 1} (e.g., Black, Blue)`}
                    value={color}
                    onChange={(e) => {
                      const newColors = [...formData.colors]
                      newColors[idx] = e.target.value
                      setFormData({ ...formData, colors: newColors })
                    }}
                  />
                  {formData.colors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newColors = formData.colors.filter((_, i) => i !== idx)
                        setFormData({ ...formData, colors: newColors })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData, colors: [...formData.colors, ""] })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Color
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-semibold">Specifications</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  type="text"
                  placeholder="e.g., Polyester, Nylon"
                  value={formData.specifications.material}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, material: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="text"
                  placeholder="e.g., 20L, 30L"
                  value={formData.specifications.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, capacity: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="text"
                  placeholder="e.g., 400g, 500g"
                  value={formData.specifications.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, weight: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compartments">Compartments</Label>
                <Input
                  id="compartments"
                  type="number"
                  placeholder="1"
                  min="1"
                  value={formData.specifications.compartments}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, compartments: Number.parseInt(e.target.value) || 1 },
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  type="text"
                  placeholder="e.g., 1 year, 2 years"
                  value={formData.specifications.warranty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, warranty: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {editingProductId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={loading}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading} className={editingProductId ? "flex-1" : "w-full"} size="lg">
              {loading 
                ? (editingProductId ? "Updating..." : "Adding...") 
                : (editingProductId ? "Update Product" : "Add Product")
              }
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Products ({products.length})</h2>
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            <p className="text-lg mb-2">No products yet</p>
            <p className="text-sm">Create your first product using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product._id} className="bg-card p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-default">
                <div className="flex gap-4">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-input flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-input flex-shrink-0 bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-lg truncate cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleEdit(product)}
                          title="Click to edit"
                        >
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                            {getCategoryName(product.categoryId)}
                          </span>
                          <span>MOQ: {product.moq} pcs</span>
                          <span>•</span>
                          <span className="font-semibold text-foreground">₹{product.basePrice.toFixed(2)}</span>
                        </div>
                        {product.colors && product.colors.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Colors: <span className="font-medium">{product.colors.join(", ")}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 cursor-pointer hover:bg-primary/10 hover:border-primary/50"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(product._id)}
                          className="h-8 w-8 hover:bg-accent/80 border-muted-foreground/30 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
