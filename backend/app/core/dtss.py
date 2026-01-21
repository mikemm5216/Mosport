import logging
from typing import Optional, List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIJudge:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = None
        
        if self.api_key:
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=self.api_key)
            except ImportError:
                logger.error("OpenAI package not installed.")
        else:
            logger.info("No OPENAI_API_KEY found. DTSS running in Mock Mode.")

    async def evaluate_post(self, text: str, image_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyzes social post content to determine if it validates a match.
        Returns: { "is_match": bool, "confidence": float, "tags": List[str] }
        """
        # 1. Mock Mode (Fail-safe)
        if not self.client:
            return self._mock_evaluation(text)

        # 2. Real AI Judgment
        try:
            # Construct prompt
            messages = [
                {"role": "system", "content": "You are a sports verification AI. Analyze the post to confirm if a sports venue is showing a match. Return JSON only: {is_match, confidence, tags}."},
                {"role": "user", "content": f"Post: {text}"}
            ]
            
            if image_url:
                messages[1]["content"] = [
                    {"type": "text", "text": f"Post: {text}"},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]

            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                response_format={"type": "json_object"},
                max_tokens=150
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            logger.error(f"AI Evaluation failed: {e}")
            # Fallback to neutral mock on error
            return {"is_match": False, "confidence": 0.0, "tags": [], "error": str(e)}

    def _mock_evaluation(self, text: str) -> Dict[str, Any]:
        """
        Deterministic mock logic for testing without API usage.
        """
        text_lower = text.lower()
        if "football" in text_lower or "match" in text_lower or "live" in text_lower:
            return {
                "is_match": True,
                "confidence": 0.85,
                "tags": ["Big Screen", "Sound ON"] if "sound" in text_lower else ["Big Screen"]
            }
        
        return {
            "is_match": False,
            "confidence": 0.1,
            "tags": []
        }

dtss_judge = AIJudge()
