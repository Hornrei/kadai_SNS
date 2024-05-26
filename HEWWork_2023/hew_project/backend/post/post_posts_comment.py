from fastapi import APIRouter, Request
from modules import dbop, oauth
import uuid
import requests
import os

router = APIRouter(tags=["comment"])

@router.post("/comment")
async def comment(request: Request,):
    try: 
        data = (await request.json())
        commentID = data["postID"]
        content = data["content"]
        imageUrl = data["image_url"]

        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        dp = dbop.DBOP()
        userID = dp.get_user_id(token["sub"])
        postID = str(uuid.uuid4()).replace("-", "")
        dp.comment_posts(postID, userID, content, commentID, imageUrl)

        target_id = dp.get_id_from_postID(commentID)

        post_url = f"https://notify.{os.environ["FRONTEND_HOST"]}/api/notice/create"
        request_body = {"target": [target_id], "type": "comment", "content": postID}
        response_ = requests.post(post_url, json=request_body)

        if response_.json()["status"] != "ok":
            return {"status": "ng", "message": "Error in notify"}

        dp.commit()
        return {"status": "ok"}
    except:
        return {"status": "ng"}
