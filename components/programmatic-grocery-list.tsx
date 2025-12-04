"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Filter, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AddItemForm } from "@/components/add-item-form"
import { QuickAddRow } from "@/components/quick-add-row"
import { CategorySection } from "@/components/category-section"
import { EditItemDialog } from "@/components/edit-item-dialog"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import type { GroceryItem, Category, FilterType } from "@/lib/types"
import { CATEGORY_CONFIG } from "@/lib/category-config"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { RandomListsSidebar } from "@/components/random-lists-sidebar"

interface ProgrammaticGroceryListProps {
  slug: string
  presetName: string
  presetDescription: string
  presetCategory: string
  presetItems: string[]
}

export function ProgrammaticGroceryList({
  slug,
  presetName,
  presetDescription,
  presetCategory,
  presetItems,
}: ProgrammaticGroceryListProps) {
  const storageKey = `grocery-list-${slug}`
  const [items, setItems, isClient] = useLocalStorage<GroceryItem[]>(storageKey, [])
  const [isInitialized, setIsInitialized] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isClient && !isInitialized) {
      if (items.length === 0) {
        const initialItems: GroceryItem[] = presetItems.map((itemName, index) => ({
          id: crypto.randomUUID(),
          name: itemName,
          quantity: "1",
          category: categorizePresetItem(itemName),
          completed: false,
          order: index,
        }))
        setItems(initialItems)
      }
      setIsInitialized(true)
    }
  }, [isClient, items.length, isInitialized, presetItems, setItems])

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

    const fullText = `${presetName}\n\n${text || "List is empty"}`

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

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const allCompleted = totalCount > 0 && completedCount === totalCount

  if (!isClient) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Badge variant="secondary" className="text-sm">
                  {presetCategory}
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-foreground">{presetName}</h1>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">{presetDescription}</p>
                {totalCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {totalCount} items checked
                  </p>
                )}
              </div>
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
          </div>

          <aside className="w-full lg:w-80 space-y-6">
            <RandomListsSidebar count={10} currentSlug={slug} title="More Lists Like This" />
          </aside>
        </div>
      </div>

      <EditItemDialog item={editingItem} open={dialogOpen} onOpenChange={setDialogOpen} onSave={editItem} />
    </div>
  )
}

function categorizePresetItem(itemName: string): Category {
  const name = itemName.toLowerCase()

  if (
    name.includes("vegetable") ||
    name.includes("fruit") ||
    name.includes("lettuce") ||
    name.includes("tomato") ||
    name.includes("potato") ||
    name.includes("onion") ||
    name.includes("garlic") ||
    name.includes("carrot") ||
    name.includes("broccoli") ||
    name.includes("spinach") ||
    name.includes("kale") ||
    name.includes("cucumber") ||
    name.includes("pepper") ||
    name.includes("avocado") ||
    name.includes("banana") ||
    name.includes("apple") ||
    name.includes("orange") ||
    name.includes("berr") ||
    name.includes("grape") ||
    name.includes("melon") ||
    name.includes("pear") ||
    name.includes("peach") ||
    name.includes("plum") ||
    name.includes("lemon") ||
    name.includes("lime") ||
    name.includes("herbs") ||
    name.includes("basil") ||
    name.includes("cilantro") ||
    name.includes("parsley") ||
    name.includes("ginger") ||
    name.includes("mushroom") ||
    name.includes("squash") ||
    name.includes("zucchini") ||
    name.includes("eggplant") ||
    name.includes("celery") ||
    name.includes("radish") ||
    name.includes("beet") ||
    name.includes("asparagus") ||
    name.includes("cabbage")
  ) {
    return "Produce"
  }

  if (
    name.includes("meat") ||
    name.includes("chicken") ||
    name.includes("beef") ||
    name.includes("pork") ||
    name.includes("turkey") ||
    name.includes("fish") ||
    name.includes("salmon") ||
    name.includes("tuna") ||
    name.includes("shrimp") ||
    name.includes("bacon") ||
    name.includes("sausage") ||
    name.includes("steak") ||
    name.includes("ground") ||
    name.includes("ribs") ||
    name.includes("ham") ||
    name.includes("lamb") ||
    name.includes("duck") ||
    name.includes("wings") ||
    name.includes("thigh") ||
    name.includes("breast")
  ) {
    return "Meat"
  }

  if (
    name.includes("milk") ||
    name.includes("cheese") ||
    name.includes("yogurt") ||
    name.includes("butter") ||
    name.includes("cream") ||
    name.includes("egg") ||
    name.includes("dairy") ||
    name.includes("cottage") ||
    name.includes("sour cream") ||
    name.includes("whipped") ||
    name.includes("ice cream") ||
    name.includes("mozzarella") ||
    name.includes("cheddar") ||
    name.includes("parmesan") ||
    name.includes("feta") ||
    name.includes("brie")
  ) {
    return "Dairy"
  }

  if (
    name.includes("bread") ||
    name.includes("roll") ||
    name.includes("bagel") ||
    name.includes("muffin") ||
    name.includes("croissant") ||
    name.includes("bun") ||
    name.includes("tortilla") ||
    name.includes("pita") ||
    name.includes("naan") ||
    name.includes("pastry") ||
    name.includes("donut") ||
    name.includes("cake") ||
    name.includes("cookie") ||
    name.includes("brownie") ||
    name.includes("pie")
  ) {
    return "Bakery"
  }

  if (
    name.includes("water") ||
    name.includes("juice") ||
    name.includes("soda") ||
    name.includes("coffee") ||
    name.includes("tea") ||
    name.includes("beer") ||
    name.includes("wine") ||
    name.includes("liquor") ||
    name.includes("champagne") ||
    name.includes("cider") ||
    name.includes("kombucha") ||
    name.includes("smoothie") ||
    name.includes("protein shake") ||
    name.includes("energy drink") ||
    name.includes("sports drink") ||
    name.includes("lemonade")
  ) {
    return "Drinks"
  }

  if (
    name.includes("chip") ||
    name.includes("cracker") ||
    name.includes("pretzel") ||
    name.includes("popcorn") ||
    name.includes("candy") ||
    name.includes("chocolate") ||
    name.includes("nuts") ||
    name.includes("trail mix") ||
    name.includes("granola") ||
    name.includes("bar") ||
    name.includes("jerky") ||
    name.includes("snack")
  ) {
    return "Snacks"
  }

  if (
    name.includes("soap") ||
    name.includes("detergent") ||
    name.includes("paper") ||
    name.includes("toilet") ||
    name.includes("towel") ||
    name.includes("clean") ||
    name.includes("trash") ||
    name.includes("bag") ||
    name.includes("napkin") ||
    name.includes("plate") ||
    name.includes("cup") ||
    name.includes("batteries") ||
    name.includes("flashlight")
  ) {
    return "Household"
  }

  if (
    name.includes("baby") ||
    name.includes("formula") ||
    name.includes("diaper") ||
    name.includes("wipes") ||
    name.includes("infant")
  ) {
    return "Baby"
  }

  return "Other"
}
