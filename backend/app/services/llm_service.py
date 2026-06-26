import os
import json
from typing import Dict, Any

class LLMService:
    @staticmethod
    def query_llm(prompt: str, system_instruction: str = "You are an AI Sales Deal assistant.") -> str:
        provider = os.getenv("LLM_PROVIDER", "gemini").lower()
        
        # 1. Attempt Google Gemini Provider
        if provider == "gemini":
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                try:
                    import google.generativeai as genai
                    genai.configure(api_key=api_key)
                    model = genai.GenerativeModel(
                        model_name="gemini-1.5-flash",
                        system_instruction=system_instruction
                    )
                    response = model.generate_content(prompt)
                    return response.text
                except Exception as e:
                    print(f"Gemini API query failed, falling back to mock: {e}")
            else:
                print("GEMINI_API_KEY not found in environment, using mock fallback.")

        # 2. Attempt OpenAI Provider
        elif provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key:
                try:
                    from openai import OpenAI
                    client = OpenAI(api_key=api_key)
                    response = client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": prompt}
                        ]
                    )
                    return response.choices[0].message.content or ""
                except Exception as e:
                    print(f"OpenAI API query failed, falling back to mock: {e}")
            else:
                print("OPENAI_API_KEY not found in environment, using mock fallback.")

        # 3. High-fidelity Mock Fallback (Driven by keyword matching inside prompt to feel highly realistic!)
        return LLMService._mock_response_generator(prompt)

    @staticmethod
    def _mock_response_generator(prompt: str) -> str:
        prompt_lower = prompt.lower()
        
        # Objection extraction trigger
        if "objection" in prompt_lower:
            return json.dumps({
                "objections": [
                    {
                        "category": "Pricing",
                        "objection_text": "Pricing tier is higher than the original budgetary guidelines by 15%.",
                        "suggested_response": "Highlight the long-term ROI showing server consolidation savings of 22%. Recommend looking into 3-year multi-year amortization tables.",
                        "follow_up_recommendation": "Provide customized 3-year cost-savings analysis sheets."
                    }
                ]
            })

        # Recommendation / Next Best Action trigger
        elif "recommend" in prompt_lower or "next action" in prompt_lower:
            return json.dumps({
                "next_action": "Schedule a separate technical validation sync with AeroSpace CTO's office this week.",
                "reasoning": "AeroSpace Tech Enterprise Sync deal health dropped because no technical decision maker has approved the current API architecture draft.",
                "priority": "High",
                "expected_impact": "High",
                "suggested_date": "2026-06-29"
            })

        # Meeting Summary / Highlights trigger
        elif "summarize" in prompt_lower or "highlights" in prompt_lower:
            return json.dumps({
                "summary": "Weekly sync meeting covering latency spikes and SLA. AeroSpace Corp expressed concerns on cart latency checkout bottlenecks.",
                "sentiment_label": "Positive",
                "sentiment_score": 0.45,
                "keywords": ["latency", "checkout", "SLA contract", "Magento migration"],
                "buying_signals": ["Expanding contract budget by 15% next quarter"],
                "highlights": ["CTO approved scheduling technical deep-dive session", "Procurement agreed to fast-track redlines review"],
                "decision_makers": ["Emily Taylor (Nova Retail)", "Marcus Vance (AeroSpace)"],
                "competitors": ["Snowflake", "Databricks"]
            })

        # Default fallback
        return json.dumps({
            "message": "AI processed exchange successfully.",
            "success": True
        })
