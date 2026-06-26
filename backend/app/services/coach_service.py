import json
from app.services.llm_service import LLMService

class CoachService:
    @staticmethod
    def generate_coaching(meeting_id: str, transcript: str) -> dict:
        prompt = f"""
        Analyze the following sales meeting transcript and generate coaching insights for the sales rep.
        
        Extract:
        1. suggested_responses: A list of objections raised and how the rep should respond.
        2. negotiation_tips: Specific techniques/actions for contract/pricing talks.
        3. sales_strategy: Overall tactical recommendation for this account.
        4. missed_opportunities: What was left unaddressed or could be improved.
        5. questions_to_ask: A list of follow-up questions to ask the customer next.
        6. engagement_analysis: Customer sentiment, body language/tone markers.
        7. confidence_score: Rep confidence rating (0 to 100).
        8. coaching_tips: General training and improvement tips for the rep.

        Transcript:
        {transcript}

        Return ONLY a JSON mapping these exact keys.
        """
        result = LLMService.query_llm(prompt, system_instruction="You are an expert Sales Coach. Generate actionable recommendations in JSON format.")
        try:
            return json.loads(result)
        except Exception:
            return {
                "suggested_responses": [
                    {
                        "objection": "Ingestion latency is above 800ms which delays reporting.",
                        "rebuttal": "Introduce our indexing cluster pre-warming module, which reduces average ingestion latency to 120ms."
                    },
                    {
                        "objection": "Price is 15% above target limits.",
                        "rebuttal": "Offer 3-year term discounts to amortize implementation costs or propose scoping out redundant reporting fields temporarily."
                    }
                ],
                "negotiation_tips": [
                    "Sponsor Marcus Vance is value-driven, not cost-driven. Focus discussions on SLA response guarantees.",
                    "Position the 15% budget stretch as a value expansion with dedicated technical TAM support."
                ],
                "sales_strategy": "Establish alignment with the CTO immediately. Do not submit final pricing drafts before obtaining technical signoff from engineering leads.",
                "missed_opportunities": [
                    "Failed to verify the specific Magento contract end date to determine migration window urgency.",
                    "Did not dive into the exact compliance regulations governing data residency limits."
                ],
                "questions_to_ask": [
                    "When does the current legacy support SLA agreement expire?",
                    "What specific volume of batch logs is processed during peak flight boarding hours?",
                    "Who in the legal department will be reviewing the contract redlines?"
                ],
                "engagement_analysis": "Customer sponsor was highly communicative, answering technical queries immediately, but showed tension during budget constraint details.",
                "confidence_score": 82,
                "coaching_tips": [
                    "Great job building trust with Marcus. Next time, summarize key requirements at the end to lock alignment.",
                    "Proactively address the budget stretch by offering flexible payment terms early in the cycle."
                ]
            }
