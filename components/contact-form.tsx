"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Check, ShoppingBag } from "lucide-react"

// Bag categories
const bagCategories = [
  { id: "school", name: "School Bags" },
  { id: "travel", name: "Travel Bags" },
  { id: "trekking", name: "Trekking Bags" },
  { id: "laptop", name: "Laptop Bags" },
  { id: "business", name: "Business Bags" },
]

// Country data for phone number selection
const countries = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', pattern: /^\d{10}$/, placeholder: '9876543210', digits: 10 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', pattern: /^\d{10}$/, placeholder: '1234567890', digits: 10 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', pattern: /^\d{10,11}$/, placeholder: '7123456789', digits: [10, 11] },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', pattern: /^\d{10}$/, placeholder: '1234567890', digits: 10 },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', pattern: /^\d{9}$/, placeholder: '412345678', digits: 9 },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪', pattern: /^\d{9}$/, placeholder: '501234567', digits: 9 },
]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    bagCategory: [] as string[], // Changed to array for multiple selections
    quantity: "",
    colorTheme: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<{email?: string; phone?: string}>({})
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  // Validation functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidPhone = (phone: string): boolean => {
    const currentCountry = getCurrentCountry()
    const digitsOnly = phone.replace(/\D/g, '')
    return currentCountry.pattern.test(digitsOnly)
  }

  const getCurrentCountry = () => {
    return countries.find(country => country.dialCode === formData.countryCode) || countries[0]
  }

  const getPhoneValidationMessage = (): string => {
    const currentCountry = getCurrentCountry()
    const digits = currentCountry.digits
    
    if (Array.isArray(digits)) {
      return `${digits[0]} to ${digits[1]} digits required`
    } else {
      return `Exactly ${digits} digits required`
    }
  }

  const formatPhoneInput = (input: string): string => {
    const digitsOnly = input.replace(/\D/g, '')
    const currentCountry = getCurrentCountry()
    const maxDigits = Array.isArray(currentCountry.digits) ? currentCountry.digits[1] : currentCountry.digits
    return digitsOnly.slice(0, maxDigits)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user starts typing
    if (name === "email" && errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
    if (name === "phone" && errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }))
    }
  }

  const handlePhoneChange = (value: string) => {
    const formattedValue = formatPhoneInput(value)
    setFormData(prev => ({
      ...prev,
      phone: formattedValue,
    }))
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }))
    }
  }

  const handleCountrySelect = (country: typeof countries[0]) => {
    setFormData(prev => ({ ...prev, countryCode: country.dialCode }))
    setShowCountryDropdown(false)
    setFormData(prev => ({ ...prev, phone: "" }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const isSelected = prev.bagCategory.includes(categoryId)
      if (isSelected) {
        return {
          ...prev,
          bagCategory: prev.bagCategory.filter(id => id !== categoryId)
        }
      } else {
        return {
          ...prev,
          bagCategory: [...prev.bagCategory, categoryId]
        }
      }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: {email?: string; phone?: string} = {}

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = `Invalid ${getCurrentCountry().name} phone number. ${getPhoneValidationMessage()}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (formData.bagCategory.length === 0) {
      alert("Please select at least one bag category")
      return
    }

    setIsLoading(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '203aa19b-7eb3-4b02-ba59-699b8c0d81bf',
          name: formData.name,
          email: formData.email,
          phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : "",
          bag_categories: formData.bagCategory.join(", "),
          quantity: formData.quantity,
          color_theme: formData.colorTheme,
          message: formData.message,
          subject: `SafarMate Quote Request - ${formData.name}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          countryCode: "+91",
          bagCategory: [],
          quantity: "",
          colorTheme: "",
          message: "",
        })
        setErrors({})
        setTimeout(() => setSubmitStatus("idle"), 5000)
      } else {
        setSubmitStatus("error")
        setTimeout(() => setSubmitStatus("idle"), 5000)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get Your Custom Bag Quote
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Fill out the form below to get a personalized quote for your custom bag requirements. 
          Our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Request a Quote</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              
              <div className="mb-3 relative">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Country Code
                </label>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    {getCurrentCountry().flag}
                    {formData.countryCode} - {getCurrentCountry().name}
                    <span className="ml-auto text-gray-500">▼</span>
                  </span>
                </button>
                
                {showCountryDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-all ${
                          formData.countryCode === country.dialCode ? 'bg-gray-100 text-gray-900' : ''
                        }`}
                      >
                        <span className="text-base">{country.flag}</span>
                        <span className="flex-1">{country.name}</span>
                        <span className="text-gray-500">{country.dialCode}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder={`e.g., ${getCurrentCountry().placeholder}`}
                maxLength={Array.isArray(getCurrentCountry().digits) ? getCurrentCountry().digits[1] : getCurrentCountry().digits}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              {!errors.phone && formData.phone && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Valid {getCurrentCountry().name} phone number
                </p>
              )}
            </div>

            {/* Bag Categories Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bag Categories Required *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bagCategories.map((category) => {
                  const isSelected = formData.bagCategory.includes(category.id)
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white border-transparent' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        {isSelected && <Check className="w-5 h-5" />}
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Select one or multiple categories
              </p>
            </div>

            {/* Quantity and Color Theme */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Required *
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                >
                  <option value="">Select quantity</option>
                  <option value="1-10">1-10 units</option>
                  <option value="11-50">11-50 units</option>
                  <option value="51-100">51-100 units</option>
                  <option value="101-500">101-500 units</option>
                  <option value="500+">500+ units</option>
                  <option value="bulk">Bulk Order</option>
                </select>
              </div>

              <div>
                <label htmlFor="colorTheme" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Color Theme
                </label>
                <input
                  type="text"
                  id="colorTheme"
                  name="colorTheme"
                  value={formData.colorTheme}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="e.g., Black & Blue, Corporate Colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition-all"
                placeholder="Tell us about your specific requirements, design preferences, or any other details..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || formData.bagCategory.length === 0}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-800 hover:to-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? "Processing..." : "Get Quote Now"}
            </button>

            {submitStatus === "success" && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg text-green-700 flex items-center gap-3">
                <Check className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Quote request sent successfully!</p>
                  <p className="text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg text-red-700">
                <p className="font-semibold">Failed to send request</p>
                <p className="text-sm">Please try again or contact us directly.</p>
              </div>
            )}
          </form>
        </div>

        {/* Right Column - Contact Information */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Why Choose SafarMate?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Premium Quality</h3>
                  <p className="text-white/80 text-sm">Durable materials and expert craftsmanship</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Custom Designs</h3>
                  <p className="text-white/80 text-sm">Tailored to your specific requirements</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Bulk Order Discounts</h3>
                  <p className="text-white/80 text-sm">Competitive pricing for wholesale orders</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Fast Delivery</h3>
                  <p className="text-white/80 text-sm">Timely production and shipping</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:info@safarmate.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                    info@safarmate.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a href="tel:+911234567890" className="text-gray-600 hover:text-gray-900 transition-colors">
                    +91-12345 67890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Office Address</p>
                  <p className="text-gray-600">
                    Plot no. 505 Sector 19,<br />
                    Dwarka, Delhi 110075<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Business Hours</h4>
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-red-500">Closed</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}