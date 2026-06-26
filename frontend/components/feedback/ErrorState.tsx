import React from "react"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
  troubleshootGuide?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "There was an error loading the requested resource. Please try again.",
  onRetry,
  className,
  troubleshootGuide,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-red-500/20 rounded-lg bg-red-500/5 min-h-[300px] shadow-sm transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/30",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 mb-4">
        <ShieldAlert className="h-6 w-6 stroke-1" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-3 leading-relaxed">{description}</p>
      
      {troubleshootGuide && (
        <div className="text-[10px] text-red-400/80 bg-red-950/10 border border-red-500/10 rounded px-2.5 py-1.5 mb-4 max-w-xs leading-normal">
          {troubleshootGuide}
        </div>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="h-8 text-xs font-semibold hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 border-red-500/20 hover:border-red-500/40 text-foreground hover:bg-red-500/5"
        >
          Retry Connection
        </Button>
      )}
    </div>
  )
}

