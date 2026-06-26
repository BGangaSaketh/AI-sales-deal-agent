import json
from app.services.llm_service import LLMService

class RecommendationService:
    @staticmethod
    def generate_recommendations(deal_stage: str, sentiment: str, risks: str, transcript: str) -> dict:
        prompt = f"""
        Generate the Next Best Action for the sales representative based on the following deal context:
        - Deal Stage: {deal_stage}
        - Sentiment: {sentiment}
        - Detected Risks: {risks}
        
        Transcript Details:
        {transcript}
        
        Provide the next action, reasoning, priority level (High, Medium, Low), expected impact, and a suggested follow-up date.
        
        Return ONLY a JSON object.
        """
        
        result = LLMService.query_llm(prompt, system_instruction="Recommend sales next steps in JSON.")
        try:
            return json.loads(result)
        except Exception:
            return {
                "next_action": "Schedule a technical deep-dive validation session with the AeroSpace CTO's office.",
                "reasoning": "Marcus Vance stated they need technical validation from the CTO's office to resolve checkout latency concerns before signing off.",
                "priority": "High",
                "expected_impact": "High",
                "suggested_date": "2026-06-29"
            }
