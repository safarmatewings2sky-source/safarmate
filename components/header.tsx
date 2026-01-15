import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  onOpenLeadModal?: () => void
}

export default function Header({ onOpenLeadModal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false)
    }

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isDropdownOpen])

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const categories = [
    { name: "School Bags", href: "/categories/school-bags", icon: "🎒" },
    { name: "Travel Bags", href: "/categories/travel-bags", icon: "🧳" },
    { name: "Trekking Bags", href: "/categories/trekking-bags", icon: "🥾" },
    { name: "Business Bags", href: "/categories/business-bags", icon: "💼" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/icon.svg"
                alt="SafarMate Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SafarMate
              </span>
              <span className="text-xs text-gray-500 -mt-1">Premium Bags & Luggage</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-3/4"></span>
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDropdownOpen(!isDropdownOpen)
                }}
                className="flex items-center space-x-1 px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 group"
              >
                <span>Categories</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-3/4"></span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-5 duration-200">
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Our Collections
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 group/item"
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                          {/* <ChevronDown className="w-4 h-4 text-gray-400 transform -rotate-90 ml-auto group-hover/item:translate-x-1 transition-transform" /> */}
                        </Link>
                      ))}
                    </div>
                    {/* <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href="/categories"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg hover:shadow-lg transition-all duration-300 group"
                      >
                        <span>View All Categories</span>
                        <ChevronDown className="w-4 h-4 transform -rotate-90 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/admin">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 border border-gray-200"
              >
                Dashboard
              </Button>
            </Link>
            {onOpenLeadModal ? (
              <Button 
                size="sm" 
                onClick={onOpenLeadModal}
                className="px-6 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Quote
              </Button>
            ) : (
              <Link href="/contact">
                <Button 
                  size="sm"
                  className="px-6 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Quote
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="relative w-10 h-10 hover:bg-gray-50"
            >
              <Menu className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-gray-100">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Link 
                href="/" 
                className="flex items-center space-x-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative w-8 h-8">
                  <Image
                    src="/icon.svg"
                    alt="SafarMate Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">SafarMate</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-gray-50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <div className="space-y-1 pt-2">
                  <div className="px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Categories
                    </h3>
                  </div>
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400 transform -rotate-90 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer CTA */}
            <div className="p-6 border-t border-gray-100 space-y-3 bg-gray-50/50">
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button 
                  variant="outline" 
                  className="w-full justify-center border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400"
                >
                  Admin Dashboard
                </Button>
              </Link>
              {onOpenLeadModal ? (
                <Button 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenLeadModal()
                  }}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Free Quote
                </Button>
              ) : (
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                  <Button 
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Get Free Quote
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}