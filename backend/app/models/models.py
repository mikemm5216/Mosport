from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Float, Index, Text, PickleType
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(String, nullable=False) # FAN, VENUE, STAFF
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture_url = Column(Text)
    provider = Column(String) # Legacy field
    oauth_provider = Column(String) # V6.1 Standard
    is_guest = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    venues = relationship("Venue", back_populates="owner")

class Venue(Base):
    __tablename__ = "venues"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True)
    address = Column(Text)
    city = Column(String, index=True)
    country = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    qoe_score = Column(Float, default=0.0)
    is_verified = Column(Boolean, default=False) # Legacy field
    verified_status = Column(Boolean, default=False) # V6.1 Standard (Internal Verification)
    
    # V6.1 New Columns
    features = Column(JSONB, default={})
    vibes = Column(JSONB, default=[])
    social_count = Column(Integer, default=0)
    
    owner = relationship("User", back_populates="venues")
    # Using VennueEvent association
    events = relationship("VenueEvent", back_populates="venue")

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    league = Column(String, index=True)
    sport = Column(String, index=True)
    team_a = Column(String)
    team_b = Column(String)
    start_time = Column(DateTime(timezone=True), index=True)
    status = Column(String, default="scheduled") # scheduled, live, finished, cancelled
    
    # DTSS / Constitutional Compliance Fields (Derivative data only)
    confidence_score = Column(Float, default=0.0)  # T-1/T-24/T-7 verification score
    last_verified = Column(DateTime(timezone=True))  # Last DTSS check timestamp
    override_reason = Column(Text)  # If status=cancelled due to 'Private Event', 'Closed', etc.
    
    # Using VennueEvent association
    venues = relationship("VenueEvent", back_populates="event")

class VenueEvent(Base):
    __tablename__ = "venue_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("venues.id"))
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"))
    verification_status = Column(String, default="predicted") # predicted, confirmed, authority
    
    venue = relationship("Venue", back_populates="events")
    event = relationship("Event", back_populates="venues")
