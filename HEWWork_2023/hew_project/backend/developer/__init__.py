from fastapi import APIRouter
from developer import dummy_user
import os

router = APIRouter(
    prefix="/dev"
)

if os.environ.get("LOGIN_BYPASS"):
    router.include_router(
        dummy_user.router,
    )
