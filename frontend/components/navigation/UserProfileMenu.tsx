"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, Settings, Shield } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function UserProfileMenu() {
  const { user, logout } = useAppStore()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user) return null

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    logout()
    router.push("/login")
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img
          src={user.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
          alt={user.full_name}
          className="h-8 w-8 rounded-full border border-border shadow-sm object-cover"
        />
        <div className="hidden text-left md:block">
          <p className="text-xs font-semibold leading-none">{user.full_name}</p>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{user.role}</p>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 glass-panel rounded-md border shadow-lg py-1 z-50 overflow-hidden"
          >
            {/* Header info */}
            <div className="px-4 py-3 border-b border-border/40 bg-muted/10">
              <p className="text-sm font-semibold">{user.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500 border border-amber-500/20">
                  <Shield className="mr-0.5 h-2.5 w-2.5" />
                  {user.role}
                </span>
              </div>
            </div>

            {/* Menu options */}
            <div className="py-1">
              <button
                onClick={() => { setIsOpen(false); router.push("/settings") }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/40 text-left transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                My Profile
              </button>
              <button
                onClick={() => { setIsOpen(false); router.push("/settings") }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/40 text-left transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </button>
            </div>

            {/* Footer action */}
            <div className="border-t border-border/40 py-1 bg-red-500/5">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-600/10 text-left transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
