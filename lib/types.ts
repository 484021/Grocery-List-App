export type Category = "Produce" | "Meat" | "Dairy" | "Bakery" | "Snacks" | "Drinks" | "Household" | "Baby" | "Other"

export interface GroceryItem {
  id: string
  name: string
  quantity: string
  category: Category
  completed: boolean
  order: number
}

export type FilterType = "all" | "active" | "completed"
