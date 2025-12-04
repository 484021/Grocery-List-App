"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/lib/types"
import { CATEGORY_CONFIG } from "@/lib/category-config"

interface AddItemFormProps {
  onAdd: (name: string, quantity: string, category: Category) => void
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [category, setCategory] = useState<Category>("Other")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd(name.trim(), quantity.trim() || "1", category)
      setName("")
      setQuantity("")
      setCategory("Other")
    }
  }

  return (
    <Card className="p-6 bg-card shadow-sm border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="item-name" className="text-foreground font-medium">
            Item name
          </Label>
          <Input
            id="item-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What do you need?"
            className="h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground font-medium">
              Quantity
            </Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              className="h-12 rounded-xl border-border bg-background text-foreground"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category" className="h-12 rounded-xl border-border bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(CATEGORY_CONFIG).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_CONFIG[cat as Category].emoji}</span>
                      <span>{cat}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-sm"
          disabled={!name.trim()}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add to List
        </Button>
      </form>
    </Card>
  )
}
