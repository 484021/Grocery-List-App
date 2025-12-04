export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function generateSEOMetadata(slug: string, presetData: { name: string; description: string }) {
  const title = `${presetData.name} | Free Grocery List Maker`
  const description = `A free grocery list tool for ${presetData.name}. Auto-filled list, editable, printable, and easy to use.`
  const url = `https://v0.dev/grocery-lists/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mom's Grocery List",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
