from fastapi import APIRouter
from user import(
    follower, 
    following,
    who,
    follow,
    upload,
    check,
    create,
    user_lore,
    user_name,
    )


router = APIRouter(
    prefix="/user",
    tags=["user"],
)



router.include_router(follower.router)
router.include_router(following.router)
router.include_router(who.router)
router.include_router(follow.router)
router.include_router(upload.router)
router.include_router(check.router)
router.include_router(create.router)
router.include_router(user_lore.router)
router.include_router(user_name.router)