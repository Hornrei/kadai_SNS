from fastapi import APIRouter, Request
from pydantic import BaseModel
import uuid
from app.notice import dbop

router = APIRouter(tags=["notice"])

class Data(BaseModel):
    target: str
    type: str
    content: str

@router.post("/create")
async def create(request: Request, data: Data): 
    """
    target: 通知を受け取るユーザーのID\n
    type: 通知のタイプ\n
    content: 通知の内容\n
    type: content ↓\n
    dm: group_id, favorite: post_id, follow: user_id, comment: comment_id
    """
    try: 
        if data.target == "" or data.type == "" or data.content == "": 
            return {"status": "ng"}

        dp = dbop.DBOP()

        uuid_ = str(uuid.uuid4()).replace("-", "")

        dp.create_notice(uuid_, data.target, data.type, data.content)
        dp.commit()

        return {"status": "ok"}
    except: 
        return {"status": "ng"}


class Data(BaseModel):
    target: str
    type: str
    content: str

@router.post("/delete")
async def delete(request: Request, data: Data): 
    try: 
        if data.target == "" or data.type == "" or data.content == "": 
            return {"status": "ng"}

        dp = dbop.DBOP()

        dp.delete_notice(data.target, data.type, data.content)
        dp.commit()

        return {"status": "ok"}
    except Exception as e: 
        return {"status": str(e)}


@router.get("/get")
async def get(request: Request, user_id: str): 
    try: 
        dp = dbop.DBOP()

        count = dp.get_notice_count(user_id)

        return_ = {
            "dm": {"count": 0, "content": set()}, 
            "favorite": {"count": 0, "content": set()}, 
            "follow": {"count": 0, "content": set()}, 
            "comment": {"count": 0, "content": set()}
        }

        for d in count:
            return_[d[0]]["count"] = d[1]

        info = dp.get_notice(user_id)

        print(info)

        for d in info:
            return_[d[1]]["content"].add(d[2])

        return {"status": "ok", "data": return_}
    except: 
        return {"status": "ng"}
