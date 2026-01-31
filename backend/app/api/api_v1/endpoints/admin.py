from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.db.init_db import init_db

router = APIRouter()

@router.post("/seed")
async def seed_data(
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Trigger database seeding manually.
    Useful when shell access is not available.
    """
    try:
        await init_db()
        return {"message": "Database seeding completed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
