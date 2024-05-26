from fastapi import APIRouter, Request
from modules import dbop, oauth
from datetime import datetime as dt


router = APIRouter(tags=["followingSchedule"])

@router.get("/followingSchedule")
async def followingSchedule(request: Request, ym: str = str(dt.now())[:7]):
# ym = yearMonth (年と月を取得  例: 2024-01)
    try:
        dp = dbop.DBOP()
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        userID = dp.get_user_id(token["sub"])

        following = dp.get_following(userID)
        following_list = [userID]

        if following != []: 
            for d in following:
                following_list.append(d[0])
            
            # フォロワーがいない場合ngを返す
            # if following_list == []: 
            #     return {"status": "ng"}

            tuple(following_list)

            print(following_list)

            data = dp.get_specific_schedule(following_list, ym)
            _return = []
            user_name = {}

            for d in data:
                if d[6] == "1" or d[1] == userID:
                    if d[1] not in user_name:
                        user_name[d[1]] = dp.get_user_name(d[1])

                    _return.append({
                        "schedule_id": d[0],
                        "user_id": d[1],
                        "user_name": user_name[d[1]],
                        "start_day": d[2],
                        "end_day": d[3],
                        "location": d[4],
                        "content": d[5]
                    })

        else: 
            return {"status": "ng"}

        return {"status": "ok", "list": _return}
    except Exception:
        return {"status": "ng"}
