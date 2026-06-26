"use client"

import React, { useState, useEffect, useRef } from "react"
import { useAppStore, AgentExecutionLog, Meeting } from "@/lib/store"
import { Skeleton } from "@/components/feedback/Skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Play,
  Terminal,
  Cpu,
  Brain,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Mail,
  Shield,
  FileCode,
  Layers
} from "lucide-react"

export default function Agents() {
  const {
    agentLogs,
    meetings,
    processMeetingAI,
    processingMeetingId,
    processingStep,
    processingStatusText
  } = useAppStore()

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("")
  const [selectedAgentId, setSelectedAgentId] = useState<string>("meeting_agent")
  const [customTranscript, setCustomTranscript] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"logs" | "output">("logs")
  
  // Simulated Loading State
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Set initial selected meeting
  useEffect(() => {
    if (meetings.length > 0 && !selectedMeetingId) {
      setSelectedMeetingId(meetings[0].id)
    }
  }, [meetings, selectedMeetingId])

  // Sync custom transcript with selected meeting
  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId)
  useEffect(() => {
    if (selectedMeeting) {
      setCustomTranscript(
        selectedMeeting.transcriptText || 
        selectedMeeting.notes || 
        `Marcus Vance (AeroSpace Corp): Hi Alexander, thanks for jumping on. We've been reviewing the licensing proposal. The primary bottleneck we're experiencing is cart latency checkout spikes during batch ingestion. We're seeing latencies above 800ms which is delaying our flight boarding reporting metrics.
Alexander Sterling: That makes sense. We can optimize the batch pipelines. Have you discussed this with your CTO?
Marcus Vance: Not yet. We need technical validation from the CTO's office. However, we're very interested in moving forward if we can fix this. Pricing-wise, we're a bit over budget by 15%, but we can probably clear that if the SLA terms are solid and checkouts are fast.`
      )
    }
  }, [selectedMeeting, selectedMeetingId])

  // Scroll terminal logs to bottom on changes
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [agentLogs, selectedAgentId, processingStep])

  const handleRunAgents = async () => {
    if (!selectedMeetingId) return
    await processMeetingAI(selectedMeetingId, false, customTranscript)
  }

  const agentIds = [
    "meeting_agent",
    "memory_agent",
    "competitor_agent",
    "risk_agent",
    "email_agent",
    "analytics_agent"
  ]

  const agentIcons: Record<string, React.ReactNode> = {
    meeting_agent: <Brain className="h-4 w-4" />,
    memory_agent: <Layers className="h-4 w-4" />,
    competitor_agent: <Shield className="h-4 w-4" />,
    risk_agent: <AlertCircle className="h-4 w-4" />,
    email_agent: <Mail className="h-4 w-4" />,
    analytics_agent: <TrendingUp className="h-4 w-4" />
  }

  const selectedAgent = agentLogs[selectedAgentId] || {
    agentId: selectedAgentId,
    agentName: "Agent",
    taskDescription: "Idle",
    status: "Idle",
    executionLogs: ["Agent is idle. Ready to execute pipeline."],
    finalOutput: {},
    updatedAt: new Date().toISOString()
  }

  const getStatusBadgeVariant = (status: string): "outline" | "gold" | "default" | "destructive" | "secondary" | "ai" => {
    switch (status) {
      case "Running":
        return "gold"
      case "Succeeded":
        return "ai"
      case "Failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">AI Multi-Agent Control Center</h2>
          <p className="text-xs text-muted-foreground">
            Monitor and run your sequential deal-intelligence agent workflows.
          </p>
        </div>
      </div>

      {/* Control Configuration Grid or Loading Skeletons */}
      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Skeleton variant="card" className="lg:col-span-2 min-h-[350px]" />
          <Skeleton variant="card" className="min-h-[350px]" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Left configurations */}
          <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Pipeline Orchestrator Setup</CardTitle>
            <CardDescription className="text-xs">
              Select a meeting exchange and edit the transcript context for the autonomous agent swarm to analyze.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Source Sync Meeting</label>
              <select
                value={selectedMeetingId}
                onChange={(e) => setSelectedMeetingId(e.target.value)}
                className="w-full text-xs h-9 rounded-md border border-input bg-background/50 px-3 py-1 ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              >
                {meetings.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.customer}) - {m.date}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Sync Transcript Context</label>
              <textarea
                value={customTranscript}
                onChange={(e) => setCustomTranscript(e.target.value)}
                rows={6}
                placeholder="Paste client communication transcripts or sync summary details..."
                className="w-full text-xs rounded-md border border-input bg-background/30 p-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-border/10 pt-4">
            <div className="text-[10px] text-muted-foreground">
              {processingMeetingId ? (
                <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                  <Loader2 className="h-3 w-3 animate-spin" /> {processingStatusText}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-500 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> System ready for execution
                </span>
              )}
            </div>

            <Button
              variant="premium"
              size="sm"
              onClick={handleRunAgents}
              disabled={!!processingMeetingId || !selectedMeetingId}
              className="h-8 font-semibold text-xs"
            >
              {processingMeetingId ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Running Swarm ({processingStep}/6)...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Run Swarm Orchestration
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Right side Agent flow state */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Swarm Execution State</CardTitle>
            <CardDescription className="text-xs">
              Sequential workflow pipeline execution tracker.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
              {agentIds.map((aid, idx) => {
                const log = agentLogs[aid]
                const stepNum = idx + 1
                const isActive = processingMeetingId && processingStep === stepNum
                const isCompleted = !processingMeetingId || processingStep > stepNum || (processingStep === 0 && log?.status === "Succeeded")
                
                return (
                  <div key={aid} className="flex items-start gap-3 relative">
                    <div
                      className={`flex items-center justify-center rounded-full h-6 w-6 text-[10px] font-bold z-10 border transition-all duration-300 ${
                        isActive
                          ? "bg-amber-500 text-white border-amber-600 shadow-md animate-pulse"
                          : isCompleted
                          ? "bg-emerald-500 text-white border-emerald-600"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : stepNum}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-semibold truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {log?.agentName || aid.replace("_", " ")}
                        </p>
                        <Badge
                          variant={getStatusBadgeVariant(log?.status || "Idle")}
                          className="h-4 text-[9px] px-1 font-semibold"
                        >
                          {log?.status || "Idle"}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {log?.taskDescription || "Idle"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terminal and Live Inspection Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Side: Agent List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Autonomous Swarm Agents
          </h3>
          
          <div className="space-y-2">
            {agentIds.map((aid) => {
              const log = agentLogs[aid]
              const isSelected = selectedAgentId === aid
              const name = log?.agentName || aid.replace("_", " ")
              const status = log?.status || "Idle"
              
              return (
                <div
                  key={aid}
                  onClick={() => setSelectedAgentId(aid)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-background/80 border-primary shadow-sm"
                      : "bg-background/20 border-border/40 hover:bg-background/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {agentIcons[aid] || <Cpu className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold truncate">{name}</h4>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {log?.taskDescription || "Awaiting execution"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(status)} className="h-4 text-[9px] px-1">
                    {status}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side: Terminal Log Display */}
        <Card className="lg:col-span-2 flex flex-col h-[450px]">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/10">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" /> {selectedAgent.agentName} Logs
              </CardTitle>
              <CardDescription className="text-xs">
                Detailed step execution logs for the current session.
              </CardDescription>
            </div>
            
            <div className="flex items-center bg-muted/60 p-0.5 rounded-md">
              <Button
                variant={activeTab === "logs" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("logs")}
                className="h-7 text-[10px] px-2.5 font-semibold"
              >
                <Terminal className="h-3 w-3 mr-1" /> Terminal
              </Button>
              <Button
                variant={activeTab === "output" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("output")}
                className="h-7 text-[10px] px-2.5 font-semibold"
              >
                <FileCode className="h-3 w-3 mr-1" /> JSON Output
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0 bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed relative">
            {activeTab === "logs" ? (
              <div className="h-full overflow-y-auto p-4 space-y-2">
                <div className="text-zinc-500 text-[10px] border-b border-zinc-800 pb-2 mb-2 flex items-center justify-between">
                  <span>AGENT ID: {selectedAgent.agentId}</span>
                  <span>LAST SYNC: {new Date(selectedAgent.updatedAt).toLocaleTimeString()}</span>
                </div>
                
                {selectedAgent.executionLogs && selectedAgent.executionLogs.length > 0 ? (
                  selectedAgent.executionLogs.map((logLine, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-600 select-none">[{idx + 1}]</span>
                      <span className={
                        logLine.includes("Successfully") || logLine.includes("Succeeded") 
                          ? "text-emerald-400" 
                          : logLine.includes("Running") || logLine.includes("Scanning")
                          ? "text-amber-400"
                          : logLine.includes("Error") || logLine.includes("Failed")
                          ? "text-rose-400"
                          : "text-zinc-300"
                      }>
                        {logLine}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-500 italic p-2">No terminal logs generated yet.</div>
                )}
                
                {selectedAgent.status === "Running" && (
                  <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                    <span className="text-zinc-600 select-none">&gt;&gt;</span>
                    <span>Processing pipeline steps...</span>
                    <span className="inline-block w-1.5 h-3 bg-amber-400 animate-caret"></span>
                  </div>
                )}
                
                <div ref={terminalEndRef} />
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-4">
                {selectedAgent.finalOutput && Object.keys(selectedAgent.finalOutput).length > 0 ? (
                  <pre className="text-emerald-400 select-text font-mono text-[10px]">
                    {JSON.stringify(selectedAgent.finalOutput, null, 2)}
                  </pre>
                ) : (
                  <div className="text-zinc-500 italic p-2 h-full flex items-center justify-center">
                    No execution results output available. Run the pipeline to populate.
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="py-2.5 px-4 bg-muted/40 border-t border-border/10 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>Agent Status: <strong className={selectedAgent.status === "Succeeded" ? "text-emerald-500" : selectedAgent.status === "Running" ? "text-amber-500" : "text-muted-foreground"}>{selectedAgent.status}</strong></span>
            <span>OS: Antigravity-Orchestrator v1.0</span>
          </CardFooter>
        </Card>
      </div>
        </>
      )}
    </div>
  )
}
