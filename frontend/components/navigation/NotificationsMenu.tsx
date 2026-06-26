"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bell, AlertTriangle, Lightbulb, Calendar, Info } from "lucide-react"
import { useAppStore, NotificationItem } from "@/lib/store"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function NotificationsMenu() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore()
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

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case "Risk":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "Recommendation":
        return <Lightbulb className="h-4 w-4 text-amber-500" />
      case "Meeting":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-md border shadow-lg py-1 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/10">
              <span className="text-xs font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[10px] font-medium text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto divide-y divide-border/20">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 text-left transition-colors cursor-pointer hover:bg-muted/30",
                      !notification.is_read && "bg-primary/5"
                    )}
                  >
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {notification.message}
                      </p>
                      <span className="text-[9px] text-muted-foreground/60 block mt-1">
                        {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!notification.is_read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
