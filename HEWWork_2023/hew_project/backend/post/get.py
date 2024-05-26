from fastapi import APIRouter, Request
from modules import dbop, oauth
import uuid

router = APIRouter(tags=["get"])


@router.get("/get/inIsFav")
async def get_timeline(
    request: Request, count: int = 10, offset: int = 0, filter: str = None
):
    """
    ユーザーの投稿+その投稿をファボしているか
    """
    print(request.cookies)
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)
    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])
    data = dp.get_post_list(count, offset, filter)
    _return = []
    for d in data:
        user_name = dp.get_user_name(d[1])
        icon_url = dp.get_user_icon(d[1])
        if d[5]:
            continue
        _return.append(
            {
                "post_id": d[0],
                "user_id": d[1],
                "user_name": user_name,
                "content": d[2],
                "image_url": d[3],
                "icon_url": icon_url,
                "timestamp": d[4],
                "is_favorite": dp.is_fav(d[0], user_id),
            }
        )
    return _return


@router.get("/get")
def get_post_list(count: int = 10, offset: int = 0, filter: str = None):
    """
    ユーザーの投稿を取得する
    filterが指定されている場合は、そのユーザーの投稿を取得する
    一時的
    """
    dp = dbop.DBOP()
    data = dp.get_post_list(count, offset, filter)
    _return = []
    print(data)

    for d in data:
        user_name = dp.get_user_name(d[1])
        icon_url = dp.get_user_icon(d[1])
        if d[5]:
            continue
        _return.append(
            {
                "post_id": d[5],
                "user_id": d[1],
                "user_name": user_name,
                "content": d[2],
                "image_url": d[3],
                "icon_url": icon_url,
                "timestamp": d[4],
            }
        )

    return _return


@router.get("/get/{post_id}")
async def get_post(request: Request, post_id: str):
    """
    投稿の詳細を取得する
    """
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)
    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])
    data = dp.get_post(post_id)
    user_name = dp.get_user_name(data[1])
    icon_url = dp.get_user_icon(data[1])
    _return = {
        "post_id": data[0],
        "user_id": data[1],
        "user_name": user_name,
        "content": data[2],
        "image_url": data[3],
        "icon_url": icon_url,
        "timestamp": data[4],
        "is_favorite": dp.is_fav(data[0], user_id),
    }
    return _return


@router.get("/get/{post_id}/comment")
async def get_comment(request: Request, post_id: str):
    """
    投稿のコメントを取得する
    """
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)
    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])
    data = dp.get_comment(post_id)
    _return = []
    for d in data:
        user_name = dp.get_user_name(d[1])
        icon_url = dp.get_user_icon(d[1])
        _return.append(
            {
                "comment_id": d[0],
                "user_id": d[1],
                "user_name": user_name,
                "content": d[2],
                "image_url": d[3],
                "icon_url": icon_url,
                "timestamp": d[4],
                "is_favorite": dp.is_fav(d[0], user_id),
            }
        )
    return _return
