import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-foreground">List Not Found</h1>
        <p className="text-lg text-muted-foreground">
          We couldn&apos;t find that grocery list. It might have been moved or doesn&apos;t exist.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  )
}
