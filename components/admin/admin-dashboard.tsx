"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CategoryManager from "./category-manager"
import ProductManager from "./product-manager"
import InquiriesViewer from "./inquiries-viewer"
import { LogOut } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"categories" | "products" | "inquiries">("products")
  const router = useRouter()

  const handleLogout = async () => {
    // Clear localStorage
    localStorage.removeItem("adminAuth")
    
    // Clear cookie via API
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
    
    // Redirect to login
    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">SafarMate Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </Button>
          <Button variant={activeTab === "products" ? "default" : "outline"} onClick={() => setActiveTab("products")}>
            Products
          </Button>
          <Button variant={activeTab === "inquiries" ? "default" : "outline"} onClick={() => setActiveTab("inquiries")}>
            Inquiries
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6">
          {activeTab === "categories" && <CategoryManager />}
          {activeTab === "products" && <ProductManager />}
          {activeTab === "inquiries" && <InquiriesViewer />}
        </div>
      </div>
    </div>
  )
}
