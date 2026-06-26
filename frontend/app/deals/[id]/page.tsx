"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppStore, Deal, DealIntelligence, Objection } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/feedback/Skeleton"
import { ProgressRing } from "@/components/feedback/ProgressRing"
import { EmptyState } from "@/components/feedback/EmptyState"
import {
  Briefcase,
  Building2,
  Calendar,
  User,
  AlertTriangle,
  Lightbulb,
  Edit2,
  Trash2,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Shield,
  Zap,
  Activity
} from "lucide-react"

const STAGES: Deal['stage'][] = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]

export default function DealDetails() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const { deals, updateDeal, deleteDeal, dealIntelligence, objections, competitorsIntel } = useAppStore()
  const [deal, setDeal] = useState<Deal | null>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editValue, setEditValue] = useState(0)
  const [editStage, setEditStage] = useState<Deal['stage']>("Lead")
  const [editCloseDate, setEditCloseDate] = useState("")
  const [editPriority, setEditPriority] = useState<Deal['priority']>("Medium")
  const [editProbability, setEditProbability] = useState(50)
  const [editNotes, setEditNotes] = useState("")

  // Active sub-tabs in Deal Details
  const [activeTab, setActiveTab] = useState<"overview" | "intelligence" | "objections">("overview")

  useEffect(() => {
    if (id) {
      const found = deals.find((d) => d.id === id)
      if (found) {
        setDeal(found)
        // Set edit states
        setEditName(found.name)
        setEditValue(found.value)
        setEditStage(found.stage)
        setEditCloseDate(found.closeDate)
        setEditPriority(found.priority)
        setEditProbability(found.probability)
        setEditNotes(found.notes)
      }
    }
  }, [id, deals])

  if (!deal) {
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

  // Get dynamic AI intelligence metrics
  const intelligence: DealIntelligence = dealIntelligence[deal.id] || {
    dealId: deal.id,
    winProbability: deal.probability,
    dealHealth: deal.health,
    riskLevel: "Medium",
    aiConfidence: 80,
    customerEngagementScore: 75,
    decisionMakerStatus: "Contact identified (CTO validation pending)",
    budgetStatus: "Pending validation guidelines",
    lastInteraction: "Exchanged briefing deck",
    upcomingAction: "Deliver cost-savings TCO amortization spreadsheet",
    dealSummary: "Opportunity involves database ingestion migration. Key hurdles include checkout latencies and procurement budgeting.",
    factors: ["Budget query active", "Technical sponsor identified"]
  }

  // Get objections for this deal
  const dealObjections = objections.filter((o) => o.dealId === deal.id)

  // Get competitors for this deal
  const dealCompetitors = competitorsIntel[deal.id] || []

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateDeal(deal.id, {
      name: editName,
      value: Number(editValue),
      stage: editStage,
      closeDate: editCloseDate,
      priority: editPriority,
      probability: Number(editProbability),
      notes: editNotes,
      status: (editStage === "Won" ? "Won" : editStage === "Lost" ? "Lost" : "Active") as any
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete deal: ${deal.name}?`)) {
      deleteDeal(deal.id)
      router.push("/deals")
    }
  }

  const handleStageClick = (stage: Deal['stage']) => {
    updateDeal(deal.id, {
      stage,
      status: (stage === "Won" ? "Won" : stage === "Lost" ? "Lost" : "Active") as any
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.push("/deals")} className="gap-1.5 h-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Pipeline
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary border border-primary/20">
            <Briefcase className="h-8 w-8 stroke-1" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight">{deal.name}</h2>
              <Badge variant={deal.stage === "Won" ? "default" : deal.stage === "Lost" ? "destructive" : "secondary"}>
                {deal.stage}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Account: {deal.customer} • Value: ${deal.value.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5 h-8">
            <Edit2 className="h-3.5 w-3.5" /> Edit Deal
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="gap-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-500 border-red-500/10 h-8">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Clickable Pipeline Stage Stepper */}
      <Card>
        <CardContent className="p-6">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-4">Pipeline stage tracker</span>
          <div className="flex items-center w-full justify-between overflow-x-auto gap-4 py-2">
            {STAGES.map((stage, idx) => {
              const currentIdx = STAGES.indexOf(deal.stage)
              const isPast = idx < currentIdx
              const isCurrent = idx === currentIdx

              return (
                <div key={stage} className="flex items-center flex-1 min-w-[100px] last:flex-none">
                  <button
                    onClick={() => handleStageClick(stage)}
                    className="flex flex-col items-center gap-1.5 group focus:outline-none"
                  >
                    <div
                      className={`h-7 w-7 rounded-full border text-xs font-semibold flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-primary border-primary text-primary-foreground shadow shadow-glow/30 scale-110"
                          : isPast
                          ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-500"
                          : "border-border hover:border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-semibold transition-all ${
                        isCurrent ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {stage}
                    </span>
                  </button>
                  {idx !== STAGES.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted/30 mx-auto shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Switcher for CRM details vs AI Deal Intelligence */}
      <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
        {(["overview", "intelligence", "objections"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === tab
                ? "bg-secondary text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "intelligence" && <Sparkles className="h-3.5 w-3.5 text-ai animate-pulse" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Deal Profile Properties</CardTitle>
              <CardDescription>Opportunity details, budgets, and close targets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5 text-xs">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Deal Value</span>
                    <span className="font-bold text-foreground text-sm">${deal.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Target Close Date</span>
                    <span className="font-semibold text-foreground">{deal.closeDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Deal Owner</span>
                    <span className="font-semibold text-foreground">{deal.salesperson}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Win Probability</span>
                    <span className="font-semibold text-foreground">{deal.probability}%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">Deal Notes</span>
                <p className="text-xs text-muted-foreground leading-relaxed p-3 border border-border/85 rounded-md bg-muted/5">
                  {deal.notes || "No notes logged."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick AI indicators sidebar card */}
          <Card className="border-ai/20 shadow-ai-glow/5 h-fit">
            <CardHeader className="flex flex-row items-center gap-1.5 pb-2">
              <Sparkles className="h-4 w-4 text-ai" />
              <CardTitle className="text-sm font-bold">AI Insight Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>AI Health Score:</span>
                <span className="font-bold text-foreground">{intelligence.dealHealth}%</span>
              </div>
              <div className="flex justify-between items-center border-t border-border/20 pt-2">
                <span>Objections Logged:</span>
                <Badge variant={dealObjections.length > 0 ? "destructive" : "secondary"}>
                  {dealObjections.length} Friction
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("intelligence")} className="w-full mt-2 gap-1 text-xs">
                Open AI Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: AI DEAL INTELLIGENCE DASHBOARD */}
      {activeTab === "intelligence" && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Left panel: dynamic score rings, Executive summary, Competitors SWOT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="border-ai/20 shadow-ai-glow/5 flex flex-col items-center p-6 text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-ai mb-3">Win Probability</span>
                <ProgressRing value={intelligence.winProbability} size={90} strokeWidth={8} isAi />
              </Card>

              <Card className="border-ai/20 shadow-ai-glow/5 flex flex-col items-center p-6 text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-ai mb-3">Deal Health</span>
                <ProgressRing value={intelligence.dealHealth} size={90} strokeWidth={8} />
              </Card>

              <Card className="border-ai/20 shadow-ai-glow/5 p-6 space-y-3 flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-ai block text-center">AI Confidence</span>
                <div className="text-center font-display text-3xl font-extrabold">{intelligence.aiConfidence}%</div>
                <div className="text-center">
                  <Badge variant={intelligence.riskLevel === "High" ? "destructive" : "secondary"} className="mx-auto">
                    {intelligence.riskLevel} Risk Level
                  </Badge>
                </div>
              </Card>
            </div>

            {/* AI Executive Summary Card */}
            <Card className="border-ai/20 shadow-ai-glow/5">
              <CardHeader className="pb-3 border-b border-border/15">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-ai flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-ai" /> Deal Executive Intelligence Briefing
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="h-7 text-[10px] gap-1 font-semibold border-border/80"
                  >
                    <Printer className="h-3.5 w-3.5" /> Export Report
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  A high-level synthesis of client sentiment, friction nodes, and pricing parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6 text-xs">
                {/* Summary Text */}
                <div className="p-3 bg-muted/20 border border-border/60 rounded-lg">
                  <p className="text-muted-foreground leading-relaxed italic">&ldquo;{intelligence.dealSummary}&rdquo;</p>
                </div>

                {/* Engagement Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-border/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Sentiment Trend</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                      {(intelligence.sentimentTrend || []).join(" → ") || "Neutral"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Response Delay</span>
                    <span className="font-semibold text-foreground">{intelligence.responseDelay || "Under 4h"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Meeting Frequency</span>
                    <span className="font-semibold text-foreground">{intelligence.meetingFrequency || "Weekly"}</span>
                  </div>
                </div>

                {/* Decision Maker & Budget Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-border/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Decision Maker Status</span>
                    <p className="text-muted-foreground font-medium">{intelligence.decisionMakerStatus}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Budget Verification</span>
                    <p className="text-muted-foreground font-medium">{intelligence.budgetStatus}</p>
                  </div>
                </div>

                {/* Identified Risk Score Factors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Identified Deal Risk Nodes ({intelligence.riskReasons?.length || 0})
                    </h4>
                    {intelligence.riskReasons && intelligence.riskReasons.length > 0 ? (
                      <ul className="space-y-2">
                        {intelligence.riskReasons.map((reason, idx) => (
                          <li key={idx} className="p-2 border border-red-500/10 bg-red-500/5 rounded text-muted-foreground leading-relaxed flex items-start gap-1.5">
                            <span className="text-red-500 font-extrabold mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-2 border border-emerald-500/10 bg-emerald-500/5 rounded text-emerald-500 font-medium">
                        No critical risk flags recorded.
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Recommended Mitigation Playbook
                    </h4>
                    <div className="p-3 border border-primary/10 bg-primary/5 rounded-lg text-muted-foreground leading-relaxed">
                      {intelligence.mitigationStrategy || "Maintain active contact updates to formulate path to completion."}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitor SWOT Card */}
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" /> Competitor SWOT Intelligence
                </CardTitle>
                <CardDescription className="text-xs">
                  Automated matrices comparing legacy setups with custom API capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {dealCompetitors.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground italic bg-muted/10 rounded-lg border border-border/30">
                    No competitor threats detected in client briefings.
                  </div>
                ) : (
                  dealCompetitors.map((comp, idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="p-2.5 bg-muted/30 border border-border/40 rounded-lg">
                        <span className="font-bold text-foreground text-xs block mb-1">Competitor Name: {comp.competitorName}</span>
                        <p className="text-[11px] text-muted-foreground italic leading-relaxed">&ldquo;{comp.comparisonSummary}&rdquo;</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 border border-emerald-500/10 bg-emerald-500/5 rounded-lg space-y-1.5">
                          <span className="font-bold text-emerald-500 block text-[10px] uppercase tracking-wide">Strengths</span>
                          <ul className="space-y-1">
                            {comp.strengths.map((str, sIdx) => (
                              <li key={sIdx} className="text-[10px] text-muted-foreground flex items-start gap-1 leading-normal">
                                <span className="text-emerald-500 font-semibold">•</span> <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 border border-red-500/10 bg-red-500/5 rounded-lg space-y-1.5">
                          <span className="font-bold text-red-400 block text-[10px] uppercase tracking-wide">Weaknesses</span>
                          <ul className="space-y-1">
                            {comp.weaknesses.map((wk, wIdx) => (
                              <li key={wIdx} className="text-[10px] text-muted-foreground flex items-start gap-1 leading-normal">
                                <span className="text-red-400 font-semibold">•</span> <span>{wk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 border border-blue-500/10 bg-blue-500/5 rounded-lg space-y-1.5">
                          <span className="font-bold text-blue-400 block text-[10px] uppercase tracking-wide">Defending Talking Points</span>
                          <ul className="space-y-1">
                            {comp.talkingPoints.map((tp, tIdx) => (
                              <li key={tIdx} className="text-[10px] text-muted-foreground flex items-start gap-1 leading-normal">
                                <span className="text-blue-400 font-bold shrink-0 mt-0.5">»</span> <span>{tp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 border border-purple-500/10 bg-purple-500/5 rounded-lg space-y-1.5">
                          <span className="font-bold text-purple-400 block text-[10px] uppercase tracking-wide">Our Differentiators</span>
                          <ul className="space-y-1">
                            {comp.differentiators.map((diff, dIdx) => (
                              <li key={dIdx} className="text-[10px] text-muted-foreground flex items-start gap-1.5 leading-normal">
                                <Zap className="h-3 w-3 text-purple-400 shrink-0 mt-0.5" /> <span>{diff}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Next Best Action & Relationship Timelines */}
          <div className="space-y-6">
            {/* NEXT BEST ACTION CARD */}
            <Card className="bg-gradient-to-br from-primary/5 to-ai/5 border-ai/30 shadow-ai-glow/10">
              <CardHeader className="flex flex-row items-center gap-1 pb-2">
                <Sparkles className="h-4 w-4 text-ai animate-pulse" />
                <CardTitle className="text-sm font-bold text-ai">Next Best Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-foreground block">Proposed Play:</span>
                  <p className="text-muted-foreground mt-0.5">{intelligence.upcomingAction}</p>
                </div>

                <div className="p-2.5 rounded bg-card/60 border border-border/60">
                  <span className="font-bold text-foreground block flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Reasoning
                  </span>
                  <p className="text-muted-foreground mt-1 leading-snug">{intelligence.dealSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Expected Impact</span>
                    <Badge className="mt-1 block w-fit">High Impact</Badge>
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase">Follow Up date</span>
                    <span className="font-semibold block mt-1">2026-06-29</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Relationship History Timeline */}
            <Card>
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" /> Relationship Timeline
                </CardTitle>
                <CardDescription className="text-xs">
                  Chronological history of deal risk score changes.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {(() => {
                  const timeline = intelligence.riskTimeline || [
                    { date: "2026-06-15", factor: "Opportunity Qualified", score: 10 },
                    { date: "2026-06-26", factor: "Friction checks active", score: 25 }
                  ]
                  
                  return (
                    <div className="relative border-l border-border pl-4 space-y-5 ml-2 py-1">
                      {timeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[23px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background border border-primary">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          </div>
                          <div className="space-y-0.5 text-xs">
                            <span className="text-[9px] text-muted-foreground font-semibold font-mono block">{item.date}</span>
                            <h5 className="font-semibold text-foreground leading-snug">{item.factor}</h5>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] text-muted-foreground">Risk level:</span>
                              <Badge variant={item.score > 55 ? "destructive" : item.score > 25 ? "gold" : "secondary"} className="text-[8px] h-3.5 py-0 px-1 font-bold">
                                {item.score}% Score
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Contributing factors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contributing Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {intelligence.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OBJECTIONS DETECTED */}
      {activeTab === "objections" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Friction & Objections Detected ({dealObjections.length})</h3>
          </div>

          {dealObjections.length === 0 ? (
            <EmptyState
              title="No Objections Flagged"
              description="No security, pricing, or timeline objections have been detected in active syncs for this deal."
              icon={<ShieldCheck className="h-6 w-6 text-emerald-500 stroke-1" />}
            />
          ) : (
            <div className="space-y-4">
              {dealObjections.map((obj) => (
                <Card key={obj.id} className="border-red-500/10 bg-red-500/5 hover:border-red-500/20 transition-all">
                  <CardHeader className="pb-2 border-b border-red-500/10 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <CardTitle className="text-xs font-bold uppercase tracking-wide text-red-500">
                        {obj.category} Objection Detected
                      </CardTitle>
                    </div>
                    <Badge variant="destructive" className="text-[9px] uppercase tracking-wide font-bold">
                      {obj.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4 text-xs leading-relaxed">
                    {/* Objection Text */}
                    <div>
                      <span className="font-bold text-foreground">Customer Statement:</span>
                      <p className="text-muted-foreground mt-0.5">&ldquo;{obj.objectionText}&rdquo;</p>
                    </div>

                    {/* AI Suggested Response Rebuttal */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 pt-2 border-t border-border/20">
                      <div className="p-3 rounded bg-card/60 border border-border/40">
                        <span className="font-bold text-foreground flex items-center gap-1 text-[11px] mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Suggested Rebuttal Response
                        </span>
                        <p className="text-muted-foreground leading-normal">{obj.suggestedResponse}</p>
                      </div>

                      <div className="p-3 rounded bg-ai/5 border border-ai/10">
                        <span className="font-bold text-ai flex items-center gap-1 text-[11px] mb-1">
                          <Lightbulb className="h-3.5 w-3.5 text-ai" /> Action Playbook Recommendation
                        </span>
                        <p className="text-muted-foreground leading-normal">{obj.followUpRecommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Deal Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border border-border rounded-lg shadow-2xl p-6 relative">
            <h3 className="text-base font-bold mb-4">Edit Deal Parameters</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Deal Name</label>
                <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Value ($)</label>
                  <Input type="number" value={editValue} onChange={(e) => setEditValue(Number(e.target.value))} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Close Target Date</label>
                  <Input type="date" value={editCloseDate} onChange={(e) => setEditCloseDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Pipeline Stage</label>
                  <select
                    value={editStage}
                    onChange={(e) => setEditStage(e.target.value as any)}
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
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/40"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Win Probability (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editProbability}
                  onChange={(e) => setEditProbability(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Deal Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full min-h-[80px] p-2 bg-transparent border border-border/80 rounded-md text-xs focus:outline-none focus:ring-1"
                />
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
      {/* Print-Only Style Overlay */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-deal-report, #printable-deal-report * {
            visibility: visible !important;
          }
          #printable-deal-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            color: #000 !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      ` }} />

      {/* Hidden Printable Report */}
      <div id="printable-deal-report" className="hidden print:block p-8 bg-white text-black font-sans space-y-6">
        <div className="border-b-2 border-black pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide">Deal Executive Briefing Report</h1>
              <p className="text-xs text-gray-500 mt-1">Generated by AI Sales Intelligence Platform</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-gray-400 uppercase">Print Date</span>
              <p className="text-xs font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4 text-xs">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase block">Opportunity Name</span>
            <span className="font-bold text-gray-900">{deal.name}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase block">Account Customer</span>
            <span className="font-semibold text-gray-900">{deal.customer}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase block">Deal Contract Value</span>
            <span className="font-semibold text-gray-900">${deal.value.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase block">Pipeline Stage</span>
            <span className="font-semibold text-gray-900">{deal.stage}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-1">AI Executive Deal Summary</h2>
          <p className="text-xs text-gray-700 leading-relaxed italic">&ldquo;{intelligence.dealSummary}&rdquo;</p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-2 text-xs">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase">Decision Maker Status</h3>
            <p className="text-gray-600 leading-relaxed">{intelligence.decisionMakerStatus}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase">Budget Verification Status</h3>
            <p className="text-gray-600 leading-relaxed">{intelligence.budgetStatus}</p>
          </div>
        </div>

        {intelligence.riskReasons && intelligence.riskReasons.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-600 border-b border-red-200 pb-1">Deal Risks & Mitigations</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Identified Risks</span>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {intelligence.riskReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Mitigation Play</span>
                <p className="text-gray-600 leading-relaxed">{intelligence.mitigationStrategy}</p>
              </div>
            </div>
          </div>
        )}

        {dealCompetitors.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-200 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-1">Competitor SWOT Comparison</h2>
            {dealCompetitors.map((comp, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs font-bold text-gray-800">Competitor: {comp.competitorName}</h3>
                <p className="text-[11px] text-gray-600 leading-relaxed italic">&ldquo;{comp.comparisonSummary}&rdquo;</p>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">Strengths</span>
                    <ul className="list-disc list-inside text-[10px] text-gray-600 space-y-0.5 mt-0.5">
                      {comp.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">Weaknesses</span>
                    <ul className="list-disc list-inside text-[10px] text-gray-600 space-y-0.5 mt-0.5">
                      {comp.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-8 text-center text-[9px] text-gray-400 border-t border-gray-200">
          Confidential - Deal Intelligence Report. For Internal Sales Rep use only.
        </div>
      </div>
    </div>
  )
}
