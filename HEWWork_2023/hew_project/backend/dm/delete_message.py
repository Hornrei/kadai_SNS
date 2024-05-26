from fastapi import APIRouter, Request, HTTPException
from modules import dbop, oauth
from modules.oauth import verify_token  # verify_token関数をインポート

router = APIRouter(tags=["deleteMessage"])

@router.delete("/deleteMessage/{message_id}")
async def delete_message(message_id: str, token: str):
    """
    特定のメッセージを削除

    :param message_id: 削除するメッセージのID。
    :param token: ユーザー認証トークン。
    :return: 削除が成功した場合は{"status": "ok"}を返します。
    """
    try:
        # トークンを検証し、ユーザーIDを取得
        user_id = verify_token(token)

        # データベース操作クラスのインスタンスを作成
        dp = dbop.DBOP()

        # メッセージをデータベースから削除
        dp.delete_message(message_id, user_id)
        
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