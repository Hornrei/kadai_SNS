from fastapi import APIRouter, Request
from modules import dbop, oauth  
from pydantic import BaseModel

router = APIRouter(tags=["username"])

class UserNameSet(BaseModel):
    username: str

@router.post("/username/set")
async def username(requests: Request, data: UserNameSet):
    
    raw_token, token_provider = oauth.parse_request(requests)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])
    dp.set_user_name(user_id, data.username)
    dp.commit()
    return {"status": "ok"}