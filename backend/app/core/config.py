from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mosport API"
    VERSION: str = "7.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    # Using the same Neon DB URL structure
    DATABASE_URL: str = "postgresql://neondb_owner:npg_6qHLaXG0cWop@ep-nameless-river-a1m3110v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI / LLM
    OPENAI_API_KEY: Union[str, None] = None

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
