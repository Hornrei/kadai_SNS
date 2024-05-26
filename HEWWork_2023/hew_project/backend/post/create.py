import os
from fastapi import APIRouter, Request
from modules import dbop, oauth, s3op
import uuid
import tempfile
from pydantic import BaseModel

router = APIRouter(tags=["create"])


class PostCreate(BaseModel):
    content: str
    image_uuid: str | None

@router.post("/create")
async def create(request: Request, data: PostCreate):
    if data.content == "" and image_url == None: 
        return {"status": "ng", "message": "content is empty"}
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)
    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])
    post_id = str(uuid.uuid4()).replace("-", "")
    s3 = s3op.s3_client()
    image_url = None
    if data.image_uuid:
        with tempfile.TemporaryFile() as tf:
            bucket_name = "temp"
            s3.download_fileobj(bucket_name, data.image_uuid, tf)
            tf.seek(0)
            raw = tf.read()
            bucket_name = "main"
            s3.put_object(
                Bucket=bucket_name,
                Key=f"{user_id}/posts/{post_id}",
                Body=raw,
                ContentType="image/png",
            )
        image_url = f"{os.environ['BLOB_HOST']}/{bucket_name}/{user_id}/posts/{post_id}"
    dp.create_post(
        post_id,
        user_id,
        image_url,
        data.content,
    )
    dp.commit()

        # data = base64.b64encode(data)
        # image = (f"data:image/{image_type};base64," + str(data)[2:])

    return {
        "status": "ok",
    }
