"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAppStore, Deal, Customer, Meeting, TaskItem } from "@/lib/store"
import { Skeleton } from "@/components/feedback/Skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressRing } from "@/components/feedback/ProgressRing"
import { Timeline } from "@/components/feedback/Timeline"
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Target,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Plus,
  CheckCircle,
  Building,
  User,
  PlusCircle,
  AlertCircle,
  Play,
  RefreshCw,
  Check,
  Sliders
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const mockChartData = [
  { month: "Jan", value: 4500000 },
  { month: "Feb", value: 5800000 },
  { month: "Mar", value: 7200000 },
  { month: "Apr", value: 8900000 },
  { month: "May", value: 11400000 },
  { month: "Jun", value: 14200000 },
]

export default function Dashboard() {
  const {
    deals,
    customers,
    meetings,
    tasks,
    activities,
    user,
    toggleTask,
    addTask,
    dealIntelligence,
    objections,
    resetDemoPipeline,
    loadPremiumDataset
  } = useAppStore()

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [demoNotification, setDemoNotification] = useState<string | null>(null)

  // Simulated Loading State
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Compute stats from Zustand state!
  const activeDeals = deals.filter((d) => d.status === "Active")
  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0)
  
  const wonDeals = deals.filter((d) => d.status === "Won")
  const closedWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0)
  
  const winRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0

  // Filter today's meetings (mock dates matching 2026-06-26)
  const todayMeetings = meetings.filter((m) => m.date === "2026-06-26")

  // Filter tasks (incomplete)
  const activeTasks = tasks.filter((t) => !t.completed).slice(0, 4)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    addTask({
      title: newTaskTitle.trim(),
      due_date: new Date().toISOString().split("T")[0],
      priority: "Medium"
    })
    setNewTaskTitle("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Executive Deal Dashboard</h2>
          <p className="text-xs text-muted-foreground">
            Welcome back, {user?.full_name || "Alexander Sterling"}. Review today's metrics and client exchanges.
          </p>
        </div>
        
        {/* Quick Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold">
            <Link href="/customers">
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Account
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold">
            <Link href="/deals">
              <PlusCircle className="mr-1.5 h-3.5 w-3.5 text-primary" /> Deal
            </Link>
          </Button>
          <Button variant="premium" size="sm" asChild className="h-8 text-xs font-semibold">
            <Link href="/meetings">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Meet Sync
            </Link>
          </Button>
        </div>
      </div>

      {/* DEMO CONTROLS BANNER */}
      <div className="relative border border-ai/20 bg-ai/5 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-ai animate-ping" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ai flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5" /> Hackathon Showcase Demo Controller
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal">
            Seed high-fidelity records for live showcases, or reset the pipeline to run the speech-to-text swarming simulation from scratch.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetDemoPipeline()
              setDemoNotification("Demo pipeline reset successfully! Go to the Meetings page and click 'Run AI Swarm' to process Whisper STT in real-time.")
              setTimeout(() => setDemoNotification(null), 6000)
            }}
            className="h-8 text-[10px] font-semibold flex items-center gap-1.5 border-border/80"
          >
            <RefreshCw className="h-3 w-3 text-muted-foreground" /> Reset Demo Swarm
          </Button>
          <Button
            variant="premium"
            size="sm"
            onClick={() => {
              loadPremiumDataset()
              setDemoNotification("Premium dataset loaded successfully! All dashboard cards, competitor SWOT, risk timelines, and terminal logs are populated.")
              setTimeout(() => setDemoNotification(null), 6000)
            }}
            className="h-8 text-[10px] font-semibold flex items-center gap-1.5"
          >
            <Play className="h-3 w-3" /> Seed Premium Dataset
          </Button>
        </div>

        {/* Demo feedback notifications overlay */}
        {demoNotification && (
          <div className="absolute left-4 right-4 -bottom-10 z-20 p-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 animate-in fade-in duration-200">
            <Check className="h-3.5 w-3.5 stroke-[2.5]" /> {demoNotification}
          </div>
        )}
      </div>

      {/* VIEW SKELETON OR METRICS LAYOUT */}
      {isLoading ? (
        <>
          {/* KPI Skeletons */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" className="h-[100px] rounded-lg" />
            ))}
          </div>
          {/* Chart & Log Skeletons */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <Skeleton variant="card" className="lg:col-span-2 min-h-[350px]" />
            <Skeleton variant="card" className="min-h-[350px]" />
          </div>
          {/* Playbook Skeletons */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <Skeleton variant="card" className="lg:col-span-2 min-h-[220px]" />
            <Skeleton variant="card" className="min-h-[220px]" />
          </div>
        </>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Dynamic Pipeline */}
        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Pipeline Value
            </CardDescription>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{formatCurrency(pipelineValue)}</div>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-0.5" /> Active Opportunities
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Closed Won */}
        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Closed Won
            </CardDescription>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{formatCurrency(closedWonValue)}</div>
            <p className="text-[10px] text-muted-foreground font-semibold flex items-center mt-1">
              Contract revenue booked
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Active Deals */}
        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Active Deals
            </CardDescription>
            <Briefcase className="h-4 w-4 text-ai" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{activeDeals.length}</div>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center mt-1">
              Pipelines floating
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Win Rate */}
        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Avg. Win Rate
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{winRate.toFixed(1)}%</div>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center mt-1">
              Closed won percentage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Workspace logs */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Revenue Expansion area chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline Expansion Trend</CardTitle>
            <CardDescription>Historical review of cumulative pipeline values.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tickLine={false} style={{ fontSize: 10 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: 10 }}
                  tickFormatter={(val) => `$${val / 1000000}M`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value), "Pipeline"]}
                  contentStyle={{
                    background: "var(--card)",
                    borderColor: "var(--card-border)",
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Global timeline log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workspace Logs</CardTitle>
            <CardDescription>Activity logs tracked dynamically.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] overflow-y-auto">
            <Timeline events={activities.slice(0, 4) as any} />
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation Hub & Objections Feed */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Next Best Action Feed */}
        <Card className="lg:col-span-2 border-ai/20 shadow-ai-glow/5">
          <CardHeader className="flex flex-row items-center gap-1.5 pb-2">
            <Sparkles className="h-4 w-4 text-ai animate-pulse" />
            <div>
              <CardTitle>AI Sales Playbook Recommendations</CardTitle>
              <CardDescription>Live Next Best Action plans computed from account logs.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.values(dealIntelligence).length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg bg-card/10">
                No active recommendations. Run AI Meeting analysis on scheduled briefings to formulate recommended plays.
              </div>
            ) : (
              <div className="space-y-3">
                {Object.values(dealIntelligence).map((intel) => {
                  const deal = deals.find(d => d.id === intel.dealId);
                  if (!deal) return null;
                  return (
                    <div key={intel.dealId} className="p-3.5 bg-gradient-to-br from-primary/5 to-ai/5 border border-ai/15 rounded-lg space-y-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/deals/${deal.id}`} className="font-bold text-foreground hover:text-primary transition-all">
                            {deal.name}
                          </Link>
                          <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
                            Health: {intel.dealHealth}%
                          </Badge>
                          <Badge variant={intel.riskLevel === "High" ? "destructive" : intel.riskLevel === "Medium" ? "secondary" : "default"} className="text-[8px] py-0 h-4">
                            {intel.riskLevel} Risk
                          </Badge>
                        </div>
                        <p className="text-foreground font-semibold mt-1">Recommended Action: &ldquo;{intel.upcomingAction}&rdquo;</p>
                        <p className="text-muted-foreground text-[11px] leading-relaxed max-w-xl">{intel.dealSummary}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold shrink-0 gap-1">
                        <Link href={`/deals/${deal.id}?tab=intelligence`}>
                          View Playbook <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Objections friction feed */}
        <Card className="border-red-500/10 hover:border-red-500/20 transition-all">
          <CardHeader className="flex flex-row items-center gap-1.5 pb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <div>
              <CardTitle>Active Deal Friction</CardTitle>
              <CardDescription>Recently identified customer objections and suggested plays.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {objections.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg bg-card/10">
                No active objections detected.
              </div>
            ) : (
              objections.slice(0, 3).map((obj) => {
                const deal = deals.find(d => d.id === obj.dealId);
                return (
                  <div key={obj.id} className="p-3 border border-red-500/10 bg-red-500/5 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-400 text-[10px] uppercase tracking-wide flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {obj.category} Objection
                      </span>
                      {deal && (
                        <Link href={`/deals/${deal.id}`} className="text-[10px] text-muted-foreground hover:text-primary transition-all truncate max-w-[120px]">
                          {deal.name.split(" ")[0]}...
                        </Link>
                      )}
                    </div>
                    <p className="text-foreground leading-snug font-medium italic">&ldquo;{obj.objectionText}&rdquo;</p>
                    <div className="text-[10px] bg-card/40 border border-border/20 rounded p-2 leading-relaxed">
                      <span className="font-bold text-foreground block mb-0.5">Suggested Playbook Rebuttal:</span>
                      <p className="text-muted-foreground">{obj.suggestedResponse}</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom widgets: Today's Meetings & Upcoming Tasks */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Today's meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Meetings</CardTitle>
            <CardDescription>Briefings scheduled for June 26, 2026.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayMeetings.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg bg-card/10">
                No meetings scheduled for today.
              </div>
            ) : (
              todayMeetings.map((meet) => (
                <div
                  key={meet.id}
                  className="flex items-center justify-between p-3.5 border border-card-border rounded-lg bg-card/45"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <Link href={`/meetings/${meet.id}`} className="text-xs font-bold hover:text-primary transition-all">
                        {meet.title}
                      </Link>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {meet.customer} • {meet.time} ({meet.duration})
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[9px]">
                    {meet.type}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Tasks checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks Checklist</CardTitle>
            <CardDescription>Action items and deliverables checklist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task adder */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <Input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a new deliverable task..."
                className="text-xs flex-1 h-9"
              />
              <Button type="submit" size="sm" className="h-9 px-3 gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>

            {/* List */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {activeTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">All tasks completed!</div>
              ) : (
                activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/10 transition-all text-xs"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 text-left focus:outline-none"
                    >
                      <div className="h-4 w-4 rounded border border-input flex items-center justify-center shrink-0">
                        {task.completed && <span className="h-2.5 w-2.5 rounded bg-primary" />}
                      </div>
                      <span className={task.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                        {task.title}
                      </span>
                    </button>
                    <Badge variant={task.priority === "High" ? "destructive" : "secondary"} className="text-[8px] py-0 h-4">
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )}
</div>
)
}
