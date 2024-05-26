from fastapi import APIRouter, Request
from modules import dbop, oauth

router = APIRouter(tags=["followingPosts"])


@router.get("/followingPosts")
async def followingPosts(request: Request, count: int = 10, offset: int = 0):

    dp = dbop.DBOP()
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    user_id = dp.get_user_id(token["sub"])

    following = dp.get_following(user_id)
    followingList = []

    print(following, type(following))

    if following != []:
        for d in following:
            followingList.append(d[0])

        tuple(followingList)

        data = dp.get_specific_post(count, offset, followingList)
        _return = []

        for d in data:
            user_name = dp.get_user_name(d[1])
            icon_url = dp.get_user_icon(d[1])
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
    else:
        return {"status": "ng"}

    return _return
