from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.api import deps
from app.models.models import Favorite, User, Event, Venue
from app.db.session import get_db

router = APIRouter()

@router.post("/")
async def create_favorite(
    target_type: str,
    target_id: Optional[str] = None,
    sport: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    新增收藏
    - target_type: 'event', 'venue', 'sport'
    - target_id: event_id 或 venue_id (target_type='sport' 時可為 null)
    - sport: 運動類型名稱 (target_type='sport' 時必填)
    """
    # 驗證 target_type
    if target_type not in ['event', 'venue', 'sport']:
        raise HTTPException(status_code=400, detail="Invalid target_type")
    
    # 驗證參數邏輯
    if target_type == 'sport' and not sport:
        raise HTTPException(status_code=400, detail="sport field required for sport favorites")
    
    if target_type in ['event', 'venue'] and not target_id:
        raise HTTPException(status_code=400, detail=f"target_id required for {target_type} favorites")
    
    # 檢查是否已收藏
    query = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.target_type == target_type
    )
    
    if target_type == 'sport':
        query = query.filter(Favorite.sport == sport)
    else:
        query = query.filter(Favorite.target_id == target_id)
    
    existing = query.first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already favorited")
    
    # 建立收藏
    favorite = Favorite(
        user_id=current_user.id,
        target_type=target_type,
        target_id=target_id,
        sport=sport
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    
    return {
        "message": "Favorited successfully",
        "id": str(favorite.id),
        "target_type": target_type
    }

@router.delete("/{favorite_id}")
async def delete_favorite(
    favorite_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """取消收藏"""
    favorite = db.query(Favorite).filter(
        Favorite.id == favorite_id,
        Favorite.user_id == current_user.id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Unfavorited successfully"}

@router.get("/me")
async def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """取得我的收藏列表"""
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()
    
    # 組織回傳資料
    result = {
        "events": [],
        "venues": [],
        "sports": []
    }
    
    for fav in favorites:
        if fav.target_type == 'event':
            event = db.query(Event).filter(Event.id == fav.target_id).first()
            if event:
                result["events"].append({
                    "favorite_id": str(fav.id),
                    "event": {
                        "id": str(event.id),
                        "title": event.title,
                        "league": event.league,
                        "sport": event.sport,
                        "start_time": event.start_time.isoformat() if event.start_time else None
                    }
                })
        elif fav.target_type == 'venue':
            venue = db.query(Venue).filter(Venue.id == fav.target_id).first()
            if venue:
                result["venues"].append({
                    "favorite_id": str(fav.id),
                    "venue": {
                        "id": str(venue.id),
                        "name": venue.name,
                        "city": venue.city,
                        "address": venue.address,
                        "rating": venue.qoe_score if venue.qoe_score else 0.0,
                        "tags": venue.tags if venue.tags else []
                    }
                })
        elif fav.target_type == 'sport':
            result["sports"].append({
                "favorite_id": str(fav.id),
                "sport": fav.sport
            })
    
    return result

@router.get("/check/{target_type}/{target_id}")
async def check_is_favorited(
    target_type: str,
    target_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """檢查是否已收藏"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.target_type == target_type,
        Favorite.target_id == target_id
    ).first()
    
    return {
        "is_favorited": favorite is not None,
        "favorite_id": str(favorite.id) if favorite else None
    }
