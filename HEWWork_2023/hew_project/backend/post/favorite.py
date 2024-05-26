from fastapi import APIRouter, Request
from modules import dbop, oauth
import requests
import os

router = APIRouter(tags=["favorite"])

# ふぁぼる
@router.post("/favorite")
async def favorite(request: Request,):
    """
    ふぁぼる\n
    必要なデータ: {"post_id": str}
    """
    try: 
        data = (await request.json())
        post_id = data["post_id"]
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        dp = dbop.DBOP()
        user_id = dp.get_user_id(token["sub"])
        dp.favorite_posts(post_id, user_id)

        target_id = dp.get_id_from_postID(post_id)

        post_url = f"https://notify.{os.environ["FRONTEND_HOST"]}/api/notice/create"
        request_body = {"target": [target_id], "type": "favorite", "content": post_id}
        response_ = requests.post(post_url, json=request_body)

        if response_.json()["status"] != "ok":
            return {"status": "ng", "message": "Error in notify"}

        dp.commit()
        return {"status": "ok"}
    except Exception as e: 
        return {"status": "ng", "message": str(e)}

# ふぁぼけす
@router.post("/unfavorite")
async def unfavorite(request: Request,):
    """
    ふぁぼけす\n
    必要なデータ: {"post_id": str}
    """
    try: 
        data = (await request.json())
        post_id = data["post_id"]

        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        dp = dbop.DBOP()
        user_id = dp.get_user_id(token["sub"])
        dp.unfavorite_posts(post_id, user_id)

        target_id = dp.get_id_from_postID(post_id)

        post_url = f"https://notify.{os.environ["FRONTEND_HOST"]}/api/notice/delete"
        request_body = {"target": target_id, "type": "favorite", "content": post_id}
        response_ = requests.post(post_url, json=request_body)

        if response_.json()["status"] != "ok":
            return {"status": "ng", "message": "Error in notify"}

        dp.commit()
        return {"status": "ok"}
    except:
        return {"status": "ng"}

# ふぁぼカウント
@router.get("/{post_id}/favorite/count")
def favorite_count(request: Request, post_id: str):
    """
    postのfavorite数を取得
    """
    try: 
        dp = dbop.DBOP()
        cnt = dp.get_favorite_cnt(post_id)
        return {"status": "ok", "count": cnt}
    except:
        return {"status": "ng"}

# ふぁぼリスト
@router.get("/favoriteList")
async def favoriteList(request: Request,post_id: str):
    """
    ふぁぼリスト\n
    必要なデータ: {"post_id": str}
    """
    try: 
        dp = dbop.DBOP()
        res = {"status": "ok", "list": []}
        for i in dp.get_favorite_list(post_id):
            res["list"].append({"user_id": i[0], "user_name": i[1]})

        return res
    except:
        return {"status": "ng"}



"""
一番きれいな実装としては

- いいねする get | post
    - /{post_id}/favorite/set
- いいねを取り消す get | post
    - /{post_id}/favorite/unset
    - /{post_id}/favorite/delete
    - /{post_id}/favorite/remove
- いいね数を取得 get
    - /{post_id}/favorite/count
- いいねリストを取得 get
    - /{post_id}/favorite/list
だと個人的には思う
追記: /{post_id}を先に持ってくとprefixがつけにくいので,先にfavoriteを持ってきてもいいかも
"""