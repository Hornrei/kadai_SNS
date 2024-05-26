from fastapi import APIRouter, Request
from modules import dbop, oauth

# deleteDMやdeleteDMGroupなどと混同されるかもしれないですが、
# これはDMGroupからセルフで脱退するエンドポイントです

router = APIRouter(tags=["removeDMUser"])

@router.post("/removeDMUser")
async def removeDMUser(request: Request):
    data = (await request.json())
    groupID = data["groupID"]

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    userID = dp.get_user_id(token["sub"])
    if dp.dm_user_check(groupID, userID): 
        dp.remove_dmUser(groupID, userID)
        dp.commit()
        return_ = "ok"
    else: 
        return_ = "ng"

    return {"status": return_}
