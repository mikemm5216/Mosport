from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.api import deps
from app.models.models import Event, VenueEvent
from app.schemas.schemas import EventWithVenues

from starlette.requests import Request
from app.core.limiter import limiter, role_based_limit

router = APIRouter()

@router.get("/", response_model=List[EventWithVenues])
@limiter.limit(role_based_limit())  # Constitutional: Role-based rate limiting
async def read_events(
    request: Request,
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    sport: Optional[str] = None,
    league: Optional[str] = None
) -> Any:
    """
    Retrieve events with their matched venues.
    """
    query = select(Event).options(
        selectinload(Event.venues).selectinload(VenueEvent.venue)
    ).offset(skip).limit(limit)

    if sport:
        query = query.filter(Event.sport == sport)
    if league:
        query = query.filter(Event.league == league)
        
    result = await db.execute(query)
    events = result.scalars().all()
    
    # Transform for response
    # The Pydantic model expects a structure, we might need manual mapping 
    # if the SQLAlchemy relations aren't 1:1 with Schema aliases.
    # For now, relying on orm_mode=True in Pydantic.
    return events
