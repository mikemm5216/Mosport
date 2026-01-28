from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.api import deps
from app.models.models import User
from app.schemas.schemas import UserCreate, Token, UserInDB
import uuid

from starlette.requests import Request
from app.core.limiter import limiter

router = APIRouter()

@router.post("/callback", response_model=Token)
@limiter.limit("5/minute")
async def login_access_token(
    request: Request,
    user_in: UserCreate,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    OAuth Callback - Exchange code for token (Simulated) & Persist User
    """
    # 1. Simulate Token Exchange (Pending real Client Secrets)
    # Generate deterministic mock profile based on code
    mock_email = f"user_{user_in.code[:5]}@example.com"
    if user_in.code == "DEMO_CODE":
        mock_email = "demo@mosport.app"
    
    mock_name = f"User {user_in.code[:5]}"
    mock_picture = f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_in.code}"

    # 2. Check if user exists
    result = await db.execute(select(User).where(User.email == mock_email))
    user = result.scalars().first()

    if not user:
        # Create new user
        user = User(
            email=mock_email,
            name=mock_name,
            picture_url=mock_picture,
            role=user_in.role,
            provider=user_in.provider,
            is_guest=False
        )
        db.add(user)
    else:
        # Update existing
        user.name = mock_name
        user.picture_url = mock_picture
        user.provider = user_in.provider
    
    await db.commit()
    await db.refresh(user)

    # 3. Return Token & User
    return {
        "access_token": f"mock_jwt_{user.id}",
        "token_type": "bearer",
        "user": user
    }

@router.post("/guest", response_model=Token)
@limiter.limit("10/minute")
async def login_guest_access_token(
    request: Request,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Guest Mode Entry (V6.1) - Create ephemeral shadow user
    """
    guest_uuid = str(uuid.uuid4())
    guest_email = f"guest_{guest_uuid[:8]}@mosport.anon"
    
    user = User(
        email=guest_email,
        name="Guest User",
        picture_url=f"https://api.dicebear.com/7.x/shapes/svg?seed={guest_uuid}",
        role="guest",
        provider=None,
        oauth_provider=None,
        is_guest=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return {
        "access_token": f"guest_jwt_{user.id}",
        "token_type": "bearer",
        "user": user
    }
