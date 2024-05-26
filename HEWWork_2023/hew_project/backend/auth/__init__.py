from fastapi import APIRouter
from auth import (
    login,
    logout,
    confirm,
    whoami,
)


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

router.include_router(login.router, )
router.include_router(logout.router, )
router.include_router(confirm.router, )
router.include_router(whoami.router, )
