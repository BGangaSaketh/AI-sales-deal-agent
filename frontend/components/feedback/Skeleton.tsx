"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card" | "list" | "table"
}

export function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  // Shimmer base style
  const baseStyle = "animate-pulse rounded bg-muted/40 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"

  if (variant === "card") {
    return (
      <div className={cn("rounded-lg border border-border/40 p-6 space-y-4 bg-card/20", className)} {...props}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted/30 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-muted/30 rounded animate-pulse" />
            <div className="h-3 w-1/4 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-muted/30 rounded animate-pulse" />
          <div className="h-3.5 w-5/6 bg-muted/30 rounded animate-pulse" />
          <div className="h-3.5 w-4/5 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-16 bg-muted/30 rounded animate-pulse" />
          <div className="h-8 w-24 bg-muted/30 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)} {...props}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-card/10">
            <div className="h-8 w-8 rounded-md bg-muted/30 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-1/3 bg-muted/30 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-muted/30 rounded animate-pulse" />
            </div>
            <div className="h-5 w-12 bg-muted/30 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className={cn("w-full border border-border/30 rounded-lg overflow-hidden space-y-3 p-4 bg-card/10", className)} {...props}>
        <div className="flex gap-4 border-b border-border/20 pb-3">
          <div className="h-4 w-1/4 bg-muted/30 rounded animate-pulse" />
          <div className="h-4 w-1/5 bg-muted/30 rounded animate-pulse" />
          <div className="h-4 w-1/6 bg-muted/30 rounded animate-pulse" />
          <div className="h-4 w-1/6 bg-muted/30 rounded animate-pulse" />
        </div>
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex gap-4 py-1.5 items-center">
            <div className="h-3.5 w-1/4 bg-muted/20 rounded animate-pulse" />
            <div className="h-3.5 w-1/5 bg-muted/20 rounded animate-pulse" />
            <div className="h-3.5 w-1/6 bg-muted/20 rounded animate-pulse" />
            <div className="h-3.5 w-1/6 bg-muted/20 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseStyle,
        variant === "text" && "h-4 w-full",
        variant === "circular" && "h-10 w-10 rounded-full",
        variant === "rectangular" && "h-20 w-full",
        className
      )}
      {...props}
    />
  )
}
