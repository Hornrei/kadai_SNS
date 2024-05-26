from fastapi import APIRouter, Request
from modules import dbop, oauth
import zoneinfo
from datetime import datetime as dt

router = APIRouter(tags=["getDMGroup"])

@router.get("/getDMGroup")
async def getDMGroup(request: Request):

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])

    data = dp.get_dm_group(user_id)
    print(data)
    if data != []: 
        return_ = []

        for d in data:
            return_ += d

        return {"status": "ok", "group_id": return_}
    else: 
        return {"status": "ng"}

@router.get("/getGroupDetail")
async def getGroupDetail(request: Request): 
    """
    グループの詳細を取得\n
    例: 
    {
  "status": "ok",
  "dm_detail": [
    {
      "group_id": "test1",
      "user_list": [
        "huga",
        "hoge"
      ],
      "last_user_id": "hogehoge",
      "last_message": "testmessage222",
      "created_at": "2023-11-17 16:17:20"
    },
    {
      "group_id": "test2",
      "user_list": [
        "hoge"
      ],
      "last_user_id": "",
      "last_message": "",
      "created_at": ""
    },
    {
      "group_id": "test3",
      "user_list": [
        "lea"
      ],
      "last_user_id": "lea",
      "last_message": "testmessage333",
      "created_at": "2023-11-18 09:00:10"
    }
  ]
}
    """

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])

    return_ = []

    for group_id in dp.get_dm_group(user_id):
        data = dp.get_last_dm(group_id[0])

        user_list = []

        for d in dp.get_dm_user(group_id[0]):
            user_list += d

        if data == None: 
            data = ["", "", ""]
            time_ = ""
        else: 
            list(data)
            time_ = dt.strptime(data[2], '%Y-%m-%d %H:%M:%S').astimezone(tz=zoneinfo.ZoneInfo('Asia/Tokyo')).strftime('%Y-%m-%d %H:%M:%S')

        return_.append({
            "group_id": group_id[0],
            "user_list": user_list,
            "last_user_id": data[0],
            "last_message": data[1],
            "created_at": time_
        })

    return {"status": "ok", "dm_detail": return_}
