"use client"

import { Package, Shield, Truck, Headphones, TrendingUp, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Package,
    title: "Quality Products",
    description: "Premium bagpacks crafted with durable materials and modern designs for long-lasting use.",
  },
  {
    icon: Shield,
    title: "Trusted Supplier",
    description: "Reliable B2B partner with years of experience in wholesale bagpack distribution.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Quick and secure delivery to your business location with tracking support.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service team ready to assist with your bulk order needs.",
  },
  {
    icon: TrendingUp,
    title: "Competitive Pricing",
    description: "Best wholesale prices in the market with flexible payment terms for businesses.",
  },
  {
    icon: Users,
    title: "Bulk Orders",
    description: "Specialized in handling large volume orders with MOQ starting from just 10 pieces.",
  },
]

export default function Features() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SafarMate?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide exceptional value for businesses looking for quality bagpacks at wholesale prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
