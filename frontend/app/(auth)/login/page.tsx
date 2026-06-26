"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Sparkles, Shield, Lock, Mail } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const { login } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      // In production, we'd hit our FastAPI backend: /api/v1/auth/login
      // For Phase 1 foundation: Mocking API auth delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      localStorage.setItem("auth_token", "mock-jwt-token-xyz-12345")
      login({
        id: "e654dfaf-efc0-4d54-9588-58754ac48488",
        email: data.email,
        full_name: "Alexander Sterling",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
        role: "SaaS Executive",
      })
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid credentials. Try guest account credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("auth_token", "mock-jwt-token-xyz-12345")
      login({
        id: "e654dfaf-efc0-4d54-9588-58754ac48488",
        email: "alexander.sterling@enterprise.ai",
        full_name: "Alexander Sterling",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
        role: "SaaS Executive",
      })
      router.push("/dashboard")
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 glass-panel border border-border p-8 rounded-lg shadow-xl relative overflow-hidden">
        {/* Dynamic glow design */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-ai/10 blur-3xl" />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-ai text-white shadow font-display font-black text-xl mb-4">
            OS
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Sign in to your Workspace
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Access your AI Sales Deal Copilot
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-500/10 border border-red-500/20 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> Email Address
            </label>
            <Input
              type="email"
              placeholder="name@company.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[10px] text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-semibold text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[10px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" variant="premium" className="w-full h-10 mt-6" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <span className="relative bg-card px-3 text-[10px] uppercase font-bold text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="h-9 gap-2 text-xs" onClick={handleGuestLogin} disabled={isLoading}>
            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
            Guest Demo
          </Button>
          <Button type="button" variant="outline" className="h-9 gap-2 text-xs" onClick={handleGuestLogin} disabled={isLoading}>
            <Sparkles className="h-3.5 w-3.5 text-ai" />
            Google Sync
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
