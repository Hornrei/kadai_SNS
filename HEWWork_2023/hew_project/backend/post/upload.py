from fastapi import APIRouter, Request
from modules import dbop, oauth, s3op
import uuid
from pydantic import BaseModel
import base64
import tempfile
import os

router = APIRouter(tags=["upload"])

class Data(BaseModel):
    image: str

# @router.post("/upload/image")
# async def upload_image(request: Request,image: Data):
#     """
#     画像をアップロードする
#     要リファクタリング
#     """
#     data = image.image
#     raw_token, token_provider = oauth.parse_request(request)
#     token = await oauth.token_check(raw_token, token_provider)
    
#     dp = dbop.DBOP()
    
#     user_id = dp.get_user_id(token["sub"])
    
#     data = base64.b64decode(data.split(",")[1])

#     s3 = s3op.s3_client()

#     bucket_name = "temp"
#     _uuid = str(uuid.uuid4()).replace("-", "")
    
#     s3.put_object(
#     Bucket=bucket_name, Key=f"{user_id}/posts/{_uuid}.png", Body=data, ContentType="image/png"
#     )
#     return {"status": "ok", "image_url":f"{os.environ['BLOB_HOST']}/{bucket_name}/{user_id}/posts/{_uuid}.png"}


@router.post("/upload/image")
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


# class Decision(BaseModel):
#     uuid_: str
#     post_id: str

# @router.post("/decision/postimage")
# async def decisionpost(request: Request, decision: Decision):
#     """
#     ポスト画像かくてい！\n
#     uuid_: tempのuuidを指定
#     """
#     try: 
#         uuid_ = decision.uuid_
#         post_id = decision.post_id

#         dp = dbop.DBOP()
#         raw_token, token_provider = oauth.parse_request(request)
#         token = await oauth.token_check(raw_token, token_provider)

#         user_id = dp.get_user_id(token["sub"])

#         s3 = s3op.s3_client()

#         with tempfile.TemporaryFile() as tf: 
#             bucket_name = "temp"
#             s3.download_fileobj(bucket_name, uuid_, tf)
#             tf.seek(0)
#             data = tf.read()
#             bucket_name= "main"
#             s3.put_object(Bucket=bucket_name, Key=f"{user_id}/posts/{post_id}", Body=data, ContentType="image/png")

#             # data = base64.b64encode(data)
#             # image = (f"data:image/{image_type};base64," + str(data)[2:])

#         return {"status": "ok", "image_url": f"http://127.0.0.1:9000/{bucket_name}/{user_id}/posts/{post_id}"}
#     except Exception as e:
#         return {"status": "ng"}

