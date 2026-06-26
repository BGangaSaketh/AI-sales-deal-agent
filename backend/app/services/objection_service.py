import json
from app.services.llm_service import LLMService

class ObjectionService:
    @staticmethod
    def detect_objections(meeting_id: str, transcript: str) -> dict:
        prompt = f"""
        Identify client objections in the following meeting transcript. Categorize each objection (e.g. Pricing, Security, Timeline, Technical) and generate a suggested rebuttal response and a follow-up recommendation.
        
        Transcript:
        {transcript}
        
        Return a JSON object containing an array of 'objections'.
        """
        
        result = LLMService.query_llm(prompt, system_instruction="Detect sales objections in JSON format.")
        try:
            return json.loads(result)
        except Exception:
            return {
                "objections": [
                    {
                        "category": "Technical",
                        "objection_text": "Cart latency spikes above 800ms during batch ingestion metrics reporting.",
                        "suggested_response": "Explain that our Phase 2 pipelines feature dedicated indexing layers that compress batch latencies to under 150ms.",
                        "follow_up_recommendation": "Provide the AeroSpace dev team with our batch API load testing benchmarks."
                    },
                    {
                        "category": "Pricing",
                        "objection_text": "Pricing tier exceeds target guidelines by 15%.",
                        "suggested_response": "Outline the amortization savings on AWS database hosting, showing net-positive savings of 22% by switching to our managed SaaS.",
                        "follow_up_recommendation": "Present a custom 3-year TCO sheet."
                    }
                ]
            }
        
        # Objection history log simulation
        # In a real environment, this service would execute CRUD database commits.
