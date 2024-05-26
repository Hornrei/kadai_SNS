from fastapi import APIRouter, Request, Response
from modules import dbop, oauth
import requests
import os

router = APIRouter(tags=["follow"])

@router.post("/follow")
async def follow_user(request: Request,to_user_id: str):
    try:
        dp = dbop.DBOP()
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        
        user_id = dp.get_user_id(token["sub"])
        dp.follow_user(user_id, to_user_id)

        post_url = f"https://notify.{os.environ["FRONTEND_HOST"]}/api/notice/create"
        request_body = {"target": [to_user_id], "type": "follow", "content": user_id}
        response_ = requests.post(post_url, json=request_body)

        if response_.json()["status"] != "ok":
            return {"status": "ng", "message": "Error in notify"}

        dp.commit()
        return {"status": "ok"}

    except:
        return {"status": "ng"}

@router.post("/unfollow")
async def unfollow_user(request: Request,to_user_id: str):
    try:
        dp = dbop.DBOP()
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        
        user_id = dp.get_user_id(token["sub"])
        dp.unfollow_user(user_id, to_user_id)

        post_url = f"https://notify.{os.environ["FRONTEND_HOST"]}/api/notice/delete"
        request_body = {"target": to_user_id, "type": "follow", "content": user_id}
        response_ = requests.post(post_url, json=request_body)

        if response_.json()["status"] != "ok":
            return {"status": "ng", "message": "Error in notify"}

        dp.commit()
        return {"status": "ok"}

    except:
        return {"status": "ng"}