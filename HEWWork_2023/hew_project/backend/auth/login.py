from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from modules.oauth import oauth
from modules import dbop
import os 


router = APIRouter()


@router.get("/login/callback/{provider}")
async def login_callback(request: Request, provider: str):
    if provider == "google":
        token = await oauth.google.authorize_access_token(request)
    elif provider == "line":
        token = await oauth.line.authorize_access_token(request)
    elif provider == "hew":
        token = await oauth.hew.authorize_access_token(request)

    sub = token["userinfo"]["sub"]
    try:
        dp = dbop.DBOP()
        dp.get_user_id(sub)
        response = RedirectResponse(url=os.environ["FRONTEND_HOST"])
    except:
        response = RedirectResponse(url=f"{os.environ['FRONTEND_HOST']}/signup")
    response.set_cookie(
        key="token_id",
        value={"id_token":token["id_token"]},
        httponly=True,
        path="/",
        secure=True,
        samesite="Lax",
        domain=os.environ["FRONTEND_HOST"]
    )
    response.set_cookie(
        key="token_provider",
        value=provider,
        httponly=False,
        path="/",
        secure=True,
        samesite="Lax",
        domain=os.environ["FRONTEND_HOST"]
    )
    
    return response


@router.get("/login/{provider}")
async def login(request: Request, provider: str):
    redirect_uri = f"{os.environ['BACKEND_HOST']}/api/v1/auth/login/callback/{provider}"
    print(redirect_uri)
    if provider == "google":
        return await oauth.google.authorize_redirect(request, redirect_uri)
    elif provider == "line":
        return await oauth.line.authorize_redirect(request, redirect_uri)
    elif provider == "hew":
        return await oauth.hew.authorize_redirect(request, redirect_uri)


