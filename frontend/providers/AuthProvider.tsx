"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

interface AuthProviderProps {
  children: React.ReactNode
}

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"]

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, login, logout } = useAppStore()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const savedUserJson = localStorage.getItem("auth_user")
    if (token) {
      let activeUser = {
        id: "e654dfaf-efc0-4d54-9588-58754ac48488",
        email: "alexander.sterling@enterprise.ai",
        full_name: "Alexander Sterling",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
        role: "SaaS Executive"
      }
      if (savedUserJson) {
        try {
          activeUser = JSON.parse(savedUserJson)
        } catch (e) {
          console.error("Failed to parse saved user JSON:", e)
        }
      }
      login(activeUser)
    } else {
      logout()
    }
    setLoading(false)
  }, [login, logout])

  useEffect(() => {
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
      const token = localStorage.getItem("auth_token")

      if (!token && !isPublicRoute) {
        // Redirect unauthorized users to login
        router.push("/login")
      } else if (token && isPublicRoute) {
        // Redirect logged-in users away from auth pages
        router.push("/dashboard")
      }
    }
  }, [loading, pathname, router])

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Establishing secure connection...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
