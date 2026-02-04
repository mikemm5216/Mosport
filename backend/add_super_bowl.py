
import asyncio
import sys
import os
from datetime import datetime
import uuid

# Ensure backend module can be imported
sys.path.append(os.getcwd())
# Depending on where we run it, we might need to add 'backend' to path
if os.path.exists(os.path.join(os.getcwd(), 'backend')):
    sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.db.session import AsyncSessionLocal
from app.models.models import Event, Venue, VenueEvent
from sqlalchemy.future import select

async def add_super_bowl():
    print("Adding Super Bowl LIX...")

    async with AsyncSessionLocal() as session:
        # 1. Create Event
        stmt = select(Event).where(
            (Event.league == "NFL") & 
            (Event.team_a == "Kansas City Chiefs")
        )
        result = await session.execute(stmt)
        event = result.scalars().first()
        
        if event:
             print("Super Bowl already exists! Updating...")
             event.start_time = datetime.fromisoformat("2026-02-09T06:30:00")
             event.title = "Super Bowl LIX: Chiefs vs 49ers"
        else:
            print("Creating Event: Super Bowl LIX")
            event = Event(
                id=uuid.uuid4(),
                title="Super Bowl LIX: Chiefs vs 49ers",
                league="NFL",
                sport="American Football",
                team_a="Kansas City Chiefs",
                team_b="San Francisco 49ers",
                start_time=datetime.fromisoformat("2026-02-09T06:30:00"),
                status="scheduled"
            )
            session.add(event)
            await session.flush()

        # 2. Link to Venues
        stmt_venue = select(Venue).where(Venue.name.ilike("%Puku%"))
        result_venue = await session.execute(stmt_venue)
        puku = result_venue.scalars().first()
        
        venues_to_link = []
        if puku:
            venues_to_link.append(puku)
        
        stmt_more = select(Venue).limit(3)
        result_more = await session.execute(stmt_more)
        venues_to_link.extend(result_more.scalars().all())
        
        venues_to_link = list({v.id: v for v in venues_to_link}.values())

        if venues_to_link:
            print(f"Linking to {len(venues_to_link)} venues...")
            for venue in venues_to_link:
                stmt_link = select(VenueEvent).where(
                    (VenueEvent.venue_id == venue.id) &
                    (VenueEvent.event_id == event.id)
                )
                result_link = await session.execute(stmt_link)
                link = result_link.scalars().first()
                
                if not link:
                    print(f"   -> Linked to {venue.name}")
                    link = VenueEvent(
                        venue_id=venue.id,
                        event_id=event.id,
                        verification_status="confirmed"
                    )
                    session.add(link)
        else:
            print("No venues found in DB to link to.")

        await session.commit()
        print("Super Bowl Added Successfully!")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(add_super_bowl())
