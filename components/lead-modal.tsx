"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, Loader2 } from "lucide-react"

interface Category {
  _id: string
  name: string
}

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    category: "",
    quantity: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedCategory = categories.find((cat) => cat._id === formData.category)
      const categoryName = selectedCategory?.name || formData.category

      const response = await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: categoryName,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setFormData({
            username: "",
            email: "",
            contact: "",
            category: "",
            quantity: "",
            message: "",
          })
        }, 3000)
      } else {
        alert(data.error || "Failed to submit your inquiry. Please try again.")
      }
    } catch (error) {
      console.error("Failed to send lead:", error)
      alert("Failed to submit your inquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Get a Quote - Bulk Order Inquiry</DialogTitle>
          <DialogDescription>
            Fill out the form below and our sales team will contact you shortly with pricing and availability.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
            <h3 className="text-2xl font-semibold">Thank You!</h3>
            <p className="text-muted-foreground">
              Your inquiry has been submitted successfully. Our sales team will contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Your Name *</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="+1 (234) 567-8900"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Product Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Required *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="e.g., 50, 100, 500"
                min="10"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">Minimum order quantity: 10 pieces</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Requirements (Optional)</Label>
              <textarea
                id="message"
                name="message"
                placeholder="Any specific requirements, colors, customization needs, etc."
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
