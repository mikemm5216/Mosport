from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

from app.api import deps
from app.models.models import CheckIn, Venue, Event, User, MosportTransaction
from app.db.session import get_db

router = APIRouter()

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    計算兩個GPS座標之間的距離（公里）
    使用 Haversine formula
    """
    R = 6371  # 地球半徑 (km)
    
    lat1_rad, lon1_rad = radians(lat1), radians(lon1)
    lat2_rad, lon2_rad = radians(lat2), radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = sin(dlat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    distance = R * c
    
    return distance

@router.post("/")
async def create_checkin(
    venue_id: str,
    latitude: float,
    longitude: float,
    event_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    簽到（含 GPS 驗證）
    - venue_id: 場地 ID
    - latitude: 用戶當前緯度
    - longitude: 用戶當前經度
    - event_id: 可選，正在觀看的賽事 ID
    """
    # 驗證場地存在
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    
    # GPS 距離驗證
    if venue.latitude and venue.longitude:
        distance = calculate_distance(latitude, longitude, venue.latitude, venue.longitude)
        
        # 允許範圍: 100公尺
        if distance > 0.1:
            raise HTTPException(
                status_code=400, 
                detail=f"Too far from venue (distance: {distance:.2f}km). Must be within 100m."
            )
    
    # 檢查今天是否已簽到過該場地（防止重複簽到）
    from datetime import date
    today_start = datetime.combine(date.today(), datetime.min.time())
    
    existing_checkin = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id,
        CheckIn.venue_id == venue_id,
        CheckIn.checked_in_at >= today_start
    ).first()
    
    if existing_checkin:
        raise HTTPException(
            status_code=400,
            detail="Already checked in to this venue today"
        )
    
    # 建立簽到記錄
    points_to_earn = 10
    checkin = CheckIn(
        user_id=current_user.id,
        venue_id=venue_id,
        event_id=event_id,
        latitude=latitude,
        longitude=longitude,
        points_earned=points_to_earn
    )
    db.add(checkin)
    
    # 更新用戶積分
    current_user.mosport_points += points_to_earn
    
    # 記錄交易
    transaction = MosportTransaction(
        user_id=current_user.id,
        type='check_in',
        points_change=points_to_earn,
        description=f"Check-in at {venue.name}",
        reference_id=checkin.id
    )
    db.add(transaction)
    
    db.commit()
    db.refresh(checkin)
    
    return {
        "message": "Checked in successfully",
        "checkin_id": str(checkin.id),
        "points_earned": points_to_earn,
        "total_points": current_user.mosport_points,
        "venue_name": venue.name
    }

@router.get("/me")
async def get_my_checkins(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """取得我的簽到歷史"""
    checkins = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id
    ).order_by(
        CheckIn.checked_in_at.desc()
    ).limit(limit).all()
    
    result = []
    for checkin in checkins:
        venue = db.query(Venue).filter(Venue.id == checkin.venue_id).first()
        event = db.query(Event).filter(Event.id == checkin.event_id).first() if checkin.event_id else None
        
        result.append({
            "id": str(checkin.id),
            "venue": {
                "id": str(venue.id),
                "name": venue.name,
                "city": venue.city
            } if venue else None,
            "event": {
                "id": str(event.id),
                "title": event.title,
                "sport": event.sport
            } if event else None,
            "points_earned": checkin.points_earned,
            "checked_in_at": checkin.checked_in_at.isoformat()
        })
    
    return {
        "checkins": result,
        "total_checkins": len(checkins)
    }

@router.get("/stats")
async def get_checkin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """取得簽到統計"""
    from sqlalchemy import func
    
    total_checkins = db.query(func.count(CheckIn.id)).filter(
        CheckIn.user_id == current_user.id
    ).scalar()
    
    total_points = db.query(func.sum(CheckIn.points_earned)).filter(
        CheckIn.user_id == current_user.id
    ).scalar() or 0
    
    # 本月簽到數
    from datetime import date
    first_day_of_month = date.today().replace(day=1)
    month_checkins = db.query(func.count(CheckIn.id)).filter(
        CheckIn.user_id == current_user.id,
        CheckIn.checked_in_at >= first_day_of_month
    ).scalar()
    
    return {
        "total_checkins": total_checkins,
        "total_points_from_checkins": total_points,
        "current_month_checkins": month_checkins,
        "current_total_points": current_user.mosport_points,
        "tier": current_user.tier
    }
