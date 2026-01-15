import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sparkles } from "lucide-react"

const faqs = [
  {
    question: "Do you manufacture custom bulk orders for businesses?",
    answer:
      "Yes, we specialize in bulk manufacturing for brands, corporates, schools, and resellers. You can customize materials, colors, branding, and packaging based on your requirement.",
  },
  {
    question: "What is the usual minimum order quantity (MOQ)?",
    answer:
      "MOQ depends on the bag type and customization level, but most SafarMate bulk orders start from 50–100 pieces. Share your requirement and we will guide you with the best options.",
  },
  {
    question: "How long does production and delivery take?",
    answer:
      "Standard production timelines range from 15–30 days after design approval and advance payment. Timelines can vary based on quantity and complexity.",
  },
  {
    question: "Can you ship across India?",
    answer:
      "Yes. We ship bulk orders across India via trusted logistics partners. We can also support priority shipping for time-sensitive requirements.",
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Quick Help
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl">
              Everything you need to know about SafarMate bulk bag manufacturing, delivery timelines, customization &
              logistics.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="rounded-2xl border border-border bg-background/80 px-4 transition-shadow hover:shadow-md"
            >
              <AccordionTrigger className="text-base font-semibold text-left text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
