from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Float, Integer, Index, Text
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
    provider = Column(String)  # Legacy: will be deprecated, use oauth_provider
    oauth_provider = Column(String)  # V6.1 Standard: 'google', 'facebook', 'zalo'
    is_guest = Column(Boolean, default=False)
    mosport_points = Column(Integer, default=0)
    tier = Column(String, default='Bronze')  # Bronze, Silver, Gold, Platinum
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    venues = relationship("Venue", back_populates="owner")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    check_ins = relationship("CheckIn", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("MosportTransaction", back_populates="user")
    vouchers = relationship("Voucher", back_populates="user")

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
    is_verified = Column(Boolean, default=False)  # Legacy: User-submitted verification
    verified_status = Column(Boolean, default=False)  # V6.1: Internal staff verification (for B2B)
    tags = Column(ARRAY(String), default=[])
    
    # V6.1 New Columns
    features = Column(JSONB, default={})
    vibes = Column(JSONB, default=[])
    social_count = Column(Integer, default=0)

    # V6.2 WBC Sprint
    event_tags = Column(ARRAY(String), default=[])  # e.g. ["#TeamTaiwan", "#AudioConfirmed"]
    fan_base = Column(String)  # e.g. "Taiwan National Team"
    
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

# ==================== Dashboard Feature Models ====================

class Favorite(Base):
    """收藏功能 - 用戶收藏賽事、場地或運動類型"""
    __tablename__ = "favorites"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    target_type = Column(String, nullable=False)  # 'event', 'venue', 'sport'
    target_id = Column(UUID(as_uuid=True))  # event_id or venue_id (null for sport)
    sport = Column(String)  # if target_type = 'sport'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    
    # Indexes
    __table_args__ = (
        Index('idx_favorite_user', 'user_id'),
        Index('idx_favorite_unique', 'user_id', 'target_type', 'target_id', 'sport', unique=True),
    )

class CheckIn(Base):
    """簽到功能 - GPS 驗證用戶到場"""
    __tablename__ = "check_ins"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    points_earned = Column(Integer, default=10)
    checked_in_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="check_ins")
    venue = relationship("Venue")
    event = relationship("Event")
    
    # Indexes
    __table_args__ = (
        Index('idx_checkin_user', 'user_id'),
        Index('idx_checkin_venue', 'venue_id'),
        Index('idx_checkin_timestamp', 'checked_in_at'),
    )

class MosportTransaction(Base):
    """積分交易記錄"""
    __tablename__ = "mosport_transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # 'check_in', 'review', 'favorite', 'redeem'
    points_change = Column(Integer, nullable=False)  # +10 or -50
    description = Column(Text)
    reference_id = Column(UUID(as_uuid=True))  # FK to check_in, voucher, etc
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    
    # Indexes
    __table_args__ = (
        Index('idx_transaction_user', 'user_id'),
        Index('idx_transaction_created', 'created_at'),
    )

class Voucher(Base):
    """優惠券 - QR Code 兌換"""
    __tablename__ = "vouchers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    discount = Column(String, nullable=False)  # "50% off", "Buy 1 Get 1"
    qr_code = Column(String, unique=True)
    condition = Column(Text)  # "利物浦進球時生效"
    expires_at = Column(DateTime(timezone=True), nullable=False)
    redeemed_at = Column(DateTime(timezone=True))
    is_redeemed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    venue = relationship("Venue")
    user = relationship("User", back_populates="vouchers")
    
    # Indexes
    __table_args__ = (
        Index('idx_voucher_user', 'user_id'),
        Index('idx_voucher_venue', 'venue_id'),
        Index('idx_voucher_qr', 'qr_code'),
    )

class Promotion(Base):
    """場地優惠活動"""
    __tablename__ = "promotions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False)
    title = Column(String, nullable=False)
    condition = Column(String)  # "goal_scored:Liverpool"
    discount = Column(String, nullable=False)
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=False)
    target_audience = Column(String, default='all')  # 'all', 'favorites', 'nearby'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    venue = relationship("Venue")
    
    # Indexes
    __table_args__ = (
        Index('idx_promotion_venue', 'venue_id'),
        Index('idx_promotion_active', 'is_active'),
    )

class BroadcasterSession(Base):
    """轉播會話 - Signal Broadcaster 狀態"""
    __tablename__ = "broadcaster_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    status = Column(String, default='LIVE')  # 'LIVE', 'OFF-AIR'
    signal_strength = Column(Integer)  # 0-100
    live_audience = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    
    # Relationships
    venue = relationship("Venue")
    event = relationship("Event")
    
    # Indexes
    __table_args__ = (
        Index('idx_broadcaster_venue', 'venue_id'),
        Index('idx_broadcaster_event', 'event_id'),
        Index('idx_broadcaster_status', 'status'),
    )

