"""
Sports API endpoint
Provides list of available sports with event counts
"""
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Event

router = APIRouter()

def get_sport_icon(sport: str) -> str:
    """Map sport name to emoji icon"""
    icons = {
        "football": "⚽",
        "soccer": "⚽",
        "basketball": "🏀",
        "american-football": "🏈",
        "nfl": "🏈",
        "rugby": "🏉",
        "cricket": "🏏",
        "tennis": "🎾",
        "volleyball": "🏐",
        "baseball": "⚾",
        "golf": "⛳",
        "hockey": "🏒",
        "boxing": "🥊",
        "mma": "🥋",
        "esports": "🎮"
    }
    sport_lower = sport.lower().replace(" ", "-")
    return icons.get(sport_lower, "🏆")

def get_sport_display_name(sport: str) -> str:
    """Convert sport ID to display name"""
    mapping = {
        "football": "足球",
        "soccer": "足球", 
        "basketball": "籃球",
        "american-football": "美式足球",
        "nfl": "美式足球",
        "rugby": "橄欖球",
        "cricket": "板球",
        "tennis": "網球",
        "volleyball": "排球",
        "baseball": "棒球",
        "golf": "高爾夫",
        "hockey": "冰球",
        "boxing": "拳擊",
        "mma": "綜合格鬥",
        "esports": "電競"
    }
    sport_lower = sport.lower().replace(" ", "-")
    return mapping.get(sport_lower, sport.title())

@router.get("/sports")
async def get_sports(
    db: Session = Depends(get_db)
):
    """
    Get all available sports with event counts.
    Returns list sorted by event count (most popular first).
    """
    
    # Query events grouped by sport
    query = db.query(
        Event.sport,
        func.count().label('event_count')
    ).group_by(Event.sport).order_by(func.count().desc())
    
    sports_data = query.all()
    
    # Build response
    sports = []
    for sport in sports_data:
        sport_id = sport.sport.lower().replace(" ", "-")
        
        sports.append({
            "id": sport_id,
            "name": get_sport_display_name(sport.sport),
            "name_en": sport.sport,
            "icon": get_sport_icon(sport.sport),
            "event_count": sport.event_count
        })
    
    return {
        "total_sports": len(sports),
        "sports": sports
    }
