"""
Scheduler System - Extensible Task Orchestration

--- ANTIGRAVITY_LOG ---
Created: 2026-01-22T21:04+07:00
Purpose: APScheduler implementation with Celery migration path
Modified by: Antigravity Agent
Constitutional Compliance: 1.4 (Portable architecture), 1.5 (Shadow Log)
Future-Proof: Protocol-based design allows Celery swap with minimal changes
---
"""

import logging
from typing import Protocol, Any, runtime_checkable
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.services.event_processor import EventProcessor

logger = logging.getLogger(__name__)


# --- Protocol Definition (Abstract Interface) ---
@runtime_checkable
class TaskScheduler(Protocol):
    """
    Abstract interface for task schedulers.
    
    Any scheduler implementation (APScheduler, Celery, Dramatiq) must implement this.
    This allows swapping schedulers without changing business logic.
    """
    
    def start(self) -> None:
        """Initialize and start the scheduler"""
        ...
    
    def shutdown(self) -> None:
        """Gracefully stop the scheduler"""
        ...
    
    def add_job(self, func: Any, trigger: Any, **kwargs: Any) -> None:
        """Add a job to the scheduler"""
        ...


# --- Job Wrapper Functions ---
async def run_tier_job(tier: str) -> None:
    """
    Wrapper function to execute tier-based processing.
    
    Responsibilities:
    1. Create DB session (managed lifecycle)
    2. Initialize EventProcessor
    3. Execute business logic
    4. Handle cleanup
    
    This wrapper allows the scheduler to remain stateless.
    """
    logger.info(f"⏰ Scheduler triggered: {tier} tier job")
    
    async with AsyncSessionLocal() as session:
        processor = EventProcessor(session)
        result = await processor.process_events_by_tier(tier)
        
        if result.success:
            logger.info(f"✅ {tier} job completed: {result.message}")
        else:
            logger.error(f"❌ {tier} job failed: {result.message}")


# --- APScheduler Implementation ---
class APSchedulerAdapter:
    """
    APScheduler-specific implementation.
    
    Constitutional Compliance:
    - Uses SLME frequencies (no hardcoded times)
    - Respects MAX_CONCURRENT_JOBS limit
    - Can be disabled via ENABLE_SCHEDULER config
    """
    
    def __init__(self):
        self._scheduler = AsyncIOScheduler(
            timezone="UTC",  # Always use UTC for consistency
            job_defaults={
                'coalesce': True,  # Combine missed runs
                'max_instances': settings.MAX_CONCURRENT_JOBS
            }
        )
    
    def start(self) -> None:
        """Start the scheduler and register SLME-based jobs"""
        logger.info("🚀 Starting APScheduler with SLME-driven job frequencies...")
        self._setup_jobs()
        self._scheduler.start()
        logger.info("✅ APScheduler is now running")
    
    def shutdown(self) -> None:
        """Gracefully shut down the scheduler"""
        logger.info("🛑 Shutting down APScheduler...")
        self._scheduler.shutdown(wait=True)
        logger.info("✅ APScheduler stopped")
    
    def add_job(self, func: Any, trigger: Any, **kwargs: Any) -> None:
        """Add a custom job (for future extensibility)"""
        self._scheduler.add_job(func, trigger, **kwargs)
    
    def _setup_jobs(self) -> None:
        """
        Register all SLME-based tier jobs.
        
        Constitutional Compliance:
        - No hardcoded cron times
        - All frequencies from settings.FREQ_* (derived from SLME)
        """
        
        # HOT Tier: Every 5 minutes (T-1 verification)
        self._scheduler.add_job(
            run_tier_job,
            IntervalTrigger(seconds=settings.FREQ_HOT),
            args=["HOT"],
            id="job_hot_tier",
            replace_existing=True,
            name="HOT Tier Processor (T-1 Live Verification)"
        )
        logger.info(f"📌 Registered HOT tier job (every {settings.FREQ_HOT}s / {settings.FREQ_HOT//60}min)")
        
        # WARM Tier: Every 1 hour (T-24 social validation)
        self._scheduler.add_job(
            run_tier_job,
            IntervalTrigger(seconds=settings.FREQ_WARM),
            args=["WARM"],
            id="job_warm_tier",
            replace_existing=True,
            name="WARM Tier Processor (T-24 Social Lock-in)"
        )
        logger.info(f"📌 Registered WARM tier job (every {settings.FREQ_WARM}s / {settings.FREQ_WARM//3600}h)")
        
        # COOL Tier: Every 6 hours (T-7 prediction)
        self._scheduler.add_job(
            run_tier_job,
            IntervalTrigger(seconds=settings.FREQ_COOL),
            args=["COOL"],
            id="job_cool_tier",
            replace_existing=True,
            name="COOL Tier Processor (T-7 Prediction)"
        )
        logger.info(f"📌 Registered COOL tier job (every {settings.FREQ_COOL}s / {settings.FREQ_COOL//3600}h)")
        
        # COLD Tier: Every 24 hours (low priority)
        self._scheduler.add_job(
            run_tier_job,
            IntervalTrigger(seconds=settings.FREQ_COLD),
            args=["COLD"],
            id="job_cold_tier",
            replace_existing=True,
            name="COLD Tier Processor (Low Priority)"
        )
        logger.info(f"📌 Registered COLD tier job (every {settings.FREQ_COLD}s / {settings.FREQ_COLD//86400}d)")
        
        logger.info("🎯 All SLME tier jobs registered successfully")


# --- Future: Celery Implementation (Placeholder) ---
class CeleryAdapter:
    """
    Celery implementation placeholder.
    
    To migrate to Celery:
    1. Implement this class
    2. Change settings.SCHEDULER_TYPE to 'celery'
    3. Run: celery -A app.core.scheduler worker
    
    Business logic (EventProcessor) remains unchanged.
    """
    
    def __init__(self):
        raise NotImplementedError(
            "Celery adapter not yet implemented. "
            "Set SCHEDULER_TYPE='apscheduler' in .env"
        )
    
    def start(self) -> None:
        # from celery import Celery
        # self.app = Celery('mosport', broker=settings.REDIS_URL)
        pass
    
    def shutdown(self) -> None:
        pass
    
    def add_job(self, func: Any, trigger: Any, **kwargs: Any) -> None:
        pass


# --- Factory Function ---
def get_scheduler() -> TaskScheduler:
    """
    Factory function to create scheduler instance based on config.
    
    Returns:
        TaskScheduler implementation (APScheduler or Celery)
    
    Raises:
        NotImplementedError: If SCHEDULER_TYPE is not supported
    """
    scheduler_type = settings.SCHEDULER_TYPE.lower()
    
    if scheduler_type == "celery":
        return CeleryAdapter()
    elif scheduler_type == "apscheduler":
        return APSchedulerAdapter()
    else:
        raise ValueError(
            f"Unknown SCHEDULER_TYPE: {settings.SCHEDULER_TYPE}. "
            "Valid options: 'apscheduler', 'celery'"
        )


# --- Global Singleton ---
scheduler_manager = get_scheduler()
