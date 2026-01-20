"use client"

import { useEffect, useState, useRef } from "react"
import ProductCard from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
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

interface ProductGridProps {
  categoryId: string
}

export default function ProductGrid({ categoryId }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [showButtons, setShowButtons] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const response = await fetch(`/api/products?categoryId=${categoryId}`)
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const updateScrollButtons = () => {
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container
        setCanScrollLeft(scrollLeft > 10)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    updateScrollButtons()
    container.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)

    return () => {
      container.removeEventListener("scroll", updateScrollButtons)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [products])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground mb-2">No products found in this category</p>
        <p className="text-sm text-muted-foreground">Please check back later or contact us for custom orders</p>
      </div>
    )
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      {/* Scroll Buttons - Swiper-like navigation (desktop only) */}
      {products.length > 3 && (
        <>
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background border cursor-pointer transition-opacity ${
                showButtons ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background border cursor-pointer transition-opacity ${
                showButtons ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </>
      )}

      {/* Scrollable Product Grid - Swiper-like horizontal scroll */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar px-1 justify-center md:justify-start"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="snap-center flex-shrink-0 w-[85%] sm:w-[260px] md:w-[300px] mx-auto md:mx-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
