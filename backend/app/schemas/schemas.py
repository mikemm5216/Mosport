from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    
class UserCreate(BaseModel):
    code: str
    provider: str
    role: str = "FAN"

class UserInDB(UserBase):
    id: UUID
    role: str
    provider: str
    is_guest: bool
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserInDB

# Venue Schemas
class VenueBase(BaseModel):
    id: UUID
    name: str
    city: str
    qoe_score: float
    is_verified: bool

    model_config = ConfigDict(from_attributes=True)

# Event Schemas
class EventBase(BaseModel):
    id: UUID
    title: str
    league: str
    start_time: datetime
    team_a: str
    team_b: str
    status: str
    
    model_config = ConfigDict(from_attributes=True)

class EventWithVenues(EventBase):
    venues: List[VenueBase] = []
