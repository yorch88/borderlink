from fastapi import APIRouter, Depends
from app.modules.landing.schemas import LandingContent, ContactIn
from app.modules.landing.service import (
    get_landing,
    update_landing,
    save_contact
)
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/v1/landing", tags=["landing"])


@router.get("/")
async def fetch_landing():
    return await get_landing()

    
@router.put("/")
async def modify_landing(
    body: LandingContent,
    current_user = Depends(get_current_user)
):
    return await update_landing(body.dict())


@router.post("/contact")
async def submit_contact(body: ContactIn):
    return await save_contact(body.dict())
