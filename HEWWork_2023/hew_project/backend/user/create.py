from fastapi import APIRouter, Request
from modules import dbop, oauth
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import re


router = APIRouter(tags=["create"])


class CreateUserData(BaseModel):
    user_id: str
    user_name: str
    image_url: str

@router.post("/create")
async def create_user(request: Request,data: CreateUserData):
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)
    db = dbop.DBOP()
    
    if db.confirm_sub(token["sub"]):
        return {"status": "already exists"}
    elif re.compile("^[a-zA-Z0-9_]{3,16}$").fullmatch(data.user_id) == None:
        return {"status": "invalid userID"}
    else: 
        db.user_register(id=data.user_id, name=data.user_name, icon=data.image_url, sub=token["sub"], provider=token_provider)
        db.commit()
        response = JSONResponse(content={"status": "success"})
        response.set_cookie(
        key="user_icon",
        value=data.image_url,
        httponly=True,
        domain="127.0.0.1",
        path="/",
        samesite="lax",
    )
    return response 