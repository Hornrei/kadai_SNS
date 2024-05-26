from fastapi import APIRouter, Request
from modules import dbop, oauth
from pydantic import BaseModel

router = APIRouter(tags=["removeSchedule"])

class Data(BaseModel): 
    schedule_id: str

@router.post("/removeSchedule")
async def removeSchedule(request: Request, data: Data):
    try: 
        schedule_id = data.schedule_id

        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        dp = dbop.DBOP()
        user_id = dp.get_user_id(token["sub"])

        dp.remove_schedule(schedule_id, user_id)
        dp.commit()

        return {"status": "ok"}
    except Exception: 
        return {"status": "ng"}
