import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number // 0 to 100
  className?: string
  isAi?: boolean
}

export function ProgressBar({ value, className, isAi = false }: ProgressBarProps) {
  const barColor = isAi ? "bg-ai" : "bg-primary"

  return (
    <div className={cn("h-2 w-full rounded-full bg-muted/20 overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full", barColor)}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  )
}
