"""
Mo Engine Search API Endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.services import search as search_service

router = APIRouter()


@router.get("/venues")
async def search_venues(
    q: str = Query(..., description="Search query (team, league, event, venue name)"),
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    limit: int = Query(20, ge=1, le=100, description="Max results"),
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Search venues with Mo Engine weighted formula
    
    Returns venues sorted by:
    1. Live Signal (T-1 status) - highest priority
    2. Text match + Distance + Trust Score
    """
    results = await search_service.search_venues(
        db=db,
        query=q,
        user_lat=lat,
        user_lon=lon,
        limit=limit
    )
    
    return {
        "query": q,
        "results": results,
        "count": len(results)
    }


@router.get("/trending")
async def get_trending(
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Get trending tags and events for Zero State
    
    Used when user clicks search box but hasn't typed anything yet
    """
    tags = await search_service.get_trending_tags(db=db, limit=10)
    events = await search_service.get_trending_events(db=db, limit=5)
    
    return {
        "tags": tags,
        "events": events
    }


@router.get("/fallback")
async def get_fallback(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Get fallback venues for "No Results" state
    
    Returns popular sports bars near user
    """
    venues = await search_service.get_fallback_venues(
        db=db,
        user_lat=lat,
        user_lon=lon,
        limit=limit
    )
    
    return {
        "venues": venues,
        "count": len(venues)
    }
