"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore, Customer, Deal, Meeting, Objection, DealIntelligence } from "@/lib/store"
import { formatDualCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/feedback/EmptyState"
import {
  Brain,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Calendar,
  Video,
  Clock,
  User,
  Users,
  CheckCircle2,
  MessageSquare,
  CheckSquare,
  FileText,
  TrendingDown,
  Layers,
  AlertCircle
} from "lucide-react"

export default function MemoryIntelligence() {
  const router = useRouter()
  const {
    customers,
    deals,
    meetings,
    objections,
    dealIntelligence,
    coachingLogs
  } = useAppStore()

  const [activeTab, setActiveTab] = useState<"memory" | "meetings" | "recommendations" | "objections" | "risks">("memory")
  const [search, setSearch] = useState("")

  // Resolves AI Memory parameters for each customer (Hindsight Engine)
  const getCustomerMemory = (customer: Customer) => {
    if (customer.id === "c1" || customer.name.toLowerCase().includes("aero")) {
      return {
        budget: "Friction (15% over initial allocation guidelines, but stretchable if checkout speed is resolved).",
        painPoints: "Latency spikes (800ms) during flight boarding batch ingestion metrics reporting.",
        decisionMakers: "Marcus Vance (Director of Engineering) identified as key evaluation sponsor. CTO validation required.",
        competitors: "Magento enterprise database systems.",
        commStyle: "Structured, highly technical syncs with performance charts.",
        meetingTime: "Thursdays or Fridays afternoon preferred.",
        insights: "Customer values SLA metrics over standard discounts."
      }
    } else if (customer.id === "c2" || customer.name.toLowerCase().includes("nova")) {
      return {
        budget: "Pending validation guidelines budget approval in mid-July.",
        painPoints: "Magento storefront checkout delays causing cart abandonments.",
        decisionMakers: "Emily Taylor (Lead Project Manager). Procurement review active.",
        competitors: "Shopify Plus, customized managed layers.",
        commStyle: "Frequent email syncs and brief video briefings.",
        meetingTime: "Tuesday mornings preferred.",
        insights: "Strong preference for typescript SDK scripts."
      }
    }
    
    return {
      budget: "Under budget assessment. Prefers fixed multi-year deals.",
      painPoints: "No major latency points reported. Interested in automated pipeline reports.",
      decisionMakers: "Sponsor identified. Key procurement team active.",
      competitors: "Shopify Plus, Custom internal tools.",
      commStyle: "Technical briefings.",
      meetingTime: "Mid-week morning preferred.",
      insights: "Values fast onboarding and integration support."
    }
  }

  // Filter listings based on search query
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  )

  const completedMeetings = meetings.filter(
    (m) =>
      m.hasTranscript &&
      (m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.customer.toLowerCase().includes(search.toLowerCase()))
  )

  const activeIntels = Object.values(dealIntelligence).filter((intel) => {
    const deal = deals.find((d) => d.id === intel.dealId)
    return deal?.name.toLowerCase().includes(search.toLowerCase())
  })

  const filteredObjections = objections.filter((obj) => {
    const deal = deals.find((d) => d.id === obj.dealId)
    return (
      obj.objectionText.toLowerCase().includes(search.toLowerCase()) ||
      obj.category.toLowerCase().includes(search.toLowerCase()) ||
      deal?.name.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between border-b border-border/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">🧠 AI Intelligence Center</h2>
          <p className="text-xs text-muted-foreground">
            Unified intelligence workspace compiling hindsight customer memory, meeting transcript synthetics, risk analysis, and Objections.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 bg-secondary/60 p-1 rounded-lg w-fit border border-border/10">
          <button
            onClick={() => { setActiveTab("memory"); setSearch("") }}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "memory"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            Customer Memory
          </button>
          <button
            onClick={() => { setActiveTab("meetings"); setSearch("") }}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "meetings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            Meeting Intel
          </button>
          <button
            onClick={() => { setActiveTab("recommendations"); setSearch("") }}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "recommendations"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Recommendations
          </button>
          <button
            onClick={() => { setActiveTab("objections"); setSearch("") }}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "objections"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Objections
          </button>
          <button
            onClick={() => { setActiveTab("risks"); setSearch("") }}
            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "risks"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Risk Analysis
          </button>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground stroke-1" />
        <Input
          type="text"
          placeholder={
            activeTab === "memory"
              ? "Search accounts, industries..."
              : activeTab === "meetings"
              ? "Search processed meetings..."
              : activeTab === "recommendations"
              ? "Search deals recommendations..."
              : activeTab === "objections"
              ? "Search friction category or text..."
              : "Search deals risk assessments..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* Tab 1: Customer Memory */}
      {activeTab === "memory" && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground text-xs border border-dashed rounded-lg bg-card/10">
              No active customer memory records found.
            </div>
          ) : (
            filteredCustomers.map((cust) => {
              const mem = getCustomerMemory(cust)
              return (
                <Card key={cust.id} isAi hoverLift className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/20">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-ai/10 text-ai flex items-center justify-center">
                        <Brain className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-none">{cust.name}</h4>
                        <span className="text-[9px] text-muted-foreground/60 block mt-0.5">{cust.industry}</span>
                      </div>
                    </div>
                    <Badge variant="ai" className="text-[9px] px-2">Hindsight Memory</Badge>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3.5 flex-1 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Budget Constraints</span>
                        <p className="text-foreground leading-relaxed font-medium">{mem.budget}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Core Pain Points</span>
                        <p className="text-foreground leading-relaxed font-medium">{mem.painPoints}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-border/40 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Decision Makers</span>
                        <p className="text-foreground leading-relaxed font-medium">{mem.decisionMakers}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Competitors Evaluated</span>
                        <p className="text-foreground leading-relaxed font-medium">{mem.competitors}</p>
                      </div>
                    </div>

                    <div className="border-t border-border/40 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Communication Style</span>
                        <p className="text-foreground leading-relaxed font-medium">{mem.commStyle}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Preferred Meeting Time</span>
                        <p className="text-foreground leading-relaxed font-medium">{mem.meetingTime}</p>
                      </div>
                    </div>

                    <div className="border-t border-border/40 pt-3">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Key AI Highlight</span>
                      <div className="p-2 border border-ai/10 bg-ai/5 rounded text-ai leading-relaxed font-medium">
                        {mem.insights}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Tab 2: Meeting Intelligence */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          {completedMeetings.length === 0 ? (
            <EmptyState
              title="No Analyzed Meetings"
              description="Schedule client sync sessions and execute speech-to-text processing to review dialogue summaries."
              actionLabel="Meetings Calendar"
              onAction={() => router.push("/meetings")}
            />
          ) : (
            completedMeetings.map((meet) => {
              const coach = coachingLogs[meet.id]
              return (
                <Card key={meet.id} hoverLift className="overflow-hidden">
                  <div className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/20 pb-3">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                          <Video className="h-4 w-4" />
                        </div>
                        <div>
                          <Link href={`/meetings/${meet.id}`} className="text-sm font-bold hover:text-primary transition-all">
                            {meet.title}
                          </Link>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Account: {meet.customer} • Connected Deal: {meet.deal}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px] flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {meet.date}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {meet.duration}
                        </Badge>
                        <Badge variant="ai" className="text-[9px]">Summary Extracted</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                      {/* Left: AI Summary */}
                      <div className="lg:col-span-2 space-y-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">AI Briefing Summary</span>
                        <p className="text-foreground italic leading-relaxed bg-muted/10 p-3 rounded-lg border border-border/40">
                          &ldquo;{meet.summary}&rdquo;
                        </p>
                        {coach && (
                          <div className="pt-2">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Engagement Analysis</span>
                            <p className="text-foreground text-[11px] font-medium leading-relaxed">{coach.engagementAnalysis}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Key highlights & action items */}
                      <div className="space-y-3.5 bg-secondary/20 p-3 rounded-lg border border-border/20">
                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Discovery Questions Checklist</span>
                          {coach?.questionsToAsk && coach.questionsToAsk.length > 0 ? (
                            <ul className="space-y-1">
                              {coach.questionsToAsk.slice(0, 3).map((q, i) => (
                                <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1 leading-normal font-medium">
                                  <CheckSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[10px] text-muted-foreground italic">No discovery questions cataloged.</p>
                          )}
                        </div>

                        {coach?.missedOpportunities && coach.missedOpportunities.length > 0 && (
                          <div>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Coach Alerts</span>
                            <div className="flex items-start gap-1.5 p-2 bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] rounded leading-relaxed font-semibold">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <span>Missed Opp: {coach.missedOpportunities[0]}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Tab 3: Recommendations */}
      {activeTab === "recommendations" && (
        <div className="space-y-4">
          {activeIntels.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs border border-dashed rounded-lg bg-card/10">
              No recommended action playbooks compiled yet. Perform sync syncs to run agent forecasting.
            </div>
          ) : (
            activeIntels.map((intel) => {
              const deal = deals.find((d) => d.id === intel.dealId)
              if (!deal) return null
              return (
                <Card key={intel.dealId} hoverLift className="overflow-hidden">
                  <div className="p-5 flex flex-col lg:flex-row justify-between gap-6 text-xs">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/deals/${deal.id}`} className="text-sm font-bold hover:text-primary transition-all">
                          {deal.name}
                        </Link>
                        <Badge variant="secondary">{deal.stage}</Badge>
                        <Badge variant="outline" className="text-[9px]">Value: {formatDualCurrency(deal.value)}</Badge>
                      </div>

                      <p className="text-muted-foreground text-[11px] leading-relaxed max-w-xl">
                        {intel.dealSummary}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Win Probability</span>
                          <span className="text-xs font-bold text-foreground">{intel.winProbability}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Deal Health</span>
                          <span className="text-xs font-bold text-foreground">{intel.dealHealth}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">AI Confidence</span>
                          <span className="text-xs font-bold text-foreground">{intel.aiConfidence}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Last Interaction</span>
                          <span className="text-xs font-semibold text-foreground truncate block max-w-[120px]">{intel.lastInteraction}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center shrink-0">
                      <ArrowRight className="hidden lg:block h-5 w-5 text-muted-foreground opacity-55" />
                    </div>

                    <div className="flex-1 space-y-3 p-4 bg-ai/5 border border-ai/10 rounded-lg relative">
                      <span className="text-[9px] font-bold text-ai uppercase tracking-wider block flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Recommended Playbook Action
                      </span>
                      <p className="text-foreground font-bold text-xs leading-snug">
                        &ldquo;{intel.upcomingAction}&rdquo;
                      </p>
                      
                      <div className="border-t border-ai/10 pt-2 grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-muted-foreground block">Decision Makers Status</span>
                          <span className="font-semibold text-foreground truncate block max-w-[160px]">{intel.decisionMakerStatus}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Budget Status</span>
                          <span className="font-semibold text-foreground truncate block max-w-[160px]">{intel.budgetStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Tab 4: Objections */}
      {activeTab === "objections" && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredObjections.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground text-xs border border-dashed rounded-lg bg-card/10">
              No buying friction points or objections detected.
            </div>
          ) : (
            filteredObjections.map((obj) => {
              const deal = deals.find((d) => d.id === obj.dealId)
              return (
                <Card key={obj.id} hoverLift className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-2.5 border-b border-border/20">
                    <div>
                      <span className="font-bold text-[10px] text-red-500 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> {obj.category} Objection
                      </span>
                      {deal && (
                        <Link href={`/deals/${deal.id}`} className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-all mt-1 block">
                          Linked Deal: {deal.name}
                        </Link>
                      )}
                    </div>
                    <Badge variant={obj.status === "Resolved" ? "default" : "destructive"}>
                      {obj.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3.5 flex-1 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Friction Statement</span>
                      <p className="text-foreground font-semibold italic mt-0.5 leading-snug">
                        &ldquo;{obj.objectionText}&rdquo;
                      </p>
                    </div>

                    <div className="p-3 border border-border bg-card/50 rounded-lg space-y-1.5">
                      <span className="font-bold text-foreground block text-[10px] flex items-center gap-1">
                        <CheckSquare className="h-3.5 w-3.5 text-primary" /> Suggested Rebuttal playbook
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{obj.suggestedResponse}</p>
                    </div>

                    <div className="p-3 border border-ai/10 bg-ai/5 rounded-lg space-y-1.5">
                      <span className="font-bold text-ai block text-[10px] flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Follow-up Action play
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{obj.followUpRecommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Tab 5: Risk Analysis */}
      {activeTab === "risks" && (
        <div className="space-y-4">
          {activeIntels.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs border border-dashed rounded-lg bg-card/10">
              No deal risk calculations logged. Compile meetings recordings to compute risk vectors.
            </div>
          ) : (
            activeIntels.map((intel) => {
              const deal = deals.find((d) => d.id === intel.dealId)
              if (!deal) return null
              return (
                <Card key={intel.dealId} hoverLift className="overflow-hidden">
                  <div className="p-5 flex flex-col lg:flex-row justify-between gap-6 text-xs">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <Link href={`/deals/${deal.id}`} className="text-sm font-bold hover:text-primary transition-all">
                          {deal.name}
                        </Link>
                        <Badge variant={intel.riskLevel === "High" ? "destructive" : intel.riskLevel === "Medium" ? "secondary" : "default"}>
                          {intel.riskLevel} Severity Risk
                        </Badge>
                        <Badge variant="outline">Risk Score: {intel.riskScore || 65}%</Badge>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Risk Factors Identified</span>
                        <ul className="space-y-1.5">
                          {(intel.riskReasons || intel.factors).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 p-2 bg-red-50/5 dark:bg-red-950/10 border border-red-500/10 rounded leading-relaxed text-muted-foreground">
                              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-center shrink-0">
                      <ArrowRight className="hidden lg:block h-5 w-5 text-muted-foreground opacity-55" />
                    </div>

                    <div className="flex-1 space-y-3.5">
                      <div className="p-4 border border-ai/10 bg-ai/5 rounded-lg space-y-1.5">
                        <span className="font-bold text-ai block text-[10px] flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" /> AI Mitigation playbook strategy
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {intel.mitigationStrategy || "Identify and align core technical sponsors to clear API redlines early."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-secondary/35 p-3 rounded-lg border border-border/20 text-[11px]">
                        <div>
                          <span className="text-muted-foreground block">Response Latency Threshold</span>
                          <span className="font-bold text-foreground block mt-0.5">{intel.responseDelay || "Exceeding 24 hours"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Meeting Sync Cadence</span>
                          <span className="font-bold text-foreground block mt-0.5">{intel.meetingFrequency || "Once every 2 weeks"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
