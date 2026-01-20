"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Package, Truck, Shield, Info, Loader2, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
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
  const [isZoomed, setIsZoomed] = useState(false)

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

  const nextImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full"></div>
            </div>
            <p className="text-muted-foreground animate-pulse">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <div className="relative inline-block">
              <Info className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="absolute -inset-4 bg-destructive/10 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Product Not Found</h1>
            <p className="text-muted-foreground">{error || "The product you're looking for doesn't exist."}</p>
            <Button 
              onClick={() => router.push("/")} 
              variant="outline" 
              className="cursor-pointer mt-4 hover:scale-105 transition-transform"
            >
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 cursor-pointer group hover:bg-primary/10 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images Section */}
            <div className="space-y-6">
              {/* Main Image Container */}
              <div className="relative group">
                <div 
                  className={`relative w-full h-[320px] sm:h-[360px] md:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden border-2 border-input bg-gradient-to-br from-secondary/20 to-background shadow-lg transition-all duration-300 ${
                    isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in hover:shadow-xl'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <Image
                    src={product.images?.[selectedImageIndex] || product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className={`object-contain transition-transform duration-300 ${
                      isZoomed ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Zoom Indicator */}
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ZoomIn className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Navigation Arrows */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 backdrop-blur-sm border shadow-lg hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation()
                          prevImage()
                        }}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 backdrop-blur-sm border shadow-lg hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation()
                          nextImage()
                        }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border shadow-sm text-sm font-medium">
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer group ${
                          selectedImageIndex === index
                            ? "border-primary ring-4 ring-primary/20 shadow-lg scale-105"
                            : "border-input hover:border-primary/50 hover:scale-105 hover:shadow-md"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 25vw, 12.5vw"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-primary/20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  {/* Gradient fade edges */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">In Stock</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {product.name}
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/20 pl-4 py-1">
                  {product.description}
                </p>
              </div>

              {/* Price and MOQ Card */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Starting from</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-bold text-primary">₹{product.basePrice.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">/ piece</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-medium text-muted-foreground">Minimum Order Quantity</p>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{product.moq} pieces</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Available Colors */}
              {product.colors && product.colors.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Available Colors
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-full border hover:scale-105 transition-transform duration-200 cursor-pointer group"
                      >
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Specifications */}
              {product.specifications && (
                <Card className="p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
                  <h3 className="text-lg font-semibold mb-6">Product Specifications</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      value && (
                        <div 
                          key={key}
                          className="space-y-1 p-3 rounded-lg hover:bg-secondary/20 transition-colors duration-200"
                        >
                          <p className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium text-lg">{value}</p>
                        </div>
                      )
                    ))}
                  </div>
                </Card>
              )}

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Package,
                    title: "Bulk Orders",
                    description: `MOQ: ${product.moq}`,
                    gradient: "from-blue-500/20 to-blue-600/10"
                  },
                  {
                    icon: Truck,
                    title: "Fast Shipping",
                    description: "Worldwide Delivery",
                    gradient: "from-green-500/20 to-green-600/10"
                  },
                  {
                    icon: Shield,
                    title: "Quality Assured",
                    description: product.specifications?.warranty || "Standard Warranty",
                    gradient: "from-amber-500/20 to-amber-600/10"
                  }
                ].map((feature, index) => (
                  <Card 
                    key={index}
                    className="p-4 border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.gradient}`}>
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  className="flex-1 cursor-pointer bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  Request Quote
                </Button>
                <Link href="/contact" className="flex-1 cursor-pointer">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full cursor-pointer border-2 hover:border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200"
                  >
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