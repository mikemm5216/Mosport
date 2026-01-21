from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings

# Initialize logic
# Ideally backed by Redis, but locally might default to memory if not careful.
# Slowapi handles storage_uri. 
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=settings.REDIS_URL,
    default_limits=["100/minute"]
)
