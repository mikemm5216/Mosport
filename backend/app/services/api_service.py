
import requests
import logging
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class APISportsService:
    """
    Integration with API-Sports (Football/Baseball).
    For WBC 2026, we use the Baseball API.
    """
    # Documentation: https://api-sports.io/documentation/baseball/v1
    BASE_URL_BASEBALL = "https://v1.baseball.api-sports.io"
    
    def __init__(self):
        self.headers = {
            'x-rapidapi-host': "v1.baseball.api-sports.io",
            'x-rapidapi-key': settings.API_FOOTBALL_KEY or ""
        }
        
    def get_wbc_fixtures(self, season: int = 2026) -> List[Dict[str, Any]]:
        """
        Fetch WBC fixtures. 
        """
        if not settings.API_FOOTBALL_KEY:
            logger.warning("⚠️ No API_FOOTBALL_KEY set. Cannot fetch real fixtures.")
            return [] # In production, maybe fallback to mock?
            
        endpoint = f"{self.BASE_URL_BASEBALL}/games"
        # Note: You need to find the specific League ID for WBC in API-Baseball.
        # For now, we use a placeholder '10' (needs verification).
        params = {"league": 10, "season": season} 
        
        try:
            logger.info(f"Fetching WBC fixtures from {endpoint}...")
            response = requests.get(endpoint, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data.get("response", [])
        except Exception as e:
            logger.error(f"❌ Error fetching WBC fixtures: {e}")
            return []

api_sports_service = APISportsService()
