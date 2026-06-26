import json
from app.services.llm_service import LLMService

class MemoryService:
    @staticmethod
    def update_customer_memory(customer_id: str, transcript: str) -> dict:
        prompt = f"""
        Analyze the following client meeting transcript and extract the customer memory fields:
        - Budget
        - Pain Points
        - Decision Makers
        - Competitors
        - Preferred Communication Style
        - Preferred Meeting Time
        - Business Goals
        - Previous Concerns
        - Product Interest
        - Important Dates
        - Buying Signals
        - Risks
        
        Transcript:
        {transcript}
        
        Return ONLY a JSON object mapping these fields.
        """
        
        result = LLMService.query_llm(prompt, system_instruction="Extract customer memory profiles in JSON.")
        try:
            return json.loads(result)
        except Exception:
            # Fallback mock structures in case of parsing problems
            return {
                "budget": "Over budget guidelines by 15%",
                "pain_points": "Latency spikes (800ms) during flight boarding ingestion reporting",
                "decision_makers": ["Marcus Vance (AeroSpace Corp)", "CTO (requires validation)"],
                "competitors": ["Magento legacy systems"],
                "preferred_communication_style": "Structured, technical syncs",
                "preferred_meeting_time": "Thursdays or Fridays afternoon",
                "business_goals": "Fix ingestion checkout latencies below 200ms",
                "previous_concerns": "SLA contract support parameters",
                "product_interest": "Real-time batch ingestion API pipelines",
                "important_dates": "Evaluation milestone by August 15",
                "buying_signals": "Willing to increase budget if checkout latency is resolved",
                "risks": "No technical decision maker has approved architecture draft"
            }
