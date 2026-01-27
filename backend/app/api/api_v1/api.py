from fastapi import APIRouter
from app.api.api_v1.endpoints import login, events, venues, search

api_router = APIRouter()
api_router.include_router(login.router, prefix="/auth", tags=["auth"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(venues.router, prefix="/venues", tags=["venues"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
