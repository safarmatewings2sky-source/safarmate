"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package, Users, TrendingUp } from "lucide-react"

interface HeroProps {
  onOpenLeadModal?: () => void
}

export default function Hero({ onOpenLeadModal }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Package className="h-4 w-4" />
              <span>B2B Wholesale Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Premium Bagpacks for
              <span className="text-primary"> Bulk Orders</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Professional B2B wholesale platform for quality bagpacks. Minimum order quantity: 10 pieces per design.
              Competitive pricing for businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="#categories">
                <Button size="lg" className="w-full sm:w-auto group">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {onOpenLeadModal ? (
                <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={onOpenLeadModal}>
                  Contact Sales
                </Button>
              ) : (
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contact Sales
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-2xl font-bold text-primary">
                  <Users className="h-5 w-5" />
                  <span>500+</span>
                </div>
                <p className="text-sm text-muted-foreground">Business Clients</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-2xl font-bold text-primary">
                  <Package className="h-5 w-5" />
                  <span>50+</span>
                </div>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-2xl font-bold text-primary">
                  <TrendingUp className="h-5 w-5" />
                  <span>10+</span>
                </div>
                <p className="text-sm text-muted-foreground">MOQ</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/new-backpacks-collection.png"
              alt="Premium Bagpacks Collection"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
