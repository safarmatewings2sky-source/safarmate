"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Product {
  _id: string
  name: string
  moq: number
  colors: string[]
}

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

export default function InquiryModal({ isOpen, onClose, product }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    buyerName: "",
    companyName: "",
    email: "",
    phone: "",
    quantity: product.moq,
    colors: [] as string[],
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorToggle = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/send-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productName: product.name,
          colors: formData.colors.join(", "),
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setFormData({
            buyerName: "",
            companyName: "",
            email: "",
            phone: "",
            quantity: product.moq,
            colors: [],
            notes: "",
          })
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to send inquiry:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Order Inquiry - {product.name}</DialogTitle>
          <DialogDescription>Minimum order quantity: {product.moq} pieces</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-lg font-semibold text-primary">Thank you! Your inquiry has been sent.</p>
            <p className="text-muted-foreground mt-2">Our sales team will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="buyerName"
                placeholder="Your Name"
                value={formData.buyerName}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity (Minimum: {product.moq} pieces)</label>
              <input
                type="number"
                name="quantity"
                min={product.moq}
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Colors</label>
              <div className="grid grid-cols-2 gap-2">
                {product.colors.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color)}
                      onChange={() => handleColorToggle(color)}
                      className="rounded"
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>

            <textarea
              name="notes"
              placeholder="Additional notes or requirements"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Inquiry"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
