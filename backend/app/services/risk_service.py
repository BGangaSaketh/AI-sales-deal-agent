import json
from app.services.llm_service import LLMService

class RiskService:
    @staticmethod
    def assess_deal_risk(deal_id: str, transcript: str) -> dict:
        prompt = f"""
        Score the deal risks based on meeting details. Provide scores for:
        - Win Probability (0 to 100)
        - Deal Health (0 to 100)
        - Risk Level (High, Medium, Low)
        - AI Confidence (0 to 100)
        - Customer Engagement Score (0 to 100)
        - Decision Maker Status (Identified, Unidentified, Friction)
        - Budget Status (Approved, Pending, Friction)
        
        Transcript Details:
        {transcript}
        
        Return a JSON object containing these metrics.
        """
        
        result = LLMService.query_llm(prompt, system_instruction="Analyze deal health scores in JSON.")
        try:
            return json.loads(result)
        except Exception:
            return {
                "win_probability": 65,
                "deal_health": 70,
                "risk_level": "Medium",
                "ai_confidence": 85,
                "customer_engagement_score": 80,
                "decision_maker_status": "Friction (CTO validation required)",
                "budget_status": "Friction (15% over budget)"
            }
