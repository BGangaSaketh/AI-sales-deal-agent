-- Database Schema Extensions for Phase 3: Enterprise AI Sales Platform

-- 1. Sales Coaching Logs Table
CREATE TABLE IF NOT EXISTS public.sales_coaching_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    suggested_responses JSONB DEFAULT '[]'::jsonb,
    negotiation_tips JSONB DEFAULT '[]'::jsonb,
    sales_strategy TEXT,
    missed_opportunities JSONB DEFAULT '[]'::jsonb,
    questions_to_ask JSONB DEFAULT '[]'::jsonb,
    engagement_analysis TEXT,
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    coaching_tips JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Generated Emails Table
CREATE TABLE IF NOT EXISTS public.generated_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    email_type VARCHAR(100) NOT NULL, -- e.g., 'Follow-up', 'Summary', 'Proposal', 'Reminder', 'Thank You'
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    call_to_action VARCHAR(255),
    suggested_send_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Competitor Intelligence Table
CREATE TABLE IF NOT EXISTS public.competitor_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    competitor_name VARCHAR(150) NOT NULL, -- e.g., 'Salesforce', 'HubSpot'
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    talking_points JSONB DEFAULT '[]'::jsonb,
    differentiators JSONB DEFAULT '[]'::jsonb,
    comparison_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Agent Execution Logs Table
CREATE TABLE IF NOT EXISTS public.agent_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) NOT NULL, -- e.g., 'meeting_agent', 'memory_agent'
    agent_name VARCHAR(150) NOT NULL,
    task_description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Idle', -- e.g., 'Idle', 'Running', 'Succeeded', 'Failed'
    execution_logs JSONB DEFAULT '[]'::jsonb,
    final_output JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
