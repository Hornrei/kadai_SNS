from fastapi import APIRouter
from app.notice import notice

router = APIRouter(
    prefix="/notice",
    tags=["notice"],
)

router.include_router(notice.router)