import type { Metadata } from "next"
import { notFound } from "next/navigation"
import groceryPresets from "@/data/grocery-presets.json"
import { ProgrammaticGroceryList } from "@/components/programmatic-grocery-list"
import { generateSEOMetadata } from "@/lib/seo-utils"

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

// Generate static params for all 200 pages at build time
export function generateStaticParams() {
  return Object.keys(presets).map((slug) => ({
    slug,
  }))
}

// Generate SEO metadata for each page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const preset = presets[slug]

  if (!preset) {
    return {
      title: "Not Found",
    }
  }

  return generateSEOMetadata(slug, preset)
}

export default async function GroceryListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const preset = presets[slug]

  if (!preset) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgrammaticGroceryList
        slug={slug}
        presetName={preset.name}
        presetDescription={preset.description}
        presetCategory={preset.category}
        presetItems={preset.items}
      />
    </div>
  )
}
