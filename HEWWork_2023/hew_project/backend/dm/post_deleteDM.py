from fastapi import APIRouter, Request
from modules import dbop, oauth

router = APIRouter(tags=["deleteDM"])

@router.post("/deleteDM")
async def deleteDM(request: Request):
    data = (await request.json())
    dmID = data["dmID"]
    groupID = data["groupID"]

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    userID = dp.get_user_id(token["sub"])
    if dp.dm_user_check(groupID, userID): 
        dp.delete_dm(dmID, groupID, userID)
        dp.commit()
        return_ = "ok"
    else: 
        return_ = "ng"

    return {"status": return_}
