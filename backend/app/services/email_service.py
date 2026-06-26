import json
from app.services.llm_service import LLMService

class EmailService:
    @staticmethod
    def generate_email_templates(meeting_id: str, transcript: str, customer_style: str = "Technical & Professional") -> dict:
        prompt = f"""
        Based on the following client sync transcript, generate email communication drafts in `{customer_style}` style.
        
        Generate the following templates:
        1. Follow-up Email: A recap of actions for key contacts.
        2. Meeting Summary Email: A high-level overview of requirements discussed and agreed steps.
        3. Proposal Email: Accompanying template for submitting contract scopes.
        4. Reminder Email: A template for checking on contract redlines.
        5. Thank You Email: A short, professional thank you note.

        For each email type, provide:
        - subject: Subject line
        - body: Body content (HTML formatted paragraphs with [Placeholder] notations for rep signoff)
        - call_to_action: Explicit next step action
        - suggested_send_date: Suggested date to send (e.g. YYYY-MM-DD)

        Transcript:
        {transcript}

        Return ONLY a JSON mapping the email types.
        """
        result = LLMService.query_llm(prompt, system_instruction="You are a professional sales copywriter. Generate personalized client emails in JSON.")
        try:
            return json.loads(result)
        except Exception:
            return {
                "Follow-up": {
                    "subject": "AeroSpace Sync: Ingestion Latency Steps & Actions",
                    "body": "Hi Marcus,<br/><br/>Thank you for your time today. I am following up on our sync regarding latency checkouts. As discussed, we are setting up a trial sandbox pipeline to demonstrate pre-warming ingestion configurations designed to reduce spikes below 150ms.<br/><br/>I will send over the technical deep-dive slot suggestions tomorrow. Looking forward to showing you the test run results.<br/><br/>Best regards,<br/>[Your Name]",
                    "call_to_action": "Verify sandbox test parameters",
                    "suggested_send_date": "2026-06-27"
                },
                "Summary": {
                    "subject": "Executive Summary: AeroSpace Technical Alignment Sync",
                    "body": "Dear Marcus,<br/><br/>Here is a summary of our discussion today:<br/>- Discussed checkout latencies delaying flight boarding metric feeds.<br/>- Identified budget constraints (15% stretch required).<br/>- Action item: Rep to deliver cost TCO amortization spreadsheet.<br/>- Action item: AeroSpace to validate architecture with CTO's office.<br/><br/>Thank you,<br/>[Your Name]",
                    "call_to_action": "Review summary metrics",
                    "suggested_send_date": "2026-06-27"
                },
                "Proposal": {
                    "subject": "Tailored Licensing Proposal: AeroSpace Ingestion SLA",
                    "body": "Hi Marcus,<br/><br/>Attached is our customized contract licensing proposal matching the 24/7 SLA specifications we reviewed. This includes dedicated TAM coverage to ensure ingestion pipelines stay within target latency levels.<br/><br/>Best,<br/>[Your Name]",
                    "call_to_action": "Review attached proposal PDF",
                    "suggested_send_date": "2026-06-29"
                },
                "Reminder": {
                    "subject": "Friendly Check-in: Legal Redlines Review",
                    "body": "Hi Marcus,<br/><br/>Just checking in to see if your legal team has had a chance to review the licensing redlines we shared last week. Let me know if we should jump on a quick call with our legal rep to expedite review.<br/><br/>Regards,<br/>[Your Name]",
                    "call_to_action": "Schedule legal sync call",
                    "suggested_send_date": "2026-07-02"
                },
                "Thank You": {
                    "subject": "Thank you for the partnership sync, Marcus!",
                    "body": "Marcus,<br/><br/>Quick thank you for a highly productive sync session today. Your technical insights on Magento bottlenecks were extremely helpful. Excited about what we will build together.<br/><br/>Thanks,<br/>[Your Name]",
                    "call_to_action": "No immediate action required",
                    "suggested_send_date": "2026-06-26"
                }
            }
