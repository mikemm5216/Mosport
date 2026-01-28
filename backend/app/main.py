from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import logging

from app.core.config import settings
from app.api.api_v1.api import api_router
from app.core.limiter import limiter
from app.core.scheduler import scheduler_manager

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup/shutdown events.
    
    Constitutional Compliance: 1.4 (Scheduler control via config)
    """
    # --- Startup ---
    logger.info("🚀 Mosport Backend Starting...")
    
    if settings.ENABLE_SCHEDULER:
        logger.info(f"Initializing Scheduler System ({settings.SCHEDULER_TYPE})...")
        try:
            scheduler_manager.start()
            logger.info("✅ Scheduler started successfully")
        except Exception as e:
            logger.error(f"❌ Scheduler failed to start: {str(e)}")
            logger.warning("⚠️ Continuing without scheduler (degraded mode)")
    else:
        logger.warning("⚠️ Scheduler is DISABLED via ENABLE_SCHEDULER=False")
    
    yield
    
    # --- Shutdown ---
    logger.info("🛑 Mosport Backend Shutting Down...")
    if settings.ENABLE_SCHEDULER:
        try:
            scheduler_manager.shutdown()
            logger.info("✅ Scheduler stopped gracefully")
        except Exception as e:
            logger.error(f"Error during scheduler shutdown: {str(e)}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to Mosport API (FastAPI Edition)",
        "version": settings.VERSION,
        "docs": "/docs"
    }

from sqlalchemy.sql import text
from app.db.session import engine

@app.get("/health")
async def health_check():
    try:
        # Simple query to check database connection
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
        return {"status": "ok", "db": "connected", "phase": "migration_complete"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        # Return 503 Service Unavailable if DB is down
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
