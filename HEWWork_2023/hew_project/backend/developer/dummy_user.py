from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse
from modules.oauth import oauth
from modules import dbop
import json
router = APIRouter()


@router.get("/set_auth_cookie")
def dev_user01(request: Request, user_id: str):
    response = Response(status_code=200)

    response.set_cookie(
        key="token_id",
        value=json.dumps({'user': f'{user_id}'}),
        httponly=True,
    )
    response.set_cookie(
        key="token_provider",
        value="dummy",
    )
    
    return response

