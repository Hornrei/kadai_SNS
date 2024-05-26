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

@router.post("/upload")
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

        return {"status": "ok", "uuid": uuid_, "image_url":f"https://blob.{os.environ["FRONTEND_HOST"]}/{bucket_name}/{uuid_}"}
    except Exception as e:
        return {"status": "ng"}
