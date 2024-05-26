from fastapi import APIRouter
from post import(
    create,
    get,
    upload,
    post_posts_comment,
    post_posts_delete,
    posts_detail,
    following_posts,
    favorite,
    search
)

router = APIRouter(
    prefix="/post",
    tags=["post"],
)


router.include_router(create.router)
router.include_router(get.router)
router.include_router(upload.router)
router.include_router(post_posts_comment.router)
router.include_router(post_posts_delete.router)
router.include_router(posts_detail.router) # ポスト詳細
router.include_router(following_posts.router) # フォロー中のポストのみ表示
router.include_router(favorite.router) # ふぁぼ
router.include_router(search.router) # 検索
