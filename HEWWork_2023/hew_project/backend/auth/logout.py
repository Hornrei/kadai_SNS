from fastapi import APIRouter, Request
from fastapi.responses import Response,RedirectResponse
from modules.oauth import oauth
import os

router = APIRouter()

logout_uri = {
    "google" : "https://accounts.google.com/Logout",
    "line" : "",
    "dummy": "",
    "hew": ""
}

@router.get("/logout")
async def logout(request: Request):
    # token_provider = request.cookies["token_provider"]
    response = Response()
    # # response.set_cookie("token_id", "", expires=0)
    # for cookie_name in request.cookies:
    #     response.set_cookie(cookie_name, "", expires=0)
    # response.body = {"uri":logout_uri[token_provider]}
    return response

@router.get("/logout/redirect")
def logout_redirect():
    res = RedirectResponse(url=f"{os.environ['FRONTEND_HOST']}")
    res.delete_cookie(        
        key="token_id",
        httponly=True,
        path="/",
        secure=True,
        samesite="Lax",
        domain=os.environ["FRONTEND_HOST"])
    return res