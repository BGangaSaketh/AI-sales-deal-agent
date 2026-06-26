"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAppStore, Meeting } from "@/lib/store"
import { Skeleton } from "@/components/feedback/Skeleton"
import { EmptyState } from "@/components/feedback/EmptyState"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Video,
  Clock,
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Users,
  Grid,
  List,
  Upload,
  Check,
  Loader2,
  FileText,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"

export default function Meetings() {
  const {
    meetings,
    customers,
    deals,
    addMeeting,
    processingMeetingId,
    processingStep,
    processingStatusText,
    processMeetingAI,
    objections
  } = useAppStore()
  
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list")
  const [listFilter, setListFilter] = useState<"Upcoming" | "Past">("Upcoming")
  const [calendarMode, setCalendarMode] = useState<"month" | "week" | "day">("month")
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  
  // Simulated Loading State
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  // Drag and drop states
  const [dragActive, setDragActive] = useState(false)
  
  // Form fields
  const [title, setTitle] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [selectedDealId, setSelectedDealId] = useState("")
  const [date, setDate] = useState("2026-06-26")
  const [time, setTime] = useState("10:00")
  const [type, setType] = useState<Meeting['type']>("Video")
  const [attendeesInput, setAttendeesInput] = useState("")
  const [duration, setDuration] = useState("30 mins")
  const [notes, setNotes] = useState("")

  // Filter listings
  const filteredMeetings = meetings.filter((m) => {
    if (listFilter === "Upcoming") {
      return m.status === "Scheduled"
    } else {
      return m.status === "Completed" || m.status === "Cancelled"
    }
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const customerObj = customers.find((c) => c.id === selectedCustomerId)
    const dealObj = deals.find((d) => d.id === selectedDealId)
    if (!customerObj) return

    addMeeting({
      title,
      customer: customerObj.name,
      customerId: customerObj.id,
      deal: dealObj ? dealObj.name : "General Account Sync",
      dealId: dealObj ? dealObj.id : "",
      date,
      time,
      type,
      attendees: attendeesInput.split(",").map((a) => a.trim()).filter((a) => a !== ""),
      duration,
      notes,
      status: "Scheduled"
    })

    // Reset forms
    setTitle("")
    setSelectedCustomerId("")
    setSelectedDealId("")
    setDate("2026-06-26")
    setTime("10:00")
    setType("Video")
    setAttendeesInput("")
    setDuration("30 mins")
    setNotes("")
    setShowCreateModal(false)
  }

  // Monthly Calendar logic: simple mock render for June 2026
  // June 2026 starts on Monday (1) and has 30 days.
  const renderMonthDays = () => {
    const days = []
    
    // We map meetings specifically by day of June 2026
    for (let i = 1; i <= 30; i++) {
      const dateString = `2026-06-${i.toString().padStart(2, "0")}`
      const dayMeetings = meetings.filter((m) => m.date === dateString)

      days.push(
        <div
          key={i}
          className="min-h-[90px] border border-border/40 p-1 bg-card/10 flex flex-col justify-between hover:bg-card/30 transition-all rounded"
        >
          <span className="text-[10px] font-bold text-muted-foreground self-start p-1">{i}</span>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {dayMeetings.map((meet) => (
              <button
                key={meet.id}
                onClick={() => setSelectedMeeting(meet)}
                className="w-full text-left truncate text-[9px] bg-primary/10 border border-primary/20 text-foreground px-1 py-0.5 rounded font-semibold hover:bg-primary/20 transition-all block"
              >
                {meet.time} {meet.customer.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      )
    }
    return days
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Client Meetings</h2>
          <p className="text-xs text-muted-foreground">
            Schedule customer briefings, sync calendars, and preview meeting summaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggler */}
          <div className="inline-flex rounded-lg bg-secondary p-1 mr-2">
            <button
              onClick={() => setActiveTab("list")}
              className={`rounded p-1.5 transition-all ${
                activeTab === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`rounded p-1.5 transition-all ${
                activeTab === "calendar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <Button variant="premium" size="sm" onClick={() => setShowCreateModal(true)} className="gap-1">
            <Plus className="h-4 w-4" />
            Schedule Sync
          </Button>
        </div>
      </div>

      {/* VIEW SKELETON OR CONTENT CORES */}
      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-4">
            <div className="h-8 w-32 bg-muted/20 animate-pulse rounded" />
            <Skeleton variant="list" className="space-y-3" />
          </div>
          <Skeleton variant="card" className="h-[220px]" />
        </div>
      ) : activeTab === "list" ? (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          {/* Main List */}
          <div className="xl:col-span-2 space-y-4">
            {/* List tab filters */}
            <div className="flex rounded-lg bg-secondary p-1 w-fit">
              {["Upcoming", "Past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setListFilter(tab as any)}
                  className={`rounded px-3 py-1 text-[11px] font-semibold transition-all ${
                    listFilter === tab
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab} Meetings
                </button>
              ))}
            </div>

            {filteredMeetings.length === 0 ? (
              <EmptyState
                title="No Meetings Scheduled"
                description={`There are currently no ${listFilter.toLowerCase()} customer briefings or client syncs scheduled. Click Schedule Sync to add one.`}
                actionLabel="Schedule Sync"
                onAction={() => setShowCreateModal(true)}
              />
            ) : (
              filteredMeetings.map((meeting) => (
                <Card key={meeting.id} hoverLift>
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <Link href={`/meetings/${meeting.id}`} className="text-sm font-bold leading-none hover:text-primary transition-all">
                          {meeting.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {meeting.customer} • Deal: {meeting.deal}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {meeting.date} at {meeting.time}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {meeting.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                      <Badge variant={meeting.status === "Scheduled" ? "default" : "secondary"}>
                        {meeting.status}
                      </Badge>
                      
                      {meeting.hasTranscript ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMeeting(meeting)}
                          className="gap-1 text-xs"
                        >
                          Summary
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" disabled>
                          No Summary
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Right sidebar info */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-ai animate-pulse" />
                Next-Gen Meeting Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                Phase 1 is establishing clean calendar scheduling. In Phase 2, a recording integration trigger will listen to audio signals and compile automated summaries.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/30">
            <div>
              <CardTitle>June 2026</CardTitle>
              <CardDescription>Company-wide scheduling view.</CardDescription>
            </div>
            
            {/* Calendar modes switcher */}
            <div className="flex rounded-lg bg-secondary p-1">
              {(["month", "week", "day"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCalendarMode(mode)}
                  className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                    calendarMode === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {calendarMode === "month" ? (
              <div className="grid grid-cols-7 gap-2">
                {/* Mon - Sun Header */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center font-bold text-xs py-1 text-muted-foreground border-b border-border/20 mb-2">
                    {day}
                  </div>
                ))}
                {/* Month Days render */}
                {renderMonthDays()}
              </div>
            ) : (
              // Week / Day simple placeholder
              <div className="flex h-64 items-center justify-center border border-dashed rounded bg-muted/5 text-xs text-muted-foreground text-center p-6 max-w-md mx-auto">
                <div>
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-foreground">{calendarMode.toUpperCase()} Scheduling Grid</p>
                  <p className="mt-1">Active sync interface is standard in Month view for hackathon demonstration purposes.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View summary detail Modal popups */}
      {selectedMeeting && (() => {
        // Sync with live state to pick up real-time AI updates
        const meeting = meetings.find(m => m.id === selectedMeeting.id) || selectedMeeting;
        const isProcessing = processingMeetingId === meeting.id;
        const meetingObjections = objections.filter(o => o.meetingId === meeting.id);

        const handleDrag = (e: React.DragEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
          } else if (e.type === "dragleave") {
            setDragActive(false)
          }
        }

        const handleDrop = async (e: React.DragEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(false)
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            await handleFileProcessing(file)
          }
        }

        const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            await handleFileProcessing(file)
          }
        }

        const handleFileProcessing = async (file: File) => {
          const isAudio = file.name.endsWith(".mp3") || file.name.endsWith(".wav") || file.name.endsWith(".m4a")
          if (isAudio) {
            await processMeetingAI(meeting.id, true)
          } else if (file.name.endsWith(".txt")) {
            const reader = new FileReader()
            reader.onload = async (event) => {
              const text = event.target?.result as string
              await processMeetingAI(meeting.id, false, text)
            }
            reader.readAsText(file)
          } else {
            alert("Unsupported format. Please drop a .txt transcript or .mp3/.wav audio file.")
          }
        }

        const triggerSimulation = async () => {
          await processMeetingAI(meeting.id, false)
        }

        const AI_STEPS = [
          { step: 1, label: "Transcription", desc: "Whisper Audio parsing" },
          { step: 2, label: "Intelligence", desc: "Summary & signal extraction" },
          { step: 3, label: "Objections", desc: "Detecting buying friction" },
          { step: 4, label: "Memory Sync", desc: "Updating Hindsight parameters" },
          { step: 5, label: "Playbook Rec", desc: "Formulating next best actions" },
          { step: 6, label: "Deal Scoring", desc: "Updating Forecast health" },
        ]

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xl glass-panel border border-border rounded-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold mb-1">{meeting.title}</h3>
              <p className="text-[11px] text-muted-foreground mb-4">
                Account: {meeting.customer} • Connected Opportunity: {meeting.deal}
              </p>

              <div className="space-y-4 text-xs leading-relaxed">
                {/* Notes & Scope */}
                <div className="p-3 bg-muted/10 border border-border/40 rounded-lg">
                  <span className="font-bold text-foreground block mb-1">Agenda & Sync Notes</span>
                  <p className="text-muted-foreground">{meeting.notes || "No agenda notes."}</p>
                </div>

                {/* Case 1: Active Processing Loader Stepper */}
                {isProcessing && (
                  <div className="p-5 border border-ai/20 bg-ai/5 rounded-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-ai" />
                      <span className="font-bold text-ai text-xs">CascadeFlow Model Cascade Running</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{processingStatusText}</p>
                    
                    {/* Stepper Progress Visualizer */}
                    <div className="grid grid-cols-6 gap-2 pt-2 relative">
                      <div className="absolute top-[9px] left-2 right-2 h-0.5 bg-muted/40 z-0" />
                      {AI_STEPS.map((s) => {
                        const isDone = processingStep > s.step;
                        const isActive = processingStep === s.step;
                        return (
                          <div key={s.step} className="flex flex-col items-center z-10 text-center relative">
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                              isDone ? "bg-emerald-500 border-emerald-500 text-white" :
                              isActive ? "bg-ai border-ai text-white animate-pulse shadow shadow-ai/30" :
                              "bg-card border-border text-muted-foreground"
                            }`}>
                              {isDone ? <Check className="h-3 w-3" /> : s.step}
                            </div>
                            <span className={`text-[8px] font-semibold mt-1 block truncate w-full ${
                              isActive ? "text-ai font-bold" : "text-muted-foreground"
                            }`}>
                              {s.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Case 2: Upload Transcript / Audio Zone */}
                {!meeting.hasTranscript && !isProcessing && (
                  <div className="space-y-4">
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-all relative ${
                        dragActive ? "border-ai bg-ai/5" : "border-border/60 bg-card/20 hover:border-border"
                      }`}
                    >
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".txt,.mp3,.wav,.m4a"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground opacity-60 mb-2" />
                      <p className="font-bold text-foreground mb-1 text-xs">Drag & drop client exchanges</p>
                      <p className="text-[10px] text-muted-foreground">
                        Drop text transcript (.txt) or Whisper audio exchange (.mp3, .wav)
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border/40 rounded-lg bg-card/10">
                      <div>
                        <span className="font-bold block text-[11px]">Developer simulation mode</span>
                        <span className="text-[10px] text-muted-foreground">Demonstrate the entire AI workflow automatically.</span>
                      </div>
                      <Button variant="premium" size="sm" onClick={triggerSimulation} className="text-xs gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        Simulate AI Run
                      </Button>
                    </div>
                  </div>
                )}

                {/* Case 3: Display Processed AI Results */}
                {meeting.hasTranscript && !isProcessing && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-ai/5 border border-ai/20 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ai flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" /> AI Insight Summary
                        </span>
                        <Badge variant="ai" className="text-[9px] uppercase font-bold">Analysis Complete</Badge>
                      </div>
                      <p className="text-foreground italic leading-relaxed">&ldquo;{meeting.summary}&rdquo;</p>
                    </div>

                    {/* Show detected objections in modal if any */}
                    {meetingObjections.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-bold text-foreground block text-[10px] uppercase tracking-wider">
                          Friction points & Objections Detected ({meetingObjections.length})
                        </span>
                        {meetingObjections.map((obj) => (
                          <div key={obj.id} className="p-3 border border-red-500/10 bg-red-500/5 rounded-lg space-y-1.5">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-red-400">
                              <AlertTriangle className="h-3.5 w-3.5" /> {obj.category} Objection:
                            </div>
                            <p className="text-muted-foreground font-medium">&ldquo;{obj.objectionText}&rdquo;</p>
                            <div className="text-[10px] bg-card/60 p-2 border border-border/30 rounded mt-1.5">
                              <span className="font-bold text-foreground block mb-0.5">Suggested Playbook Rebuttal:</span>
                              <p className="text-muted-foreground">{obj.suggestedResponse}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm" onClick={() => setSelectedMeeting(null)}>
                    Close Panel
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/meetings/${meeting.id}`}>
                      Go to Workspace
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Schedule meeting modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border border-border rounded-lg shadow-2xl p-6 relative">
            <h3 className="text-base font-bold mb-4">Schedule Client Briefing</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Meeting Title</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sync & Integration Demo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Account Customer</label>
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
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Linked Deal</label>
                  <select
                    value={selectedDealId}
                    onChange={(e) => setSelectedDealId(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/40"
                  >
                    <option value="">-- Optional Deal --</option>
                    {deals.filter(d => d.customerId === selectedCustomerId).map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Meeting Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Start Time</label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Location Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/40"
                  >
                    <option value="Video">Video Call</option>
                    <option value="Onsite">Onsite Meeting</option>
                    <option value="Call">Phone Call</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Duration</label>
                  <Input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 30 mins" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Attendees (comma-separated)</label>
                <Input
                  type="text"
                  value={attendeesInput}
                  onChange={(e) => setAttendeesInput(e.target.value)}
                  placeholder="Alexander Sterling, John Doe (Acme)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Meeting Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[60px] p-2 bg-transparent border border-border/80 rounded-md text-xs focus:outline-none"
                  placeholder="Primary requirements to sync..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
