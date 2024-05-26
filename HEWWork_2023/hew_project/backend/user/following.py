from fastapi import APIRouter, Request
from modules import dbop, oauth

router = APIRouter(tags=["following"])


@router.get('/following')
async def get_following_users(userID: str, count: int = 10, offset: int = 0):
    try:
        dp = dbop.DBOP()

        # フォロー情報のクエリ
        following_users = dp.get_user_following(userID, count, offset)

        response_data = {
            "status": "ok",
            "users": [{"user_id": user[0], "user_name": user[1], "user_icon": user[2]} for user in following_users]
        }

        return response_data

    except Exception as e:
        return {"status": "ng", "message": str(e)}

@router.get("/following/count")
def get_following_count(user_id: str):
    try:
        dp = dbop.DBOP()
        following_count = dp.get_following_count(user_id)

        response_data = {
            "status": "ok",
            "count": following_count
        }

        return response_data

    except Exception as e:
        return {"status": "ng", "message": str(e)}

@router.get("/following/check")
async def check_following(request: Request, to_user_id: str):
    try:
        dp = dbop.DBOP()
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        user_id = dp.get_user_id(token["sub"])
        is_following = dp.check_following(user_id, to_user_id)

        response_data = {
            "status": "ok",
            "is_following": is_following
        }

        return response_data

    except Exception as e:
        return {"status": "ng", "message": str(e)}