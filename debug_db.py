
import asyncio
import sys
import os
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.db.session import AsyncSessionLocal
from app.models.models import Venue, Event, VenueEvent

async def inspect():
    async with AsyncSessionLocal() as session:
        print("--- Venues ---")
        result = await session.execute(select(Venue))
        venues = result.scalars().all()
        for v in venues:
            print(f"[{v.city}] {v.name} (ID: {v.id})")
        
        print("\n--- Events ---")
        result = await session.execute(select(Event))
        events = result.scalars().all()
        for e in events:
            print(f"{e.team_a} vs {e.team_b} (ID: {e.id})")
            
        print("\n--- Links (VenueEvent) ---")
        result = await session.execute(select(VenueEvent).options(selectinload(VenueEvent.venue), selectinload(VenueEvent.event)))
        links = result.scalars().all()
        for l in links:
             v_name = l.venue.name if l.venue else "Unknown"
             e_title = l.event.title if l.event else "Unknown"
             print(f"{v_name} -> {e_title} ({l.verification_status})")

if __name__ == "__main__":
    asyncio.run(inspect())
