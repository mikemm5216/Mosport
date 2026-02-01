from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, and_
from datetime import datetime, timedelta
from typing import List

from app.api import deps
from app.models.models import (
    User, Event, Venue, Favorite, CheckIn, BroadcasterSession
)
from app.db.session import get_db

router = APIRouter()

@router.get("/platform-kpi")
async def get_platform_kpi(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    平台 KPI 總覽 (Admin Only)
    - DAU (Daily Active Users)
    - MAU (Monthly Active Users)
    - 總用戶數、活躍場地數等
    """
    # 計算時間點
    now = datetime.utcnow()
    yesterday = now - timedelta(days=1)
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    
    # DAU - 過去24小時有簽到的用戶
    dau = db.query(func.count(distinct(CheckIn.user_id))).filter(
        CheckIn.checked_in_at >= yesterday
    ).scalar() or 0
    
    # MAU - 過去30天有簽到的用戶
    mau = db.query(func.count(distinct(CheckIn.user_id))).filter(
        CheckIn.checked_in_at >= month_ago
    ).scalar() or 0
    
    # 總用戶數
    total_users = db.query(func.count(User.id)).scalar() or 0
    
    # 活躍場地 (7天內有廣播會話)
    active_venues = db.query(func.count(distinct(BroadcasterSession.venue_id))).filter(
        BroadcasterSession.started_at >= week_ago
    ).scalar() or 0
    
    # 總場地數
    total_venues = db.query(func.count(Venue.id)).scalar() or 0
    
    # 已驗證場地數
    verified_venues = db.query(func.count(Venue.id)).filter(
        Venue.verified_status == True
    ).scalar() or 0
    
    # 簡易轉換率計算 (簽到/用戶)
    total_checkins = db.query(func.count(CheckIn.id)).scalar() or 0
    conversion_rate = (dau / total_users * 100) if total_users > 0 else 0
    
    return {
        "users": {
            "total": total_users,
            "dau": dau,
            "mau": mau,
            "growth": {
                "daily": 0,  # TODO: 需要歷史數據計算
                "weekly": 0,
                "monthly": 0
            }
        },
        "venues": {
            "total": total_venues,
            "active": active_venues,
            "verified": verified_venues,
            "pending": total_venues - verified_venues
        },
        "conversionFunnel": {
            "appOpens": total_users,  # 簡化: 使用總用戶數
            "searches": total_users,   # TODO: 需要搜尋追蹤
            "checkIns": total_checkins,
            "conversionRate": round(conversion_rate, 2)
        }
    }

@router.get("/event-rankings")
async def get_event_rankings(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    賽事收藏排行 (Admin Only)
    返回收藏數最多的賽事
    """
    # 統計每個賽事的收藏數和場地轉播數
    from sqlalchemy.orm import joinedload
    
    rankings = db.query(
        Event,
        func.count(distinct(Favorite.id)).label('favorites_count'),
        func.count(distinct(BroadcasterSession.venue_id)).label('broadcasting_venues')
    ).outerjoin(
        Favorite,
        and_(
            Favorite.target_type == 'event',
            Favorite.target_id == Event.id
        )
    ).outerjoin(
        BroadcasterSession,
        BroadcasterSession.event_id == Event.id
    ).group_by(Event.id).order_by(
        func.count(distinct(Favorite.id)).desc()
    ).limit(limit).all()
    
    result = []
    for event, favorites_count, venues_count in rankings:
        # 計算實際簽到數
        checkins_count = db.query(func.count(CheckIn.id)).filter(
            CheckIn.event_id == event.id
        ).scalar() or 0
        
        result.append({
            "event": {
                "id": str(event.id),
                "title": event.title,
                "league": event.league,
                "sport": event.sport,
                "team_a": event.team_a,
                "team_b": event.team_b,
                "start_time": event.start_time.isoformat() if event.start_time else None,
                "status": event.status
            },
            "favoritedBy": favorites_count,
            "checkIns": checkins_count,
            "venues": venues_count
        })
    
    return {"rankings": result, "total": len(result)}

@router.get("/venue-performance")
async def get_venue_performance(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    場地表現排行 (Admin Only)
    - 人氣王 (最多收藏)
    - 流量王 (最多簽到)
    """
    # 人氣王 - 收藏數最多
    top_popular = db.query(
        Venue,
        func.count(Favorite.id).label('favorites_count')
    ).outerjoin(
        Favorite,
        and_(
            Favorite.target_type == 'venue',
            Favorite.target_id == Venue.id
        )
    ).group_by(Venue.id).order_by(
        func.count(Favorite.id).desc()
    ).limit(limit).all()
    
    # 流量王 - 簽到數最多 (本週)
    week_ago = datetime.utcnow() - timedelta(days=7)
    top_traffic = db.query(
        Venue,
        func.count(CheckIn.id).label('checkins_count')
    ).outerjoin(
        CheckIn,
        and_(
            CheckIn.venue_id == Venue.id,
            CheckIn.checked_in_at >= week_ago
        )
    ).group_by(Venue.id).order_by(
        func.count(CheckIn.id).desc()
    ).limit(limit).all()
    
    return {
        "topPopular": [
            {
                "venue": {
                    "id": str(venue.id),
                    "name": venue.name,
                    "city": venue.city,
                    "qoe_score": venue.qoe_score
                },
                "favoritedBy": count,
                "avgRating": venue.qoe_score / 20 if venue.qoe_score else 0  # 簡化評分
            }
            for venue, count in top_popular
        ],
        "topTraffic": [
            {
                "venue": {
                    "id": str(venue.id),
                    "name": venue.name,
                    "city": venue.city
                },
                "weeklyCheckIns": count,
                "growthRate": 0  # TODO: 需要歷史數據計算
            }
            for venue, count in top_traffic
        ]
    }

@router.get("/sport-distribution")
async def get_sport_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.require_admin)
):
    """
    運動類型分佈 (Admin Only)
    """
    # 統計每個運動類型的粉絲數（通過收藏和簽到判斷）
    sport_favorites = db.query(
        Favorite.sport,
        func.count(distinct(Favorite.user_id)).label('fans')
    ).filter(
        Favorite.target_type == 'sport'
    ).group_by(Favorite.sport).all()
    
    total_fans = db.query(func.count(distinct(Favorite.user_id))).filter(
        Favorite.target_type == 'sport'
    ).scalar() or 1  # 避免除以0
    
    result = []
    for sport, fans in sport_favorites:
        percentage = (fans / total_fans * 100) if total_fans > 0 else 0
        result.append({
            "sport": sport,
            "fans": fans,
            "percentage": round(percentage, 2)
        })
    
    # 按粉絲數排序
    result.sort(key=lambda x: x['fans'], reverse=True)
    
    return {"sportDistribution": result}
