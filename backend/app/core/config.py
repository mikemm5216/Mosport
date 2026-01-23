from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mosport API"
    VERSION: str = "7.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    # Railway PostgreSQL (Internal connection)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:IKBpagcZJzwTOKKuHPFUmVrVaSpBikAz@postgres.railway.internal:5432/railway"
    
    # Redis
    REDIS_URL: str = "redis://default:lkPGvRLbULzRqwUSOJCYTeIxKpiludly@redis.railway.internal:6379"

    # AI / LLM
    OPENAI_API_KEY: Union[str, None] = None
    
    # Scheduler Control (Constitutional Compliance: 1.4)
    ENABLE_SCHEDULER: bool = True  # Set to False during development/testing
    SCHEDULER_TYPE: str = "apscheduler"  # Options: 'apscheduler', 'celery'
    
    # Worker Concurrency (prevents AI API quota exhaustion)
    MAX_CONCURRENT_JOBS: int = 3
    
    # SLME Frequencies (in seconds) - derived from core/slme.py
    # Can be overridden via environment variables for testing
    FREQ_HOT: int = 300      # 5 minutes (T-1 live verification)
    FREQ_WARM: int = 3600    # 1 hour (T-24 social lock-in)
    FREQ_COOL: int = 21600   # 6 hours (T-7 prediction)
    FREQ_COLD: int = 86400   # 24 hours (low priority)

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
