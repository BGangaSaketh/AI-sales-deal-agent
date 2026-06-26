"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Video,
  Brain,
  Sparkles,
  BarChart3,
  Cpu,
  Settings,
  X,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  isAi?: boolean
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Deals", href: "/deals", icon: Briefcase },
  { name: "Meetings", href: "/meetings", icon: Video },
  { name: "🧠 Intelligence", href: "/memory", icon: Brain, isAi: true },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Agents", href: "/agents", icon: Cpu },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  // Hide sidebar on auth pages
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname)
  if (isAuthPage) return null

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border bg-card transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-ai text-white shadow font-display font-extrabold text-sm tracking-tighter shrink-0">
            OS
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-sm font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate"
            >
              Executive AI OS
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold transition-all duration-150 relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                item.isAi && !isActive && "hover:text-ai"
              )}
            >
              <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">
                <Icon className={cn("h-4 w-4", item.isAi && !isActive && "text-ai")} />
                {item.isAi && (
                  <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-ai animate-pulse" />
                )}
              </div>
              {sidebarOpen && <span className="truncate">{item.name}</span>}
              {sidebarOpen && item.isAi && (
                <span className={cn(
                  "ml-auto rounded px-1 py-0.5 text-[8px] font-bold border transition-all",
                  isActive
                    ? "bg-white text-ai border-white/20"
                    : "bg-ai/10 text-ai border-ai/10"
                )}>
                  AI
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer / Toggle button */}
      <div className="p-3 border-t border-border/40 flex justify-end">
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm transition-all focus:outline-none"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
