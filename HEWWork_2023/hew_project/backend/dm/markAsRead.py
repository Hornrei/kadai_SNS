from fastapi import APIRouter, Path

router = APIRouter(tags=["dummy"])

@router.put("/markAsRead/{message_id}")
async def mark_as_read(message_id: int = Path(..., title="既読にマークするメッセージのID")):
    """
    メッセージを既読にマーク

    :param message_id: 既読にマークするメッセージのID。
    :return: 成功メッセージ。
    """
    # ここにメッセージを既読にマークするためのロジックを書く
    # メッセージIDに基づいてデータベースを更新するかも

    return {"message": "Message marked as read successfully!"}