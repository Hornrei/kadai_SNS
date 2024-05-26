import os
from fastapi import APIRouter, Request
from modules import dbop, oauth, s3op
import uuid
from pydantic import BaseModel
import tempfile

router = APIRouter(tags=["create"])


class Data(BaseModel):
    gadget_name: str
    gadget_tag1: str
    gadget_tag2: str
    gadget_tag3: str
    gadget_content: str
    image_uuid: str
    rental_status: bool


@router.post("/create")
async def create(request: Request, data: Data):
    """
    ガジェット作成 & 画像をmainに追加\n
    image_uuid: tempにある画像のuuid
    """

    # data = (await request.json())
    # gadget_name = data["gadget_name"]
    # gadget_image = data["gadget_image"]
    # gadget_tag1 = data["gadget_tag1"]
    # gadget_tag2 = data["gadget_tag2"]
    # gadget_tag3 = data["gadget_tag3"]
    # gadget_content = data["gadget_content"]
    # try:
    gadget_name = data.gadget_name
    gadget_tag1 = data.gadget_tag1
    gadget_tag2 = data.gadget_tag2
    gadget_tag3 = data.gadget_tag3
    gadget_content = data.gadget_content
    rental_status = data.rental_status

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)
    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])

    gadget_id = str(uuid.uuid4()).replace("-", "")

    # 画像処理
    image_uuid = data.image_uuid
    s3 = s3op.s3_client()

    with tempfile.TemporaryFile() as tf:
        bucket_name = "temp"
        s3.download_fileobj(bucket_name, image_uuid, tf)
        tf.seek(0)
        data = tf.read()
        bucket_name = "main"
        s3.put_object(
            Bucket=bucket_name,
            Key=f"{user_id}/gadgets/{gadget_id}",
            Body=data,
            ContentType="image/png",
        )
        dp.create_gadget(
            gadget_id,
            user_id,
            gadget_name,
            f"{os.environ.get('BLOB_HOST')}/{bucket_name}/{user_id}/gadgets/{gadget_id}",
            gadget_tag1,
            gadget_tag2,
            gadget_tag3,
            gadget_content,
            int(rental_status),
        )
        dp.commit()

    return {"status": "ok"}
    # except Exception as e:
    #     return {"status": "ng", "error": str(e)}
