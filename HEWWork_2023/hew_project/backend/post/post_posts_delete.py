from fastapi import APIRouter, Request
from modules import dbop, oauth
# これも一旦俺作

router = APIRouter(tags=["delete"])

@router.post("/delete")
async def delete(request: Request,):
    # よくわかんないけどなんか引っ張ってきてなんかしてる
    data = (await request.json())
    postID = data["postID"]

    # よくわかんないけどなんかしてなんか頑張ってからやったぜってしてる
    raw_token, token_provider = oauth.parse_request(request)
    token = await oauth.token_check(raw_token, token_provider)

    dp = dbop.DBOP()
    userID = dp.get_user_id(token["sub"])
    dp.delete_posts(postID, userID)
    dp.commit()
    return {"status": "ok"}