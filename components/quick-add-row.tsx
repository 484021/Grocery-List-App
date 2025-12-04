"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { QUICK_ADD_ITEMS } from "@/lib/category-config"

interface QuickAddRowProps {
  onQuickAdd: (name: string, category: string) => void
}

export function QuickAddRow({ onQuickAdd }: QuickAddRowProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">Quick add staples:</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_ADD_ITEMS.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuickAdd(item.name, item.category)}
              className="rounded-full bg-secondary/50 hover:bg-secondary border-border text-foreground font-medium"
            >
              {item.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
