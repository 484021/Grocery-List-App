"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AddItemForm } from "@/components/add-item-form"
import { QuickAddRow } from "@/components/quick-add-row"
import { CategorySection } from "@/components/category-section"
import { EditItemDialog } from "@/components/edit-item-dialog"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import type { GroceryItem, Category, FilterType } from "@/lib/types"
import { CATEGORY_CONFIG } from "@/lib/category-config"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import groceryPresets from "@/data/grocery-presets.json"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RandomListsSidebar } from "@/components/random-lists-sidebar"

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

export default function GroceryListPage() {
  const [items, setItems, isClient] = useLocalStorage<GroceryItem[]>("grocery-items", [])
  const [filter, setFilter] = useState<FilterType>("all")
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [presetSearch, setPresetSearch] = useState("")
  const { toast } = useToast()

  const addItem = (name: string, quantity: string, category: Category) => {
    const newItem: GroceryItem = {
      id: crypto.randomUUID(),
      name,
      quantity,
      category,
      completed: false,
      order: items.length,
    }
    setItems([...items, newItem])
    toast({
      title: "Added!",
      description: `${name} added to your list`,
    })
  }

  const quickAdd = (name: string, category: string) => {
    addItem(name, "1", category as Category)
  }

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    toast({
      title: "Removed",
      description: "Item removed from your list",
    })
  }

  const editItem = (id: string, name: string, quantity: string, category: Category) => {
    setItems(items.map((item) => (item.id === id ? { ...item, name, quantity, category } : item)))
    toast({
      title: "Updated!",
      description: "Item updated successfully",
    })
  }

  const shareList = () => {
    const text = items
      .filter((item) => !item.completed)
      .map((item) => `• ${item.name} (${item.quantity}) - ${item.category}`)
      .join("\n")

    const fullText = `Grocery List\n\n${text || "List is empty"}`

    if (navigator.share) {
      navigator.share({ text: fullText })
    } else {
      navigator.clipboard.writeText(fullText)
      toast({
        title: "Copied!",
        description: "List copied to clipboard",
      })
    }
  }

  const filteredItems = useMemo(() => {
    switch (filter) {
      case "active":
        return items.filter((item) => !item.completed)
      case "completed":
        return items.filter((item) => item.completed)
      default:
        return items
    }
  }, [items, filter])

  const groupedByCategory = useMemo(() => {
    const grouped: Record<Category, GroceryItem[]> = {
      Produce: [],
      Meat: [],
      Dairy: [],
      Bakery: [],
      Snacks: [],
      Drinks: [],
      Household: [],
      Baby: [],
      Other: [],
    }

    filteredItems.forEach((item) => {
      grouped[item.category].push(item)
    })

    return grouped
  }, [filteredItems])

  const filteredPresets = useMemo(() => {
    if (!presetSearch) return Object.entries(presets)

    const search = presetSearch.toLowerCase()
    return Object.entries(presets).filter(
      ([slug, preset]) =>
        preset.name.toLowerCase().includes(search) ||
        preset.description.toLowerCase().includes(search) ||
        preset.category.toLowerCase().includes(search),
    )
  }, [presetSearch])

  const presetsByCategory = useMemo(() => {
    const grouped: Record<string, Array<[string, PresetData]>> = {}

    filteredPresets.forEach(([slug, preset]) => {
      if (!grouped[preset.category]) {
        grouped[preset.category] = []
      }
      grouped[preset.category].push([slug, preset])
    })

    return grouped
  }, [filteredPresets])

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const allCompleted = totalCount > 0 && completedCount === totalCount

  if (!isClient) {
    return <div className="min-h-screen bg-background" />
  }

  if (showPresets) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-4xl mx-auto p-6 space-y-6 ">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Browse 200+ Grocery Lists</h1>
            <p className="text-lg text-muted-foreground">Choose a pre-filled grocery list template to get started</p>

            <div className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lists..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowPresets(false)} variant="outline">
                Back to My List
              </Button>
            </div>
          </motion.div>

          <div className="space-y-8">
            {Object.entries(presetsByCategory).map(([category, categoryPresets]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryPresets.map(([slug, preset]) => (
                    <Link key={slug} href={`/grocery-lists/${slug}`}>
                      <Card className="p-4 hover:border-primary transition-colors cursor-pointer h-full">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground">{preset.name}</h3>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {preset.items.length} items
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{preset.description}</p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No lists found matching &quot;{presetSearch}&quot;</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 space-y-6 lg:pt-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <h1 className="text-4xl font-bold text-foreground">Grocery List</h1>
              <p className="text-lg text-muted-foreground">What do we need this week?</p>
              {totalCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {completedCount} of {totalCount} items checked
                </p>
              )}
              <Button onClick={() => setShowPresets(true)} variant="outline" size="sm" className="mt-2">
                Browse 200+ Pre-filled Lists
              </Button>
            </motion.div>

            <div className="flex gap-2 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border text-foreground bg-transparent"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {filter === "all" ? "All" : filter === "active" ? "Active" : "Completed"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter("all")}>All Items</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("completed")}>Completed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={shareList}
                className="rounded-full border-border text-foreground bg-transparent"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            <QuickAddRow onQuickAdd={quickAdd} />

            <AddItemForm onAdd={addItem} />

            <AnimatePresence>
              {allCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 px-6 bg-secondary/30 rounded-2xl"
                >
                  <p className="text-2xl font-semibold text-foreground">All done! You&apos;re amazing!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredItems.length === 0 && !allCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 px-6 bg-secondary/30 rounded-2xl"
              >
                <p className="text-xl text-muted-foreground">Your list is empty. Add something!</p>
              </motion.div>
            )}

            <div className="space-y-6">
              {(Object.keys(CATEGORY_CONFIG) as Category[]).map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  items={groupedByCategory[category]}
                  onToggle={toggleItem}
                  onEdit={(item) => {
                    setEditingItem(item)
                    setDialogOpen(true)
                  }}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          <aside className="w-full lg:w-100 space-y-6 m-auto">
            <RandomListsSidebar count={10} title="Explore More Lists" />
          </aside>
          </div>

        </div>
      </div>

      <EditItemDialog item={editingItem} open={dialogOpen} onOpenChange={setDialogOpen} onSave={editItem} />
    </div>
  )
}
