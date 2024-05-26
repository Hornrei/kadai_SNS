from fastapi import APIRouter, Request
from modules import dbop, oauth
from pydantic import BaseModel
import requests
import os

router = APIRouter(tags=["addDMUser"])


class AddDMUser(BaseModel):
    target_user_id: str
    group_id: str


@router.post("/addDMUser")
async def add_dm_user(request: Request, data: AddDMUser):
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])

    if dp.dm_user_check(data.group_id, user_id):
        dp.addUser_dm(data.group_id, data.target_user_id)

        post_url = f"https://notify.{os.environ["FRONTEND_HOST"]}/api/notice/create"
        request_body = {"target": [data.target_user_id], "type": "dm", "content": data.group_id}
        response_ = requests.post(post_url, json=request_body)

        if response_.json()["status"] != "ok":
            return {"status": "ng", "message": "Error in notify"}

        dp.commit()
        return_ = "ok"
    else:
        return_ = "ng"

    return {"status": return_}
