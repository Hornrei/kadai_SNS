from fastapi import APIRouter, Request
from modules import dbop, oauth  
from pydantic import BaseModel
import re

router = APIRouter(tags=["userLore"])

@router.get("/userLore")
async def userLore(requests: Request, userID: str):

    dp = dbop.DBOP()
    if dp.confirm_id(userID):
        lore = dp.get_lore(userID)
        return {"status": "ok", "lore": lore}
    else: 
        return {"status": "ng"}


class UserLoreSet(BaseModel):
    lore: str

@router.post("/userLore/set")
async def user_lore_set(requests: Request, data: UserLoreSet): 

    data.lore = re.sub("\n+", "\n", data.lore)
    if re.compile("^(?:[^\n]*\n?){0,5}$").fullmatch(data.lore) == None:
        print("すてーたすえぬぎぃ")
        return {"status": "ng"}

    raw_token, token_provider = oauth.parse_request(requests)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])
    dp.set_lore(user_id, data.lore)
    dp.commit()
    return {"status": "ok"}
