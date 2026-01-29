"""
Mo Engine V1: Hybrid Search Service
====================================

Search Formula:
Score = (TextMatch × 0.4) + (Distance × 0.3) + (TrustScore × 0.2) + (LiveSignal × 1.0)

- TextMatch: Keyword accuracy (ts_rank)
- Distance: How close to user
- TrustScore: Venue's QoE score
- LiveSignal: BOOST venues with T-1 status (confirmed broadcasting)
"""

from typing import List, Dict, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta


async def search_venues(
    db: AsyncSession,
    query: str,
    user_lat: float,
    user_lon: float,
    limit: int = 20
) -> List[Dict]:
    """
    Mo Engine V1: Hybrid Search (Text + Distance + Signal)
    
    Args:
        db: Database session
        query: Search query (e.g., "Manchester United", "football")
        user_lat: User latitude
        user_lon: User longitude
        limit: Max results
        
    Returns:
        List of venues with scores
    """
    
    sql = text("""
        SELECT 
            v.id,
            v.name,
            v.slug,
            v.address,
            v.city,
            v.latitude,
            v.longitude,
            v.qoe_score,
            v.current_dtss_status,
            v.tags,
            
            -- Text matching score (ts_rank)
            ts_rank(v.search_vector, websearch_to_tsquery('english', :q)) as text_rank,
            
            -- Distance in km (PostGIS point distance)
            ROUND(
                (point(v.longitude, v.latitude) <@> point(:lon, :lat)) * 1.60934, 2
            ) as distance_km,
            
            -- Live Signal Boost (T-1 = currently broadcasting)
            CASE WHEN v.current_dtss_status = 'T-1' THEN 10 ELSE 0 END as live_boost,
            
            -- Final Score (weighted formula)
            (
                ts_rank(v.search_vector, websearch_to_tsquery('english', :q)) * 0.4 +
                (1.0 / GREATEST(1.0, point(v.longitude, v.latitude) <@> point(:lon, :lat))) * 0.3 +
                (v.qoe_score / 10.0) * 0.2 +
                CASE WHEN v.current_dtss_status = 'T-1' THEN 1.0 ELSE 0.0 END
            ) as final_score
            
        FROM venues v
        WHERE 
            -- Text matching (full-text OR fuzzy)
            v.search_vector @@ websearch_to_tsquery('english', :q)
            OR v.name ILIKE :fuzzy_q
            OR EXISTS (
                SELECT 1 FROM unnest(v.tags) tag 
                WHERE tag ILIKE :fuzzy_q
            )
        ORDER BY 
            live_boost DESC,  -- T-1 venues always on top
            final_score DESC, -- Then by weighted score
            distance_km ASC   -- Finally by proximity
        LIMIT :limit;
    """)
    
    result = await db.execute(sql, {
        "q": query,
        "fuzzy_q": f"%{query}%",
        "lat": user_lat,
        "lon": user_lon,
        "limit": limit
    })
    
    rows = result.fetchall()
    
    return [
        {
            "id": str(row.id),
            "name": row.name,
            "slug": row.slug,
            "address": row.address,
            "city": row.city,
            "latitude": float(row.latitude) if row.latitude else None,
            "longitude": float(row.longitude) if row.longitude else None,
            "qoe_score": float(row.qoe_score) if row.qoe_score else 0.0,
            "dtss_status": row.current_dtss_status,
            "tags": row.tags or [],
            "text_rank": float(row.text_rank) if row.text_rank else 0.0,
            "distance_km": float(row.distance_km) if row.distance_km else None,
            "live_boost": row.live_boost,
            "final_score": float(row.final_score) if row.final_score else 0.0
        }
        for row in rows
    ]


async def get_trending_tags(
    db: AsyncSession,
    limit: int = 10,
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None
) -> List[str]:
    """
    Get trending tags for Zero State display
    
    Logic: Most common tags from venues with upcoming events (next 7 days)
    If lat/lon provided, filter by venues within 50km
    """
    
    # Base query
    query_str = """
        SELECT 
            unnest(v.tags) as tag,
            COUNT(*) as frequency
        FROM venues v
        INNER JOIN venue_events ve ON v.id = ve.venue_id
        INNER JOIN events e ON ve.event_id = e.id
        WHERE 
            e.start_time BETWEEN NOW() AND NOW() + INTERVAL '7 days'
            AND e.status != 'cancelled'
            AND v.tags IS NOT NULL
    """
    
    params = {"limit": limit}
    
    # Add distance filter if coordinates provided
    if user_lat is not None and user_lon is not None:
        query_str += """
            AND (point(v.longitude, v.latitude) <@> point(:lon, :lat)) * 1.60934 <= 50
        """
        params["lat"] = user_lat
        params["lon"] = user_lon
        
    query_str += """
        GROUP BY tag
        ORDER BY frequency DESC, RANDOM()
        LIMIT :limit;
    """
    
    result = await db.execute(text(query_str), params)
    rows = result.fetchall()
    
    return [row.tag for row in rows]


async def get_trending_events(
    db: AsyncSession,
    limit: int = 10
) -> List[Dict]:
    """
    Get trending events for Zero State display
    
    Logic: Events with most venue confirmations (next 7 days)
    """
    
    sql = text("""
        SELECT 
            e.id,
            e.title,
            e.league,
            e.sport,
            e.team_a,
            e.team_b,
            e.start_time,
            COUNT(ve.venue_id) as venue_count
        FROM events e
        INNER JOIN venue_events ve ON e.id = ve.event_id
        WHERE 
            e.start_time BETWEEN NOW() AND NOW() + INTERVAL '7 days'
            AND e.status != 'cancelled'
        GROUP BY e.id
        ORDER BY venue_count DESC, e.start_time ASC
        LIMIT :limit;
    """)
    
    result = await db.execute(sql, {"limit": limit})
    rows = result.fetchall()
    
    return [
        {
            "id": str(row.id),
            "title": row.title,
            "league": row.league,
            "sport": row.sport,
            "team_a": row.team_a,
            "team_b": row.team_b,
            "start_time": row.start_time.isoformat(),
            "venue_count": row.venue_count
        }
        for row in rows
    ]


async def get_fallback_venues(
    db: AsyncSession,
    user_lat: float,
    user_lon: float,
    limit: int = 10
) -> List[Dict]:
    """
    Get fallback venues for "No Results" state
    
    Logic: Popular sports bars near user (sorted by QoE score + distance)
    """
    
    sql = text("""
        SELECT 
            v.id,
            v.name,
            v.slug,
            v.address,
            v.city,
            v.latitude,
            v.longitude,
            v.qoe_score,
            v.tags,
            ROUND(
                (point(v.longitude, v.latitude) <@> point(:lon, :lat)) * 1.60934, 2
            ) as distance_km
        FROM venues v
        WHERE 
            v.is_verified = true
            AND 'sports bar' = ANY(v.tags)  -- Generic sports bars
        ORDER BY 
            v.qoe_score DESC,
            distance_km ASC
        LIMIT :limit;
    """)
    
    result = await db.execute(sql, {
        "lat": user_lat,
        "lon": user_lon,
        "limit": limit
    })
    
    rows = result.fetchall()
    
    return [
        {
            "id": str(row.id),
            "name": row.name,
            "slug": row.slug,
            "address": row.address,
            "city": row.city,
            "latitude": float(row.latitude) if row.latitude else None,
            "longitude": float(row.longitude) if row.longitude else None,
            "qoe_score": float(row.qoe_score) if row.qoe_score else 0.0,
            "tags": row.tags or [],
            "distance_km": float(row.distance_km) if row.distance_km else None
        }
        for row in rows
    ]
