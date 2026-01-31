from fastapi import APIRouter
from typing import Any, List

router = APIRouter()

@router.get("/")
def read_users() -> List[Any]:
    return []

@router.get("/me")
def read_user_me() -> Any:
    return {"message": "User profile endpoint (Recovery)"}
