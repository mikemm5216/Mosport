import redis.asyncio as redis
from app.core.config import settings
import logging
from typing import Optional, Any
import json

logger = logging.getLogger(__name__)

# Constitutional Compliance: Section 3.3 Smart Caching
# TTL tiers for different data types
class CacheTTL:
    """
    Cache TTL Constants (Section 3.3 - Cache as ATM)
    
    - STATIC: 30 days - Venue location, facilities, hotel lists
    - SEMI_DYNAMIC: 7 days - Event fixtures, schedules
    - RAW: 48 hours - Social media posts, scraping data
    - SESSION: 1 hour - User session data
    """
    STATIC = 86400 * 30       # 30 days (2,592,000 seconds)
    SEMI_DYNAMIC = 86400 * 7  # 7 days (604,800 seconds)
    RAW = 86400 * 2           # 48 hours (172,800 seconds)
    SESSION = 3600            # 1 hour


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

    async def set(self, key: str, value: Any, ttl: int = CacheTTL.RAW) -> bool:
        """
        Set cache value with TTL.
        
        Args:
            key: Cache key
            value: Value to cache (dict/list will be JSON serialized)
            ttl: Time-to-live in seconds. Use CacheTTL constants:
                - CacheTTL.STATIC (30 days) - Venue info, locations
                - CacheTTL.SEMI_DYNAMIC (7 days) - Event fixtures
                - CacheTTL.RAW (48 hours) - Social media posts (default)
                - CacheTTL.SESSION (1 hour) - User sessions
        
        Returns:
            bool: Success status
        
        Example:
            # Store venue location (static data)
            await cache.set("venue:123:location", {...}, CacheTTL.STATIC)
            
            # Store event fixture (semi-dynamic)
            await cache.set("event:456:fixture", {...}, CacheTTL.SEMI_DYNAMIC)
            
            # Store raw social post (default)
            await cache.set("raw:post:789", {...})  # Uses CacheTTL.RAW
        """
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
