from fastapi import APIRouter, Request
from modules import dbop, oauth


router = APIRouter(tags=["who"])

@router.get("/whoami")
def whoami_id(request: Request):
    user_id = request.cookies.get("user_id")
    dp = dbop.DBOP()
    user_name = dp.get_user_name(user_id)
    image_url = dp.get_user_icon(user_id)
    return {"user_id": user_id, "user_name": user_name, "image_url": image_url}

@router.get("/whois/{user_id}")
def whois_id(user_id: str):
    dp = dbop.DBOP()
    user_name = dp.get_user_name(user_id)
    image_url = dp.get_user_icon(user_id)
    return {"user_id": user_id, "user_name": user_name, "image_url": image_url}