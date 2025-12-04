"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import groceryPresets from "@/data/grocery-presets.json"

type PresetData = {
  name: string
  description: string
  category: string
  items: string[]
}

type GroceryPresets = {
  [key: string]: PresetData
}

const presets = groceryPresets as GroceryPresets

interface RandomListsSidebarProps {
  count?: number
  currentSlug?: string
  title?: string
}

export function RandomListsSidebar({ count = 10, currentSlug, title = "Explore More Lists" }: RandomListsSidebarProps) {
  const randomLists = useMemo(() => {
    const allSlugs = Object.keys(presets)
    const availableSlugs = currentSlug ? allSlugs.filter((slug) => slug !== currentSlug) : allSlugs

    // Shuffle and get random lists
    const shuffled = [...availableSlugs].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).map((slug) => ({
      slug,
      preset: presets[slug],
    }))
  }, [count, currentSlug])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-3">
        {randomLists.map(({ slug, preset }) => (
          <Link key={slug} href={`/grocery-lists/${slug}`}>
            <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm leading-tight">{preset.name}</h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {preset.items.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{preset.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
