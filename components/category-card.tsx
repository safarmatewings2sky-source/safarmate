"use client"

import { Card } from "@/components/ui/card"

interface CategoryCardProps {
  category: {
    _id: string
    name: string
    description: string
    image: string
  }
  isSelected: boolean
  onSelect: () => void
}

export default function CategoryCard({ category, isSelected, onSelect }: CategoryCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer overflow-hidden transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary shadow-lg" : "shadow-md hover:shadow-lg"
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img src={category.image || "/placeholder.svg"} alt={category.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{category.name}</h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
    </Card>
  )
}
