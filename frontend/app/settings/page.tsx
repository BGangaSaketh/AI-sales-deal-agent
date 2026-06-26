"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { Settings, Shield, Key, Sliders, CheckSquare, Square, User, Bell, Palette, Building } from "lucide-react"

type SettingsTab = "profile" | "appearance" | "notifications" | "security" | "organization"

export default function SettingsPage() {
  const { user, theme, setTheme } = useAppStore()
  
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>("profile")
  
  const [name, setName] = useState(user?.full_name || "Alexander Sterling")
  const [email, setEmail] = useState(user?.email || "alexander.sterling@enterprise.ai")
  const [role, setRole] = useState(user?.role || "SaaS Executive")
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  
  // Organization Info
  const [orgName, setOrgName] = useState("AeroSpace & Partners")
  const [billingTier, setBillingTier] = useState("Enterprise Scale")

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/20 pb-4">
        <h2 className="text-xl font-bold tracking-tight">System Settings</h2>
        <p className="text-xs text-muted-foreground">
          Configure user credentials, dark mode toggles, email triggers, and API connections.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        {/* Left Side: Sub-tab navigation */}
        <div className="md:col-span-1 flex flex-col space-y-1">
          <button
            onClick={() => setActiveSubTab("profile")}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-left transition-all ${
              activeSubTab === "profile"
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            Profile Account
          </button>
          <button
            onClick={() => setActiveSubTab("appearance")}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-left transition-all ${
              activeSubTab === "appearance"
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
            }`}
          >
            <Palette className="h-4 w-4 shrink-0" />
            Appearance Theme
          </button>
          <button
            onClick={() => setActiveSubTab("notifications")}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-left transition-all ${
              activeSubTab === "notifications"
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
            }`}
          >
            <Bell className="h-4 w-4 shrink-0" />
            Notifications Alerts
          </button>
          <button
            onClick={() => setActiveSubTab("security")}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-left transition-all ${
              activeSubTab === "security"
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
            }`}
          >
            <Shield className="h-4 w-4 shrink-0" />
            Security Privacy
          </button>
          <button
            onClick={() => setActiveSubTab("organization")}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-left transition-all ${
              activeSubTab === "organization"
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
            }`}
          >
            <Building className="h-4 w-4 shrink-0" />
            Organization Details
          </button>
        </div>

        {/* Right Side: Main Content view */}
        <div className="md:col-span-3 space-y-6">
          {/* PROFILE SUBTAB */}
          {activeSubTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Configure credentials details and professional titles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Full Name</label>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Corporate Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Corporate Role</label>
                  <Input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="default" size="sm" onClick={handleSave}>
                    Save Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* APPEARANCE SUBTAB */}
          {activeSubTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Interface Customization</CardTitle>
                <CardDescription>Select workspace layout and theme settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-xs">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block">System Theme</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex-1 border p-4 rounded-lg text-left transition-all ${
                        theme === "light"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      <span className="font-bold block">Light Theme</span>
                      <span className="text-[10px] block mt-1">Premium Apple-style Executive Workspace</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex-1 border p-4 rounded-lg text-left transition-all ${
                        theme === "dark"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      <span className="font-bold block">Dark Theme</span>
                      <span className="text-[10px] block mt-1">Deep Navy Glassmorphic AI OS</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS SUBTAB */}
          {activeSubTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Triggers</CardTitle>
                <CardDescription>Decide how and when you get alerted about deal updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">Weekly Digest</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Receive summary reports on deal risks and win forecast trends via email.</p>
                    </div>
                    <button onClick={() => setWeeklyDigest(!weeklyDigest)}>
                      {weeklyDigest ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start justify-between border-t border-border/40 pt-3">
                    <div>
                      <h4 className="font-semibold text-foreground">Real-time Risk Alerts</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Get immediate in-app notifications when a high-impact risk is detected on any deal.</p>
                    </div>
                    <button onClick={() => setEmailAlerts(!emailAlerts)}>
                      {emailAlerts ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border/40">
                  <Button size="sm" onClick={handleSave}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SECURITY SUBTAB */}
          {activeSubTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security & Credentials</CardTitle>
                <CardDescription>Manage user passwords and connection API tokens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-3 max-w-sm">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Current Password</label>
                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">New Secure Password</label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border/40">
                  <Button size="sm" onClick={handleSave}>
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ORGANIZATION SUBTAB */}
          {activeSubTab === "organization" && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>Manage team corporate layouts and contract tiers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Organization Name</label>
                    <Input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Billing Subscription Tier</label>
                    <Input type="text" value={billingTier} disabled className="bg-muted/10" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border/40">
                  <Button size="sm" onClick={handleSave}>
                    Save Organization Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="fixed bottom-6 right-6 p-4 rounded-lg bg-emerald-500 text-white shadow-xl text-xs font-semibold animate-bounce z-50">
          Settings successfully saved!
        </div>
      )}
    </div>
  )
}
