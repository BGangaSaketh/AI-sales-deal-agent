import os

class SpeechService:
    @staticmethod
    def transcribe_audio(audio_file_path: str) -> str:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                with open(audio_file_path, "rb") as audio_file:
                    transcript = client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                    return transcript.text
            except Exception as e:
                print(f"Whisper Transcription failed, falling back to mock: {e}")
        else:
            print("OPENAI_API_KEY not found in environment, using mock Whisper transcription.")

        # High-fidelity mock transcript of a sales briefing
        return (
            "Marcus Vance (AeroSpace Corp): Hi Alexander, thanks for jumping on. We've been reviewing the "
            "licensing proposal. The primary bottleneck we're experiencing is cart latency checkout spikes during batch ingestion. "
            "We're seeing latencies above 800ms which is delaying our flight boarding reporting metrics. "
            "Alexander Sterling: That makes sense. We can optimize the batch pipelines. Have you discussed this with your CTO? "
            "Marcus Vance: Not yet. We need technical validation from the CTO's office. However, we're very interested in moving "
            "forward if we can fix this. Pricing-wise, we're a bit over budget by 15%, but we can probably clear that "
            "if the SLA terms are solid and checkouts are fast."
        )
