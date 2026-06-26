import React, { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Menu, Sparkles, Building2, Briefcase, Video } from "lucide-react"
import { ThemeSwitch } from "./ThemeSwitch"
import { NotificationsMenu } from "./NotificationsMenu"
import { UserProfileMenu } from "./UserProfileMenu"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggleSidebar, customers, deals, meetings } = useAppStore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  // Close search popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Hide Topbar on auth pages
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname)
  if (isAuthPage) return null

  // Capitalize pathname for title
  const getPageTitle = () => {
    if (pathname === "/") return "Overview"
    const segment = pathname.split("/").pop() || ""
    if (segment === "dashboard") return "Overview"
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  // Filter global search results (limit 5)
  const getSearchResults = () => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const matches: { id: string; type: "Customer" | "Deal" | "Meeting"; name: string; href: string }[] = []

    customers.forEach((c) => {
      if (c.name.toLowerCase().includes(query) || c.industry.toLowerCase().includes(query)) {
        matches.push({ id: c.id, type: "Customer", name: c.name, href: `/customers/${c.id}` })
      }
    })

    deals.forEach((d) => {
      if (d.name.toLowerCase().includes(query) || d.customer.toLowerCase().includes(query)) {
        matches.push({ id: d.id, type: "Deal", name: d.name, href: `/deals/${d.id}` })
      }
    })

    meetings.forEach((m) => {
      if (m.title.toLowerCase().includes(query) || m.customer.toLowerCase().includes(query)) {
        matches.push({ id: m.id, type: "Meeting", name: m.title, href: `/meetings/${m.id}` })
      }
    })

    return matches.slice(0, 5)
  }

  const results = getSearchResults()

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Dynamic Title */}
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
            {getPageTitle()}
          </h1>
          {pathname.includes("memory") && (
            <span className="flex items-center gap-0.5 rounded-full bg-ai/10 px-2 py-0.5 text-[10px] font-semibold text-ai border border-ai/10">
              <Sparkles className="h-3 w-3" />
              Real-time Copilot
            </span>
          )}
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Interactive Global Search bar */}
        <div className="relative hidden w-64 md:block" ref={searchRef}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground stroke-1" />
          <input
            type="text"
            placeholder="Search deals, contacts... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-xs shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring dark:bg-black/20 focus:border-primary/50"
          />

          {/* Results Dropdown popup */}
          {results.length > 0 && (
            <div className="absolute right-0 top-10 w-80 glass-panel border border-border shadow-xl rounded-md py-1.5 z-50 overflow-hidden text-xs">
              <div className="px-3 py-1 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border/35 pb-1">
                Workspace Results
              </div>
              <div className="divide-y divide-border/20 max-h-60 overflow-y-auto">
                {results.map((res) => (
                  <Link
                    key={`${res.type}-${res.id}`}
                    href={res.href}
                    onClick={() => setSearchQuery("")}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted/30 transition-all text-foreground"
                  >
                    {res.type === "Customer" && <Building2 className="h-3.5 w-3.5 text-muted-foreground" />}
                    {res.type === "Deal" && <Briefcase className="h-3.5 w-3.5 text-primary" />}
                    {res.type === "Meeting" && <Video className="h-3.5 w-3.5 text-ai" />}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{res.name}</div>
                      <span className="text-[9px] text-muted-foreground leading-none">{res.type} Record</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggler */}
        <ThemeSwitch />

        {/* Bell Alert Popover */}
        <NotificationsMenu />

        {/* Divider */}
        <span className="h-6 w-px bg-border/60" />

        {/* User Account Popover */}
        <UserProfileMenu />
      </div>
    </header>
  )
}
