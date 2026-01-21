from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api import deps
from app.models.models import Venue
from app.schemas.schemas import VenueBase # We might need a more detailed schema later
import uuid

router = APIRouter()

@router.get("/", response_model=List[VenueBase])
async def read_venues(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve venues.
    """
    result = await db.execute(select(Venue).offset(skip).limit(limit))
    venues = result.scalars().all()
    return venues

@router.get("/{venue_id}", response_model=VenueBase)
async def read_venue(
    venue_id: uuid.UUID,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Get venue by ID.
    """
    result = await db.execute(select(Venue).where(Venue.id == venue_id))
    venue = result.scalars().first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue
