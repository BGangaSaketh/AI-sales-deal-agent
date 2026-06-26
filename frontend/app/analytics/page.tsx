"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import {
  BarChart3,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Briefcase,
  DollarSign,
  PieChart as PieIcon,
  Sparkles,
  Percent,
  AlertTriangle
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from "recharts"

const COLORS = ["var(--primary)", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function Analytics() {
  const { deals, dealIntelligence } = useAppStore()
  const [timeRange, setTimeRange] = useState<"90" | "30" | "all">("90")

  // Compute live stats from Zustand store
  const activeDeals = deals.filter(d => d.status === "Active")
  const wonDeals = deals.filter(d => d.status === "Won")
  const lostDeals = deals.filter(d => d.status === "Lost")
  
  const totalValue = deals.reduce((acc, d) => acc + d.value, 0)
  const wonValue = wonDeals.reduce((acc, d) => acc + d.value, 0)
  const averageDealSize = deals.length > 0 ? totalValue / deals.length : 0
  const winRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)
  }

  // 1. Pipeline value by stage
  const getStageChartData = () => {
    const stages: Record<string, { value: number; count: number }> = {
      Lead: { value: 0, count: 0 },
      Qualified: { value: 0, count: 0 },
      Proposal: { value: 0, count: 0 },
      Negotiation: { value: 0, count: 0 },
      Won: { value: 0, count: 0 },
      Lost: { value: 0, count: 0 }
    }
    deals.forEach(d => {
      if (stages[d.stage]) {
        stages[d.stage].value += d.value
        stages[d.stage].count += 1
      }
    })
    return Object.entries(stages).map(([name, data]) => ({
      name,
      value: data.value,
      count: data.count
    }))
  }

  const stageData = getStageChartData()

  // 2. Win/Loss Pie data
  const pieData = [
    { name: "Won Opportunities", value: wonDeals.length || 1 },
    { name: "Lost Opportunities", value: lostDeals.length || 0 }
  ]

  // 3. Mock Revenue trend
  const trendData = [
    { month: "Jan", revenue: 1200000, pipeline: 2400000 },
    { month: "Feb", revenue: 1800000, pipeline: 3100000 },
    { month: "Mar", revenue: 2400000, pipeline: 4800000 },
    { month: "Apr", revenue: 3100000, pipeline: 5700000 },
    { month: "May", revenue: wonValue > 0 ? wonValue * 0.7 : 4500000, pipeline: totalValue * 0.8 },
    { month: "Jun", revenue: wonValue || 5100000, pipeline: totalValue }
  ]

  // 4. Lost reasons distribution
  const lostReasonsData = [
    { reason: "Competitor Pricing", count: 4, val: 850000 },
    { reason: "Technical SLA Spikes", count: 3, val: 1200000 },
    { reason: "CTO Architecture check", count: 2, val: 950000 },
    { reason: "Timeline migration delay", count: 1, val: 250000 }
  ]

  // Top performing deals
  const topDeals = [...deals].sort((a, b) => b.value - a.value).slice(0, 4)

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Advanced Sales Analytics</h2>
          <p className="text-xs text-muted-foreground">
            Forecast modeling, risk distributions, competitor trends, and transaction size averages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-secondary p-1">
            {(["90", "30", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase transition-all ${
                  timeRange === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "All Time" : `${r} Days`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">Average Deal Size</CardDescription>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{formatCurrency(averageDealSize)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Calculated from total opportunities</p>
          </CardContent>
        </Card>

        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">Conversion Win Rate</CardDescription>
            <Percent className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{winRate.toFixed(1)}%</div>
            <p className="text-[9px] text-emerald-500 font-semibold flex items-center mt-1">
              {wonDeals.length} Won / {lostDeals.length} Lost
            </p>
          </CardContent>
        </Card>

        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">Active Forecasts</CardDescription>
            <TrendingUp className="h-4 w-4 text-ai" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{formatCurrency(totalValue * 0.75)}</div>
            <p className="text-[9px] text-muted-foreground mt-1">Weighted win probability forecast</p>
          </CardContent>
        </Card>

        <Card hoverLift>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">Friction Rate</CardDescription>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">
              {deals.length > 0 ? ((deals.filter(d => d.riskCount > 0).length / deals.length) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-[9px] text-red-400 font-semibold mt-1">Deals flagged with risk factors</p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Graphs Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Line Chart: Revenue expansion */}
        <Card className="lg:col-span-2 border-ai/20 shadow-ai-glow/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-ai" /> Monthly Pipeline & Booking Expansion
            </CardTitle>
            <CardDescription>Comparison between live pipeline value and booked won contract revenues.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tickLine={false} style={{ fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10 }} tickFormatter={val => `$${val/1000000}M`} />
                <Tooltip formatter={(value: any) => [formatCurrency(value), ""]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" name="Booked Contracts" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" name="Pipeline Forecast" dataKey="pipeline" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPipeline)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: Win Conversion */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Distribution</CardTitle>
            <CardDescription>Ratio of closed won to lost deals.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex flex-col justify-between">
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-display">{winRate.toFixed(0)}%</span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold">Avg Win Rate</span>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-primary block" />
                <span>Won ({wonDeals.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-500 block" />
                <span>Lost ({lostDeals.length})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Graphs: Stages and Loss reasons */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Stage values */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
            <CardDescription>Active opportunities weight distribution.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tickLine={false} style={{ fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10 }} tickFormatter={val => `$${val/1000}K`} />
                <Tooltip formatter={(value: any) => [formatCurrency(value), "Total Value"]} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Loss reasons horizontal */}
        <Card>
          <CardHeader>
            <CardTitle>Friction & Deal Loss Reasons</CardTitle>
            <CardDescription>Primary objections and friction causing deal slips.</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lostReasonsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" tickLine={false} style={{ fontSize: 10 }} tickFormatter={val => `$${val/1000}K`} />
                <YAxis dataKey="reason" type="category" tickLine={false} axisLine={false} style={{ fontSize: 9 }} width={110} />
                <Tooltip formatter={(value: any) => [formatCurrency(value), "Lost Value"]} />
                <Bar dataKey="val" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Top Opportunity Pipelines</CardTitle>
          <CardDescription>Highest value deals currently registered in the CRM.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/20 text-xs">
            {topDeals.map((d) => {
              const intel = dealIntelligence[d.id]
              return (
                <div key={d.id} className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <span className="font-bold text-foreground block">{d.name}</span>
                    <span className="text-muted-foreground block text-[10px]">Account: {d.customer} • Close date: {d.closeDate}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-foreground block">{formatCurrency(d.value)}</span>
                      <Badge variant={d.stage === "Won" ? "default" : d.stage === "Lost" ? "destructive" : "secondary"} className="text-[9px] py-0 h-4">
                        {d.stage} ({d.probability}%)
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
