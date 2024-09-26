from fastapi import APIRouter, Depends
from app.firebase_auth import check_admin, security

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

@router.get("/check")
async def check_admin_status(admin_status: dict = Depends(check_admin)):
    return admin_status