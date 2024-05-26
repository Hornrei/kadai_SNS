from fastapi import APIRouter, Request
from modules import dbop, oauth
import zoneinfo
from datetime import datetime as dt

router = APIRouter(tags=["getDMMessage"])

@router.get("/getDMMessage")
async def getDMMessage(request: Request, group_id: str):

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])

    if dp.dm_user_check(group_id, user_id): 
        data = dp.get_dm_message(group_id)

        return_ = []
        user_info = {}

        for d in data: 
            if d[1] not in user_info:
                user_info[d[1]] = {
                    "name": dp.get_user_name(d[1]),
                    # "icon": dp.get_user_icon(d[1])
                }
            return_.append({
                "type": user_check(user_id, d[1]),
                "massage_id": d[0],
                "user_id": d[1],
                "user_name": user_info[d[1]]["name"],
                # "icon_url": user_info[d[1]]["icon"],
                "message": d[2],
                "created_at": dt.strptime(d[3], '%Y-%m-%d %H:%M:%S').astimezone(tz=zoneinfo.ZoneInfo('Asia/Tokyo')).strftime('%Y-%m-%d %H:%M:%S')
            })
        return {"status": "ok", "dm_detail": return_}

    return {"status": "ng"}

# 送信者か受信者かを判定するやつ
def user_check(now_user_id, check_user_id):
    if now_user_id == check_user_id:
        return "send"
    else:
        return "receive"
