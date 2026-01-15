"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

interface AboutSectionProps {
  onOpenLeadModal?: () => void
}

export default function AboutSection({ onOpenLeadModal }: AboutSectionProps) {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/business-backpack-black.jpg"
              alt="About SafarMate"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About SafarMate</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We are a leading B2B wholesale platform specializing in premium bagpacks for businesses worldwide. 
                With years of experience in the industry, we understand the unique needs of bulk buyers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Quality Assurance</h3>
                  <p className="text-sm text-muted-foreground">
                    Every product undergoes rigorous quality checks to ensure durability and customer satisfaction.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Flexible MOQ</h3>
                  <p className="text-sm text-muted-foreground">
                    Minimum order quantity starts from just 10 pieces, making it accessible for businesses of all sizes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Custom Solutions</h3>
                  <p className="text-sm text-muted-foreground">
                    We offer customization options for large orders, including branding and design modifications.
                  </p>
                </div>
              </div>
            </div>

            {onOpenLeadModal ? (
              <Button size="lg" className="mt-6" onClick={onOpenLeadModal}>
                Get in Touch
              </Button>
            ) : (
              <Link href="/contact">
                <Button size="lg" className="mt-6">
                  Get in Touch
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
