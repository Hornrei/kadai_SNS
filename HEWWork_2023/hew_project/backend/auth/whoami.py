from fastapi import APIRouter, Request, Cookie, Header
from fastapi.responses import Response
from modules import oauth
from modules import dbop
import json
from pydantic import BaseModel

router = APIRouter()


@router.get(
    "/whoami",
    responses={
        200: {
            "description": "ログインしているユーザーの情報をCookieに設定する",
            "content": {"application/json": {"example": {}}},
            "headers": {
                "Set-Cookie": {
                    "description": "user_idを設定するクッキーと、user_iconを設定するクッキー",
                    "schema": {
                        "type": "string",
                        "example": "user_id=12345; user_icon=http://127.0.0.1:8000/temp;",
                    },
                }
            },
        },
        401:{
            "description": "汎用エラー",
            "content": {"application/json": {"example": {"status": "error"}}},
        }
    },
)
async def whoami_token(
    request: Request,
    token_id: str = Cookie(default=None, description="base64 encode token id"),
    token_provider: str | None = Cookie(default=None, description="token provider"),
):

    try:
        token_id = json.loads(token_id.replace("'", '"'))
        token = await oauth.token_check(token_id, token_provider)
    except:
        token = None
    if not token:
        return Response(status_code=401, content="error")
    try:
        dp = dbop.DBOP()
        user_id = dp.get_user_id(token["sub"])
        return {"status": "ok", "user_id": user_id}
        response = Response(status_code=200)
        response.set_cookie(key="user_id", value=user_id)
        response.set_cookie(key="user_icon", value=dp.get_user_icon(user_id))
        response.body = json.dumps({"status": "ok", "user_id": user_id})
        print(response.body)

    except:
        return Response(status_code=401, content="error")

    return response
