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


# Static list of supported sports with metadata
SUPPORTED_SPORTS = [
    {"id": "football", "name": "足球", "name_en": "Football", "icon": "⚽"},
    {"id": "basketball", "name": "籃球", "name_en": "Basketball", "icon": "🏀"},
    {"id": "badminton", "name": "羽球", "name_en": "Badminton", "icon": "🏸"},
    {"id": "tennis", "name": "網球", "name_en": "Tennis", "icon": "🎾"},
    {"id": "baseball", "name": "棒球", "name_en": "Baseball", "icon": "⚾"},
    {"id": "table-tennis", "name": "桌球", "name_en": "Table Tennis", "icon": "🏓"},
    {"id": "volleyball", "name": "排球", "name_en": "Volleyball", "icon": "🏐"},
    {"id": "cricket", "name": "板球", "name_en": "Cricket", "icon": "🏏"},
    {"id": "muay-thai", "name": "泰拳", "name_en": "Muay Thai", "icon": "🥊"},
    {"id": "martial-arts", "name": "格鬥", "name_en": "MMA", "icon": "🥋"},
    {"id": "f1", "name": "F1 賽車", "name_en": "Formula 1", "icon": "🏎️"},
    {"id": "rugby", "name": "橄欖球", "name_en": "Rugby", "icon": "🏉"},
    {"id": "esports", "name": "電競", "name_en": "Esports", "icon": "🎮"},
    {"id": "golf", "name": "高爾夫", "name_en": "Golf", "icon": "⛳"},
    {"id": "billiards", "name": "撞球", "name_en": "Billiards", "icon": "🎱"}
]

@router.get("/sports")
async def get_sports(
    db: Session = Depends(get_db)
):
    """
    Get all available sports with event counts.
    Returns comprehensive list of sports, prioritizing those with active events.
    """
    
    # Query events grouped by sport
    query = db.query(
        Event.sport,
        func.count().label('event_count')
    ).group_by(Event.sport)
    
    db_counts = {row.sport.lower(): row.event_count for row in query.all()}
    
    # Build final list
    sports = []
    for s in SUPPORTED_SPORTS:
        # Match DB count or default to 0
        # Check both id and name_en for matches in DB
        count = db_counts.get(s["id"], 0) or db_counts.get(s["name_en"].lower(), 0)
        
        sports.append({
            **s,
            "event_count": count
        })
    
    # Sort: First by count (desc), then by standard order in SUPPORTED_SPORTS
    sports.sort(key=lambda x: x["event_count"], reverse=True)
    
    return {
        "total_sports": len(sports),
        "sports": sports
    }

