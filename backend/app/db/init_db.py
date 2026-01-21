import asyncio
import uuid
from datetime import datetime, timedelta, timezone

from app.db.session import AsyncSessionLocal
from app.models.models import Venue, Event, VenueEvent, User
from sqlalchemy.future import select

async def init_db():
    print("Initializing Database with Hanoi Puku Cafe Scenario...")
    async with AsyncSessionLocal() as session:
        # 1. Create Venue Owner (Staff) if not exists
        result = await session.execute(select(User).where(User.email == "staff@mosport.app"))
        user = result.scalars().first()
        if not user:
            user = User(
                id=uuid.uuid4(),
                email="staff@mosport.app",
                role="STAFF",
                name="Mosport Admin",
                provider="google"
            )
            session.add(user)
            await session.commit()
            print("Created Staff User.")

        # 2. Create Venue: Puku Cafe
        result = await session.execute(select(Venue).where(Venue.slug == "puku-cafe-hanoi"))
        venue = result.scalars().first()
        if not venue:
            venue = Venue(
                id=uuid.uuid4(),
                owner_id=user.id,
                name="Puku Cafe and Sports Bar",
                slug="puku-cafe-hanoi",
                address="16-18 Tong Duy Tan",
                city="Hanoi",
                country="Vietnam",
                qoe_score=4.8,
                is_verified=True,
                latitude=21.0285,
                longitude=105.8542
            )
            session.add(venue)
            print("Created Venue: Puku Cafe.")
        else:
            print("Venue Puku Cafe already exists.")

        # 3. Create Event: Man Utd vs Liverpool (Hot Game)
        # Set start time to 30 mins from now to simulate "Soon/Live"
        start_time = datetime.now(timezone.utc) + timedelta(minutes=30)
        
        result = await session.execute(select(Event).where(Event.team_a == "Man Utd"))
        event = result.scalars().first()
        
        if not event:
            event = Event(
                id=uuid.uuid4(),
                title="Man Utd vs Liverpool",
                league="Premier League",
                sport="Football",
                team_a="Man Utd",
                team_b="Liverpool",
                start_time=start_time,
                status="scheduled"
            )
            session.add(event)
            print("Created Event: Man Utd vs Liverpool.")
        else:
            # Update time to ensure it shows up as relevant
            event.start_time = start_time
            print("Updated Event time.")

        # 4. Link Venue to Event (AI Verified)
        await session.flush() # Ensure IDs are available
        
        result = await session.execute(select(VenueEvent).where(
            VenueEvent.venue_id == venue.id,
            VenueEvent.event_id == event.id
        ))
        link = result.scalars().first()
        
        if not link:
            link = VenueEvent(
                id=uuid.uuid4(),
                venue_id=venue.id,
                event_id=event.id,
                verification_status="confirmed" # or 'authority' which frontend treats as verified
            )
            session.add(link)
            print("Linked Puku Cafe to Match (AI Verified).")
        else:
            link.verification_status = "confirmed"
            print("Link already exists, updated status.")

        await session.commit()
        print("Data Initialization Complete.")

if __name__ == "__main__":
    asyncio.run(init_db())
