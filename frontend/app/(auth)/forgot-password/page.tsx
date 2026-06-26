"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch (err) {
      // Ignore
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 glass-panel border border-border p-8 rounded-lg shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-ai/10 blur-3xl" />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-ai text-white shadow font-display font-black text-xl mb-4">
            OS
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Reset password
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            We will send you a secure link to reset
          </p>
        </div>

        {success ? (
          <div className="p-4 text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-center">
            Verification link sent! Please check your email inbox.
          </div>
        ) : (
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

            <Button type="submit" variant="premium" className="w-full h-10 mt-6" disabled={isLoading}>
              {isLoading ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
