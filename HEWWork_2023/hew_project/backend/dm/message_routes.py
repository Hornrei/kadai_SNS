from fastapi import APIRouter, Request, HTTPException
from modules import dbop, oauth
import uuid

router = APIRouter(tags=["sendMessage"])

@router.post("/sendMessage")
async def send_message(request: Request):
    """
    メッセージを送信を行う

    :param request: メッセージを送信するためのリクエスト。
    :return: 送信が成功した場合は{"status": "ok"}を返します。
    """
    try:
        data = await request.json()
        target_user_id = data["target_user_id"]
        message_content = data["message_content"]

        # トークンを取得し、検証
        raw_token, token_provider = oauth.parse_request(request)
        token = await oauth.token_check(raw_token, token_provider)

        # データベース操作クラスのインスタンスを作成
        dp = dbop.DBOP()

        # 送信者のユーザーIDを取得
        sender_user_id = dp.get_user_id(token["sub"])

        # ランダムなメッセージIDを生成（UUIDを使用）
        message_id = str(uuid.uuid4()).replace("-", "")

        # メッセージをデータベースに保存
        dp.add_message(message_id, sender_user_id, target_user_id, message_content)
        
        # トランザクションのコミット
        dp.commit()

        # データベース接続を閉じる
        dp.close()

        return {"status": "ok"}

    except HTTPException as e:
        # HTTPエラーが発生した場合はエラーレスポンスを返す
        raise HTTPException(status_code=e.status_code, detail=str(e.detail))
    except Exception as e:
        # その他のエラーが発生した場合はエラーレスポンスを返す
        raise HTTPException(status_code=500, detail=str(e))
