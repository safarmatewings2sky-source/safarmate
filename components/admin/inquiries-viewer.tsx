"use client"

import { useEffect, useState } from "react"

interface Inquiry {
  _id: string
  buyerName: string
  companyName: string
  email: string
  phone: string
  productName: string
  quantity: number
  colors: string
  notes: string
  createdAt: string
  status: string
}

export default function InquiriesViewer() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
    const interval = setInterval(fetchInquiries, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/inquiries")
      const data = await response.json()
      setInquiries(data)
    } catch (error) {
      console.error("Failed to fetch inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading inquiries...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bulk Order Inquiries ({inquiries.length})</h2>

      {inquiries.length === 0 ? (
        <p className="text-muted-foreground">No inquiries yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Company</th>
                <th className="text-left py-2 px-4">Product</th>
                <th className="text-left py-2 px-4">Quantity</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-left py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="border-b hover:bg-background">
                  <td className="py-3 px-4">{inquiry.buyerName}</td>
                  <td className="py-3 px-4">{inquiry.companyName}</td>
                  <td className="py-3 px-4">{inquiry.productName}</td>
                  <td className="py-3 px-4">{inquiry.quantity}</td>
                  <td className="py-3 px-4 text-blue-600">{inquiry.email}</td>
                  <td className="py-3 px-4">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
