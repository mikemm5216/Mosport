
import asyncio
import sys
import os
from datetime import datetime

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.db.session import AsyncSessionLocal
from app.models.models import Event
from app.services.api_service import api_sports_service
from sqlalchemy.future import select

async def sync_fixtures():
    print("⚾ Fetching WBC fixtures from API-Sports...")
    
    fixtures = api_sports_service.get_wbc_fixtures(season=2026)
    
    if not fixtures:
        print("⚠️ No fixtures found. Check API Key or League ID.")
        return

    async with AsyncSessionLocal() as session:
        count = 0
        for game in fixtures:
            # Parse data from API-Baseball response structure
            # Example structure: { "id": 123, "date": "...", "teams": { "home": {...}, "away": {...} }, "status": {...} }
            
            api_id = game.get("id") # Store this? we don't have api_id column yet. use loose matching.
            
            teams = game.get("teams", {})
            home_team = teams.get("home", {}).get("name")
            away_team = teams.get("away", {}).get("name")
            
            if not home_team or not away_team:
                continue
                
            start_str = game.get("date") # ISO format
            try:
                start_time = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
            except:
                start_time = datetime.now()

            # Check if event exists
            stmt = select(Event).where(
                (Event.team_a == home_team) & 
                (Event.team_b == away_team) & 
                (Event.league == "WBC")
            )
            result = await session.execute(stmt)
            event = result.scalars().first()
            
            status_long = game.get("status", {}).get("long", "Scheduled")
            
            if not event:
                print(f"➕ Creating: {home_team} vs {away_team}")
                event = Event(
                    title=f"{home_team} vs {away_team}",
                    league="WBC",
                    sport="Baseball",
                    team_a=home_team,
                    team_b=away_team,
                    start_time=start_time,
                    status=status_long.lower()
                )
                session.add(event)
            else:
                print(f"🔄 Updating: {home_team} vs {away_team}")
                event.start_time = start_time
                event.status = status_long.lower()
            
            count += 1
            
        await session.commit()
        print(f"✅ Synced {count} fixtures.")

if __name__ == "__main__":
    asyncio.run(sync_fixtures())
