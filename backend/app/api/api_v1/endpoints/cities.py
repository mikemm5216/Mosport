"""
Cities API endpoint
Provides list of cities with venue counts and GPS-based distance calculations
"""
from fastapi import APIRouter, Query, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Optional, List
import math

from app.database import get_db
from app.models.models import Venue

router = APIRouter()

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two points on Earth using Haversine formula
    Returns distance in kilometers
    """
    R = 6371  # Earth radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat/2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon/2) ** 2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    
    return distance

def get_country_code(country: str) -> str:
    """Map country name to ISO code"""
    mapping = {
        "Vietnam": "VN",
        "Thailand": "TH",
        "Singapore": "SG",
        "Malaysia": "MY",
        "Philippines": "PH",
        "Indonesia": "ID",
        "Cambodia": "KH",
        "Taiwan": "TW",
        "Japan": "JP",
        "South Korea": "KR"
    }
    return mapping.get(country, "")

def get_flag_emoji(country: str) -> str:
    """Convert country name to flag emoji"""
    code = get_country_code(country)
    if not code:
        return ""
    
    # Convert country code to regional indicator symbols (flag emoji)
    return ''.join(chr(127397 + ord(c)) for c in code)

@router.get("/cities")
async def get_cities(
    lat: Optional[float] = Query(None, description="User latitude for distance calculation"),
    lng: Optional[float] = Query(None, description="User longitude for distance calculation"),
    db: Session = Depends(get_db)
):
    """
    Get all available cities with venue counts and optional distance calculations.
    
    If lat/lng provided:
    - Cities sorted by distance
    - Distance included in response
    - is_nearby flag for cities < 100km
    
    Otherwise:
    - Alphabetical by country then city
    """
    
    # Query venues grouped by city/country with average coordinates
    query = db.query(
        Venue.city,
        Venue.country,
        func.avg(Venue.latitude).label('latitude'),
        func.avg(Venue.longitude).label('longitude'),
        func.count().label('venue_count')
    ).group_by(Venue.city, Venue.country)
    
    cities_data = query.all()
    
    # Build response
    cities = []
    for city in cities_data:
        city_obj = {
            "name": city.city,
            "country": city.country,
            "country_code": get_country_code(city.country),
            "flag_emoji": get_flag_emoji(city.country),
            "venue_count": city.venue_count,
            "latitude": float(city.latitude) if city.latitude else 0,
            "longitude": float(city.longitude) if city.longitude else 0
        }
        
        # Calculate distance if user location provided
        if lat is not None and lng is not None and city.latitude and city.longitude:
            distance = haversine_distance(
                lat, lng,
                float(city.latitude), float(city.longitude)
            )
            city_obj["distance_km"] = round(distance, 1)
            city_obj["is_nearby"] = distance < 100
        
        cities.append(city_obj)
    
    # Sort cities
    if lat is not None and lng is not None:
        # Sort by distance (nearest first)
        cities.sort(key=lambda x: x.get("distance_km", float('inf')))
    else:
        # Default: alphabetical by country then city
        cities.sort(key=lambda x: (x["country"], x["name"]))
    
    return {
        "user_location": {"lat": lat, "lng": lng} if lat and lng else None,
        "total_cities": len(cities),
        "cities": cities
    }
