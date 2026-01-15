"use client"

import { useState, useRef,useEffect } from "react"
import Link from "next/link"
import { Phone, X, Send, Minimize2, Maximize2, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define phone numbers
const whatsappNumber = "9871890607"
const phoneNumber = "9871890607"

// Bag categories for selection
const bagCategories = [
  { id: "travel", name: "Travel Bags", description: "Duffle bags, Cabin luggage, Backpack luggage" },
  { id: "trekking", name: "Trekking Bags", description: "Hiking backpacks, Camping bags, Outdoor gear" },
  { id: "business", name: "Business Bags", description: "Laptop bags, Briefcases, Office backpacks" },
  { id: "school", name: "School Bags", description: "Backpacks, Lunch bags, College bags" },
  { id: "other", name: "Other", description: "Custom requirements or other bag types" },
]

// Country data for phone number selection
const countries = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', pattern: /^\d{10}$/, placeholder: '9876543210', digits: 10 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', pattern: /^\d{10}$/, placeholder: '1234567890', digits: 10 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', pattern: /^\d{10,11}$/, placeholder: '7123456789', digits: [10, 11] },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', pattern: /^\d{10}$/, placeholder: '1234567890', digits: 10 },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', pattern: /^\d{9}$/, placeholder: '412345678', digits: 9 },
]

export default function FloatingContact() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <>
      <div className="fixed right-6 bottom-6 flex flex-col items-end gap-3 z-50">
        {/* WhatsApp Button - Always Visible */}
        <Link
          href={`https://wa.me/${whatsappNumber}?text=Hello%20Safarmate%20BagPacks!%20I%20need%20information%20about%20your%20bags.`}
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            fill="currentColor" 
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </Link>

        {/* Chat Button - Always Visible */}
        <button
          onClick={() => {
            setIsChatOpen(true)
            setIsMinimized(false)
          }}
          title="Chat"
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M8 10h.01"/>
            <path d="M12 10h.01"/>
            <path d="M16 10h.01"/>
          </svg>
        </button>

        {/* Phone Button - Always Visible */}
        <Link
          href={`tel:${phoneNumber}`}
          title="Call"
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </Link>
      </div>

      {/* Chat Widget */}
      {isChatOpen && (
        <ChatWidget 
          isMinimized={isMinimized}
          onMinimize={() => setIsMinimized(!isMinimized)}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  )
}

interface ChatWidgetProps {
  isMinimized: boolean
  onMinimize: () => void
  onClose: () => void
}

function ChatWidget({ isMinimized, onMinimize, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date; type?: 'text' | 'options' }>>([
    {
      text: "Welcome to Safarmate BagPacks! I'm here to help you find the perfect bag. What's your name?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91", // Default to India
    bagCategory: "",
    quantity: "",
    purpose: "",
    message: "",
  })
  const [currentStep, setCurrentStep] = useState<
    "name" | "email" | "phone" | "category" | "quantity" | "purpose" | "message" | "complete"
  >("name")
  const [isLoading, setIsLoading] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get current country details
  const getCurrentCountry = () => {
    return countries.find(country => country.dialCode === formData.countryCode) || countries[0]
  }

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

  const getPhoneValidationMessage = (): string => {
    const currentCountry = getCurrentCountry()
    const countryName = currentCountry.name
    const digits = currentCountry.digits
    
    if (Array.isArray(digits)) {
      return `Please enter a valid ${countryName} phone number (${digits[0]} to ${digits[1]} digits)`
    } else {
      return `Please enter a valid ${countryName} phone number (exactly ${digits} digits)`
    }
  }

  const getPhonePlaceholder = (): string => {
    const currentCountry = getCurrentCountry()
    return currentCountry.placeholder
  }

  const formatPhoneInput = (input: string): string => {
    const digitsOnly = input.replace(/\D/g, '')
    const currentCountry = getCurrentCountry()
    const maxDigits = Array.isArray(currentCountry.digits) ? currentCountry.digits[1] : currentCountry.digits
    return digitsOnly.slice(0, maxDigits)
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const userMessage = {
      text: currentInput,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentInput("")
    setIsLoading(true)

    // Update form data based on current step
    const updatedFormData = { ...formData }
    let validationError = ""

    switch (currentStep) {
      case "name":
        updatedFormData.name = currentInput
        setFormData(updatedFormData)
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: "Thank you! What's your email address?",
              isUser: false,
              timestamp: new Date(),
            },
          ])
          setCurrentStep("email")
          setIsLoading(false)
        }, 1000)
        break

      case "email":
        if (!isValidEmail(currentInput)) {
          validationError = "Please enter a valid email address (e.g., name@example.com)"
        } else {
          updatedFormData.email = currentInput
          setFormData(updatedFormData)
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                text: "Great! What's your phone number? You can select your country code.",
                isUser: false,
                timestamp: new Date(),
              },
            ])
            setCurrentStep("phone")
            setIsLoading(false)
          }, 1000)
        }
        break

      case "phone":
        const formattedPhone = formatPhoneInput(currentInput)
        if (!isValidPhone(formattedPhone)) {
          validationError = getPhoneValidationMessage()
        } else {
          updatedFormData.phone = formattedPhone
          setFormData(updatedFormData)
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                text: "What type of bag are you interested in?",
                isUser: false,
                timestamp: new Date(),
                type: 'options',
              },
            ])
            setCurrentStep("category")
            setIsLoading(false)
          }, 1000)
        }
        break

      case "category":
        const selectedCat = bagCategories.find(cat => cat.name === currentInput)
        if (!selectedCat) {
          validationError = "Please select one of the bag categories from the options above."
        } else {
          updatedFormData.bagCategory = currentInput
          setFormData(updatedFormData)
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                text: `Great choice! ${selectedCat.description} What quantity are you looking for?`,
                isUser: false,
                timestamp: new Date(),
              },
            ])
            setCurrentStep("quantity")
            setIsLoading(false)
          }, 1000)
        }
        break

      case "quantity":
        const quantity = parseInt(currentInput)
        if (isNaN(quantity) || quantity <= 0) {
          validationError = "Please enter a valid quantity (e.g., 10, 50, 100)"
        } else {
          updatedFormData.quantity = currentInput
          setFormData(updatedFormData)
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                text: "What will be the primary purpose of these bags?",
                isUser: false,
                timestamp: new Date(),
              },
            ])
            setCurrentStep("purpose")
            setIsLoading(false)
          }, 1000)
        }
        break

      case "purpose":
        updatedFormData.purpose = currentInput
        setFormData(updatedFormData)
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: "Please share any additional details or specific requirements:",
              isUser: false,
              timestamp: new Date(),
            },
          ])
          setCurrentStep("message")
          setIsLoading(false)
        }, 1000)
        break

      case "message":
        updatedFormData.message = currentInput
        setFormData(updatedFormData)
        
        // Send the form data to Web3Forms
        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_key: '203aa19b-7eb3-4b02-ba59-699b8c0d81bf',
              name: updatedFormData.name,
              email: updatedFormData.email,
              phone: `${updatedFormData.countryCode} ${updatedFormData.phone}`,
              subject: `Bag Inquiry: ${updatedFormData.bagCategory} (Qty: ${updatedFormData.quantity})`,
              message: `Bag Category: ${updatedFormData.bagCategory}
Quantity: ${updatedFormData.quantity}
Purpose: ${updatedFormData.purpose}
Additional Details: ${updatedFormData.message}

--- Contact Details ---
Name: ${updatedFormData.name}
Email: ${updatedFormData.email}
Phone: ${updatedFormData.countryCode} ${updatedFormData.phone}

Source: Chat Widget`,
              source: 'chat-widget',
            }),
          })

          const data = await response.json()

          if (data.success) {
            setMessages(prev => [
              ...prev,
              {
                text: "Thank you for providing all the information! We've received your inquiry and our team will contact you shortly with the best quote for your bag requirements.",
                isUser: false,
                timestamp: new Date(),
              },
            ])
          } else {
            setMessages(prev => [
              ...prev,
              {
                text: "Thank you for the information! There was an issue sending your details. Please try contacting us via WhatsApp or email.",
                isUser: false,
                timestamp: new Date(),
              },
            ])
          }
        } catch (error) {
          console.error("Error sending chat data:", error)
          setMessages(prev => [
            ...prev,
            {
              text: "Thank you for the information! There was an error processing your request. Please try contacting us via WhatsApp or email.",
              isUser: false,
              timestamp: new Date(),
            },
          ])
        } finally {
          setCurrentStep("complete")
          setIsLoading(false)
        }
        break

      default:
        setIsLoading(false)
        break
    }

    // Handle validation errors
    if (validationError) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            text: validationError,
            isUser: false,
            timestamp: new Date(),
          },
        ])
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleCategorySelect = (categoryName: string) => {
    setCurrentInput(categoryName)
    handleSendMessage()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCountrySelect = (country: typeof countries[0]) => {
    setFormData(prev => ({ ...prev, countryCode: country.dialCode }))
    setShowCountryDropdown(false)
    // Clear phone input when country changes
    setCurrentInput("")
  }

  const handlePhoneInputChange = (value: string) => {
    const formattedValue = formatPhoneInput(value)
    setCurrentInput(formattedValue)
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-40 right-6 z-50 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-border">
        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
          <h3 className="font-semibold">Safarmate BagPacks Chat</h3>
          <div className="flex gap-2">
            <button onClick={onMinimize} className="hover:bg-primary/80 rounded p-1 transition-colors">
              <Maximize2 size={16} />
            </button>
            <button onClick={onClose} className="hover:bg-primary/80 rounded p-1 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-40 right-6 z-50 w-80 h-[500px] bg-card rounded-lg shadow-2xl border border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
        <h3 className="font-semibold">Safarmate BagPacks</h3>
        <div className="flex gap-2">
          <button onClick={onMinimize} className="hover:bg-primary/80 rounded p-1 transition-colors">
            <Minimize2 size={16} />
          </button>
          <button onClick={onClose} className="hover:bg-primary/80 rounded p-1 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-secondary">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.isUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isUser ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Bag Category Options */}
          {currentStep === "category" && (
  <div className="space-y-2">
    {bagCategories.map((category) => (
      <button
        key={category.id}
        onClick={() => handleCategorySelect(category.name)}
        className="w-full p-3 bg-background hover:bg-black hover:text-white border border-border rounded-lg text-left transition-colors cursor-pointer"
      >
        <div className="font-medium">{category.name}</div>
        <div className="text-xs text-muted-foreground hover:text-white/80 mt-1">{category.description}</div>
      </button>
    ))}
  </div>
)}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground rounded-lg rounded-bl-none px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {currentStep !== "complete" && currentStep !== "category" && (
        <div className="p-4 border-t border-border">
          {/* Country selector for phone step */}
          {currentStep === "phone" && (
            <div className="mb-3 relative">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Country Code
              </label>
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {getCurrentCountry().flag}
                  {formData.countryCode} - {getCurrentCountry().name}
                  <span className="ml-auto text-muted-foreground">▼</span>
                </span>
              </button>
              
              {showCountryDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCountryDropdown(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-1 max-h-48 overflow-y-auto bg-background border border-border rounded-lg shadow-lg z-20">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 transition-colors cursor-pointer ${
                          formData.countryCode === country.dialCode ? 'bg-primary/10 text-primary' : ''
                        }`}
                      >
                        <span className="text-base">{country.flag}</span>
                        <span className="flex-1">{country.name}</span>
                        <span className="text-muted-foreground">{country.dialCode}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type={currentStep === "email" ? "email" : currentStep === "phone" ? "tel" : "text"}
              value={currentInput}
              onChange={(e) => currentStep === "phone" ? handlePhoneInputChange(e.target.value) : setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentStep === "name" ? "Your full name..." :
                currentStep === "email" ? "your@email.com..." :
                currentStep === "phone" ? `e.g., ${getPhonePlaceholder()}` :
                currentStep === "quantity" ? "Quantity (e.g., 10, 50, 100+)..." :
                currentStep === "purpose" ? "Personal use, Corporate gifts, Reselling..." :
                "Additional details, specific colors, sizes..."
              }
              maxLength={currentStep === "phone" ? (Array.isArray(getCurrentCountry().digits) ? getCurrentCountry().digits[1] : getCurrentCountry().digits) : undefined}
              className="flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isLoading}
              className="px-4 py-2"
            >
              <Send size={18} />
            </Button>
          </div>
          
          {/* Input hints */}
          {currentStep === "email" && (
            <p className="text-xs text-muted-foreground mt-1">
              Please enter a valid email address
            </p>
          )}
          {currentStep === "phone" && (
            <p className="text-xs text-muted-foreground mt-1">
              {getPhoneValidationMessage()}
            </p>
          )}
          {currentStep === "quantity" && (
            <p className="text-xs text-muted-foreground mt-1">
              Enter the quantity you need. For bulk orders, mention approximate number.
            </p>
          )}
        </div>
      )}

      {/* Success Message with Contact Info */}
      {currentStep === "complete" && (
        <div className="p-4 border-t border-border space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-600 dark:text-green-400">
            <p className="font-medium">✓ Inquiry Submitted Successfully!</p>
            <p className="text-sm mt-1">Our team will contact you within 24 hours.</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="text-primary mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs font-medium text-foreground">Email</p>
                <a href="mailto:info@safarmate.com" className="text-xs text-muted-foreground hover:text-primary transition">
                  info@safarmate.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="text-primary mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs font-medium text-foreground">Phone</p>
                <a href="tel:+919871890607" className="text-xs text-muted-foreground hover:text-primary transition">
                  +91 98718 90607
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs font-medium text-foreground">Address</p>
                <p className="text-xs text-muted-foreground">
                  Safarmate BagPacks Headquarters
                </p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full"
            variant="outline"
          >
            Close Chat
          </Button>
        </div>
      )}
    </div>
  )
}