from fastapi import APIRouter, Request
from modules import dbop, oauth
from pydantic import BaseModel
import datetime
import uuid

router = APIRouter(tags=["rental"])

class Data(BaseModel):
    gadget_id: str
    periods: str

@router.post("/createRental")
async def create(request: Request, data: Data): 
    """
    ガジェットのレンタルを作成\n
    gadget_id: ガジェットID\n
    periods: レンタル期間(例: 2020-01-10)\n
    """
    try: 
        dp = dbop.DBOP()
        gadget_id = data.gadget_id
        periods = data.periods
        
        # ガジェットがレンタルされている場合、ng
        if dp.confirm_rental(gadget_id) or dp.confirm_gadget_status(gadget_id) == 0:
            return {"status": "ng", "message": "gadget is rental now"}

        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        user_id = dp.get_user_id(token["sub"])

        # ガジェットの所有者は借りられません
        if dp.confirm_gadget_owner(gadget_id, user_id) == True: 
            return {"status": "ng", "message": "You are the owner of this gadget"}

        dp.create_rental(gadget_id, user_id, periods)

        # dmの作成
        owner_id = dp.get_gadget_owner(gadget_id)
        group_id = dp.get_specific_group(user_id, owner_id)

        if group_id is None:
            group_id = str(uuid.uuid4()).replace("-", "")
            dp.addUser_dm(group_id, user_id)
            dp.addUser_dm(group_id, owner_id)

        dm_id = str(uuid.uuid4()).replace("-", "")
        dp.create_dm(dm_id, group_id, user_id, f"\"{dp.get_gadget_name(gadget_id)}\"のレンタル申請をしました。{periods}まで")

        dp.commit()

        return {"status": "ok"}
    except Exception: 
        return {"status": "ng"}

class Data(BaseModel):
    gadget_id: str

@router.post("/deleteRental")
async def delete(request: Request, data: Data):
    try: 
        gadget_id = data.gadget_id

        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        dp = dbop.DBOP()
        user_id = dp.get_user_id(token["sub"])

        # ガジェット所有者以外は削除できません
        if dp.confirm_gadget_owner(gadget_id, user_id) == False: 
            return {"status": "ng"}

        dp.delete_rental(gadget_id, user_id)
        dp.commit()

        return {"status": "ok"}
    except Exception:
        return {"status": "ng"}


@router.get("/getRental")
async def getRental(request: Request, gadget_id: str):
    """
    ガジェットのレンタル情報を取得
    gadget_id: ガジェットID
    """
    try: 
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)
        dp = dbop.DBOP()
        user_id = dp.get_user_id(token["sub"])

        # ガジェットの所有者or借りた人でなければ、レンタルの情報を受け取れません
        if dp.owner_or_borrower(user_id, gadget_id) == False: 
            return {"status": "ng"}

        get_data = dp.get_rental(gadget_id)

        # ガジェット存在確認
        if dp.confirm_gadget(gadget_id) == False:
            print("gadget not found")
            return {"status": "ng"}

        # ガジェットレンタルされてるか確認
        if get_data == None:
            return {"status": "ok", "rental": "false"}

        info = {
            "gadget_id": get_data[0],
            "user_id": get_data[1],
            "periods": get_data[2]
        }
        
        periods_date = datetime.datetime.strptime(get_data[2], '%Y-%m-%d')
        periods_date = datetime.date(periods_date.year, periods_date.month, periods_date.day)

        expired = "false"
        print(datetime.date.today())
        print(type(datetime.date.today()), type(periods_date)) 
        if periods_date < datetime.date.today():
            expired = "true"

        return {"status": "ok", "rental": "true", "info": info, "expired": expired}
    except Exception:
        print("error")
        return {"status": "ng"}
