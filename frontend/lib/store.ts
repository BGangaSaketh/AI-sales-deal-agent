import { create } from "zustand"

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  is_read: boolean
  type: 'Risk' | 'Recommendation' | 'Meeting' | 'System'
  created_at: string
}

export interface Customer {
  id: string
  name: string
  industry: string
  size: string
  website: string
  email: string
  phone: string
  salesRep: string
  status: 'Active' | 'Lead' | 'Inactive'
  tags: string[]
  notes: string[]
  created_at: string
}

export interface Deal {
  id: string
  name: string
  customer: string      // Customer/Account Name
  customerId: string    // References Customer.id
  value: number
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'
  closeDate: string     // YYYY-MM-DD
  priority: 'High' | 'Medium' | 'Low'
  probability: number   // 0 - 100
  salesperson: string
  notes: string
  status: 'Active' | 'Won' | 'Lost'
  health: number        // 0 - 100
  riskCount: number
  recCount: number
}

export interface Meeting {
  id: string
  title: string
  customer: string
  customerId: string
  deal: string
  dealId: string
  date: string          // YYYY-MM-DD
  time: string          // HH:MM
  type: 'Video' | 'Onsite' | 'Call'
  attendees: string[]
  duration: string      // e.g. "45 mins"
  notes: string
  status: 'Scheduled' | 'Completed' | 'Cancelled'
  hasTranscript: boolean
  summary?: string
  transcriptText?: string
}

export interface TaskItem {
  id: string
  title: string
  due_date: string      // YYYY-MM-DD
  completed: boolean
  priority: 'High' | 'Medium' | 'Low'
}

export interface ActivityItem {
  id: string
  type: 'Customer' | 'Deal' | 'Meeting' | 'Stage' | 'System'
  title: string
  description: string
  time: string          // e.g. "2h ago" or ISO
}

export interface Objection {
  id: string
  meetingId: string
  dealId: string
  category: 'Pricing' | 'Security' | 'Timeline' | 'Technical' | 'Support' | 'Compliance' | 'Budget'
  objectionText: string
  suggestedResponse: string
  followUpRecommendation: string
  status: 'Open' | 'Resolved'
  created_at: string
}

export interface DealIntelligence {
  dealId: string
  winProbability: number
  dealHealth: number
  riskLevel: 'High' | 'Medium' | 'Low'
  aiConfidence: number
  customerEngagementScore: number
  decisionMakerStatus: string
  budgetStatus: string
  lastInteraction: string
  upcomingAction: string
  dealSummary: string
  factors: string[]
  // Phase 3 Extended Risk features
  riskScore: number
  riskReasons: string[]
  riskTimeline: { date: string; factor: string; score: number }[]
  mitigationStrategy: string
  sentimentTrend: string[]
  responseDelay: string
  meetingFrequency: string
  competitorMentions: string[]
}

export interface CoachingLog {
  meetingId: string
  dealId: string
  suggestedResponses: { objection: string; rebuttal: string }[]
  negotiationTips: string[]
  salesStrategy: string
  missedOpportunities: string[]
  questionsToAsk: string[]
  engagementAnalysis: string
  confidenceScore: number
  coachingTips: string[]
}

export interface GeneratedEmail {
  subject: string
  body: string
  callToAction: string
  suggestedSendDate: string
}

export interface CompetitorIntel {
  competitorName: string
  strengths: string[]
  weaknesses: string[]
  talkingPoints: string[]
  differentiators: string[]
  comparisonSummary: string
}

export interface AgentExecutionLog {
  agentId: string
  agentName: string
  taskDescription: string
  status: 'Idle' | 'Running' | 'Succeeded' | 'Failed'
  executionLogs: string[]
  finalOutput: Record<string, any>
  updatedAt: string
}

interface AppState {
  user: User | null
  theme: "light" | "dark"
  sidebarOpen: boolean
  notifications: NotificationItem[]
  customers: Customer[]
  deals: Deal[]
  meetings: Meeting[]
  tasks: TaskItem[]
  activities: ActivityItem[]
  objections: Objection[]
  dealIntelligence: Record<string, DealIntelligence>
  
  // Phase 3 Extensions
  coachingLogs: Record<string, CoachingLog>
  generatedEmails: Record<string, Record<string, GeneratedEmail>>
  competitorsIntel: Record<string, CompetitorIntel[]>
  agentLogs: Record<string, AgentExecutionLog>
  pinnedCustomerIds: string[]
  
  // AI Processing status
  processingMeetingId: string | null
  processingStep: number // 0 to 6
  processingStatusText: string

  // Auth & UI Toggles
  login: (user: User) => void
  logout: () => void
  setTheme: (theme: "light" | "dark") => void
  toggleTheme: () => void
  toggleSidebar: () => void
  
  // Notification actions
  addNotification: (notification: Omit<NotificationItem, "id" | "created_at" | "is_read">) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  
  // Customer CRM actions
  addCustomer: (customer: Omit<Customer, "id" | "created_at">) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  togglePinCustomer: (id: string) => void
  
  // Deal CRM actions
  addDeal: (deal: Omit<Deal, "id" | "health" | "riskCount" | "recCount">) => void
  updateDeal: (id: string, deal: Partial<Deal>) => void
  deleteDeal: (id: string) => void
  moveDealStage: (id: string, stage: Deal['stage']) => void
  
  // Meeting CRM actions
  addMeeting: (meeting: Omit<Meeting, "id" | "hasTranscript">) => void
  updateMeeting: (id: string, meeting: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void
  
  // Task actions
  addTask: (task: Omit<TaskItem, "id" | "completed">) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void

  // Activity actions
  addActivity: (activity: Omit<ActivityItem, "id" | "time">) => void

  // AI Actions
  processMeetingAI: (meetingId: string, isAudio: boolean, textContent?: string) => Promise<void>
  resetDemoPipeline: () => void
  loadPremiumDataset: () => void
}

// Initial mock data definitions
const initialCustomers: Customer[] = [
  {
    id: "c1",
    name: "AeroSpace Corp",
    industry: "Aerospace & Defense",
    size: "10,000+",
    website: "https://aerospacecorp.com",
    email: "procurement@aerospacecorp.com",
    phone: "+1 (555) 019-2831",
    salesRep: "Alexander Sterling",
    status: "Active",
    tags: ["Enterprise", "Multi-year"],
    notes: ["Strong preference for SLA support.", "Discussing flight metric latency next session."],
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "c2",
    name: "Nova Retail Services",
    industry: "Retail & E-commerce",
    size: "500-1000",
    website: "https://novaretail.io",
    email: "contact@novaretail.io",
    phone: "+1 (555) 902-1144",
    salesRep: "Sarah Jenkins",
    status: "Lead",
    tags: ["Magento-Migrate", "Mid-Market"],
    notes: ["Migrating checkout endpoints to modern stack.", "Budget validation expected mid-July."],
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "c3",
    name: "Apex Financials",
    industry: "Banking & Finance",
    size: "5,000-10,000",
    website: "https://apexfinancial.com",
    email: "security-leads@apexfinancial.com",
    phone: "+1 (555) 234-9099",
    salesRep: "Alexander Sterling",
    status: "Active",
    tags: ["Strategic", "Finance"],
    notes: ["Strict data sovereignty guidelines apply.", "Evaluating Databricks integrations."],
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  }
]

const initialDeals: Deal[] = [
  {
    id: "d1",
    name: "AeroSpace Tech Enterprise Sync",
    customer: "AeroSpace Corp",
    customerId: "c1",
    value: 750000,
    stage: "Negotiation",
    closeDate: "2026-08-15",
    priority: "High",
    probability: 80,
    salesperson: "Alexander Sterling",
    notes: "Reviewing SLA contract clause and licensing fees.",
    status: "Active",
    health: 85,
    riskCount: 1,
    recCount: 2
  },
  {
    id: "d2",
    name: "Nova Commerce Scaleout Bundle",
    customer: "Nova Retail Services",
    customerId: "c2",
    value: 250000,
    stage: "Qualified",
    closeDate: "2026-10-01",
    priority: "Medium",
    probability: 40,
    salesperson: "Sarah Jenkins",
    notes: "Migrating from Magento checkout setup.",
    status: "Active",
    health: 60,
    riskCount: 3,
    recCount: 1
  },
  {
    id: "d3",
    name: "Apex Finance Global Contract",
    customer: "Apex Financials",
    customerId: "c3",
    value: 2400000,
    stage: "Proposal",
    closeDate: "2026-07-30",
    priority: "High",
    probability: 90,
    salesperson: "Alexander Sterling",
    notes: "Security check completed. Redline contracts sent.",
    status: "Active",
    health: 92,
    riskCount: 0,
    recCount: 4
  }
]

const initialMeetings: Meeting[] = [
  {
    id: "m1",
    title: "AeroSpace Tech Enterprise Sync",
    customer: "AeroSpace Corp",
    customerId: "c1",
    deal: "AeroSpace Tech Enterprise Sync",
    dealId: "d1",
    date: "2026-06-26",
    time: "14:00",
    type: "Video",
    attendees: ["Alexander Sterling", "Marcus Vance (AeroSpace)"],
    duration: "45 mins",
    notes: "Weekly sync meeting covering latency spikes and SLA.",
    status: "Scheduled",
    hasTranscript: false
  },
  {
    id: "m2",
    title: "Initial Demo & Scope Alignment",
    customer: "Nova Retail Services",
    customerId: "c2",
    deal: "Nova Commerce Scaleout Bundle",
    dealId: "d2",
    date: "2026-06-25",
    time: "10:00",
    type: "Video",
    attendees: ["Sarah Jenkins", "Emily Taylor (Nova)"],
    duration: "30 mins",
    notes: "Demo of SDK checkout integrations and migration timelines.",
    status: "Completed",
    hasTranscript: true,
    summary: "Nova is migrating from Magento to Shopify Plus or custom SaaS. Major pain points include checkout latency and currency conversion. Budget is approved but needs senior procurement signoff."
  },
  {
    id: "m3",
    title: "Executive Partnership Agreement",
    customer: "Apex Financials",
    customerId: "c3",
    deal: "Apex Finance Global Contract",
    dealId: "d3",
    date: "2026-06-24",
    time: "16:30",
    type: "Onsite",
    attendees: ["Alexander Sterling", "Donald Draper (Apex)", "Roger Sterling (Apex)"],
    duration: "60 mins",
    notes: "In-person contract redlining at Apex corporate office.",
    status: "Completed",
    hasTranscript: true,
    summary: "Final alignment on enterprise licensing terms. Security review complete. Contrast sent to legal for review."
  }
]

const initialTasks: TaskItem[] = [
  { id: "t1", title: "Submit security questionnaire to Apex Financials", due_date: "2026-06-27", completed: false, priority: "High" },
  { id: "t2", title: "Draft custom checkout SLA for AeroSpace Corp", due_date: "2026-06-28", completed: false, priority: "High" },
  { id: "t3", title: "Follow up with Emily Taylor (Nova Retail)", due_date: "2026-06-29", completed: true, priority: "Medium" }
]

const initialActivities: ActivityItem[] = [
  { id: "a_init1", type: "Customer", title: "Customer Account Created", description: "Nova Retail Services was added by Sarah Jenkins.", time: "2 days ago" },
  { id: "a_init2", type: "Meeting", title: "Initial Demo Completed", description: "Sync completed with Nova Retail Services.", time: "Yesterday" },
  { id: "a_init3", type: "Deal", title: "Pipeline Deal Updated", description: "AeroSpace Tech Enterprise Sync deal moved to Negotiation stage.", time: "Today" }
]

const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Critical Deal Risk Detected",
    message: "No technical decision maker identified for AeroSpace Corp deal.",
    is_read: false,
    type: "Risk",
    created_at: new Date().toISOString()
  },
  {
    id: "n2",
    title: "Deal Intelligence Recommendation",
    message: "Consider scheduling a pricing alignment call with Nova Retail Services.",
    is_read: false,
    type: "Recommendation",
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
]

const initialObjections: Objection[] = [
  {
    id: "obj1",
    meetingId: "m2",
    dealId: "d2",
    category: "Technical",
    objectionText: "Magento legacy checkout endpoints latency was causing cart abandonment.",
    suggestedResponse: "Demo the local headless TypeScript API SDK speeds which index checkouts in under 150ms.",
    followUpRecommendation: "Provide benchmark tests comparisons.",
    status: "Open",
    created_at: new Date().toISOString()
  }
]

const initialDealIntelligence: Record<string, DealIntelligence> = {
  "d1": {
    dealId: "d1",
    winProbability: 80,
    dealHealth: 85,
    riskLevel: "Medium",
    aiConfidence: 90,
    customerEngagementScore: 85,
    decisionMakerStatus: "Marcus Vance (Director of Engineering) identified",
    budgetStatus: "Approved by finance leads",
    lastInteraction: "Weekly sync meeting completing SLA check",
    upcomingAction: "Technical validation sync with CTO's office",
    dealSummary: "AeroSpace wants to migrate reporting ingestion to speed metrics. They have budget approval but require CTO clearance on dedicated API pipelines.",
    factors: ["Sponsor identified", "checkout latency concerns", "15% budget stretch query"],
    riskScore: 25,
    riskReasons: ["CTO architecture validation check is still outstanding."],
    riskTimeline: [
      { date: "2026-06-15", factor: "Opportunity Qualified", score: 10 },
      { date: "2026-06-26", factor: "Friction checks active", score: 25 }
    ],
    mitigationStrategy: "Schedule validation deep dive with CTO's team. Present latency performance speed logs.",
    sentimentTrend: ["Neutral-Positive", "Positive"],
    responseDelay: "Under 2 hours",
    meetingFrequency: "Weekly",
    competitorMentions: ["Magento"]
  },
  "d2": {
    dealId: "d2",
    winProbability: 40,
    dealHealth: 60,
    riskLevel: "High",
    aiConfidence: 75,
    customerEngagementScore: 65,
    decisionMakerStatus: "Emily Taylor identified, Procurement review pending",
    budgetStatus: "Pending validation guidelines",
    lastInteraction: "Demo presentation of storefront migrations",
    upcomingAction: "Deliver cost-savings amortization comparison chart",
    dealSummary: "Nova is migrating their legacy Magento stack to modern SaaS headless storefronts. Need cost projections before procurement signoff.",
    factors: ["Magento contract deadline", "procurement review delays", "budget guidance friction"],
    riskScore: 65,
    riskReasons: [
      "Budget approval pending validation guidelines.",
      "Procurement timeline delays.",
      "Competition from Shopify Plus detected."
    ],
    riskTimeline: [
      { date: "2026-06-10", factor: "Initial inquiry", score: 30 },
      { date: "2026-06-25", factor: "Budget guidelines check delay", score: 65 }
    ],
    mitigationStrategy: "Draft custom checkout SLA terms. Deliver storefront savings ROI analysis chart. Address Shopify comparison talking points.",
    sentimentTrend: ["Neutral", "Neutral"],
    responseDelay: "Over 24 hours",
    meetingFrequency: "Bi-weekly",
    competitorMentions: ["Shopify Plus"]
  }
}

const initialCoachingLogs: Record<string, CoachingLog> = {
  "m2": {
    meetingId: "m2",
    dealId: "d2",
    suggestedResponses: [
      { objection: "Magento checkout latency delays storefront response.", rebuttal: "Demonstrate local headless TypeScript API performance metrics showing average speeds below 150ms." }
    ],
    negotiationTips: [
      "Show storefront optimization ROI metrics showing checkout cart abandonment reduction of 22%.",
      "Offer pilot deployment discount terms to fast-track validation timelines."
    ],
    salesStrategy: "Validate migration scope immediately with PM Emily Taylor before submitting cost breakdowns to procurement leads.",
    missedOpportunities: [
      "Did not query legacy Magento contract termination schedule window details.",
      "Did not outline data residency and sovereignty requirements limits."
    ],
    questionsToAsk: [
      "Who will lead storefront frontend API validations on Nova's engineering team?",
      "When is the target checkout launch milestone deadline?"
    ],
    engagementAnalysis: "Sponsor was highly engaged, outlining internal timelines clearly, but showed caution concerning migration downtime risks.",
    confidenceScore: 78,
    coachingTips: [
      "Highlight data migration security safeguards immediately in follow-up exchanges.",
      "Offer dedicated engineering migration office hours to assist developers."
    ]
  }
}

const initialGeneratedEmails: Record<string, Record<string, GeneratedEmail>> = {
  "m2": {
    "Follow-up": {
      subject: "Nova Retail storefront migration - Next steps recap",
      body: "Hi Emily,<br/><br/>Thank you for the productive discussion yesterday. I've compiled the storefront migration SLA redlines we reviewed.<br/><br/>As discussed, our technical leads will send over the headless storefront SDK benchmarks next Monday.<br/><br/>Best,<br/>[Your Name]",
      callToAction: "Verify storefront SDK benchmark details",
      suggestedSendDate: "2026-06-26"
    },
    "Thank You": {
      subject: "Thank you for the sync session, Emily!",
      body: "Hi Emily,<br/><br/>Quick thank you for the walkthrough of Nova's legacy Magento checkout flows. Looking forward to our next steps.<br/><br/>Regards,<br/>[Your Name]",
      callToAction: "No action required",
      suggestedSendDate: "2026-06-25"
    }
  }
}

const initialCompetitorsIntel: Record<string, CompetitorIntel[]> = {
  "d2": [
    {
      competitorName: "Shopify Plus",
      strengths: [
        "Faster initial theme deployment timelines.",
        "Large pre-existing storefront plugin ecosystem."
      ],
      weaknesses: [
        "Transaction fee penalties on external gateway transactions.",
        "Limited custom database schema configuration scopes."
      ],
      talkingPoints: [
        "Nova's custom CRM databases will experience latency synchronization checks under Shopify standard APIs.",
        "Show external payment checkout fees overhead calculations."
      ],
      differentiators: [
        "Headless API pipeline provides zero transaction-fee checkouts.",
        "Guarantees direct, low-latency database connectivity structures."
      ],
      comparisonSummary: "Shopify Plus offers simple setups but introduces transaction friction and rigid configurations that restrict Nova's custom CRM endpoints."
    }
  ]
}

const initialAgentLogs: Record<string, AgentExecutionLog> = {
  "meeting_agent": {
    agentId: "meeting_agent",
    agentName: "Meeting Intelligence Agent",
    taskDescription: "Extract summaries, sentiment labels, keywords, and highlights.",
    status: "Succeeded",
    executionLogs: ["Idle", "Reading raw logs files...", "Synthesizing meeting insights...", "Succeeded"],
    finalOutput: { summary: "Magento checkout latency bottlenecks sync briefings." },
    updatedAt: new Date().toISOString()
  },
  "memory_agent": {
    agentId: "memory_agent",
    agentName: "Customer Memory Agent",
    taskDescription: "Update persistent customer profile memory logs.",
    status: "Succeeded",
    executionLogs: ["Idle", "Retrieving historical notes...", "Syncing profile updates...", "Succeeded"],
    finalOutput: { painPoints: "Magento checkout latency causing cart abandonments." },
    updatedAt: new Date().toISOString()
  }
}

// Client-side local persistence utilities
const getLocalStorageItem = (key: string, defaultValue: any) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return defaultValue
      }
    }
  }
  return defaultValue
}

const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const useAppStore = create<AppState>((set) => ({
  user: getLocalStorageItem("auth_user", null),
  theme: getLocalStorageItem("theme", "light"),
  sidebarOpen: true,
  notifications: getLocalStorageItem("notifications", mockNotifications),
  customers: getLocalStorageItem("customers", initialCustomers),
  deals: getLocalStorageItem("deals", initialDeals),
  meetings: getLocalStorageItem("meetings", initialMeetings),
  tasks: getLocalStorageItem("tasks", initialTasks),
  activities: getLocalStorageItem("activities", initialActivities),
  objections: getLocalStorageItem("objections", initialObjections),
  dealIntelligence: getLocalStorageItem("dealIntelligence", initialDealIntelligence),
  coachingLogs: getLocalStorageItem("coachingLogs", initialCoachingLogs),
  generatedEmails: getLocalStorageItem("generatedEmails", initialGeneratedEmails),
  competitorsIntel: getLocalStorageItem("competitorsIntel", initialCompetitorsIntel),
  agentLogs: getLocalStorageItem("agentLogs", initialAgentLogs),
  pinnedCustomerIds: getLocalStorageItem("pinnedCustomerIds", ["c1"]),
  
  processingMeetingId: null,
  processingStep: 0,
  processingStatusText: "",

  login: (user) => {
    saveToLocalStorage("auth_user", user)
    set({ user })
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
    }
    set({ user: null })
  },
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
    }
    saveToLocalStorage("theme", theme)
    set({ theme })
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light"
      if (typeof window !== "undefined") {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(nextTheme)
      }
      saveToLocalStorage("theme", nextTheme)
      return { theme: nextTheme }
    }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addNotification: (notification) =>
    set((state) => {
      const updated = [
        {
          ...notification,
          id: `n-${Date.now()}`,
          is_read: false,
          created_at: new Date().toISOString()
        },
        ...state.notifications
      ]
      saveToLocalStorage("notifications", updated)
      return { notifications: updated }
    }),
  markNotificationAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
      saveToLocalStorage("notifications", updated)
      return { notifications: updated }
    }),
  markAllNotificationsAsRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, is_read: true }))
      saveToLocalStorage("notifications", updated)
      return { notifications: updated }
    }),

  // Customer Actions
  addCustomer: (customer) =>
    set((state) => {
      const newCust: Customer = {
        ...customer,
        id: `c-${Date.now()}`,
        created_at: new Date().toISOString()
      }
      const updated = [newCust, ...state.customers]
      saveToLocalStorage("customers", updated)

      // Add to timeline activity
      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Customer",
        title: "Customer Added",
        description: `${customer.name} was added by ${state.user?.full_name || "Sales Rep"}.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      return { customers: updated, activities: updatedActivities }
    }),
  updateCustomer: (id, customerData) =>
    set((state) => {
      const updated = state.customers.map((c) =>
        c.id === id ? { ...c, ...customerData } : c
      )
      saveToLocalStorage("customers", updated)
      return { customers: updated }
    }),
  deleteCustomer: (id) =>
    set((state) => {
      const target = state.customers.find((c) => c.id === id)
      const updated = state.customers.filter((c) => c.id !== id)
      saveToLocalStorage("customers", updated)

      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Customer",
        title: "Customer Deleted",
        description: `${target?.name || "Customer"} was deleted from workspace.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      return { customers: updated, activities: updatedActivities }
    }),

  // Deal Actions
  addDeal: (deal) =>
    set((state) => {
      const newDeal: Deal = {
        ...deal,
        id: `d-${Date.now()}`,
        health: 75,
        riskCount: 0,
        recCount: 0
      }
      const updated = [newDeal, ...state.deals]
      saveToLocalStorage("deals", updated)

      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Deal",
        title: "New Deal Created",
        description: `${deal.name} for ${deal.customer} added at $${deal.value.toLocaleString()}.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      return { deals: updated, activities: updatedActivities }
    }),
  updateDeal: (id, dealData) =>
    set((state) => {
      const updated = state.deals.map((d) =>
        d.id === id ? { ...d, ...dealData } : d
      )
      saveToLocalStorage("deals", updated)
      return { deals: updated }
    }),
  deleteDeal: (id) =>
    set((state) => {
      const target = state.deals.find((d) => d.id === id)
      const updated = state.deals.filter((d) => d.id !== id)
      saveToLocalStorage("deals", updated)

      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Deal",
        title: "Deal Removed",
        description: `${target?.name || "Deal"} opportunity deleted.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      return { deals: updated, activities: updatedActivities }
    }),
  moveDealStage: (id, stage) =>
    set((state) => {
      const updated = state.deals.map((d) =>
        d.id === id ? { ...d, stage, status: (stage === "Won" ? "Won" : stage === "Lost" ? "Lost" : "Active") as any } : d
      )
      saveToLocalStorage("deals", updated)

      const target = state.deals.find((d) => d.id === id)
      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Stage",
        title: "Deal Stage Progression",
        description: `Opportunity ${target?.name || "Deal"} shifted to ${stage}.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      return { deals: updated, activities: updatedActivities }
    }),

  // Meeting Actions
  addMeeting: (meeting) =>
    set((state) => {
      const newMeet: Meeting = {
        ...meeting,
        id: `m-${Date.now()}`,
        hasTranscript: false
      }
      const updated = [newMeet, ...state.meetings]
      saveToLocalStorage("meetings", updated)

      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Meeting",
        title: "Meeting Scheduled",
        description: `Exchange scheduled: ${meeting.title} with ${meeting.customer}.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      return { meetings: updated, activities: updatedActivities }
    }),
  updateMeeting: (id, meetingData) =>
    set((state) => {
      const updated = state.meetings.map((m) =>
        m.id === id ? { ...m, ...meetingData } : m
      )
      saveToLocalStorage("meetings", updated)
      return { meetings: updated }
    }),
  deleteMeeting: (id) =>
    set((state) => {
      const target = state.meetings.find((m) => m.id === id)
      const updated = state.meetings.filter((m) => m.id !== id)
      saveToLocalStorage("meetings", updated)

      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Meeting",
        title: "Meeting Cancelled",
        description: `${target?.title || "Meeting"} was removed from calendar.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      return { meetings: updated, activities: updatedActivities }
    }),

  // Task Actions
  addTask: (task) =>
    set((state) => {
      const newTask: TaskItem = {
        ...task,
        id: `t-${Date.now()}`,
        completed: false
      }
      const updated = [...state.tasks, newTask]
      saveToLocalStorage("tasks", updated)
      return { tasks: updated }
    }),
  toggleTask: (id) =>
    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
      saveToLocalStorage("tasks", updated)
      return { tasks: updated }
    }),
  deleteTask: (id) =>
    set((state) => {
      const updated = state.tasks.filter((t) => t.id !== id)
      saveToLocalStorage("tasks", updated)
      return { tasks: updated }
    }),

  addActivity: (activity) =>
    set((state) => {
      const newAct: ActivityItem = {
        ...activity,
        id: `a-${Date.now()}`,
        time: new Date().toISOString()
      }
      const updated = [newAct, ...state.activities]
      saveToLocalStorage("activities", updated)
      return { activities: updated }
    }),

  togglePinCustomer: (id) =>
    set((state) => {
      const pinned = state.pinnedCustomerIds.includes(id)
        ? state.pinnedCustomerIds.filter((cid) => cid !== id)
        : [...state.pinnedCustomerIds, id]
      saveToLocalStorage("pinnedCustomerIds", pinned)
      return { pinnedCustomerIds: pinned }
    }),

  // CASCADEFLOW AI WORKFLOW RUNNER (Transcribe -> Summarize -> Memory -> Objections -> Recommendations -> Dashboard)
  processMeetingAI: async (meetingId, isAudio, textContent) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    
    // Clear and set running status for Meeting Agent
    const startAgentLogs: Record<string, AgentExecutionLog> = {
      meeting_agent: {
        agentId: "meeting_agent",
        agentName: "Meeting Intelligence Agent",
        taskDescription: "Extract summaries, sentiment labels, keywords, and highlights.",
        status: "Running",
        executionLogs: ["Initializing connection...", "Scanning sync transcript text...", "Extracting briefing metadata..."],
        finalOutput: {},
        updatedAt: new Date().toISOString()
      },
      memory_agent: {
        agentId: "memory_agent",
        agentName: "Customer Memory Agent",
        taskDescription: "Analyze and capture persistent customer budget and friction details.",
        status: "Idle",
        executionLogs: ["Idle"],
        finalOutput: {},
        updatedAt: new Date().toISOString()
      },
      competitor_agent: {
        agentId: "competitor_agent",
        agentName: "SWOT Competitor Agent",
        taskDescription: "Detect competitor product mentions and build defensive SWOT talking points.",
        status: "Idle",
        executionLogs: ["Idle"],
        finalOutput: {},
        updatedAt: new Date().toISOString()
      },
      risk_agent: {
        agentId: "risk_agent",
        agentName: "Forecast Risk Agent",
        taskDescription: "Perform health calculations, response delay metrics, and score win rates.",
        status: "Idle",
        executionLogs: ["Idle"],
        finalOutput: {},
        updatedAt: new Date().toISOString()
      },
      email_agent: {
        agentId: "email_agent",
        agentName: "Personalized Copywriter Agent",
        taskDescription: "Synthesize ready-to-send email drafts matching customer language style.",
        status: "Idle",
        executionLogs: ["Idle"],
        finalOutput: {},
        updatedAt: new Date().toISOString()
      },
      analytics_agent: {
        agentId: "analytics_agent",
        agentName: "Executive Analytics Agent",
        taskDescription: "Re-calculate revenue forecasts, stage progression curves, and lost metrics.",
        status: "Idle",
        executionLogs: ["Idle"],
        finalOutput: {},
        updatedAt: new Date().toISOString()
      }
    }
    
    set({
      processingMeetingId: meetingId,
      processingStep: 1,
      processingStatusText: isAudio ? "Transcribing audio with OpenAI Whisper..." : "Loading uploaded transcript...",
      agentLogs: startAgentLogs
    })
    saveToLocalStorage("agentLogs", startAgentLogs)
    await sleep(2000)

    const transcript = textContent || (
      "Marcus Vance (AeroSpace Corp): Hi Alexander, thanks for jumping on. We've been reviewing the " +
      "licensing proposal. The primary bottleneck we're experiencing is cart latency checkout spikes during batch ingestion. " +
      "We're seeing latencies above 800ms which is delaying our flight boarding reporting metrics. " +
      "Alexander Sterling: That makes sense. We can optimize the batch pipelines. Have you discussed this with your CTO? " +
      "Marcus Vance: Not yet. We need technical validation from the CTO's office. However, we're very interested in moving " +
      "forward if we can fix this. Pricing-wise, we're a bit over budget by 15%, but we can probably clear that " +
      "if the SLA terms are solid and checkouts are fast."
    )

    // STT Meeting Agent succeeds
    const meetingLogs = { ...useAppStore.getState().agentLogs }
    meetingLogs.meeting_agent.status = "Succeeded"
    meetingLogs.meeting_agent.executionLogs.push("Successfully parsed transcript.")
    meetingLogs.meeting_agent.finalOutput = {
      summary: "Sync covering latency checks. AeroSpace expressed concerns on cart checkout delays.",
      sentiment: "Neutral-Positive"
    }
    // Memory Agent starts running
    meetingLogs.memory_agent.status = "Running"
    meetingLogs.memory_agent.executionLogs = ["Comparing historical values...", "Extracting target budget updates...", "Syncing profile vaults..."]

    set({
      processingStep: 2,
      processingStatusText: "Running Customer Memory Agent...",
      agentLogs: meetingLogs
    })
    saveToLocalStorage("agentLogs", meetingLogs)
    await sleep(2000)
    
    const summary = "AeroSpace sync briefing. Key pain points identified: 800ms ingestion latencies. Budget is tight (15% over target) but buying signals exist if technical checklist is validated."

    // Memory Agent succeeds, Competitor Agent starts running
    const memoryLogs = { ...useAppStore.getState().agentLogs }
    memoryLogs.memory_agent.status = "Succeeded"
    memoryLogs.memory_agent.executionLogs.push("Successfully updated Hindsight memory values.")
    memoryLogs.memory_agent.finalOutput = {
      painPoints: "Latency spikes (800ms) during flight boarding",
      budget: "Friction (15% over limits)"
    }
    memoryLogs.competitor_agent.status = "Running"
    memoryLogs.competitor_agent.executionLogs = ["Scanning for competitor key terms...", "Extracting comparison differentiators..."]

    set({
      processingStep: 3,
      processingStatusText: "Detecting Customer Objections & SWOT Competitors...",
      agentLogs: memoryLogs
    })
    saveToLocalStorage("agentLogs", memoryLogs)
    await sleep(2000)
    
    // Add dynamic objection to state
    const targetMeeting = useAppStore.getState().meetings.find(m => m.id === meetingId)
    const dealId = targetMeeting ? targetMeeting.dealId : "d1"
    const customerId = targetMeeting ? targetMeeting.customerId : "c1"
    const objectionId = `obj-${Date.now()}`
    
    const newObjection: Objection = {
      id: objectionId,
      meetingId,
      dealId,
      category: "Technical",
      objectionText: "Batch ingestion checkout latencies above 800ms are delaying boarding reporting metrics.",
      suggestedResponse: "Offer our Phase 2 backend engine trial which guarantees latencies below 150ms through pre-indexing layers.",
      followUpRecommendation: "Email load test benchmarks.",
      status: "Open",
      created_at: new Date().toISOString()
    }

    const newCompetitors: CompetitorIntel[] = [
      {
        competitorName: "Magento Enterprise",
        strengths: ["Pre-existing database reporting layers", "No migration required initially"],
        weaknesses: ["Synchronous thread queuing causing 800ms locks", "High infrastructure scale overhead"],
        talkingPoints: [
          "Explain how Magento locks database access during large ingestion batches.",
          "Compare their synchronous model with our asynchronous headless ingestion speed."
        ],
        differentiators: [
          "Guarantees checkout execution under 150ms.",
          "Decoupled headless structure prevents lock collisions."
        ],
        comparisonSummary: "Magento represents the legacy bottleneck. Transitioning to custom headless APIs resolves the ingestion latency completely."
      }
    ]
    
    set((state) => {
      const updatedObjections = [newObjection, ...state.objections]
      const updatedComps = { ...state.competitorsIntel, [dealId]: newCompetitors }
      saveToLocalStorage("objections", updatedObjections)
      saveToLocalStorage("competitorsIntel", updatedComps)
      return { objections: updatedObjections, competitorsIntel: updatedComps }
    })

    // Competitor Agent succeeds, Risk Agent starts running
    const competitorLogs = { ...useAppStore.getState().agentLogs }
    competitorLogs.competitor_agent.status = "Succeeded"
    competitorLogs.competitor_agent.executionLogs.push("Successfully compiled competitor SWOT data.")
    competitorLogs.competitor_agent.finalOutput = {
      competitorName: "Magento Enterprise",
      riskType: "Legacy Lock-in"
    }
    competitorLogs.risk_agent.status = "Running"
    competitorLogs.risk_agent.executionLogs = ["Calculating response delays...", "Estimating win/loss probability models...", "Scoring customer sentiment trend..."]

    set({
      processingStep: 4,
      processingStatusText: "Predicting Deal Risks & Mitigations...",
      agentLogs: competitorLogs
    })
    saveToLocalStorage("agentLogs", competitorLogs)
    await sleep(2000)
    
    // Update Customer Memory
    set((state) => {
      const updatedCust = state.customers.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            status: "Active" as any,
            notes: ["Pain Point: Latency spikes (800ms) on batch boarding reporting.", "Budget Friction: 15% over limit.", ...c.notes]
          }
        }
        return c
      })
      saveToLocalStorage("customers", updatedCust)
      return { customers: updatedCust }
    })

    // Risk Agent succeeds, Email Agent starts running
    const riskLogs = { ...useAppStore.getState().agentLogs }
    riskLogs.risk_agent.status = "Succeeded"
    riskLogs.risk_agent.executionLogs.push("Successfully computed deal risk indicators.")
    riskLogs.risk_agent.finalOutput = {
      dealHealth: 80,
      riskLevel: "Medium",
      winProbability: 75
    }
    riskLogs.email_agent.status = "Running"
    riskLogs.email_agent.executionLogs = ["Fetching style profile...", "Drafting follow-up recs templates...", "Structuring CTA links..."]

    // AI Coaching log
    const newCoaching: CoachingLog = {
      meetingId,
      dealId,
      suggestedResponses: [
        { objection: "Pricing is 15% above targets.", rebuttal: "Amortize implementation costs over a 3-year term licensing structure." },
        { objection: "CTO hasn't cleared integration maps.", rebuttal: "Offer a technical walkthrough deep-dive sandbox session directly with their lead architects." }
      ],
      negotiationTips: [
        "Marcus is technical. Avoid marketing jargon. Show bench-test charts.",
        "Position the 15% budget stretch as a value expansion with dedicated technical TAM support."
      ],
      salesStrategy: "Validate migration scale with engineering leads before procurement signoff to build technical urgency.",
      missedOpportunities: [
        "Did not verify specific Magento contract termination deadlines.",
        "Missed detail concerning security clearance pipelines."
      ],
      questionsToAsk: [
        "When is the next procurement steering committee meeting scheduled?",
        "Can we schedule a 15-minute quick call with your CTO next Tuesday?"
      ],
      engagementAnalysis: "Marcus was highly communicative, responding to SLA questions immediately, but showed caution regarding timeline downtime.",
      confidenceScore: 84,
      coachingTips: [
        "Always summarize action owners before concluding exchanges.",
        "Share pre-built redlines documents to speed legal reviews."
      ]
    }

    set((state) => {
      const updatedCoaching = { ...state.coachingLogs, [meetingId]: newCoaching }
      saveToLocalStorage("coachingLogs", updatedCoaching)
      return { coachingLogs: updatedCoaching }
    })

    set({
      processingStep: 5,
      processingStatusText: "Running Smart Follow-up Email Generator...",
      agentLogs: riskLogs
    })
    saveToLocalStorage("agentLogs", riskLogs)
    await sleep(2000)
    
    // Trigger notification
    const alert: NotificationItem = {
      id: `n-${Date.now()}`,
      title: "Next Best Action Formulated",
      message: "Schedule a separate technical validation sync with AeroSpace CTO's office.",
      is_read: false,
      type: "Recommendation",
      created_at: new Date().toISOString()
    }

    const emailTemplates: Record<string, GeneratedEmail> = {
      "Follow-up": {
        subject: "Recap & Technical Ingestion Next Steps - AeroSpace Corp",
        body: "Hi Marcus,<br/><br/>Thank you for your time today. Following up on our sync, I've outlined the action items we discussed:<br/>- [Your Name] to deliver cost SLA amortization tables next Monday.<br/>- AeroSpace to schedule a technical validation sync with the CTO's office.<br/><br/>Looking forward to our next steps.<br/><br/>Regards,<br/>[Your Name]",
        callToAction: "Confirm tech sync scheduling date",
        suggestedSendDate: "2026-06-27"
      },
      "Thank You": {
        subject: "Thank you for the productive briefing sync today!",
        body: "Marcus,<br/><br/>Just a quick note to say thank you for the walkthrough of AeroSpace's batch flight boarding pipelines today. Your insights were extremely valuable.<br/><br/>Best regards,<br/>[Your Name]",
        callToAction: "No action required",
        suggestedSendDate: "2026-06-26"
      },
      "Proposal": {
        subject: "Licensing Proposal & SLA Guarantees - AeroSpace Ingestion",
        body: "Marcus,<br/><br/>Attached is our licensing proposal customized to the 24/7 SLA parameters we reviewed today. Let me know if your legal team has any redlines.<br/><br/>Sincerely,<br/>[Your Name]",
        callToAction: "Submit redlines draft",
        suggestedSendDate: "2026-06-29"
      }
    }
    
    set((state) => {
      const updatedNotifs = [alert, ...state.notifications]
      const updatedEmails = { ...state.generatedEmails, [meetingId]: emailTemplates }
      saveToLocalStorage("notifications", updatedNotifs)
      saveToLocalStorage("generatedEmails", updatedEmails)
      return { notifications: updatedNotifs, generatedEmails: updatedEmails }
    })

    // Email Agent succeeds, Analytics Agent starts running
    const emailLogs = { ...useAppStore.getState().agentLogs }
    emailLogs.email_agent.status = "Succeeded"
    emailLogs.email_agent.executionLogs.push("Successfully synthesized follow-up template drafts.")
    emailLogs.email_agent.finalOutput = {
      followUpDraft: "Ready",
      thankYouDraft: "Ready"
    }
    emailLogs.analytics_agent.status = "Running"
    emailLogs.analytics_agent.executionLogs = ["Re-calculating pipeline metrics...", "Recalculating forecast timelines...", "Finalizing health distributions..."]

    set({
      processingStep: 6,
      processingStatusText: "Scoring Deal Intelligence Dashboard...",
      agentLogs: emailLogs
    })
    saveToLocalStorage("agentLogs", emailLogs)
    await sleep(2000)
    
    // Update Deal Intelligence
    const currentIntel = useAppStore.getState().dealIntelligence
    const updatedIntel = {
      ...currentIntel,
      [dealId]: {
        dealId,
        winProbability: 75,
        dealHealth: 80,
        riskLevel: "Medium" as any,
        aiConfidence: 85,
        customerEngagementScore: 90,
        decisionMakerStatus: "Marcus Vance identified (Requires CTO validation)",
        budgetStatus: "Friction (15% over target limit)",
        lastInteraction: "Audio sync debrief complete",
        upcomingAction: "Schedule validation sync with CTO's office",
        dealSummary: "AeroSpace needs database optimizations. Budget query active.",
        factors: ["CTO approval required", "checkout latency concerns", "budget friction"],
        // Phase 3 Extensions
        riskScore: 35,
        riskReasons: [
          "No technical decision maker (CTO) has signed off on integration designs.",
          "Target contract pricing is 15% above initial budget guidelines."
        ],
        riskTimeline: [
          { date: "2026-06-20", factor: "Budget friction identified", score: 20 },
          { date: "2026-06-26", factor: "CTO validation milestone pending", score: 35 }
        ],
        mitigationStrategy: "Schedule a separate, 15-minute quick technical review call with the CTO. Deliver a tailored 3-year amortized cost projection sheet to showcase long-term ROI.",
        sentimentTrend: ["Neutral", "Neutral-Positive", "Positive"],
        responseDelay: "Under 4 hours",
        meetingFrequency: "Bi-weekly",
        competitorMentions: ["Magento Enterprise"]
      }
    }
    saveToLocalStorage("dealIntelligence", updatedIntel)

    // Update Deal metrics
    set((state) => {
      const updatedDeals = state.deals.map((d) => {
        if (d.id === dealId) {
          return {
            ...d,
            health: 80,
            probability: 75,
            stage: "Negotiation" as any,
            riskCount: 2,
            recCount: 3
          }
        }
        return d
      })
      saveToLocalStorage("deals", updatedDeals)
      
      const updatedMeetings = state.meetings.map((m) => {
        if (m.id === meetingId) {
          return {
            ...m,
            status: "Completed" as any,
            hasTranscript: true,
            summary,
            transcriptText: transcript
          }
        }
        return m
      })
      saveToLocalStorage("meetings", updatedMeetings)

      // Smart CRM Autofill: Add actionable items to Tasks checklist!
      const autofillTask1: TaskItem = {
        id: `t-auto1-${Date.now()}`,
        title: "Schedule technical validation sync with AeroSpace CTO's office",
        due_date: "2026-06-29",
        completed: false,
        priority: "High"
      }
      const autofillTask2: TaskItem = {
        id: `t-auto2-${Date.now()}`,
        title: "Submit 3-year TCO amortization cost sheet to Marcus Vance",
        due_date: "2026-06-28",
        completed: false,
        priority: "Medium"
      }
      const updatedTasks = [...state.tasks, autofillTask1, autofillTask2]
      saveToLocalStorage("tasks", updatedTasks)

      // Log global activity
      const activity: ActivityItem = {
        id: `a-${Date.now()}`,
        type: "Meeting",
        title: "Exchange Processed by AI",
        description: `Meeting ${targetMeeting?.title} parsed. Memory, coaching recommendations, follow-up emails, and forecast scores updated.`,
        time: new Date().toISOString()
      }
      const updatedActivities = [activity, ...state.activities]
      saveToLocalStorage("activities", updatedActivities)

      // Finalize Analytics Agent logs
      const finalAgentLogs = { ...state.agentLogs }
      finalAgentLogs.analytics_agent.status = "Succeeded"
      finalAgentLogs.analytics_agent.executionLogs.push("Successfully recalculated sales forecasts.")
      finalAgentLogs.analytics_agent.finalOutput = {
        winProbability: 75,
        forecastInflow: "+15%"
      }
      saveToLocalStorage("agentLogs", finalAgentLogs)

      return {
        dealIntelligence: updatedIntel,
        deals: updatedDeals,
        meetings: updatedMeetings,
        tasks: updatedTasks,
        activities: updatedActivities,
        agentLogs: finalAgentLogs,
        processingMeetingId: null,
        processingStep: 0,
        processingStatusText: ""
      }
    })
  },
  resetDemoPipeline: () => {
    // Reset meeting m1
    const resetMeetings = useAppStore.getState().meetings.map(m => 
      m.id === "m1" ? { ...m, hasTranscript: false, summary: undefined, transcriptText: undefined, status: "Scheduled" as const } : m
    )
    // Clear coaching and email templates for m1
    const coaching = { ...useAppStore.getState().coachingLogs }
    delete coaching["m1"]
    const emails = { ...useAppStore.getState().generatedEmails }
    delete emails["m1"]
    
    // Reset deal d1 to original values
    const resetDeals = useAppStore.getState().deals.map(d => 
      d.id === "d1" ? { ...d, health: 85, probability: 80, stage: "Negotiation" as const, riskCount: 1, recCount: 2 } : d
    )

    // Reset dealIntelligence d1
    const resetIntel = { ...useAppStore.getState().dealIntelligence }
    if (resetIntel["d1"]) {
      resetIntel["d1"] = {
        ...resetIntel["d1"],
        dealHealth: 85,
        winProbability: 80,
        riskLevel: "Medium",
        riskScore: 25,
        riskReasons: ["CTO architecture validation check is still outstanding."],
        mitigationStrategy: "Schedule validation deep dive with CTO's team. Present latency performance speed logs."
      }
    }

    // Reset agent logs to Idle
    const idleLogs = { ...useAppStore.getState().agentLogs }
    Object.keys(idleLogs).forEach(k => {
      idleLogs[k] = {
        ...idleLogs[k],
        status: "Idle",
        executionLogs: ["Agent is idle. Ready to execute pipeline."],
        finalOutput: {}
      }
    })

    // Filter out auto-filled tasks
    const resetTasks = useAppStore.getState().tasks.filter(t => !t.id.startsWith("t-auto"))

    // Log activity
    const resetActivity: ActivityItem = {
      id: `a-reset-${Date.now()}`,
      type: "System",
      title: "AI Workflow Reset",
      description: "AI workflow database reset to pre-processed scheduled states. Ready for Whisper STT sync simulation.",
      time: new Date().toISOString()
    }
    const updatedActivities = [resetActivity, ...useAppStore.getState().activities]

    saveToLocalStorage("meetings", resetMeetings)
    saveToLocalStorage("coachingLogs", coaching)
    saveToLocalStorage("generatedEmails", emails)
    saveToLocalStorage("deals", resetDeals)
    saveToLocalStorage("dealIntelligence", resetIntel)
    saveToLocalStorage("agentLogs", idleLogs)
    saveToLocalStorage("tasks", resetTasks)
    saveToLocalStorage("activities", updatedActivities)

    set({
      meetings: resetMeetings,
      coachingLogs: coaching,
      generatedEmails: emails,
      deals: resetDeals,
      dealIntelligence: resetIntel,
      agentLogs: idleLogs,
      tasks: resetTasks,
      activities: updatedActivities
    })
  },
  loadPremiumDataset: () => {
    // Seed fully completed, rich data for all deals and meetings
    const premiumMeetings = useAppStore.getState().meetings.map(m => {
      if (m.id === "m1") {
        return {
          ...m,
          status: "Completed" as const,
          hasTranscript: true,
          summary: "Sync covering latency checks. AeroSpace expressed concerns on batch boarding reporting. Ingestion latency above 800ms locks the database thread queuing.",
          transcriptText: "Marcus Vance (AeroSpace Corp): Hi Alexander, thanks for jumping on. We've been reviewing the licensing proposal. The primary bottleneck we're experiencing is cart latency checkout spikes during batch ingestion. We're seeing latencies above 800ms which is delaying our flight boarding reporting metrics.\nAlexander Sterling: That makes sense. We can optimize the batch pipelines. Have you discussed this with your CTO?\nMarcus Vance: Not yet. We need technical validation from the CTO's office. However, we're very interested in moving forward if we can fix this. Pricing-wise, we're a bit over budget by 15%, but we can probably clear that if the SLA terms are solid and checkouts are fast."
        }
      }
      return m
    })

    const premiumDeals = useAppStore.getState().deals.map(d => {
      if (d.id === "d1") {
        return {
          ...d,
          health: 80,
          probability: 75,
          stage: "Negotiation" as const,
          riskCount: 2,
          recCount: 3
        }
      }
      return d
    })

    const premiumIntel = {
      ...useAppStore.getState().dealIntelligence,
      "d1": {
        dealId: "d1",
        winProbability: 75,
        dealHealth: 80,
        riskLevel: "Medium" as const,
        aiConfidence: 85,
        customerEngagementScore: 90,
        decisionMakerStatus: "Marcus Vance identified (Requires CTO validation)",
        budgetStatus: "Friction (15% over target limit)",
        lastInteraction: "Audio sync debrief complete",
        upcomingAction: "Schedule validation sync with CTO's office",
        dealSummary: "AeroSpace needs database optimizations to fix 800ms checkout delays. Budget query active.",
        factors: ["CTO approval required", "checkout latency concerns", "budget friction"],
        riskScore: 35,
        riskReasons: [
          "No technical decision maker (CTO) has signed off on integration designs.",
          "Target contract pricing is 15% above initial budget guidelines."
        ],
        riskTimeline: [
          { date: "2026-06-20", factor: "Budget friction identified", score: 20 },
          { date: "2026-06-26", factor: "CTO validation milestone pending", score: 35 }
        ],
        mitigationStrategy: "Schedule a separate, 15-minute quick technical review call with the CTO. Deliver a tailored 3-year amortized cost projection sheet to showcase long-term ROI.",
        sentimentTrend: ["Neutral", "Neutral-Positive", "Positive"],
        responseDelay: "Under 4 hours",
        meetingFrequency: "Bi-weekly",
        competitorMentions: ["Magento Enterprise"]
      }
    }

    const premiumCoaching = {
      ...useAppStore.getState().coachingLogs,
      "m1": {
        meetingId: "m1",
        dealId: "d1",
        suggestedResponses: [
          { objection: "Pricing is 15% above targets.", rebuttal: "Amortize implementation costs over a 3-year term licensing structure." },
          { objection: "CTO hasn't cleared integration maps.", rebuttal: "Offer a technical walkthrough deep-dive sandbox session directly with their lead architects." }
        ],
        negotiationTips: [
          "Marcus is technical. Avoid marketing jargon. Show bench-test charts.",
          "Position the 15% budget stretch as a value expansion with dedicated technical TAM support."
        ],
        salesStrategy: "Validate migration scale with engineering leads before procurement signoff to build technical urgency.",
        missedOpportunities: [
          "Did not verify specific Magento contract termination deadlines.",
          "Missed detail concerning security clearance pipelines."
        ],
        questionsToAsk: [
          "When is the next procurement steering committee meeting scheduled?",
          "Can we schedule a 15-minute quick call with your CTO next Tuesday?"
        ],
        engagementAnalysis: "Marcus was highly communicative, responding to SLA questions immediately, but showed caution regarding timeline downtime.",
        confidenceScore: 84,
        coachingTips: [
          "Always summarize action owners before concluding exchanges.",
          "Share pre-built redlines documents to speed legal reviews."
        ]
      }
    }

    const premiumEmails = {
      ...useAppStore.getState().generatedEmails,
      "m1": {
        "Follow-up": {
          subject: "Recap & Technical Ingestion Next Steps - AeroSpace Corp",
          body: "Hi Marcus,<br/><br/>Thank you for your time today. Following up on our sync, I've outlined the action items we discussed:<br/>- [Your Name] to deliver cost SLA amortization tables next Monday.<br/>- AeroSpace to schedule a technical validation sync with the CTO's office.<br/><br/>Looking forward to our next steps.<br/><br/>Regards,<br/>[Your Name]",
          callToAction: "Confirm tech sync scheduling date",
          suggestedSendDate: "2026-06-27"
        },
        "Thank You": {
          subject: "Thank you for the productive briefing sync today!",
          body: "Marcus,<br/><br/>Just a quick note to say thank you for the walkthrough of AeroSpace's batch flight boarding pipelines today. Your insights were extremely valuable.<br/><br/>Best regards,<br/>[Your Name]",
          callToAction: "No action required",
          suggestedSendDate: "2026-06-26"
        },
        "Proposal": {
          subject: "Licensing Proposal & SLA Guarantees - AeroSpace Ingestion",
          body: "Marcus,<br/><br/>Attached is our licensing proposal customized to the 24/7 SLA parameters we reviewed today. Let me know if your legal team has any redlines.<br/><br/>Sincerely,<br/>[Your Name]",
          callToAction: "Submit redlines draft",
          suggestedSendDate: "2026-06-29"
        }
      }
    }

    const premiumCompetitors = {
      ...useAppStore.getState().competitorsIntel,
      "d1": [
        {
          competitorName: "Magento Enterprise",
          strengths: ["Pre-existing database reporting layers", "No migration required initially"],
          weaknesses: ["Synchronous thread queuing causing 800ms locks", "High infrastructure scale overhead"],
          talkingPoints: [
            "Explain how Magento locks database access during large ingestion batches.",
            "Compare their synchronous model with our asynchronous headless ingestion speed."
          ],
          differentiators: [
            "Guarantees checkout execution under 150ms.",
            "Decoupled headless structure prevents lock collisions."
          ],
          comparisonSummary: "Magento represents the legacy bottleneck. Transitioning to custom headless APIs resolves the ingestion latency completely."
        }
      ]
    }

    const premiumAgentLogs = {
      ...useAppStore.getState().agentLogs,
      "meeting_agent": {
        agentId: "meeting_agent",
        agentName: "Meeting Intelligence Agent",
        taskDescription: "Extract summaries, sentiment labels, keywords, and highlights.",
        status: "Succeeded" as const,
        executionLogs: ["Initializing connection...", "Scanning sync transcript text...", "Extracting briefing metadata...", "Successfully parsed transcript."],
        finalOutput: { summary: "Sync covering latency checks. AeroSpace expressed concerns on cart checkout delays.", sentiment: "Neutral-Positive" },
        updatedAt: new Date().toISOString()
      },
      "memory_agent": {
        agentId: "memory_agent",
        agentName: "Customer Memory Agent",
        taskDescription: "Analyze and capture persistent customer budget and friction details.",
        status: "Succeeded" as const,
        executionLogs: ["Comparing historical values...", "Extracting target budget updates...", "Syncing profile vaults...", "Successfully updated Hindsight memory values."],
        finalOutput: { painPoints: "Latency spikes (800ms) during flight boarding", budget: "Friction (15% over limits)" },
        updatedAt: new Date().toISOString()
      },
      "competitor_agent": {
        agentId: "competitor_agent",
        agentName: "SWOT Competitor Agent",
        taskDescription: "Detect competitor product mentions and build defensive SWOT talking points.",
        status: "Succeeded" as const,
        executionLogs: ["Scanning for competitor key terms...", "Extracting comparison differentiators...", "Successfully compiled competitor SWOT data."],
        finalOutput: { competitorName: "Magento Enterprise", riskType: "Legacy Lock-in" },
        updatedAt: new Date().toISOString()
      },
      "risk_agent": {
        agentId: "risk_agent",
        agentName: "Forecast Risk Agent",
        taskDescription: "Perform health calculations, response delay metrics, and score win rates.",
        status: "Succeeded" as const,
        executionLogs: ["Calculating response delays...", "Estimating win/loss probability models...", "Scoring customer sentiment trend...", "Successfully computed deal risk indicators."],
        finalOutput: { dealHealth: 80, riskLevel: "Medium", winProbability: 75 },
        updatedAt: new Date().toISOString()
      },
      "email_agent": {
        agentId: "email_agent",
        agentName: "Personalized Copywriter Agent",
        taskDescription: "Synthesize ready-to-send email drafts matching customer language style.",
        status: "Succeeded" as const,
        executionLogs: ["Fetching style profile...", "Drafting follow-up recs templates...", "Structuring CTA links...", "Successfully synthesized follow-up template drafts."],
        finalOutput: { followUpDraft: "Ready", thankYouDraft: "Ready" },
        updatedAt: new Date().toISOString()
      },
      "analytics_agent": {
        agentId: "analytics_agent",
        agentName: "Executive Analytics Agent",
        taskDescription: "Re-calculate revenue forecasts, stage progression curves, and lost metrics.",
        status: "Succeeded" as const,
        executionLogs: ["Re-calculating pipeline metrics...", "Recalculating forecast timelines...", "Finalizing health distributions...", "Successfully recalculated sales forecasts."],
        finalOutput: { winProbability: 75, forecastInflow: "+15%" },
        updatedAt: new Date().toISOString()
      }
    }

    // Seed tasks
    const premiumTasks = [
      { id: "t-auto1-seed", title: "Schedule technical validation sync with AeroSpace CTO's office", due_date: "2026-06-29", completed: false, priority: "High" as const },
      { id: "t-auto2-seed", title: "Submit 3-year TCO amortization cost sheet to Marcus Vance", due_date: "2026-06-28", completed: false, priority: "Medium" as const },
      ...useAppStore.getState().tasks.filter(t => !t.id.startsWith("t-auto"))
    ]

    const seedActivity: ActivityItem = {
      id: `a-seed-${Date.now()}`,
      type: "System",
      title: "Enterprise Dataset Loaded",
      description: "Rich historical CRM records, swarming terminal logs, and playbook summaries seeded into workspace.",
      time: new Date().toISOString()
    }
    const updatedActivities = [seedActivity, ...useAppStore.getState().activities]

    saveToLocalStorage("meetings", premiumMeetings)
    saveToLocalStorage("deals", premiumDeals)
    saveToLocalStorage("dealIntelligence", premiumIntel)
    saveToLocalStorage("coachingLogs", premiumCoaching)
    saveToLocalStorage("generatedEmails", premiumEmails)
    saveToLocalStorage("competitorsIntel", premiumCompetitors)
    saveToLocalStorage("agentLogs", premiumAgentLogs)
    saveToLocalStorage("tasks", premiumTasks)
    saveToLocalStorage("activities", updatedActivities)

    set({
      meetings: premiumMeetings,
      deals: premiumDeals,
      dealIntelligence: premiumIntel,
      coachingLogs: premiumCoaching,
      generatedEmails: premiumEmails,
      competitorsIntel: premiumCompetitors,
      agentLogs: premiumAgentLogs,
      tasks: premiumTasks,
      activities: updatedActivities
    })
  }
}))
