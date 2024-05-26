from fastapi import APIRouter, Request
from fastapi.responses import Response
from modules import oauth


router = APIRouter()


@router.get("/confirm")
async def confirm(request: Request):
    try:
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        print(token)
    except:
        token = None
    if not token:
        return Response(status_code=401,content="error")
    return Response(status_code=200,content="ok")
