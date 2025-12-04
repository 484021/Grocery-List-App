"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GroceryItem, Category } from "@/lib/types"
import { CATEGORY_CONFIG } from "@/lib/category-config"

interface EditItemDialogProps {
  item: GroceryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, name: string, quantity: string, category: Category) => void
}

export function EditItemDialog({ item, open, onOpenChange, onSave }: EditItemDialogProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [category, setCategory] = useState<Category>("Other")

  useEffect(() => {
    if (item) {
      setName(item.name)
      setQuantity(item.quantity)
      setCategory(item.category)
    }
  }, [item])

  const handleSave = () => {
    if (item && name.trim()) {
      onSave(item.id, name.trim(), quantity.trim() || "1", category)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-foreground font-medium">
              Item name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-border bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-quantity" className="text-foreground font-medium">
              Quantity
            </Label>
            <Input
              id="edit-quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-12 rounded-xl border-border bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category" className="text-foreground font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="edit-category" className="h-12 rounded-xl border-border bg-background text-foreground">
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
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
