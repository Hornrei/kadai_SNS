from fastapi import APIRouter, Request
from modules import dbop, oauth

router = APIRouter(tags=["getSchedule"])

@router.get("/getSchedule")
async def getSchedule(request: Request, userID: str = ""):
    """
    userIDを指定していない場合、tokenからuserIDを取得する
    """
    dp = dbop.DBOP()
    if userID == "":
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        userID = dp.get_user_id(token["sub"])

    if dp.confirm_id(userID): 
        data = dp.get_schedule(userID)
    else: 
        return{"status": "ng"}

    return_ = []
    user_name = dp.get_user_name(userID)

    for d in data:
        # visibilityがtrueで表示
        if d[6] == "1":
            return_.append({
                "schedule_id": d[0],
                "user_id": d[1],
                "user_name": user_name,
                "start_day": d[2],
                "end_day": d[3],
                "location": d[4],
                "content": d[5],
                "timestamp": d[7]
            })

    return {"list": return_}
