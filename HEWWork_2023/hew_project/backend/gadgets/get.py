import os
from fastapi import APIRouter, Request
from modules import dbop, oauth
import uuid

router = APIRouter(tags=["gadgets"])

# @router.get("/get")
# def get_gadget_list(count:int=10,offset:int=0,filter:str|None=None):
#     dp = dbop.DBOP()
#     data = dp.get_gadget_list(count, offset, filter)
#     _return = []


#     for d in data:
#         user_name = dp.get_user_name(d[1])
#         _return.append({"gadget_id":d[0],"user_id": d[1], "gadget_name": d[2],"gadget_image":d[3], "gadget_tag": [d[4],d[5],d[6]], "gadget_content": d[7], "timestamp": d[8]})

#     return _return

@router.get("/get/{gedget_id}")
def get_gadget(gedget_id: str):
    """
    ガジェットモーダルを開いたときに呼び出されるAPI\n
    """
    try: 
        dp = dbop.DBOP()
        return_ = dp.get_gadget(gedget_id)
        return {
            "gadget_id": return_[0],
            "user_id": return_[1],
            "gadget_name": return_[2],
            "gadget_image": f"{os.environ['BLOB_HOST']}/main/{return_[1]}/gadgets/{return_[0]}",
            "gadget_tag": [return_[4], return_[5], return_[6]],
            "gadget_content": return_[7],
            "timestamp": return_[8],
            "rental_status": return_[9],
            # 誰かにレンタルされているかどうか
            "is_rental": not(dp.confirm_rental(gedget_id))
        }
    except Exception as e:
        return {"status": "ng", "error": str(e)}


@router.get("/get")
def get_gadget_moc(count:int=10, offset:int=0, filter:str=None, rental_status:int=None):
    """
    ガジェットの一覧を取得する
    """
    # try: 
    dp = dbop.DBOP()
    data = dp.get_gadget_list(count, offset, filter, rental_status)
    return_ = []
    for d in data: 
        return_.append({
            "gadget_id": d[0],
            "user_id": d[1],
            "gadget_name": d[2],
            "gadget_image": d[3],
            "gadget_tag": [d[4], d[5], d[6]],
            "gadget_content": d[7],
            "timestamp": d[8],
            # ユーザーがレンタル可能かどうかを設定する
            "rental_status": d[9]
        })
    return return_
# except Exception as e:
    return {"status": "ng"}

