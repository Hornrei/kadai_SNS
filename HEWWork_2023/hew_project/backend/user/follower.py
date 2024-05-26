from fastapi import APIRouter, Request
from modules import dbop



router = APIRouter(tags=["follower"])


@router.get('/follower')
def get_follower_users(userID: str, count: int = 10, offset: int = 0):
    try:
        dp = dbop.DBOP()
        follower_user = dp.get_user_follower(userID, count, offset)
        response_data = {
            "status": "ok",
            "users": [{"user_id": user[0], "user_name": user[1], "user_icon": user[2]} for user in follower_user]
        }

        return response_data

    except Exception as e:
        return {"status": "ng", "message": str(e)}



@router.get('/follower/count')
async def get_follower_count(user_id: str):
    try:
        dp = dbop.DBOP()
        follower_count = dp.get_flower_count(user_id)
        response_data = {
            "status": "ok",
            "count": follower_count
        }

        return response_data

    except Exception as e:
        return {"status": "ng", "message": str(e)}
