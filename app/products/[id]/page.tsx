"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Package, Truck, Shield, Info, Loader2 } from "lucide-react"
import InquiryModal from "@/components/inquiry-modal"

interface Product {
  _id: string
  name: string
  description: string
  categoryId: string
  moq: number
  basePrice: number
  images: string[]
  colors: string[]
  specifications: {
    material: string
    capacity: string
    weight: string
    compartments: number
    warranty: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error("Product not found")
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <Info className="h-12 w-12 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-muted-foreground">{error || "The product you're looking for doesn't exist."}</p>
            <Button onClick={() => router.push("/")} variant="outline" className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full rounded-lg overflow-hidden border border-input bg-muted aspect-[3/4] md:aspect-[4/5]">
                <Image
                  src={product.images?.[selectedImageIndex] || product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-input hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Price and MOQ */}
              <div className="flex items-baseline gap-4 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <p className="text-4xl font-bold text-primary">₹{product.basePrice.toFixed(2)}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-muted-foreground mb-1">Minimum Order</p>
                  <p className="text-xl font-semibold">{product.moq} pieces</p>
                </div>
              </div>

              {/* Available Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-full border border-primary/20"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {product.specifications.material && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Material</p>
                        <p className="font-medium">{product.specifications.material}</p>
                      </div>
                    )}
                    {product.specifications.capacity && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                        <p className="font-medium">{product.specifications.capacity}</p>
                      </div>
                    )}
                    {product.specifications.weight && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Weight</p>
                        <p className="font-medium">{product.specifications.weight}</p>
                      </div>
                    )}
                    {product.specifications.compartments && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Compartments</p>
                        <p className="font-medium">{product.specifications.compartments}</p>
                      </div>
                    )}
                    {product.specifications.warranty && (
                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Warranty</p>
                        <p className="font-medium">{product.specifications.warranty}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Package className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Bulk Orders</p>
                    <p className="text-xs text-muted-foreground">MOQ: {product.moq}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Fast Shipping</p>
                    <p className="text-xs text-muted-foreground">Worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Quality Assured</p>
                    <p className="text-xs text-muted-foreground">
                      {product.specifications?.warranty || "Standard"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Request Quote
            </Button>
            <Link href="/contact" className="flex-1 cursor-pointer">
              <Button size="lg" variant="outline" className="w-full cursor-pointer">
                Contact Sales
              </Button>
            </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Inquiry Modal */}
      {product && (
        <InquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{
            _id: product._id,
            name: product.name,
            moq: product.moq,
            colors: product.colors || [],
          }}
        />
      )}
    </div>
  )
}
