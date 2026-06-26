import React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  icon,
  className,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg border-muted/30 bg-card/25 hover:bg-card/30 hover:border-primary/20 transition-all duration-300 min-h-[300px] shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/10 text-muted-foreground mb-4 transition-transform duration-300">
        {icon || <AlertCircle className="h-6 w-6 stroke-1 text-muted-foreground" />}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button
          variant="premium"
          size="sm"
          onClick={onAction}
          className="h-8 text-xs font-semibold hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

