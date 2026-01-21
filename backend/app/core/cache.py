import redis.asyncio as redis
from app.core.config import settings
import logging
from typing import Optional, Any
import json

logger = logging.getLogger(__name__)

class CacheService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CacheService, cls).__new__(cls)
            try:
                cls._instance.redis = redis.from_url(
                    settings.REDIS_URL, 
                    encoding="utf-8", 
                    decode_responses=True,
                    socket_connect_timeout=2  # Short timeout for fail-safe
                )
            except Exception as e:
                logger.warning(f"Redis initialization failed: {e}")
                cls._instance.redis = None
        return cls._instance

    async def get(self, key: str) -> Optional[Any]:
        if not self.redis:
            return None
        try:
            val = await self.redis.get(key)
            if val:
                try:
                    return json.loads(val)
                except json.JSONDecodeError:
                    return val
            return None
        except Exception as e:
            logger.warning(f"Redis get failed: {e}")
            return None

    async def set(self, key: str, value: Any, ttl: int = 3600) -> bool:
        if not self.redis:
            return False
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            await self.redis.set(key, value, ex=ttl)
            return True
        except Exception as e:
            logger.warning(f"Redis set failed: {e}")
            return False

    async def delete(self, key: str) -> bool:
        if not self.redis:
            return False
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.warning(f"Redis delete failed: {e}")
            return False

cache = CacheService()
