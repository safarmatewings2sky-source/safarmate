"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  moq: number
  basePrice: number
  images: string[]
  colors: string[]
  specifications?: {
    material: string
    capacity: string
    weight: string
    compartments: number
    warranty: string
  }
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product._id}`} className="cursor-pointer">
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/50 h-full flex flex-col cursor-pointer gap-3 sm:gap-4 py-0 bg-card/95">
        {/* Product Image */}
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl">
          <Image
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Product Info */}
        <div className="px-4 pb-3 pt-1 sm:px-5 flex-1 flex flex-col">
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg sm:text-xl transition-colors break-words">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Price and MOQ */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60">
              <div>
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-2xl font-bold text-primary">₹{product.basePrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">MOQ</p>
                <p className="text-sm font-semibold">{product.moq} pcs</p>
              </div>
            </div>

            {/* Available Colors */}
            {false && product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Colors:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.colors.slice(0, 3).map((color, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                    >
                      {color}
                    </span>
                  ))}
                  {product.colors.length > 3 && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                      +{product.colors.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* View Details Button */}
          <div className="mt-3">
            <Button
              variant="outline"
              className="w-full rounded-full border-primary/40 hover:bg-black hover:text-white group-hover:bg-black group-hover:text-white transition-colors text-sm font-medium"
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
