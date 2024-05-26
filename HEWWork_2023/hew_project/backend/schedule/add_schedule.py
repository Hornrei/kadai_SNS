from fastapi import APIRouter, Request
from modules import dbop, oauth
import uuid
from pydantic import BaseModel
# これも一旦俺作

router = APIRouter(tags=["addSchedule"])

class Data(BaseModel): 
    scheduleName: str
    startDate: str
    endDate: str
    location: str
    visibility: bool

@router.post("/addSchedule")
async def addSchedule(request: Request, data: Data):
    try: 
        scheduleName = data.scheduleName
        startDate = data.startDate
        endDate = data.endDate
        location = data.location
        visibility = data.visibility

        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        dp = dbop.DBOP()
        user_id = dp.get_user_id(token["sub"])
        schedule_id = str(uuid.uuid4()).replace("-", "")
        dp.add_schedule(schedule_id, user_id, startDate, endDate, location, scheduleName, visibility)
        dp.commit()
        return {"status": "ok"}
    except Exception: 
        return {"status": "ng"}
