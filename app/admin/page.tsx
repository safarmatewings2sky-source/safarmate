"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminDashboard from "@/components/admin/admin-dashboard"
import Image from "next/image"
import { Lock, Mail, LogIn, Loader2 } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      // Check if we have a stored auth token in localStorage as backup
      const storedAuth = localStorage.getItem("adminAuth")
      
      if (storedAuth === "true") {
        // Verify with server
        const response = await fetch("/api/admin/check-auth", {
          method: "GET",
          credentials: "include", // Important: include cookies
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            setIsAuthenticated(true)
            localStorage.setItem("adminAuth", "true")
          } else {
            localStorage.removeItem("adminAuth")
          }
        } else {
          localStorage.removeItem("adminAuth")
        }
      } else {
        // Check server anyway
        const response = await fetch("/api/admin/check-auth", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            setIsAuthenticated(true)
            localStorage.setItem("adminAuth", "true")
          }
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("adminAuth")
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: include cookies
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        setEmail("")
        setPassword("")
        // Store auth state in localStorage as backup
        localStorage.setItem("adminAuth", "true")
      } else {
        setError(data.error || "Invalid email or password")
        localStorage.removeItem("adminAuth")
      }
    } catch (err) {
      setError("Failed to authenticate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Image
                  src="/icon.svg"
                  alt="SafarMate Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">SafarMate Admin</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@safarmate.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AdminDashboard />
}
