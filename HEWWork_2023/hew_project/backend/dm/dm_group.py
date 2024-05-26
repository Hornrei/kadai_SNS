from fastapi import APIRouter, Request, Cookie
from modules import dbop, oauth
import uuid
from pydantic import BaseModel

router = APIRouter(tags=["dm_group"])


@router.post("/create_dm_group")
async def create_dm_group(request: Request):
    """
    APIをコールしたユーザーIDを取得し、DMグループを作成する\n
    ログイン後
    できる
    """

    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    user_id = dp.get_user_id(token["sub"])
    group_id = str(uuid.uuid4()).replace("-", "")

    dp.addUser_dm(group_id, user_id)
    dp.commit()

    return {"status": "ok", "group_id": group_id}
