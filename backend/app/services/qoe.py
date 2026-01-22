"""
QoE (Quality of Experience) Calculator

--- ANTIGRAVITY_LOG ---
Created: 2026-01-22T21:23+07:00
Purpose: Venue experience scoring based on Constitutional Section 3.2
Modified by: Antigravity Agent
Constitutional Reference: PRODUCT_SPEC.md Section 3.2
---

Scoring Logic:
- Liveness: 過去 30 天社交媒體活動 (25 分)
- Visual: Big Screen vs Standard (30 分)
- Audio: Sound ON vs Background Music (25 分)
- Vibe: Rowdy vs Chill (20 分)

Total: 100 分制
"""

import logging
from typing import Dict, Any
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class QoECalculator:
    """
    Quality of Experience Score Calculator
    
    Constitutional Compliance: Section 3.2
    All scores are derivative data (safe for PostgreSQL storage)
    """
    
    # Scoring Weights (total = 100)
    WEIGHTS = {
        "liveness": 25,
        "visual": 30,
        "audio": 25,
        "vibe": 20
    }
    
    # Tag Value Mappings
    VISUAL_VALUES = {
        "Big Screen": 30,
        "Standard": 15,
        None: 0
    }
    
    AUDIO_VALUES = {
        "Sound ON": 25,
        "Background Music": 10,
        None: 0
    }
    
    VIBE_VALUES = {
        "Rowdy": 20,  # High-energy sports bar
        "Chill": 10,  # Relaxed atmosphere
        None: 0
    }
    
    @classmethod
    def calculate_score(cls, venue_tags: Dict[str, Any]) -> float:
        """
        Calculate QoE Score from venue tags.
        
        Args:
            venue_tags: Dict with keys:
                - liveness: bool (True if social media active in last 30 days)
                - visual: str ("Big Screen" or "Standard")
                - audio: str ("Sound ON" or "Background Music")
                - vibe: str ("Rowdy" or "Chill")
        
        Returns:
            Float score 0.0-100.0
        
        Example:
            >>> tags = {
            ...     "liveness": True,
            ...     "visual": "Big Screen",
            ...     "audio": "Sound ON",
            ...     "vibe": "Rowdy"
            ... }
            >>> QoECalculator.calculate_score(tags)
            100.0
        """
        score = 0.0
        
        # 1. Liveness (25 points)
        if venue_tags.get("liveness"):
            score += cls.WEIGHTS["liveness"]
            logger.debug("Liveness: +25 points")
        
        # 2. Visual (30 points)
        visual = venue_tags.get("visual")
        visual_score = cls.VISUAL_VALUES.get(visual, 0)
        score += visual_score
        logger.debug(f"Visual ({visual}): +{visual_score} points")
        
        # 3. Audio (25 points)
        audio = venue_tags.get("audio")
        audio_score = cls.AUDIO_VALUES.get(audio, 0)
        score += audio_score
        logger.debug(f"Audio ({audio}): +{audio_score} points")
        
        # 4. Vibe (20 points)
        vibe = venue_tags.get("vibe")
        vibe_score = cls.VIBE_VALUES.get(vibe, 0)
        score += vibe_score
        logger.debug(f"Vibe ({vibe}): +{vibe_score} points")
        
        logger.info(f"QoE Score calculated: {score}/100")
        return score
    
    @classmethod
    def generate_tags_from_dtss(cls, dtss_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert DTSS analysis result into QoE tags.
        
        Args:
            dtss_result: Output from DTSSService.analyze_venue_post()
        
        Returns:
            Dict with qoe_tags ready for scoring
        
        Example:
            >>> dtss_output = {
            ...     "has_live_event": True,
            ...     "qoe_update": {"visual": "Big Screen", "audio": "Sound ON"}
            ... }
            >>> QoECalculator.generate_tags_from_dtss(dtss_output)
            {
                "liveness": True,
                "visual": "Big Screen",
                "audio": "Sound ON",
                "vibe": None  # Need manual annotation
            }
        """
        qoe_update = dtss_result.get("qoe_update", {})
        
        tags = {
            "liveness": dtss_result.get("has_live_event", False),
            "visual": qoe_update.get("visual"),
            "audio": qoe_update.get("audio"),
            "vibe": None  # Vibe usually requires historical pattern analysis
        }
        
        return tags
    
    @classmethod
    def classify_venue_tier(cls, score: float) -> str:
        """
        Classify venue into tiers based on QoE score.
        
        Args:
            score: QoE score (0-100)
        
        Returns:
            Tier classification string
        """
        if score >= 80:
            return "Premium"  # Perfect sports viewing experience
        elif score >= 60:
            return "Standard"  # Good experience
        elif score >= 40:
            return "Basic"  # Acceptable
        else:
            return "Unverified"  # Not recommended for live sports
    
    @classmethod
    def should_recommend(cls, score: float, event_importance: str = "normal") -> bool:
        """
        Determine if venue should be recommended for an event.
        
        Args:
            score: QoE score
            event_importance: "high" (WBC Final), "normal", "low"
        
        Returns:
            Boolean recommendation
        """
        thresholds = {
            "high": 80,    # Only premium venues for major events
            "normal": 60,  # Standard+ for regular matches
            "low": 40      # Basic+ for casual viewing
        }
        
        threshold = thresholds.get(event_importance, 60)
        return score >= threshold


# Singleton instance
qoe_calculator = QoECalculator()
