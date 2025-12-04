import type { Category } from "./types"

export const CATEGORY_CONFIG: Record<Category, { emoji: string; color: string }> = {
  Produce: { emoji: "🥬", color: "bg-green-100 text-green-800" },
  Meat: { emoji: "🍖", color: "bg-red-100 text-red-800" },
  Dairy: { emoji: "🥛", color: "bg-blue-100 text-blue-800" },
  Bakery: { emoji: "🍞", color: "bg-amber-100 text-amber-800" },
  Snacks: { emoji: "🍿", color: "bg-orange-100 text-orange-800" },
  Drinks: { emoji: "🧃", color: "bg-purple-100 text-purple-800" },
  Household: { emoji: "🧹", color: "bg-slate-100 text-slate-800" },
  Baby: { emoji: "🍼", color: "bg-pink-100 text-pink-800" },
  Other: { emoji: "📦", color: "bg-gray-100 text-gray-800" },
}

export const QUICK_ADD_ITEMS = [
  { name: "Milk", category: "Dairy" as Category },
  { name: "Eggs", category: "Dairy" as Category },
  { name: "Bread", category: "Bakery" as Category },
  { name: "Bananas", category: "Produce" as Category },
  { name: "Chicken", category: "Meat" as Category },
  { name: "Rice", category: "Other" as Category },
  { name: "Cheese", category: "Dairy" as Category },
]
