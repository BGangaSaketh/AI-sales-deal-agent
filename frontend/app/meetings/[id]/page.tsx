"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppStore, Meeting } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/feedback/Skeleton"
import {
  Video,
  Clock,
  Calendar,
  User,
  Users,
  FileText,
  Trash2,
  ArrowLeft,
  Sparkles,
  Paperclip,
  Upload,
  Check,
  Loader2,
  AlertTriangle,
  Download,
  Copy,
  Mail,
  Brain,
  MessageSquare,
  HelpCircle,
  TrendingDown,
  CheckSquare
} from "lucide-react"

export default function MeetingDetails() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const {
    meetings,
    deleteMeeting,
    processingMeetingId,
    processingStep,
    processingStatusText,
    processMeetingAI,
    objections,
    coachingLogs,
    generatedEmails
  } = useAppStore()
  
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [activeLeftTab, setActiveLeftTab] = useState<"agenda" | "coaching" | "emails">("agenda")
  const [selectedEmailType, setSelectedEmailType] = useState<string>("Follow-up")
  const [emailCopied, setEmailCopied] = useState(false)
  
  useEffect(() => {
    if (id) {
      const found = meetings.find((m) => m.id === id)
      if (found) {
        setMeeting(found)
      }
    }
  }, [id, meetings])

  // Automatically switch tabs when processed if on other views
  useEffect(() => {
    if (meeting?.hasTranscript && activeLeftTab === "agenda") {
      setActiveLeftTab("coaching")
    }
  }, [meeting?.hasTranscript])

  if (!meeting) {
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

  const handleDelete = () => {
    if (confirm(`Are you sure you want to cancel the meeting: ${meeting.title}?`)) {
      deleteMeeting(meeting.id)
      router.push("/meetings")
    }
  }

  const downloadTranscript = () => {
    if (!meeting.transcriptText) return
    const element = document.createElement("a")
    const file = new Blob([meeting.transcriptText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${meeting.title.replace(/\s+/g, "_")}_transcript.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCopyEmail = (text: string) => {
    navigator.clipboard.writeText(text)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  // Parse speaker transcription dialogue
  const renderSpeakerDialogue = () => {
    if (!meeting.transcriptText) return null
    const lines = meeting.transcriptText.split("\n")
    return (
      <div className="space-y-4 max-h-[350px] overflow-y-auto p-4 border border-border/40 bg-zinc-950/20 rounded-lg">
        {lines.map((line, idx) => {
          const colonIdx = line.indexOf(":")
          if (colonIdx > -1) {
            const speaker = line.substring(0, colonIdx).trim()
            const dialogue = line.substring(colonIdx + 1).trim()
            const isUser = speaker.includes("Alexander Sterling")
            return (
              <div key={idx} className={`flex flex-col ${isUser ? "items-end text-right" : "items-start text-left"}`}>
                <span className="text-[9px] font-bold text-muted-foreground mb-0.5">{speaker}</span>
                <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                  isUser 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted/80 text-foreground border border-border/40 rounded-tl-none"
                }`}>
                  {dialogue}
                </div>
              </div>
            )
          }
          return <p key={idx} className="text-xs text-muted-foreground italic leading-relaxed py-1">{line}</p>
        })}
      </div>
    )
  }

  const coachingLog = coachingLogs[meeting.id]
  const emailDrafts = generatedEmails[meeting.id]

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center">
        <Button variant="outline" size="sm" onClick={() => router.push("/meetings")} className="gap-1.5 h-8 text-xs font-semibold">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Calendar
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary border border-primary/20">
            <Video className="h-8 w-8 stroke-1" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight">{meeting.title}</h2>
              <Badge variant={meeting.status === "Completed" ? "secondary" : "default"}>
                {meeting.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Account: {meeting.customer} • Connected Deal: {meeting.deal}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDelete} className="gap-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-500 border-red-500/10 h-8">
            <Trash2 className="h-3.5 w-3.5" /> Cancel Meeting
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left column tabs-card */}
        <Card className="lg:col-span-2 flex flex-col min-h-[480px]">
          {/* Tab Selector */}
          <div className="flex border-b border-border/20 px-6 pt-4 gap-2 bg-muted/20">
            <button
              onClick={() => setActiveLeftTab("agenda")}
              className={`pb-3 text-xs font-semibold px-2 transition-all border-b-2 ${
                activeLeftTab === "agenda"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Agenda & Schedule
            </button>
            <button
              onClick={() => meeting.hasTranscript && setActiveLeftTab("coaching")}
              disabled={!meeting.hasTranscript}
              className={`pb-3 text-xs font-semibold px-2 transition-all border-b-2 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                activeLeftTab === "coaching"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brain className="h-3.5 w-3.5" /> AI Sales Coach
            </button>
            <button
              onClick={() => meeting.hasTranscript && setActiveLeftTab("emails")}
              disabled={!meeting.hasTranscript}
              className={`pb-3 text-xs font-semibold px-2 transition-all border-b-2 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                activeLeftTab === "emails"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> Smart Follow-up
            </button>
          </div>

          <CardContent className="flex-1 p-6">
            {/* Tab 1: Agenda & Schedule */}
            {activeLeftTab === "agenda" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Date</span>
                      <span className="font-semibold">{meeting.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Time & Duration</span>
                      <span className="font-semibold">{meeting.time} ({meeting.duration})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Location Type</span>
                      <span className="font-semibold">{meeting.type} Meeting</span>
                    </div>
                  </div>
                </div>

                {/* List Attendees */}
                <div className="border-t border-border/40 pt-4">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> Attendees List
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {meeting.attendees.map((attendee) => (
                      <div key={attendee} className="flex items-center gap-2 p-2.5 rounded-lg border border-border/60 text-xs bg-background/30">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{attendee}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared notes */}
                <div className="border-t border-border/40 pt-4">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Meeting Agenda & Notes
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {meeting.notes || "No agenda notes provided."}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: AI Sales Coach */}
            {activeLeftTab === "coaching" && (
              <div className="space-y-6">
                {coachingLog ? (
                  <div className="space-y-6">
                    {/* Top analysis bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 border border-border bg-muted/30 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Engagement Analysis</span>
                          <p className="text-[11px] text-foreground mt-1 leading-relaxed">{coachingLog.engagementAnalysis}</p>
                        </div>
                      </div>
                      <div className="p-3 border border-ai/10 bg-ai/5 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-ai font-bold">Coach Confidence Rating</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                              <div className="bg-ai h-full" style={{ width: `${coachingLog.confidenceScore}%` }} />
                            </div>
                            <span className="text-xs font-bold text-ai">{coachingLog.confidenceScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Missed Opps & Negotiation playbook */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Missed Opportunities
                        </h4>
                        <ul className="space-y-2">
                          {coachingLog.missedOpportunities.map((opp, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5 leading-relaxed bg-muted/10 p-2 rounded border border-border/30">
                              <span className="text-amber-500 font-bold mt-0.5">•</span>
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          <Brain className="h-3.5 w-3.5" /> Playbook Coaching Tips
                        </h4>
                        <ul className="space-y-2">
                          {(coachingLog.coachingTips || coachingLog.negotiationTips).map((tip, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5 leading-relaxed bg-primary/5 p-2 rounded border border-primary/10">
                              <span className="text-primary font-bold mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Suggested rebuttals and Questions to Ask */}
                    <div className="border-t border-border/40 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> Rebuttals & Objections
                        </h4>
                        <div className="space-y-3">
                          {coachingLog.suggestedResponses.map((sr, idx) => (
                            <div key={idx} className="text-xs p-2.5 rounded-lg border border-border bg-background/50 space-y-1">
                              <p className="font-semibold text-foreground">Objection: &ldquo;{sr.objection}&rdquo;</p>
                              <p className="text-muted-foreground text-[11px] leading-relaxed italic bg-muted/40 p-1.5 rounded mt-1 border-l-2 border-primary">
                                Rebuttal: {sr.rebuttal}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                          <CheckSquare className="h-3.5 w-3.5" /> Discovery Questions to Ask
                        </h4>
                        <ul className="space-y-2">
                          {coachingLog.questionsToAsk.map((q, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                              <CheckSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-muted-foreground italic">
                    AI coaching analysis not yet generated. Trigger processing from the right pane.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Smart Email Drafts */}
            {activeLeftTab === "emails" && (
              <div className="space-y-4">
                {emailDrafts ? (
                  <div className="space-y-4">
                    {/* Selector of draft types */}
                    <div className="flex gap-2">
                      {Object.keys(emailDrafts).map((type) => (
                        <Button
                          key={type}
                          variant={selectedEmailType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedEmailType(type)}
                          className="h-8 text-[11px] font-semibold px-3"
                        >
                          {type} Template
                        </Button>
                      ))}
                    </div>

                    {/* Email Editor Frame */}
                    {(() => {
                      const activeEmail = emailDrafts[selectedEmailType]
                      if (!activeEmail) return null
                      
                      return (
                        <div className="space-y-4 border border-border/80 rounded-lg overflow-hidden bg-background/50">
                          <div className="p-3 bg-muted/40 border-b border-border text-[11px] space-y-1">
                            <div><span className="font-bold text-muted-foreground">Subject:</span> <span className="font-semibold text-foreground">{activeEmail.subject}</span></div>
                            {activeEmail.suggestedSendDate && <div><span className="font-bold text-muted-foreground">Suggested Send Date:</span> <span className="text-foreground">{activeEmail.suggestedSendDate}</span></div>}
                          </div>
                          <div className="p-4 text-xs font-sans leading-relaxed text-foreground whitespace-pre-line select-text" dangerouslySetInnerHTML={{ __html: activeEmail.body }} />
                          
                          {activeEmail.callToAction && (
                            <div className="p-3 bg-primary/5 border-t border-primary/10 text-[10px] text-primary flex items-center justify-between">
                              <span><strong>Call to Action:</strong> {activeEmail.callToAction}</span>
                              <Badge variant="ai" className="text-[8px]">CTA</Badge>
                            </div>
                          )}

                          <div className="p-3 bg-muted/10 border-t border-border flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[10px] gap-1 font-semibold"
                              onClick={() => handleCopyEmail(activeEmail.body.replace(/<br\s*\/?>/gi, '\n'))}
                            >
                              {emailCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                              {emailCopied ? "Copied" : "Copy to Clipboard"}
                            </Button>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-muted-foreground italic">
                    No generated follow-up emails available. Run the AI pipeline to formulate.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: AI Meeting Intelligence panel */}
        <div className="space-y-6">
          {(() => {
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
                alert("Unsupported format. Please upload a .txt transcript or .mp3/.wav audio file.")
              }
            }

            const triggerSimulation = async () => {
              await processMeetingAI(meeting.id, false)
            }

            const AI_STEPS = [
              { step: 1, label: "STT", desc: "Whisper Audio parsing" },
              { step: 2, label: "Summary", desc: "Key signal extraction" },
              { step: 3, label: "Objections", desc: "Detecting friction" },
              { step: 4, label: "Memory", desc: "Updating Hindsight" },
              { step: 5, label: "Playbook", desc: "Next Best Action" },
              { step: 6, label: "Scoring", desc: "Deal health update" },
            ]

            return (
              <Card className="border-ai/20 shadow-ai-glow/5 flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-ai animate-pulse" />
                    Speech-to-Text Voice Assistant
                  </CardTitle>
                  <CardDescription>Upload audio briefings to separated diarized speaker streams.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs leading-relaxed flex-1">
                  
                  {/* Case 1: Active Processing Loader Stepper */}
                  {isProcessing && (
                    <div className="p-4 border border-ai/20 bg-ai/5 rounded-lg space-y-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-ai" />
                        <span className="font-bold text-ai">CascadeFlow processing...</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{processingStatusText}</p>
                      
                      {/* Stepper progress bar */}
                      <div className="grid grid-cols-6 gap-1 pt-1.5 relative">
                        <div className="absolute top-[8px] left-1.5 right-1.5 h-0.5 bg-muted/40 z-0" />
                        {AI_STEPS.map((s) => {
                          const isDone = processingStep > s.step;
                          const isActive = processingStep === s.step;
                          return (
                            <div key={s.step} className="flex flex-col items-center z-10 text-center relative">
                              <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                                isDone ? "bg-emerald-500 border-emerald-500 text-white" :
                                isActive ? "bg-ai border-ai text-white animate-pulse shadow shadow-ai/30" :
                                "bg-card border-border text-muted-foreground"
                              }`}>
                                {isDone ? <Check className="h-2.5 w-2.5" /> : s.step}
                              </div>
                              <span className={`text-[7px] font-semibold mt-1 block truncate w-full ${
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

                  {/* Case 2: Upload transcript or audio zone */}
                  {!meeting.hasTranscript && !isProcessing && (
                    <div className="space-y-4">
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-5 text-center transition-all relative ${
                          dragActive ? "border-ai bg-ai/5" : "border-border/60 bg-card/20 hover:border-border"
                        }`}
                      >
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".txt,.mp3,.wav,.m4a"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground opacity-60 mb-2" />
                        <p className="font-bold text-foreground mb-1 text-[11px]">Upload Sync Recording</p>
                        <p className="text-[9px] text-muted-foreground">
                          Drop transcript text (.txt) or audio exchange (.mp3, .wav)
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-border/40 rounded-lg bg-card/10 text-[11px]">
                        <div>
                          <span className="font-bold block">Simulation Mode</span>
                          <span className="text-[9px] text-muted-foreground">Synthesize automated pipeline outputs.</span>
                        </div>
                        <Button variant="premium" size="sm" onClick={triggerSimulation} className="text-[10px] gap-1 px-2.5 py-1 h-7">
                          <Sparkles className="h-3 w-3" /> Run AI
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Case 3: Processed meeting outputs */}
                  {meeting.hasTranscript && !isProcessing && (
                    <div className="space-y-4">
                      <div className="p-3 bg-ai/5 border border-ai/20 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ai flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> AI Summary
                          </span>
                          <Badge variant="ai" className="text-[8px] py-0 h-4">Parsed</Badge>
                        </div>
                        <p className="text-foreground italic leading-relaxed">&ldquo;{meeting.summary}&rdquo;</p>
                      </div>

                      {/* Display transcription text with dialogue speaker split */}
                      {meeting.transcriptText && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground block text-[10px] uppercase tracking-wider">
                              Speaker Transcription Separator
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={downloadTranscript}
                              className="h-6 text-[9px] px-2 gap-1 font-semibold border-border"
                            >
                              <Download className="h-2.5 w-2.5" /> Transcript
                            </Button>
                          </div>
                          
                          {renderSpeakerDialogue()}
                        </div>
                      )}

                      {/* Display objections if any */}
                      {meetingObjections.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-border/30">
                          <span className="font-bold text-foreground block text-[10px] uppercase tracking-wider">
                            Friction & Objections ({meetingObjections.length})
                          </span>
                          {meetingObjections.map((obj) => (
                            <div key={obj.id} className="p-2.5 border border-red-500/10 bg-red-500/5 rounded-lg space-y-1">
                              <div className="font-bold text-red-400 flex items-center gap-1 text-[10px]">
                                <AlertTriangle className="h-3 w-3" /> {obj.category} Objection
                              </div>
                              <p className="text-muted-foreground font-medium">&ldquo;{obj.objectionText}&rdquo;</p>
                              <div className="text-[9px] bg-card/50 p-2 border border-border/20 rounded mt-1">
                                <span className="font-bold text-foreground block">Playbook Rebuttal:</span>
                                <p className="text-muted-foreground mt-0.5">{obj.suggestedResponse}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </CardContent>
              </Card>
            );
          })()}
        </div>
      </div>
    </div>
  )
}

