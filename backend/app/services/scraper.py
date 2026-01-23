"""
Layer A: Acquisition Service (Scraper)
Constitutional Compliance: 1.1 (Compare-only), 1.5 (Shadow Log)

This service is responsibly for fetching raw data from external sources (Social Media).
It MUST NOT store raw data in the primary database (PostgreSQL).
It MUST pass raw data to DTSS for analysis and transient storage (Redis).
"""

import logging
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)

class ScraperService:
    """
    Unified interface for acquiring social media data.
    Currently supports: MOCK
    Planned: Instagram, Facebook
    """
    
    def __init__(self):
        self.sources = ["instagram", "facebook"]

    async def fetch_recent_posts(self, venue_id: str, platform: str = "instagram", limit: int = 5) -> List[Dict[str, Any]]:
        """
        Fetch recent posts for a venue.
        In production, this would call Apify or a custom scraper.
        """
        logger.info(f"Refetching {platform} posts for venue {venue_id} (Limit: {limit})")
        
        # Simulate network delay
        await asyncio.sleep(0.5)
        
        # Mock Logic (Layer A)
        # Returns raw data structure
        return self._generate_mock_posts(venue_id, limit)

    def _generate_mock_posts(self, venue_id: str, count: int) -> List[Dict[str, Any]]:
        """
        Generates realistic mock social media posts for testing DTSS.
        """
        keywords = [
            "Live Match", "Champions League", "Sound ON 🔊", "Full House", 
            "Beer Promos", "Closed for private event", "Open till late", "Big Screen"
        ]
        
        images = [
            "https://example.com/stadium.jpg",
            "https://example.com/crowd.jpg",
            "https://example.com/tv_screen.jpg",
            None # Text only
        ]
        
        posts = []
        for i in range(count):
            text = f"{random.choice(keywords)} - {random.choice(['Come join us!', 'Tonight!', 'Book now'])}"
            
            # Make one post explicitly have "CLOSED" to test overrides
            if i == 0 and random.random() < 0.1:
                text = "Sorry we are CLOSED for a private wedding tonight."
            
            posts.append({
                "id": f"post_{venue_id}_{random.randint(1000,9999)}",
                "text": text,
                "image_url": random.choice(images),
                "timestamp": (datetime.utcnow() - timedelta(hours=i*2)).isoformat(),
                "likes": random.randint(10, 500),
                "platform": "instagram"
            })
            
        return posts

scraper_service = ScraperService()
