from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    login, users_recovery as users, events, venues, search, cities, sports, admin
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(venues.router, prefix="/venues", tags=["venues"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(cities.router, prefix="/cities", tags=["cities"])
api_router.include_router(sports.router, prefix="/sports", tags=["sports"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
