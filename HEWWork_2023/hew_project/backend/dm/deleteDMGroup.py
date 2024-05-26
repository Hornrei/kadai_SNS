from fastapi import APIRouter, Request
from modules import dbop, oauth
from pydantic import BaseModel

router = APIRouter(tags=["deleteDMGroup"])

class Data(BaseModel):
    groupID: str

@router.post("/deleteDMGroup")
async def deleteDMGroup(request: Request, data: Data):
    groupID = data.groupID

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    userID = dp.get_user_id(token["sub"])
    if dp.dm_user_check(groupID, userID): 
        dp.delete_dm_group(groupID)
        dp.commit()
        return_ = "ok"
    else: 
        return_ = "ng"

    return {"status": return_}
