"use client"

import React, { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Sparkles,
  Command,
  Plus,
  Search,
  ArrowRight,
  Video,
  Users,
  Briefcase,
  Cpu,
  BarChart3,
  Settings,
  X,
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  Calendar,
  AlertTriangle,
  Brain
} from "lucide-react"

interface AppLayoutShellProps {
  children: React.ReactNode
}

export function AppLayoutShell({ children }: AppLayoutShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, customers, deals, meetings } = useAppStore()
  
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname)

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(false)
  const [splashText, setSplashText] = useState("")

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("has_seen_splash")
    if (!hasSeen) {
      setShowSplash(true)
      
      // Typewriter welcome subtitle
      const text = "Executive AI OS: Initializing Sales Intelligence Swarm..."
      let idx = 0
      const timerText = setInterval(() => {
        if (idx < text.length) {
          setSplashText(prev => prev + text[idx])
          idx++
        } else {
          clearInterval(timerText)
        }
      }, 30)

      const timerSplash = setTimeout(() => {
        setShowSplash(false)
        sessionStorage.setItem("has_seen_splash", "true")
      }, 2500)

      return () => {
        clearInterval(timerText)
        clearTimeout(timerSplash)
      }
    }
  }, [])

  // Command Palette State
  const [showPalette, setShowPalette] = useState(false)
  const [paletteSearch, setPaletteSearch] = useState("")
  const [activeCmdIdx, setActiveCmdIdx] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "AeroSpace Corp", "High Risk Deals", "Follow-up proposal"
  ])

  // Text highlighting helper
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) 
            ? <mark key={i} className="bg-primary/30 text-primary-foreground font-semibold rounded-xs px-0.5">{part}</mark>
            : <span key={i}>{part}</span>
        )}
      </span>
    )
  }

  // Floating Chat State
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; text: string }[]>([
    { role: "assistant", text: "Hello! I am your AI Sales Copilot. Ask me about deal health, customer summaries, or follow-up plans." }
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Keydown listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setShowPalette(prev => !prev)
        setActiveCmdIdx(0)
        setPaletteSearch("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Action Executor for Command Palette
  const executeCommand = (cmd: any) => {
    if (paletteSearch.trim()) {
      setRecentSearches(prev => {
        const next = [paletteSearch.trim(), ...prev.filter(s => s !== paletteSearch.trim())]
        return next.slice(0, 5) // Keep top 5
      })
    }
    setShowPalette(false)
    setPaletteSearch("")

    if (cmd.action === "ai-chat") {
      triggerAiCopilotQuery(paletteSearch || cmd.query || "")
    } else {
      router.push(cmd.href)
    }
  }

  const triggerAiCopilotQuery = async (query: string) => {
    setShowChat(true)
    setIsTyping(true)
    setMessages(prev => [...prev, { role: "user", text: query }])
    
    // AI Response synthesis
    await new Promise(resolve => setTimeout(resolve, 1000))
    let reply = `I've analyzed the pipeline regarding "${query}". The system registers active sales signals, but recommends running the Whisper Speech-to-Text Swarms to synthesize further insight.`
    
    const lower = query.toLowerCase()
    if (lower.includes("aerospace") || lower.includes("d1") || lower.includes("m1")) {
      reply = "AeroSpace Tech Enterprise Sync: Win probability is 75%, deal health is 80%. Target budget friction (15% over target limit) and 800ms latency bottlenecks are identified. Playbook recommendation: Schedule technical validation sync with CTO's team."
    } else if (lower.includes("nova") || lower.includes("d2") || lower.includes("m2")) {
      reply = "Nova Commerce Scaleout Bundle: Win probability is 40%, deal health is 60%. Key risk detected is competition from Shopify Plus. Playbook recommendation: Deliver storefront cost-savings TCO amortization spreadsheet."
    } else if (lower.includes("risk") || lower.includes("friction")) {
      reply = "High Risk Deals Detected: Nova Retail opportunity is flagged as High Risk due to budget pending procurement guidelines and response delays exceeding 24 hours."
    } else if (lower.includes("objection") || lower.includes("pricing")) {
      reply = "Pricing Objections: Detected pricing concerns on AeroSpace Corp and Nova Retail. Suggested rebuttals involve offering 3-year multi-year amortization templates or flexible payment terms."
    }

    setMessages(prev => [...prev, { role: "assistant", text: "" }])
    setIsTyping(false)

    // Simulated streaming response typewriter
    let currentText = ""
    const interval = setInterval(() => {
      if (currentText.length < reply.length) {
        currentText += reply[currentText.length]
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", text: currentText }
          return updated
        })
      } else {
        clearInterval(interval)
      }
    }, 12)
  }

  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-background">{children}</main>
  }

  // Filter Command Palette actions
  const getFilteredCommands = () => {
    const query = paletteSearch.trim().toLowerCase()
    const all = [
      { name: "Go to Dashboard Overview", href: "/dashboard", icon: BarChart3, type: "Navigation" },
      { name: "Go to Customers Accounts", href: "/customers", icon: Users, type: "Navigation" },
      { name: "Go to Deals Opportunities", href: "/deals", icon: Briefcase, type: "Navigation" },
      { name: "Go to Meetings Calendar", href: "/meetings", icon: Video, type: "Navigation" },
      { name: "Go to Sales Analytics", href: "/analytics", icon: BarChart3, type: "Navigation" },
      { name: "Go to AI Agents Hub", href: "/agents", icon: Cpu, type: "Navigation" },
      { name: "Go to System Settings", href: "/settings", icon: Settings, type: "Navigation" },
      { name: "Schedule a Client Briefing Sync", href: "/meetings", action: "schedule", icon: Plus, type: "Action" },
      { name: "Add new Customer Profile", href: "/customers", action: "customer", icon: Plus, type: "Action" },
      { name: "Create new Deal Opportunity", href: "/deals", action: "deal", icon: Plus, type: "Action" }
    ]

    if (!query) return all

    const filtered = all.filter(c => c.name.toLowerCase().includes(query))

    // Inject dynamic context-aware AI command shortcuts
    if (query.includes("aero") || query.includes("space")) {
      filtered.unshift({
        name: "AI Swarm: Run AeroSpace Sync simulation",
        href: "/meetings/m1",
        icon: Sparkles,
        type: "AI Swarm"
      })
      filtered.unshift({
        name: "AI Coach: Open AeroSpace deal health analysis",
        href: "/deals/d1?tab=intelligence",
        icon: Brain,
        type: "AI Coach"
      })
    } else if (query.includes("nova")) {
      filtered.unshift({
        name: "AI Swarm: Run Nova Retail simulation",
        href: "/meetings/m2",
        icon: Sparkles,
        type: "AI Swarm"
      })
      filtered.unshift({
        name: "AI Coach: Open Nova Retail deal health analysis",
        href: "/deals/d2?tab=intelligence",
        icon: Brain,
        type: "AI Coach"
      })
    }

    // Prepend generic Ask AI option at the very top
    filtered.unshift({
      name: `Ask AI Copilot: "${paletteSearch}"`,
      href: "#",
      action: "ai-chat",
      icon: Sparkles,
      type: "AI Query"
    })

    return filtered
  }

  const filteredCommands = getFilteredCommands()

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const userText = chatInput.trim()
    setMessages(prev => [...prev, { role: "user", text: userText }])
    setChatInput("")
    setIsTyping(true)

    // AI Response synthesis
    await new Promise(resolve => setTimeout(resolve, 1200))
    let reply = "I've reviewed the current workspace pipeline. AeroSpace Corp has budget friction but buying signals exist. Recommend scheduling technical validation sync."
    
    const lower = userText.toLowerCase()
    if (lower.includes("aerospace") || lower.includes("d1") || lower.includes("m1")) {
      reply = "AeroSpace Tech Enterprise Sync: Win probability is 75%, deal health is 80%. Target budget friction (15% over target limit) and 800ms latency bottlenecks are identified. Playbook recommendation: Schedule technical validation sync with CTO's team."
    } else if (lower.includes("nova") || lower.includes("d2") || lower.includes("m2")) {
      reply = "Nova Commerce Scaleout Bundle: Win probability is 40%, deal health is 60%. Key risk detected is competition from Shopify Plus. Playbook recommendation: Deliver storefront cost-savings TCO amortization spreadsheet."
    } else if (lower.includes("risk") || lower.includes("friction")) {
      reply = "High Risk Deals Detected: Nova Retail opportunity is flagged as High Risk due to budget pending procurement guidelines and response delays exceeding 24 hours."
    } else if (lower.includes("objection") || lower.includes("pricing")) {
      reply = "Pricing Objections: Detected pricing concerns on AeroSpace Corp and Nova Retail. Suggested rebuttals involve offering 3-year multi-year amortization templates or flexible payment terms."
    }

    setMessages(prev => [...prev, { role: "assistant", text: "" }])
    setIsTyping(false)

    // Simulated streaming response typewriter
    let currentText = ""
    const interval = setInterval(() => {
      if (currentText.length < reply.length) {
        currentText += reply[currentText.length]
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", text: currentText }
          return updated
        })
      } else {
        clearInterval(interval)
      }
    }, 12)
  }

  const quickQuery = (q: string) => {
    setChatInput(q)
  }

  // Keyboard navigation inside Command Palette
  const handlePaletteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveCmdIdx(prev => (prev + 1) % filteredCommands.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveCmdIdx(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredCommands[activeCmdIdx]) {
        executeCommand(filteredCommands[activeCmdIdx])
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setShowPalette(false)
      setPaletteSearch("")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">
      {/* Navigation elements */}
      <Sidebar />
      
      {/* Wrapper for main content */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarOpen ? "md:pl-64" : "md:pl-16"
        )}
      >
        <Topbar />
        
        {/* Main Workspace Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24">
          <div key={pathname} className="page-enter">
            {children}
          </div>
        </main>
      </div>

      {/* 1. COMMAND PALETTE OVERLAY DIALOG */}
      {showPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg glass-panel border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[480px]">
            {/* Input Bar */}
            <div className="flex items-center gap-2 px-3 border-b border-border/40 h-12 shrink-0">
              <Search className="h-4 w-4 text-muted-foreground stroke-1" />
              <input
                type="text"
                placeholder="Search commands, ask AI, navigate..."
                value={paletteSearch}
                onChange={e => {
                  setPaletteSearch(e.target.value)
                  setActiveCmdIdx(0)
                }}
                onKeyDown={handlePaletteKeyDown}
                className="w-full h-full bg-transparent border-0 text-xs focus:outline-none placeholder-muted-foreground text-foreground"
                autoFocus
              />
              <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono font-bold select-none uppercase">ESC</span>
              <button onClick={() => { setShowPalette(false); setPaletteSearch(""); }} className="p-1 rounded hover:bg-muted/30">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
              {/* Recent Searches (only when search is empty) */}
              {!paletteSearch && recentSearches.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-1">Recent Searches</div>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPaletteSearch(s)
                          // Trigger search directly or let them edit
                        }}
                        className="px-2.5 py-1 rounded bg-secondary/60 hover:bg-secondary border border-border text-[10px] font-semibold text-foreground hover:text-primary transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Commands List */}
              <div className="space-y-1">
                {paletteSearch && (
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-1 mb-1.5">Search Results</div>
                )}
                {!paletteSearch && (
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-1 mb-1.5">Shortcuts & Navigation</div>
                )}
                
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">No matching command shortcuts found.</div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const CmdIcon = cmd.icon
                    const isActive = idx === activeCmdIdx
                    return (
                      <button
                        key={idx}
                        onClick={() => executeCommand(cmd)}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded transition-all text-left group",
                          isActive
                            ? "bg-primary/10 border-l-2 border-primary text-foreground shadow-sm"
                            : "hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "flex h-7 w-7 items-center justify-center rounded transition-all",
                            isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-primary"
                          )}>
                            <CmdIcon className="h-4 w-4 stroke-1.5" />
                          </div>
                          <div>
                            <span className={cn("font-bold block", isActive ? "text-foreground" : "text-foreground/90")}>
                              {highlightText(cmd.name, paletteSearch)}
                            </span>
                            <span className="text-[9px] text-muted-foreground/80 font-semibold uppercase">{cmd.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isActive && <span className="text-[8px] font-bold font-mono text-muted-foreground/60 select-none bg-muted px-1 py-0.5 rounded">↵ ENTER</span>}
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 2. FLOATING AI ASSISTANT CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Chat Window Card */}
        {showChat && (
          <div className="w-80 md:w-96 h-[400px] glass-panel border border-border shadow-2xl rounded-lg mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="h-12 border-b border-border/40 bg-card/65 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ai animate-pulse" />
                <span className="font-bold text-xs">AI Sales Copilot assistant</span>
              </div>
              <button onClick={() => setShowChat(false)} className="p-1 rounded hover:bg-muted/30">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[11px] leading-relaxed">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="h-6 w-6 rounded bg-ai/10 text-ai flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className={cn(
                    "p-2.5 rounded-lg max-w-[80%]",
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/20 border border-border/40 text-foreground"
                  )}>
                    {msg.text || (
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-ai animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-ai animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-ai animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <UserIcon className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="h-6 w-6 rounded bg-ai/10 text-ai flex items-center justify-center shrink-0">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Suggestions */}
            <div className="px-3 py-1.5 bg-secondary/35 border-t border-border/30 overflow-x-auto flex gap-1.5 shrink-0 select-none no-scrollbar">
              <button
                type="button"
                onClick={() => quickQuery("Score AeroSpace risks")}
                className="px-2 py-1 rounded-full border border-border bg-card hover:bg-muted text-[9px] font-semibold text-muted-foreground whitespace-nowrap"
              >
                AeroSpace risks
              </button>
              <button
                type="button"
                onClick={() => quickQuery("What is the mitigation for Nova?")}
                className="px-2 py-1 rounded-full border border-border bg-card hover:bg-muted text-[9px] font-semibold text-muted-foreground whitespace-nowrap"
              >
                Nova mitigations
              </button>
              <button
                type="button"
                onClick={() => quickQuery("Find high risk deals")}
                className="px-2 py-1 rounded-full border border-border bg-card hover:bg-muted text-[9px] font-semibold text-muted-foreground whitespace-nowrap"
              >
                High risk deals
              </button>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-border/40 bg-card/45 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Ask Sales Copilot..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 text-xs focus:outline-none dark:bg-black/20"
              />
              <button type="submit" className="h-9 w-9 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center shrink-0">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Bubble Button Toggle */}
        <button
          onClick={() => setShowChat(prev => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-ai text-white shadow-lg hover:shadow-glow/20 shadow-glow/15 transition-all transform hover:scale-105"
        >
          {showChat ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5 animate-pulse" />}
        </button>
      </div>

      {/* 3. PREMIUM HACKATHON SPLASH SCREEN LOADER */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070e] text-white select-none animate-out fade-out duration-500 delay-[2000ms] fill-mode-forwards">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-ai/10 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md px-6">
            {/* Logo Pulse Icon */}
            <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-ai text-white shadow-2xl shadow-primary/20 border border-white/10 animate-bounce">
              <Sparkles className="h-10 w-10 animate-pulse" />
              {/* Outer pulsing ring */}
              <div className="absolute -inset-2 rounded-2xl border border-primary/20 animate-ping opacity-75" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                EXECUTIVE AI OS
              </h1>
              <p className="font-mono text-[10px] text-ai uppercase tracking-widest font-bold h-4">
                {splashText}
                <span className="inline-block w-1 h-3 bg-ai ml-1 animate-caret"></span>
              </p>
            </div>

            {/* Simulated loader bar */}
            <div className="w-48 bg-white/5 border border-white/5 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-ai animate-[loader_2.2s_ease-out_infinite]" />
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes loader {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          ` }} />
        </div>
      )}
    </div>
  )
}
