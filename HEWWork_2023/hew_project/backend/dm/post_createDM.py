from fastapi import APIRouter, Request
from modules import dbop, oauth, s3op
import uuid
from pydantic import BaseModel
import tempfile
import requests
import os

router = APIRouter(tags=["createDM"])

@router.post("/createDM")
async def createDM(request: Request):
    data = (await request.json())
    content = data["content"]
    groupID = data["groupID"]
    # image_uuid = data["image_uuid"]

    if content == "":
        return {"status": "ng"}

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    userID = dp.get_user_id(token["sub"])
    if dp.dm_user_check(groupID, userID): 
        dmID = str(uuid.uuid4()).replace("-", "")

        # if image_uuid: 
        #     s3 = s3op.s3_client()
        #     with tempfile.TemporaryFile() as tf:
        #         bucket_name = "temp"
        #         s3.download_fileobj(bucket_name, image_uuid, tf)
        #         tf.seek(0)
        #         data = tf.read()
        #         bucket_name = "main"
        #         s3.put_object(Bucket=bucket_name, Key=f"dm/{groupID}/{dmID}", Body=data, ContentType="image/png")

        dp.create_dm(dmID, groupID, userID, content)

        select_list = dp.get_dm_user(groupID)
        user_list = []

        for d in select_list:
            user_list.append(d[0])
        
        user_list.remove(userID)
        
        print(user_list)

        post_url = f"https://notify.{os.environ["FRONTEND_HOST"]}/api/notice/create"
        request_body = {"target": user_list, "type": "dm", "content": groupID}
        response_ = requests.post(post_url, json=request_body)

        if response_.json()["status"] != "ok":
            return {"status": "ng", "message": "Error in notify"}

        dp.commit()
        return_ = "ok"
    else: 
        return_ = "ng"

    return {"status": return_}
