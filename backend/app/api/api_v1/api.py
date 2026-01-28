from fastapi import APIRouter
from app.api.api_v1.endpoints import login, events, venues, search, cities, sports

api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["auth"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(venues.router, prefix="/venues", tags=["venues"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(cities.router, tags=["cities"])
api_router.include_router(sports.router, tags=["sports"])
