"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppStore, Customer, Deal } from "@/lib/store"
import { formatDualCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/feedback/EmptyState"
import { Skeleton } from "@/components/feedback/Skeleton"
import {
  Building2,
  Mail,
  Phone,
  Globe,
  User,
  Tags,
  FileText,
  Calendar,
  Trash2,
  Edit2,
  Plus,
  ArrowLeft,
  Sparkles,
  Brain,
  MessageSquare,
  Clock,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  ShieldCheck
} from "lucide-react"

export default function CustomerDetails() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const { customers, deals, updateCustomer, deleteCustomer, meetings } = useAppStore()
  const [customer, setCustomer] = useState<Customer | null>(null)
  
  const [activeTab, setActiveTab] = useState<"overview" | "memory" | "deals" | "notes">("overview")
  const [newNote, setNewNote] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  
  // Form edit states
  const [editName, setEditName] = useState("")
  const [editIndustry, setEditIndustry] = useState("")
  const [editWebsite, setEditWebsite] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editSize, setEditSize] = useState("")
  const [editStatus, setEditStatus] = useState<Customer['status']>("Active")

  useEffect(() => {
    if (id) {
      const found = customers.find((c) => c.id === id)
      if (found) {
        setCustomer(found)
        // Set edit form defaults
        setEditName(found.name)
        setEditIndustry(found.industry)
        setEditWebsite(found.website)
        setEditEmail(found.email)
        setEditPhone(found.phone)
        setEditSize(found.size)
        setEditStatus(found.status)
      }
    }
  }, [id, customers])

  if (!customer) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 border-b border-border/40 pb-6">
          <Skeleton variant="circular" className="h-16 w-16 shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" className="h-6 w-1/3" />
            <Skeleton variant="text" className="h-4 w-1/4" />
          </div>
        </div>
        
        {/* Layout Grid Skeleton */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Skeleton variant="card" className="lg:col-span-2 min-h-[480px]" />
          <div className="space-y-6">
            <Skeleton variant="card" className="min-h-[220px]" />
            <Skeleton variant="card" className="min-h-[220px]" />
          </div>
        </div>
      </div>
    )
  }

  const customerDeals = deals.filter((d) => d.customerId === customer.id)
  const customerMeetings = meetings.filter((m) => m.customerId === customer.id)

  const handleSaveNotes = () => {
    if (!newNote.trim()) return
    const updatedNotes = [...customer.notes, newNote.trim()]
    updateCustomer(customer.id, { notes: updatedNotes })
    setNewNote("")
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateCustomer(customer.id, {
      name: editName,
      industry: editIndustry,
      website: editWebsite,
      email: editEmail,
      phone: editPhone,
      size: editSize,
      status: editStatus
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      deleteCustomer(customer.id)
      router.push("/customers")
    }
  }

  // AI Mock Memory log details specifically formatted
  const getMockMemoryVault = () => {
    if (customer.id === "c1") {
      return {
        budget: "Friction (15% over initial allocation guidelines, but stretchable if checkout speed is resolved).",
        painPoints: "Latency spikes (800ms) during flight boarding batch ingestion metrics reporting.",
        decisionMakers: "Marcus Vance (Director of Engineering) identified as key evaluation sponsor. CTO validation required.",
        competitors: "Magento enterprise database systems.",
        commStyle: "Structured, highly technical syncs with performance charts.",
        meetingTime: "Thursdays or Fridays afternoon preferred.",
        goals: "Compress ingestion checkout latencies under 200ms by next quarter.",
        prevConcerns: "Support SLA clauses parameters.",
        signals: "Expressed immediate interest to test trial sandbox pipelines.",
        dates: "Evaluation milestone scheduled by August 15.",
        risks: "CTO hasn't cleared API integration architecture drafts.",
        insights: "Customer values SLA metrics over standard discounts."
      }
    }
    
    // Defaults for c2 or others
    return {
      budget: "Pending validation guidelines budget approval in mid-July.",
      painPoints: "Magento storefront checkout delays causing cart abandonments.",
      decisionMakers: "Emily Taylor (Lead Project Manager). Procurement review active.",
      competitors: "Shopify Plus, customized managed layers.",
      commStyle: "Frequent email syncs and brief video briefings.",
      meetingTime: "Tuesday mornings preferred.",
      goals: "Migrate Magento legacy checkout pipelines.",
      prevConcerns: "Migration data downtime window.",
      signals: "Dispatched RFQ sheet.",
      dates: "Contract review milestone: October 1.",
      risks: "Magento contract termination date unknown.",
      insights: "Strong preference for typescript SDK scripts."
    }
  }

  const memory = getMockMemoryVault()

  return (
    <div className="space-y-6">
      {/* Top navigation */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/customers")} className="gap-1.5 h-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Accounts
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary border border-primary/20">
            <Building2 className="h-8 w-8 stroke-1" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight">{customer.name}</h2>
              <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                {customer.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {customer.industry} • {customer.size} Employees
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5 h-8">
            <Edit2 className="h-3.5 w-3.5" /> Edit Profile
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="gap-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-500 border-red-500/10 h-8">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Main Tabs switcher */}
      <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
        {(["overview", "memory", "deals", "notes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              activeTab === tab
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "memory" && <Brain className="h-3.5 w-3.5 text-ai" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Primary points of contact and communication settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5 text-xs">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Email</span>
                    <span className="font-medium text-foreground">{customer.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Phone</span>
                    <span className="font-medium text-foreground">{customer.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Website</span>
                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {customer.website}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Assigned Representative</span>
                    <span className="font-medium text-foreground">{customer.salesRep}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Account Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Memory summary card */}
          <Card className="border-ai/20 shadow-ai-glow/5">
            <CardHeader className="flex flex-row items-center gap-1.5 pb-2">
              <Brain className="h-5 w-5 text-ai" />
              <CardTitle className="text-sm font-bold">Hindsight Memory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                The AI Memory engine is active. The system extracts pain points and preferences from transcripts.
              </p>
              <div className="p-2.5 rounded bg-ai/5 border border-ai/10 text-foreground flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-ai shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[10px] uppercase text-ai">Primary Pain Point</span>
                  <span className="block mt-0.5 leading-snug">{memory.painPoints}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("memory")} className="w-full text-xs gap-1">
                Open AI Memory Vault
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MEMORY TAB (HINDSIGHT AI) */}
      {activeTab === "memory" && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Grid of memory cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Card 1: Budget */}
              <Card className="border-ai/20 shadow-ai-glow/5 relative overflow-hidden">
                <CardHeader className="pb-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-ai">AI Extracted Vault</span>
                  <CardTitle className="text-xs font-bold mt-1">Budget Allocation</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {memory.budget}
                </CardContent>
              </Card>

              {/* Card 2: Pain Points */}
              <Card className="border-ai/20 shadow-ai-glow/5">
                <CardHeader className="pb-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-ai">AI Extracted Vault</span>
                  <CardTitle className="text-xs font-bold mt-1">Core Pain Points</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {memory.painPoints}
                </CardContent>
              </Card>

              {/* Card 3: Decision Makers */}
              <Card className="border-ai/20 shadow-ai-glow/5">
                <CardHeader className="pb-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-ai">AI Extracted Vault</span>
                  <CardTitle className="text-xs font-bold mt-1">Decision Makers</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {memory.decisionMakers}
                </CardContent>
              </Card>

              {/* Card 4: Competitors */}
              <Card className="border-ai/20 shadow-ai-glow/5">
                <CardHeader className="pb-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-ai">AI Extracted Vault</span>
                  <CardTitle className="text-xs font-bold mt-1">Competitors</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {memory.competitors}
                </CardContent>
              </Card>

              {/* Card 5: Goals */}
              <Card className="border-ai/20 shadow-ai-glow/5">
                <CardHeader className="pb-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-ai">AI Extracted Vault</span>
                  <CardTitle className="text-xs font-bold mt-1">Business Goals</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {memory.goals}
                </CardContent>
              </Card>

              {/* Card 6: Preferred Comm Style */}
              <Card className="border-ai/20 shadow-ai-glow/5">
                <CardHeader className="pb-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-ai">AI Extracted Vault</span>
                  <CardTitle className="text-xs font-bold mt-1">Communication Style</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {memory.commStyle} (Meeting: {memory.meetingTime})
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Memory audit history logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Memory Audit Trail
              </CardTitle>
              <CardDescription>Track memory updates over client exchanges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative border-l border-border/40 pl-4 space-y-4 text-xs">
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border border-ai/40 bg-background flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-ai animate-pulse" />
                  </span>
                  <p className="font-bold text-foreground">Memory Synced</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Budget friction, latency parameters added after meeting sync.</p>
                  <span className="text-[9px] text-muted-foreground/60 mt-1 block">Today</span>
                </div>
                
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border border-border bg-muted/20" />
                  <p className="font-semibold text-muted-foreground">Profile created</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Primary email and sector segments mapped manually.</p>
                  <span className="text-[9px] text-muted-foreground/60 mt-1 block">30 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DEALS TAB */}
      {activeTab === "deals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Associated Opportunities ({customerDeals.length})</h3>
          </div>
          {customerDeals.length === 0 ? (
            <EmptyState
              title="No Deals Mapped"
              description="There are currently no active deal pipelines mapped to this organization."
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {customerDeals.map((deal) => (
                <Card key={deal.id} hoverLift onClick={() => router.push(`/deals/${deal.id}`)} className="cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold truncate">{deal.name}</CardTitle>
                      <Badge>{deal.stage}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Value:</span>
                      <span className="font-bold text-foreground">{formatDualCurrency(deal.value)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add Workspace Note</h4>
              <textarea
                placeholder="Type your notes here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full min-h-[80px] p-2 bg-transparent border border-border/80 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveNotes}>
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {customer.notes.map((note, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex gap-3 items-start text-xs">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile slide-over modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border border-border rounded-lg shadow-2xl p-6 relative">
            <h3 className="text-base font-bold mb-4">Edit Customer Profile</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Company Name</label>
                <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Industry</label>
                  <Input type="text" value={editIndustry} onChange={(e) => setEditIndustry(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Size</label>
                  <Input type="text" value={editSize} onChange={(e) => setEditSize(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Website URL</label>
                <Input type="text" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Email</label>
                  <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Phone</label>
                  <Input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Lead">Lead</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
