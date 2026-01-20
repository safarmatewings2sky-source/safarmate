"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Category {
  _id: string
  name: string
  description: string
  image: string
}

interface HeaderProps {
  onOpenLeadModal?: () => void
}

export default function Header({ onOpenLeadModal }: HeaderProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/icon.svg"
              alt="SafarMate Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-foreground">SafarMate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium hover:bg-black hover:text-white px-3 py-2 rounded-md transition-colors cursor-pointer">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium cursor-pointer hover:bg-black hover:text-white data-[state=open]:bg-black data-[state=open]:text-white">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[250px] p-2 bg-popover border border-border rounded-md shadow-lg z-50">
                      <Link href="#categories" legacyBehavior passHref>
                        <NavigationMenuLink className="block rounded-md p-3 text-sm font-medium transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white focus:outline-none cursor-pointer">
                          School Bags
                        </NavigationMenuLink>
                      </Link>
                      <Link href="#categories" legacyBehavior passHref>
                        <NavigationMenuLink className="block rounded-md p-3 text-sm font-medium transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white focus:outline-none cursor-pointer">
                          Travel Bags
                        </NavigationMenuLink>
                      </Link>
                      <Link href="#categories" legacyBehavior passHref>
                        <NavigationMenuLink className="block rounded-md p-3 text-sm font-medium transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white focus:outline-none cursor-pointer">
                          Trekking Bags
                        </NavigationMenuLink>
                      </Link>
                      <Link href="#categories" legacyBehavior passHref>
                        <NavigationMenuLink className="block rounded-md p-3 text-sm font-medium transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white focus:outline-none cursor-pointer">
                          Business Bags
                        </NavigationMenuLink>
                      </Link>
                      <Link href="#categories" legacyBehavior passHref>
                        <NavigationMenuLink className="block rounded-md p-3 text-sm font-medium transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white focus:outline-none cursor-pointer">
                          Outdoor Bags
                        </NavigationMenuLink>
                      </Link>
                      <Link href="#categories" legacyBehavior passHref>
                        <NavigationMenuLink className="block rounded-md p-3 text-sm font-medium transition-colors hover:bg-black hover:text-white focus:bg-black focus:text-white focus:outline-none cursor-pointer">
                          Laptop Bags
                        </NavigationMenuLink>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}

                <NavigationMenuItem>
                  <Link href="/#about" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium hover:bg-black hover:text-white px-3 py-2 rounded-md transition-colors cursor-pointer">
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium hover:bg-black hover:text-white px-3 py-2 rounded-md transition-colors cursor-pointer">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                Admin
              </Button>
            </Link>
            {onOpenLeadModal ? (
              <Button size="sm" onClick={onOpenLeadModal}>Get Quote</Button>
            ) : (
              <Link href="/contact">
                <Button size="sm">Get Quote</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium hover:bg-black hover:text-white px-3 py-2 rounded-md transition-colors"
                >
                  Home
                </Link>
          
                <Link
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium hover:bg-black hover:text-white px-3 py-2 rounded-md transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium hover:bg-black hover:text-white px-3 py-2 rounded-md transition-colors"
                >
                  Contact
                </Link>
                <div className="pt-4 space-y-2 border-t">
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start hover:bg-black hover:text-white">
                      Admin
                    </Button>
                  </Link>
                  {onOpenLeadModal ? (
                    <Button size="sm" className="w-full" onClick={() => { setMobileMenuOpen(false); onOpenLeadModal(); }}>Get Quote</Button>
                  ) : (
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full">Get Quote</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}