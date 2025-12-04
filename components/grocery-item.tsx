"use client"

import { motion } from "framer-motion"
import { Check, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GroceryItem as GroceryItemType } from "@/lib/types"
import { CATEGORY_CONFIG } from "@/lib/category-config"
import { cn } from "@/lib/utils"

interface GroceryItemProps {
  item: GroceryItemType
  onToggle: (id: string) => void
  onEdit: (item: GroceryItemType) => void
  onDelete: (id: string) => void
}

export function GroceryItem({ item, onToggle, onEdit, onDelete }: GroceryItemProps) {
  const categoryConfig = CATEGORY_CONFIG[item.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "p-4 bg-card shadow-sm border-border transition-all hover:shadow-md",
          item.completed && "opacity-60",
        )}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onToggle(item.id)}
            className={cn(
              "h-10 w-10 rounded-full border-2 shrink-0 transition-all",
              item.completed
                ? "bg-primary border-primary hover:bg-primary/90"
                : "bg-background border-border hover:bg-secondary",
            )}
          >
            {item.completed && <Check className="h-5 w-5 text-primary-foreground" />}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn("font-medium text-foreground", item.completed && "line-through text-muted-foreground")}>
                {item.name}
              </h3>
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium", categoryConfig.color)}>
                {categoryConfig.emoji} {item.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
          </div>

          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
