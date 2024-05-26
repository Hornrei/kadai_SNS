from fastapi import APIRouter, Request, Response
from modules import dbop, oauth

router = APIRouter(tags=["check"])


@router.get("/check/id")
def confirm_id(request: Request, user_id: str):
    dp = dbop.DBOP()
    return_ = dp.confirm_id(user_id)
    return {"status": return_}
