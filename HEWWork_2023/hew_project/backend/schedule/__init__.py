from fastapi import APIRouter
from schedule import(
    add_schedule,
    get_schedule,
    following_schedule,
    remove_schedule
)

router = APIRouter(
    prefix="/schedule",
    tags=["schedule"],
)


router.include_router(add_schedule.router)
router.include_router(get_schedule.router)
router.include_router(following_schedule.router)
router.include_router(remove_schedule.router)