
import asyncio
import csv
import sys
import os
import uuid

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.db.session import AsyncSessionLocal
from app.models.models import Venue
from sqlalchemy.future import select

async def import_venues(csv_file: str):
    print(f"Starting import from {csv_file}...")
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found.")
        print("Please create a 'venues.csv' file with columns: name, city, address, latitude, longitude, event_tags, fan_base")
        return

    async with AsyncSessionLocal() as session:
        with open(csv_file, mode='r', encoding='utf-8-sig') as f: # utf-8-sig to handle BOM from Excel
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                name = row.get('name')
                city = row.get('city')
                
                if not name:
                    continue
                    
                # Try to find existing venue by name and city
                stmt = select(Venue).where(Venue.name == name)
                if city:
                     stmt = stmt.where(Venue.city == city)
                     
                result = await session.execute(stmt)
                venue = result.scalars().first()
                
                if not venue:
                    print(f"➕ Creating: {name}")
                    venue = Venue(id=uuid.uuid4())
                    session.add(venue)
                else:
                    print(f"🔄 Updating: {name}")

                # Update fields
                venue.name = name
                venue.address = row.get('address', '')
                venue.city = city
                venue.country = row.get('country', 'Taiwan')
                # Simple slug generation if missing
                slug = row.get('slug')
                if not slug:
                    slug = f"{name}-{city}".lower().replace(" ", "-").replace(",", "")
                venue.slug = slug
                
                # Lat/Lon
                try:
                    lat = row.get('latitude')
                    lon = row.get('longitude')
                    if lat: venue.latitude = float(lat)
                    if lon: venue.longitude = float(lon)
                except ValueError:
                    print(f"⚠️ Invalid coordinates for {name}")

                # V6.2 Fields
                # Parse event_tags: "tag1|tag2"
                tags_raw = row.get('event_tags', '')
                if tags_raw:
                    venue.event_tags = [t.strip() for t in tags_raw.split('|') if t.strip()]
                
                venue.fan_base = row.get('fan_base')
                
                # Features JSON (optional column)
                features_raw = row.get('features')
                if features_raw:
                     # Assume simple pipe separated features for now or just ignore
                     venue.features = {"raw": features_raw}

                count += 1
            
            await session.commit()
            print(f"✅ Successfully imported/updated {count} venues.")

if __name__ == "__main__":
    # Allow passing file path as argument
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "venues.csv"
    asyncio.run(import_venues(csv_path))
