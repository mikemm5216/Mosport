"""
Event Processor - Core Business Logic (Scheduler-Agnostic)

--- ANTIGRAVITY_LOG ---
Created: 2026-01-22T21:04+07:00
Purpose: Tier-based event processing logic, callable by any scheduler
Modified by: Antigravity Agent
Constitutional Compliance: 1.1 (Derivative only), 1.2 (Backend logic)
---
"""

import logging
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.models import Event, Venue, VenueEvent
from app.services.dtss import dtss_service
from app.services.qoe import qoe_calculator
from app.core.slme import slme
from app.core.cache import cache, CacheTTL

logger = logging.getLogger(__name__)


class ProcessResult:
    """Result object for monitoring and logging"""
    def __init__(self, success: bool, message: str, events_processed: int = 0):
        self.success = success
        self.message = message
        self.events_processed = events_processed
        self.timestamp = datetime.utcnow()


class EventProcessor:
    """
    Core business logic for event verification and processing.
    
    Design Philosophy:
    - No scheduler-specific code (can be called by APScheduler, Celery, or API)
    - All methods are async (compatible with various execution contexts)
    - Returns explicit Result objects for monitoring
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def process_events_by_tier(self, tier: str) -> ProcessResult:
        """
        Process events based on their lifecycle tier (HOT/WARM/COOL/COLD).
        
        This is the main entry point called by schedulers.
        
        Args:
            tier: One of 'HOT', 'WARM', 'COOL', 'COLD' (from SLME)
        
        Returns:
            ProcessResult with success status and metadata
        """
        logger.info(f"🔥 Processing {tier} tier events...")
        
        try:
            # 1. Query events that match this tier
            events = await self._get_events_by_tier(tier)
            
            if not events:
                logger.info(f"No {tier} events found.")
                return ProcessResult(True, f"No {tier} events to process", 0)
            
            logger.info(f"Found {len(events)} {tier} events")
            
            # 2. Process each event
            processed_count = 0
            for event in events:
                try:
                    await self._process_single_event(event, tier)
                    processed_count += 1
                except Exception as e:
                    logger.error(f"Error processing event {event.id}: {str(e)}")
                    # Continue with other events
            
            return ProcessResult(
                True, 
                f"Processed {processed_count}/{len(events)} {tier} events",
                processed_count
            )
            
        except Exception as e:
            logger.error(f"Tier processing failed for {tier}: {str(e)}")
            return ProcessResult(False, str(e), 0)
    
    async def _get_events_by_tier(self, tier: str) -> List[Event]:
        """
        Query events that belong to a specific lifecycle tier.
        
        Uses SLME logic to determine tier based on start_time.
        """
        # Get all upcoming/live events
        result = await self.db.execute(
            select(Event).where(Event.status.in_(['scheduled', 'live']))
        )
        all_events = result.scalars().all()
        
        # Filter by SLME tier
        tier_events = [
            event for event in all_events
            if slme.get_tier(event.start_time, event.status) == tier
        ]
        
        return tier_events
    
    async def _process_single_event(self, event: Event, tier: str) -> None:
        """
        Process a single event based on its tier.
        
        Different tiers trigger different verification actions:
        - HOT (T-1): Live status check
        - WARM (T-24): Social validation
        - COOL (T-7): Predictive check
        """
        logger.debug(f"Processing event {event.id} ({event.title}) - Tier: {tier}")
        
        if tier == "HOT":
            # T-1 Hour: Live verification
            await self._verify_live_status(event)
        
        elif tier == "WARM":
            # T-24 Hours: Social media lock-in
            await self._verify_social_posts(event)
        
        elif tier in ["COOL", "COLD"]:
            # T-7 Days: Predictive check (lighter processing)
            await self._update_prediction_score(event)
    
    async def _verify_live_status(self, event: Event) -> None:
        """T-1 Verification: Check if venues are actually showing the event"""
        logger.info(f"[T-1] Verifying live status for: {event.title}")
        
        # Get associated venues
        result = await self.db.execute(
            select(VenueEvent).where(VenueEvent.event_id == event.id)
        )
        venue_events = result.scalars().all()
        
        for ve in venue_events:
            # Call DTSS to analyze latest venue post (mock data for MVP)
            # In production, this would fetch actual social media posts
            analysis = await dtss_service.analyze_venue_post(
                venue_id=str(ve.venue_id),
                post_id="latest",
                text=f"Mock post for {event.title}",
                image_url=None
            )
            
            # Update confidence
            await self.update_event_confidence(
                str(event.id), 
                analysis["event_confidence"]
            )
            
            # Calculate and update QoE Score (Constitutional: Section 3.2)
            qoe_tags = qoe_calculator.generate_tags_from_dtss(analysis)
            qoe_score = qoe_calculator.calculate_score(qoe_tags)
            
            # Update venue QoE score in database (derivative data)
            venue_result = await self.db.execute(
                select(Venue).where(Venue.id == ve.venue_id)
            )
            venue = venue_result.scalars().first()
            if venue:
                venue.qoe_score = qoe_score / 100  # Normalize to 0.0-1.0
                logger.info(f"Updated QoE for Venue {venue.name}: {qoe_score}/100")
            
            # Cache QoE tags for quick access (Constitutional: Section 3.3)
            await cache.set(
                f"venue:{ve.venue_id}:qoe_tags",
                qoe_tags,
                ttl=CacheTTL.SEMI_DYNAMIC  # 7 days - tags change infrequently
            )
            
            # Trigger alert if override detected
            if analysis["override_status"]:
                await self.trigger_interventional_alert(str(event.id))
    
    async def _verify_social_posts(self, event: Event) -> None:
        """T-24 Verification: Social media validation"""
        logger.info(f"[T-24] Social validation for: {event.title}")
        # Implement social media scraping logic here
        pass
    
    async def _update_prediction_score(self, event: Event) -> None:
        """T-7 Verification: Historical prediction"""
        logger.info(f"[T-7] Prediction update for: {event.title}")
        # Implement historical pattern analysis here
        pass
    
    async def update_event_confidence(self, event_id: str, score: float) -> bool:
        """
        Update event confidence score (Derivative data - PostgreSQL safe).
        
        Constitutional Compliance: Only stores derivative score, not raw data.
        """
        try:
            result = await self.db.execute(
                select(Event).where(Event.id == event_id)
            )
            event = result.scalars().first()
            
            if event:
                # Store derivative only
                event.confidence_score = score
                event.last_verified = datetime.utcnow()
                await self.db.commit()
                
                logger.info(f"Updated confidence for event {event_id}: {score:.2f}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to update confidence: {str(e)}")
            await self.db.rollback()
            return False
    
    async def trigger_interventional_alert(self, event_id: str) -> None:
        """
        Fail-Safe Trigger: Send alert when venue override detected.
        
        Examples: 'Private Event', 'Closed', 'Sold Out'
        """
        logger.warning(f"🚨 INTERVENTIONAL ALERT triggered for Event {event_id}")
        
        # Update event status
        result = await self.db.execute(
            select(Event).where(Event.id == event_id)
        )
        event = result.scalars().first()
        
        if event:
            event.status = "cancelled"  # or create new status "overridden"
            event.override_reason = "Venue reported unavailable"
            await self.db.commit()
            
            # In production: Send push notification, update frontend, etc.
            logger.info(f"Event {event_id} marked as cancelled due to override")
