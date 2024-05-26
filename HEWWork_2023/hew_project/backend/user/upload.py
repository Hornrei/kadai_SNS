from fastapi import APIRouter, Request
from modules import dbop, oauth, s3op
import base64
from pydantic import BaseModel
import uuid
import tempfile
import os

router = APIRouter(tags=["upload"])

class Data(BaseModel):
    image: str

# @router.post("/upload/icon")
# async def upload_icon(request: Request,image: Data):
#     """
#     画像をアップロードする
#     要リファクタリング
#     """
#     data = image.image
#     dp = dbop.DBOP()
#     data = base64.b64decode(data.split(",")[1])
#     s3 = s3op.s3_client()
#     bucket_name = "temp"
#     _uuid = str(uuid.uuid4()).replace("-", "")
#     s3.put_object(
#     Bucket=bucket_name, Key=f"temp/user/icon/{_uuid}.png", Body=data, ContentType="image/png"
#     )
#     return {"status": "ok", "image_url":f"http://127.0.0.1:9000/temp/temp/user/icon/{_uuid}.png", "uuid":_uuid}

# @router.post("/change/icon")
# async def change_icon(request: Request, image: Data):
#     """
#     アイコンを変更する
#     """
#     try: 
#         raw_token, token_provider = oauth.parse_request(request)
#         token = await oauth.token_check(raw_token, token_provider)

#         dp = dbop.DBOP()
#         user_id = dp.get_user_id(token["sub"])

#         data = image.image

#         data = base64.b64decode(data.split(",")[1])
#         s3 = s3op.s3_client()
#         bucket_name = "temp"
#         _uuid = str(uuid.uuid4()).replace("-", "")
#         s3.put_object(
#         Bucket=bucket_name, Key=f"temp/user/icon/{_uuid}.png", Body=data, ContentType="image/png")

#         icon_url = f"http://127.0.0.1:9000/temp/temp/user/icon/{_uuid}.png"
#         dp.change_user_icon(user_id, icon_url)
#         dp.commit()

#         return {"status": "ok"}
#     except Exception as e:
#         return {"status": "ng"}


@router.post("/upload/icon")
async def upload_temp(request: Request, image: Data):
    """
    画像をtempにアップロード
    """
    try: 
        data = image.image

        data = base64.b64decode(data.split(",")[1])
        s3 = s3op.s3_client()
        bucket_name = "temp"
        uuid_ = str(uuid.uuid4()).replace("-", "")
        s3.put_object(
        Bucket=bucket_name, Key=uuid_, Body=data, ContentType="image/png")

        return {"status": "ok", "uuid": uuid_, "image_url":f"{os.environ['BLOB_HOST']}/{bucket_name}/{uuid_}"}
    except Exception as e:
        return {"status": "ng"}


class Decision(BaseModel):
    uuid_: str

@router.post("/change/icon")
async def decisionicon(request: Request, decision: Decision):
    """
    画像を取得&アイコンに設定\n
    uuid_: tempのuuidを指定
    """
    try: 
        uuid_ = decision.uuid_
        dp = dbop.DBOP()
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        user_id = dp.get_user_id(token["sub"])

        s3 = s3op.s3_client()

        with tempfile.TemporaryFile() as tf: 
            bucket_name = "temp"
            s3.download_fileobj(bucket_name, uuid_, tf)
            tf.seek(0)
            data = tf.read()
            bucket_name= "main"
            s3.put_object(Bucket=bucket_name, Key=f"{user_id}/icon", Body=data, ContentType="image/png")

            # data = base64.b64encode(data)
            # image = (f"data:image/{image_type};base64," + str(data)[2:])

        return {"status": "ok", "image_url": f"{os.environ['BLOB_HOST']}/{bucket_name}/{user_id}/icon"}
    except Exception as e:
        return {"status": "ng"}
