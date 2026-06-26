-- Extend DB Schema for AI Deal Intelligence Features

-- 1. Meeting Analysis Table
CREATE TABLE IF NOT EXISTS public.meeting_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE UNIQUE,
    sentiment_score NUMERIC(3, 2), -- e.g., -1.00 to +1.00
    sentiment_label VARCHAR(50), -- e.g., 'Positive', 'Neutral', 'Friction'
    keywords JSONB DEFAULT '[]'::jsonb,
    buying_signals JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Objection History Table
CREATE TABLE IF NOT EXISTS public.objection_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- e.g., 'Pricing', 'Security', 'Timeline', 'Technical'
    objection_text TEXT NOT NULL,
    suggested_response TEXT NOT NULL,
    follow_up_recommendation TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Open', -- e.g., 'Open', 'Addressed', 'Resolved'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Memory History Table (Audit trail of customer memory shifts)
CREATE TABLE IF NOT EXISTS public.memory_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    field_updated VARCHAR(100) NOT NULL, -- e.g., 'budget', 'pain_points', 'competitors'
    previous_value TEXT,
    new_value TEXT NOT NULL,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Recommendations Log (Auditing Next Best Actions)
CREATE TABLE IF NOT EXISTS public.recommendations_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    recommendation_text TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL, -- e.g., 'High', 'Medium', 'Low'
    expected_impact VARCHAR(50) NOT NULL, -- e.g., 'High', 'Medium', 'Low'
    suggested_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Risk History Table (Tracking health shifts on opportunities)
CREATE TABLE IF NOT EXISTS public.risk_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    win_probability INTEGER CHECK (win_probability >= 0 AND win_probability <= 100),
    health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    risk_level VARCHAR(50), -- e.g., 'High', 'Medium', 'Low'
    engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
    factors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
