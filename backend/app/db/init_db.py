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

        # ==========================================
        # 5. Seed Additional Regions (Bangkok, Taipei, Singapore, Tokyo, Osaka)
        # ==========================================
        
        venues_data = [
            {
                "name": "The Sportsman Sports Bar",
                "slug": "the-sportsman-bangkok",
                "address": "Unit 10/22 Sukhumvit Soi 13",
                "city": "Bangkok",
                "country": "Thailand",
                "qoe_score": 4.5,
                "lat": 13.740,
                "lon": 100.557,
                "tags": ["sports bar", "pool", "american football", "premier league"]
            },
            {
                "name": "The Brass Monkey",
                "slug": "brass-monkey-taipei",
                "address": "166 Fuxing North Road",
                "city": "Taipei",
                "country": "Taiwan",
                "qoe_score": 4.6,
                "lat": 25.052,
                "lon": 121.544,
                "tags": ["sports bar", "salsa", "rugby", "cricket"]
            },
            {
                "name": "Harry's Boat Quay",
                "slug": "harrys-boat-quay-sg",
                "address": "28 Boat Quay",
                "city": "Singapore",
                "country": "Singapore",
                "qoe_score": 4.4,
                "lat": 1.286,
                "lon": 103.849,
                "tags": ["sports bar", "river view", "f1", "football"]
            },
            {
                "name": "HUB Shibuya",
                "slug": "hub-shibuya-tokyo",
                "address": "3-10 Udagawacho, Shibuya",
                "city": "Tokyo",
                "country": "Japan",
                "qoe_score": 4.3,
                "lat": 35.660,
                "lon": 139.698,
                "tags": ["pub", "british", "football", "baseball"]
            },
            {
                "name": "The Blarney Stone",
                "slug": "blarney-stone-osaka",
                "address": "Shinsaibashi",
                "city": "Osaka",
                "country": "Japan",
                "qoe_score": 4.7,
                "lat": 34.671,
                "lon": 135.501,
                "tags": ["irish pub", "live music", "rugby", "gaelic"]
            }
        ]

        for v_data in venues_data:
            # Check if venue exists
            result = await session.execute(select(Venue).where(Venue.slug == v_data["slug"]))
            existing_venue = result.scalars().first()
            
            if not existing_venue:
                new_venue = Venue(
                    id=uuid.uuid4(),
                    owner_id=user.id,
                    name=v_data["name"],
                    slug=v_data["slug"],
                    address=v_data["address"],
                    city=v_data["city"],
                    country=v_data["country"],
                    qoe_score=v_data["qoe_score"],
                    is_verified=True,
                    latitude=v_data["lat"],
                    longitude=v_data["lon"],
                    tags=v_data["tags"]
                )
                session.add(new_venue)
                # Link to Event
                await session.flush()
                
                link = VenueEvent(
                    id=uuid.uuid4(),
                    venue_id=new_venue.id,
                    event_id=event.id,
                    verification_status="confirmed"
                )
                session.add(link)
                print(f"Created Venue & Linked: {v_data['name']}")
            else:
                print(f"Venue exists: {v_data['name']}")

        await session.commit()
        print("Data Initialization Complete.")

if __name__ == "__main__":
    asyncio.run(init_db())
