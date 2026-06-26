"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAppStore, Deal } from "@/lib/store"
import { Skeleton } from "@/components/feedback/Skeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"
import {
  Plus,
  Search,
  Filter,
  ShieldAlert,
  Sparkles,
  User,
  Calendar,
  Grid,
  List,
  ChevronRight,
  TrendingUp,
  DollarSign
} from "lucide-react"

const STAGES: Deal['stage'][] = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]

export default function Deals() {
  const { deals, customers, addDeal, moveDealStage } = useAppStore()
  
  const [viewType, setViewType] = useState<"kanban" | "table">("kanban")
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  
  // Simulated Loading State
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null)
  
  // Drag highlight targets
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  // Form states
  const [dealName, setDealName] = useState("")
  const [dealValue, setDealValue] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [dealStage, setDealStage] = useState<Deal['stage']>("Lead")
  const [dealCloseDate, setDealCloseDate] = useState("")
  const [dealPriority, setDealPriority] = useState<Deal['priority']>("Medium")
  const [dealNotes, setDealNotes] = useState("")

  // Filter listings
  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = priorityFilter === "All" || d.priority === priorityFilter
    return matchesSearch && matchesPriority
  })

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("text/plain", dealId)
    setDraggedDealId(dealId)
  }

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    setDragOverStage(stage)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, stage: Deal['stage']) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData("text/plain") || draggedDealId
    if (dealId) {
      moveDealStage(dealId, stage)
    }
    setDraggedDealId(null)
    setDragOverStage(null)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const customerObj = customers.find((c) => c.id === selectedCustomerId)
    if (!customerObj) return

    addDeal({
      name: dealName,
      customer: customerObj.name,
      customerId: customerObj.id,
      value: Number(dealValue),
      stage: dealStage,
      closeDate: dealCloseDate,
      priority: dealPriority,
      probability: dealStage === "Won" ? 100 : dealStage === "Lost" ? 0 : 50,
      salesperson: "Alexander Sterling",
      notes: dealNotes,
      status: (dealStage === "Won" ? "Won" : dealStage === "Lost" ? "Lost" : "Active") as any
    })

    // Reset forms
    setDealName("")
    setDealValue("")
    setSelectedCustomerId("")
    setDealStage("Lead")
    setDealCloseDate("")
    setDealPriority("Medium")
    setDealNotes("")
    setShowCreateModal(false)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Lead":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Qualified":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      case "Proposal":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20"
      case "Negotiation":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Won":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      default:
        return "bg-red-500/10 text-red-400 border-red-500/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Deals Pipeline</h2>
          <p className="text-xs text-muted-foreground">
            Monitor transaction cycles, contract values, and deal health statistics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="inline-flex rounded-lg bg-secondary p-1 mr-2">
            <button
              onClick={() => setViewType("kanban")}
              className={`rounded p-1.5 transition-all ${
                viewType === "kanban" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`rounded p-1.5 transition-all ${
                viewType === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button variant="premium" size="sm" onClick={() => setShowCreateModal(true)} className="gap-1">
            <Plus className="h-4 w-4" />
            Create Deal
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground stroke-1" />
          <Input
            type="text"
            placeholder="Search opportunities or accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        
        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/20"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* VIEW PANEL OR SKELETON */}
      {isLoading ? (
        <Skeleton variant="table" className="h-96" />
      ) : deals.length === 0 ? (
        <EmptyState
          title="No Opportunities Active"
          description="Monitor deal pipelines, win probabilities, and transaction cycle health. Create your first sales opportunity to get started."
          actionLabel="Create Opportunity"
          onAction={() => setShowCreateModal(true)}
        />
      ) : viewType === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage)
            const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.value, 0)
            const isTarget = dragOverStage === stage

            return (
              <div
                key={stage}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
                className={`flex flex-col rounded-lg bg-card/35 border border-border/40 p-3 min-h-[500px] w-full shrink-0 transition-all ${
                  isTarget ? "bg-primary/5 border-primary/45 border-dashed scale-[1.01]" : ""
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-3">
                  <div>
                    <h3 className="text-xs font-extrabold tracking-wide uppercase">{stage}</h3>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      ${stageTotalValue.toLocaleString()}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[9px] px-1.5 h-4">
                    {stageDeals.length}
                  </Badge>
                </div>

                {/* Draggable Cards Stack */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="glass-panel border border-border p-3.5 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow transition-all space-y-3 relative group"
                    >
                      <div>
                        <Link href={`/deals/${deal.id}`} className="text-xs font-bold leading-tight hover:text-primary transition-all block">
                          {deal.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          {deal.customer}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/20 pt-2.5">
                        <span className="text-xs font-extrabold">${deal.value.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          {deal.riskCount > 0 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                          )}
                          <Badge className="text-[8px] h-4 py-0 leading-none" variant={deal.priority === "High" ? "destructive" : "secondary"}>
                            {deal.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="text-center py-10 text-[10px] text-muted-foreground border border-dashed rounded-lg border-border/20 bg-muted/5">
                      Drag here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity Name</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Pipeline Stage</TableHead>
                  <TableHead>Target Close</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                      No deals found matching filter options.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-semibold">
                        <Link href={`/deals/${deal.id}`} className="hover:text-primary transition-all">
                          {deal.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs">{deal.customer}</TableCell>
                      <TableCell className="text-xs font-semibold">${deal.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{deal.closeDate}</TableCell>
                      <TableCell>
                        <Badge variant={deal.priority === "High" ? "destructive" : "secondary"}>
                          {deal.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/deals/${deal.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Deal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border border-border rounded-lg shadow-2xl p-6 relative">
            <h3 className="text-base font-bold mb-4">Create Sales Opportunity</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Opportunity Name</label>
                <Input
                  type="text"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  placeholder="e.g. AeroSpace Phase 2 Contract"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Select Customer Account</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/40"
                  required
                >
                  <option value="">-- Choose Account --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Contract Value ($)</label>
                  <Input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="e.g. 500000"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Target Close Date</label>
                  <Input
                    type="date"
                    value={dealCloseDate}
                    onChange={(e) => setDealCloseDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Pipeline Stage</label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/40"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Priority</label>
                  <select
                    value={dealPriority}
                    onChange={(e) => setDealPriority(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/40"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Deal Notes / Scope</label>
                <textarea
                  value={dealNotes}
                  onChange={(e) => setDealNotes(e.target.value)}
                  placeholder="Primary requirements discuss, competitive pressures..."
                  className="w-full min-h-[80px] p-2 bg-transparent border border-border/80 rounded-md text-xs focus:outline-none focus:ring-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Create Opportunity
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
