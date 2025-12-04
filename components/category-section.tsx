"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { GroceryItem as GroceryItemType, Category } from "@/lib/types"
import { GroceryItem } from "./grocery-item"
import { CATEGORY_CONFIG } from "@/lib/category-config"

interface CategorySectionProps {
  category: Category
  items: GroceryItemType[]
  onToggle: (id: string) => void
  onEdit: (item: GroceryItemType) => void
  onDelete: (id: string) => void
}

export function CategorySection({ category, items, onToggle, onEdit, onDelete }: CategorySectionProps) {
  if (items.length === 0) return null

  const categoryConfig = CATEGORY_CONFIG[category]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-2xl">{categoryConfig.emoji}</span>
        <h2 className="text-lg font-semibold text-foreground">{category}</h2>
        <span className="text-sm text-muted-foreground">({items.length})</span>
      </div>
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {items.map((item) => (
            <GroceryItem key={item.id} item={item} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  )
}
