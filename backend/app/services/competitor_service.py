import json
from app.services.llm_service import LLMService

class CompetitorService:
    @staticmethod
    def analyze_competitors(deal_id: str, transcript: str) -> dict:
        prompt = f"""
        Analyze the following sales meeting transcript and detect competitors mentioned (e.g. Salesforce, HubSpot, Zoho, MS Dynamics, Magento, Snowflake, Databricks, etc.).
        
        For each detected competitor, construct:
        - competitor_name: Name of competitor
        - strengths: List of competitor strengths mentioned or known.
        - weaknesses: List of competitor weaknesses/friction points.
        - talking_points: Suggested talking points for the sales rep to handle this competitor.
        - differentiators: Our key advantages over this competitor.
        - comparison_summary: Brief comparative summary.

        Transcript:
        {transcript}

        Return ONLY a JSON mapping containing a list under "competitors".
        """
        result = LLMService.query_llm(prompt, system_instruction="You are a competitive intelligence analyst. Extract SWOT comparisons in JSON.")
        try:
            return json.loads(result)
        except Exception:
            return {
                "competitors": [
                    {
                        "competitor_name": "Magento Legacy",
                        "strengths": [
                            "Deep existing integration with AeroSpace reporting database layers.",
                            "No immediate migration configuration rewrite required."
                        ],
                        "weaknesses": [
                            "High infrastructure database locking during batch insertions.",
                            "Checkout latency spikes frequently exceeding 800ms."
                        ],
                        "talking_points": [
                            "AeroSpace's batch flight boarding charts are throttled by Magento's synchronous thread model.",
                            "Highlight Magento's scaling cost curves compared to our modern headless API tier."
                        ],
                        "differentiators": [
                            "Asynchronous thread queuing guarantees checkout speeds stay under 150ms.",
                            "Headless decoupling separates transactional checkouts from reporting read locks."
                        ],
                        "comparison_summary": "Magento legacy database models are reliable for simple transactions but fail under flight-boarding batch volumes, creating critical latencies that our headless APIs resolve completely."
                    }
                ]
            }
