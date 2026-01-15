"use client"

import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Categories from "@/components/categories"
import AboutSection from "@/components/about-section"
import FAQSection from "@/components/faq-section"
import TestimonialsSection from "@/components/testimonials-section"
import PartnersSection from "@/components/partners-section"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import LeadModal from "@/components/lead-modal"

export default function Home() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onOpenLeadModal={() => setIsLeadModalOpen(true)} />
      <main className="flex-1">
        <Hero onOpenLeadModal={() => setIsLeadModalOpen(true)} />
        <Features />
        <Categories />
        <AboutSection onOpenLeadModal={() => setIsLeadModalOpen(true)} />
        <FAQSection />
        <TestimonialsSection />
        <PartnersSection />
      </main>
      <Footer onOpenLeadModal={() => setIsLeadModalOpen(true)} />
      <FloatingContact />
      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </div>
  )
}
