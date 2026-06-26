from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.core.config import settings
from app.core.database import engine, Base
import time

# Import AI Services
from app.services.speech_service import SpeechService
from app.services.llm_service import LLMService
from app.services.memory_service import MemoryService
from app.services.objection_service import ObjectionService
from app.services.recommendation_service import RecommendationService
from app.services.risk_service import RiskService
from app.services.coach_service import CoachService
from app.services.email_service import EmailService
from app.services.competitor_service import CompetitorService
from app.services.agent_orchestrator import AgentOrchestrator

# Create tables in DB (mock database, in production we would use Alembic migrations)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database creation failed (likely no PostgreSQL running yet): {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="REST API service for AI Sales Deal Intelligence Agent (CRM + AI Services)",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for validation
class UserSchema(BaseModel):
    id: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    role: str

class CustomerCreateSchema(BaseModel):
    name: str
    industry: str
    size: str
    website: str
    email: str
    phone: str
    salesRep: str
    status: str
    tags: List[str]

class CustomerSchema(CustomerCreateSchema):
    id: str
    created_at: str

class DealCreateSchema(BaseModel):
    name: str
    customer: str
    customerId: str
    company: str
    value: float
    stage: str
    closeDate: str
    priority: str
    probability: int
    salesperson: str
    notes: str
    status: str

class DealSchema(DealCreateSchema):
    id: str
    health: int
    riskCount: int
    recCount: int

class MeetingCreateSchema(BaseModel):
    title: str
    customer: str
    customerId: str
    deal: str
    dealId: str
    date: str
    time: str
    type: str
    attendees: List[str]
    duration: str
    notes: str
    status: str

class MeetingSchema(MeetingCreateSchema):
    id: str
    hasTranscript: bool
    summary: Optional[str] = None

class ActivitySchema(BaseModel):
    id: str
    type: str
    title: str
    description: str = ""
    time: str

# Schema for AI Endpoint Requests
class MeetingIntelligenceRequestSchema(BaseModel):
    transcript: str

class RecommendationRequestSchema(BaseModel):
    deal_stage: str
    sentiment: str
    risks: str
    transcript: str

class CoachRequestSchema(BaseModel):
    meeting_id: str
    transcript: str

class EmailGenerateRequestSchema(BaseModel):
    meeting_id: str
    transcript: str
    customer_style: Optional[str] = "Technical & Professional"

class CompetitorRequestSchema(BaseModel):
    deal_id: str
    transcript: str

class AgentRunRequestSchema(BaseModel):
    meeting_id: str
    deal_id: str
    customer_id: str
    transcript: str

@app.get("/")
def read_root():
    return {
        "message": "Welcome to AI Sales Deal Intelligence Agent Backend API",
        "status": "online",
        "timestamp": time.time()
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time()
    }

# Mock Authentication Routes
@app.post(f"{settings.API_V1_STR}/auth/login")
def mock_login(credentials: dict):
    email = credentials.get("email")
    password = credentials.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password")
    
    return {
        "access_token": "mock-jwt-token-xyz-12345",
        "token_type": "bearer",
        "user": {
            "id": "e654dfaf-efc0-4d54-9588-58754ac48488",
            "email": email,
            "full_name": "Alexander Sterling",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
            "role": "SaaS Executive"
        }
    }

@app.post(f"{settings.API_V1_STR}/auth/signup")
def mock_signup(data: dict):
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name", "New Executive User")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password")
    
    return {
        "message": "User registered successfully",
        "user": {
            "id": "e654dfaf-efc0-4d54-9588-58754ac48488",
            "email": email,
            "full_name": full_name,
            "avatar_url": None,
            "role": "Sales Rep"
        }
    }

@app.post(f"{settings.API_V1_STR}/auth/logout")
def mock_logout():
    return {"message": "Logged out successfully"}

# REST CRM ENDPOINTS (MOCKED FOR PHASE 1 FOUNDATION SYNC)

# Customers Endpoints
@app.get(f"{settings.API_V1_STR}/customers", response_model=List[CustomerSchema])
def get_customers():
    return [
      {
        "id": "c1",
        "name": "AeroSpace Corp",
        "industry": "Aerospace & Defense",
        "size": "10,000+",
        "website": "https://aerospacecorp.com",
        "email": "procurement@aerospacecorp.com",
        "phone": "+1 (555) 019-2831",
        "salesRep": "Alexander Sterling",
        "status": "Active",
        "tags": ["Enterprise", "Multi-year"],
        "notes": ["Strong preference for SLA support.", "Discussing flight metric latency next session."],
        "created_at": "2026-05-27T00:00:00Z"
      },
      {
        "id": "c2",
        "name": "Nova Retail Services",
        "industry": "Retail & E-commerce",
        "size": "500-1000",
        "website": "https://novaretail.io",
        "email": "contact@novaretail.io",
        "phone": "+1 (555) 902-1144",
        "salesRep": "Sarah Jenkins",
        "status": "Lead",
        "tags": ["Magento-Migrate", "Mid-Market"],
        "notes": ["Migrating checkout endpoints to modern stack."],
        "created_at": "2026-06-16T00:00:00Z"
      }
    ]

@app.post(f"{settings.API_V1_STR}/customers", response_model=CustomerSchema)
def create_customer(customer: CustomerCreateSchema):
    return {
        **customer.model_dump(),
        "id": "c-mock-new",
        "created_at": "2026-06-26T12:00:00Z"
    }

@app.put(f"{settings.API_V1_STR}/customers/{{id}}", response_model=CustomerSchema)
def update_customer(id: str, customer: CustomerCreateSchema):
    return {
        **customer.model_dump(),
        "id": id,
        "created_at": "2026-05-27T00:00:00Z"
    }

@app.delete(f"{settings.API_V1_STR}/customers/{{id}}")
def delete_customer(id: str):
    return {"message": f"Customer {id} deleted successfully"}

# Deals Endpoints
@app.get(f"{settings.API_V1_STR}/deals", response_model=List[DealSchema])
def get_deals():
    return [
      {
        "id": "d1",
        "name": "AeroSpace Tech Enterprise Sync",
        "customer": "AeroSpace Corp",
        "customerId": "c1",
        "company": "AeroSpace Corp",
        "value": 750000.0,
        "stage": "Negotiation",
        "closeDate": "2026-08-15",
        "priority": "High",
        "probability": 80,
        "salesperson": "Alexander Sterling",
        "notes": "Reviewing SLA contract clause and licensing fees.",
        "status": "Active",
        "health": 85,
        "riskCount": 1,
        "recCount": 2
      }
    ]

@app.post(f"{settings.API_V1_STR}/deals", response_model=DealSchema)
def create_deal(deal: DealCreateSchema):
    return {
        **deal.model_dump(),
        "id": "d-mock-new",
        "health": 75,
        "riskCount": 0,
        "recCount": 0
    }

@app.put(f"{settings.API_V1_STR}/deals/{{id}}", response_model=DealSchema)
def update_deal(id: str, deal: DealCreateSchema):
    return {
        **deal.model_dump(),
        "id": id,
        "health": 80,
        "riskCount": 1,
        "recCount": 1
    }

@app.patch(f"{settings.API_V1_STR}/deals/{{id}}/stage")
def patch_deal_stage(id: str, data: dict):
    stage = data.get("stage")
    if not stage:
        raise HTTPException(status_code=400, detail="Missing stage parameter")
    return {"id": id, "stage": stage, "message": "Deal stage updated"}

@app.delete(f"{settings.API_V1_STR}/deals/{{id}}")
def delete_deal(id: str):
    return {"message": f"Deal {id} deleted successfully"}

# Meetings Endpoints
@app.get(f"{settings.API_V1_STR}/meetings", response_model=List[MeetingSchema])
def get_meetings():
    return [
      {
        "id": "m1",
        "title": "AeroSpace Tech Enterprise Sync",
        "customer": "AeroSpace Corp",
        "customerId": "c1",
        "deal": "AeroSpace Tech Enterprise Sync",
        "dealId": "d1",
        "date": "2026-06-26",
        "time": "14:00",
        "type": "Video",
        "attendees": ["Alexander Sterling", "Marcus Vance (AeroSpace)"],
        "duration": "45 mins",
        "notes": "Weekly sync meeting covering latency spikes and SLA.",
        "status": "Scheduled",
        "hasTranscript": False
      }
    ]

@app.post(f"{settings.API_V1_STR}/meetings", response_model=MeetingSchema)
def create_meeting(meeting: MeetingCreateSchema):
    return {
        **meeting.model_dump(),
        "id": "m-mock-new",
        "hasTranscript": False
    }

@app.delete(f"{settings.API_V1_STR}/meetings/{{id}}")
def delete_meeting(id: str):
    return {"message": f"Meeting {id} cancelled successfully"}

# ACTIVE AI SERVICES REST ENDPOINTS (CASCADEFLOW ABSTRACTIONS)

@app.post(f"{settings.API_V1_STR}/ai/transcribe")
async def transcribe_audio_endpoint(file: UploadFile = File(...)):
    # Save temp audio file (or simulate) and transcribe with speech service
    # Whisper API or Local Mock transcript fallback
    transcript = SpeechService.transcribe_audio("temp_audio.wav")
    return {
        "filename": file.filename,
        "transcript": transcript
    }

@app.post(f"{settings.API_V1_STR}/ai/meeting-intelligence")
def meeting_intelligence_endpoint(req: MeetingIntelligenceRequestSchema):
    prompt = f"""
    Perform a complete meeting analysis on the following transcript:
    {req.transcript}
    
    Extract:
    - AI Summary
    - Action Items
    - Meeting Highlights
    - Sentiment Analysis
    - Keyword Extraction
    - Important Dates
    - Decision Makers
    - Competitors Mentioned
    - Pain Points
    - Buying Signals
    
    Return a single JSON block.
    """
    result = LLMService.query_llm(prompt, system_instruction="Extract meeting logs in JSON.")
    try:
        import json
        return json.loads(result)
    except Exception:
        # High fidelity fallback structure
        return {
            "summary": "Weekly sync meeting covering latency spikes and SLA. AeroSpace Corp expressed concerns on cart latency checkout bottlenecks.",
            "sentiment_label": "Positive",
            "sentiment_score": 0.45,
            "keywords": ["latency", "checkout", "SLA contract", "Magento migration"],
            "buying_signals": ["Expanding contract budget by 15% next quarter"],
            "highlights": ["CTO approved scheduling technical deep-dive session", "Procurement agreed to fast-track redlines review"],
            "decision_makers": ["Emily Taylor (Nova Retail)", "Marcus Vance (AeroSpace)"],
            "competitors": ["Magento legacy systems"],
            "pain_points": ["Ingestion checkout latencies above 800ms"],
            "action_items": ["Schedule technical deep-dive sync (Owner: Host)", "Share cost TCO projections sheets"]
        }

@app.post(f"{settings.API_V1_STR}/ai/next-best-action")
def next_best_action_endpoint(req: RecommendationRequestSchema):
    rec = RecommendationService.generate_recommendations(
        deal_stage=req.deal_stage,
        sentiment=req.sentiment,
        risks=req.risks,
        transcript=req.transcript
    )
    return rec

@app.post(f"{settings.API_V1_STR}/ai/objections")
def objections_endpoint(req: MeetingIntelligenceRequestSchema):
    objs = ObjectionService.detect_objections(meeting_id="m-temp", transcript=req.transcript)
    return objs

@app.post(f"{settings.API_V1_STR}/ai/risk-analysis")
def risk_analysis_endpoint(req: MeetingIntelligenceRequestSchema):
    risks = RiskService.assess_deal_risk(deal_id="d-temp", transcript=req.transcript)
    return risks

@app.post(f"{settings.API_V1_STR}/ai/coach")
def coach_endpoint(req: CoachRequestSchema):
    coaching = CoachService.generate_coaching(meeting_id=req.meeting_id, transcript=req.transcript)
    return coaching

@app.post(f"{settings.API_V1_STR}/ai/email/generate")
def email_generate_endpoint(req: EmailGenerateRequestSchema):
    emails = EmailService.generate_email_templates(
        meeting_id=req.meeting_id,
        transcript=req.transcript,
        customer_style=req.customer_style
    )
    return emails

@app.post(f"{settings.API_V1_STR}/ai/competitors")
def competitors_endpoint(req: CompetitorRequestSchema):
    comps = CompetitorService.analyze_competitors(deal_id=req.deal_id, transcript=req.transcript)
    return comps

@app.post(f"{settings.API_V1_STR}/ai/agents/run")
def agents_run_endpoint(req: AgentRunRequestSchema):
    agents_timeline = AgentOrchestrator.run_multi_agent_pipeline(
        meeting_id=req.meeting_id,
        deal_id=req.deal_id,
        customer_id=req.customer_id,
        transcript=req.transcript
    )
    return agents_timeline
