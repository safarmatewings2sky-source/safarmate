"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactForm from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Have questions about our bulk bagpack orders? Get in touch with our team and we'll respond as soon as possible.
                </p>
              </div>

              <div className="bg-card rounded-2xl shadow-xl border p-8 md:p-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
