import React from "react"
import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
  className?: string
  variant?: "text" | "card" | "table"
  count?: number
}

export function SkeletonLoader({
  className,
  variant = "text",
  count = 1,
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count })

  if (variant === "table") {
    return (
      <div className={cn("w-full space-y-3 animate-pulse", className)}>
        <div className="h-8 w-full bg-muted/65 rounded-md" />
        {items.map((_, i) => (
          <div key={i} className="flex space-x-4 h-12 w-full items-center border-b border-border/50">
            <div className="h-4 w-1/4 bg-muted/45 rounded" />
            <div className="h-4 w-1/3 bg-muted/45 rounded" />
            <div className="h-4 w-1/12 bg-muted/45 rounded" />
            <div className="h-4 w-1/6 bg-muted/45 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {items.map((_, i) => (
          <div key={i} className="glass-panel rounded-lg border border-border p-6 space-y-4 animate-pulse">
            <div className="h-4 w-1/3 bg-muted/50 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted/45 rounded" />
              <div className="h-3 w-5/6 bg-muted/45 rounded" />
            </div>
            <div className="h-8 w-1/4 bg-muted/55 rounded mt-4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2.5 animate-pulse", className)}>
      {items.map((_, i) => (
        <div key={i} className="h-4 bg-muted/55 rounded w-full" />
      ))}
    </div>
  )
}
