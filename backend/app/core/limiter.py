"""
Rate Limiter - Role-Based Request Throttling

--- ANTIGRAVITY_LOG ---
Created: 2026-01-22T21:23+07:00 (Updated from original)
Purpose: Role-based rate limiting per Constitutional Section 4
Modified by: Antigravity Agent
Constitutional Reference: PRODUCT_SPEC.md Section 4 - API Rate Limiting
---

Rate Limits per Role:
- FANS: 60 req/min (strict IP-based throttling)
- VENUES: 100 req/min (moderate limits)
- STAFF: No limit (internal debugging)
- Guest (unauthenticated): 30 req/min (strictest)
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings
from starlette.requests import Request
from typing import Callable
import logging

logger = logging.getLogger(__name__)

# Role-based rate limits (Constitutional: Section 4)
RATE_LIMITS = {
    "fan": "60/minute",      # FANS: Strict limit per Constitution
    "venue": "100/minute",   # VENUES: Moderate
    "staff": "10000/minute", # STAFF: Effectively unlimited (for debugging)
    "guest": "30/minute"     # Unauthenticated: Strictest
}


def get_user_key(request: Request) -> str:
    """
    Custom key function for role-based rate limiting.
    
    Returns a key combining IP + role for granular throttling.
    Constitutional Compliance: Section 4 - FANS角色實作嚴格的IP頻率限制
    
    Args:
        request: FastAPI/Starlette request object
    
    Returns:
        str: Cache key for rate limiting (e.g., "192.168.1.1:fan")
    """
    # Get client IP
    client_ip = get_remote_address(request)
    
    # Try to extract user role from request state (set by auth middleware)
    # In production, this would come from JWT token or session
    user_role = getattr(request.state, "user_role", "guest")
    
    # Construct composite key
    key = f"{client_ip}:{user_role}"
    
    logger.debug(f"Rate limit key: {key}")
    return key


def get_limit_for_role(request: Request) -> str:
    """
    Dynamic limit provider based on user role.
    
    Returns the appropriate rate limit string for the request's user role.
    
    Args:
        request: Starlette request
    
    Returns:
        str: Rate limit (e.g., "60/minute")
    """
    user_role = getattr(request.state, "user_role", "guest")
    limit = RATE_LIMITS.get(user_role.lower(), RATE_LIMITS["guest"])
    
    logger.debug(f"Role: {user_role}, Limit: {limit}")
    return limit


# Initialize Limiter with role-based key function
limiter = Limiter(
    key_func=get_user_key,
    storage_uri=settings.REDIS_URL,
    default_limits=["100/minute"],  # Fallback if role detection fails
    headers_enabled=True  # Add X-RateLimit-* headers to responses
)


# Helper function for endpoints to use role-specific limits
def role_based_limit() -> Callable:
    """
    Decorator factory for role-based rate limiting.
    
    Usage in endpoints:
        @router.get("/events")
        @limiter.limit(role_based_limit())
        async def get_events(request: Request):
            ...
    
    This will apply:
    - 60/min for FANS
    - 100/min for VENUES
    - Unlimited for STAFF
    - 30/min for guests
    """
    return get_limit_for_role
