export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: string
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id: string
  company_name: string
  industry: string
  size: string
  website: string
  created_at?: string
  updated_at?: string
}

export interface Deal {
  id: string
  name: string
  value: number
  stage: string
  close_date?: string
  customer_id?: string
  owner_id?: string
  health_score: number
  created_at?: string
  updated_at?: string
}

export interface Meeting {
  id: string
  title: string
  meeting_date: string
  duration_minutes: number
  deal_id?: string
  host_id?: string
  status: string
  created_at?: string
  updated_at?: string
}
