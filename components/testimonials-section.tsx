import React from "react"
import { Card } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Procurement Head",
    company: "EduNation Schools",
    quote:
      "Safarmate delivered 2,000+ school backpacks on time with excellent quality. Our students and parents loved the design and durability.",
  },
  {
    name: "Priya Desai",
    role: "Brand Manager",
    company: "TravelX Retail",
    quote:
      "From sampling to final delivery, the Safarmate team was very professional. The bags look premium and match our brand perfectly.",
  },
  {
    name: "Amit Verma",
    role: "Founder",
    company: "Corporate Gifting Agency",
    quote:
      "We rely on Safarmate for large corporate gifting orders. Their consistency, finishing, and packaging make our clients very happy.",
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What Our Clients Say</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Businesses across India trust Safarmate for reliable bulk bag manufacturing, on-time delivery, and consistent quality.
        </p>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((item) => (
            <Card
              key={item.name}
              className="h-full flex flex-col gap-4 border-border/70 bg-card/95 hover:shadow-lg transition-shadow"
            >
              <div className="px-6 pt-6 flex items-start gap-3">
                <div className="rounded-full bg-black text-white p-2 shrink-0">
                  <Quote className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.quote}</p>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.role} · {item.company}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
