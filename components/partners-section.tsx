import Image from "next/image"
import React from "react"

const partners = [
  { name: "Premier Travel Stores", category: "Luggage & Travel Retail", logo: "/placeholder-logo.svg", stat: "120+ stores" },
  { name: "Urban Campus Supplies", category: "Schools & Colleges", logo: "/placeholder-logo.svg", stat: "70k students" },
  { name: "Corporate Gift Hub", category: "Corporate Gifting", logo: "/placeholder-logo.svg", stat: "400+ enterprises" },
  { name: "Outdoor Gear Chains", category: "Trekking & Outdoor", logo: "/placeholder-logo.svg", stat: "Pan-India" },
  { name: "Online Marketplaces", category: "E-commerce Sellers", logo: "/placeholder-logo.svg", stat: "5+ platforms" },
  { name: "Luxury Boutiques", category: "Premium Retail", logo: "/placeholder-logo.svg", stat: "40 cities" },
]

export default function PartnersSection() {
  return (
    <section id="partners" className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/80 mb-3">Trusted by Leaders</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Partners that scale with us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            SafarMate collaborates with retailers, institutions, and brands to deliver high-quality bags at scale. We
            power go-to-market journeys across retail, education, corporate gifting, and premium travel.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="relative size-14 rounded-xl border border-border/60 bg-background flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={36}
                    height={36}
                    className="opacity-80"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{partner.category}</p>
                  <p className="text-lg font-semibold text-foreground">{partner.name}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">{partner.stat}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 bg-primary/5 rounded-2xl border border-primary/20 p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">5M+</p>
            <p className="text-sm text-muted-foreground">Bags delivered annually</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">45+</p>
            <p className="text-sm text-muted-foreground">Cities covered in India</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">98%</p>
            <p className="text-sm text-muted-foreground">Partner retention rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
