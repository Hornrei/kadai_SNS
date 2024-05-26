from fastapi import APIRouter, Path

router = APIRouter(tags=["dummy"])

@router.get("/getDMList/{user_id}", response_model=list)
async def get_dm_list(user_id: int = Path(..., title="ユーザーのDMリストを取得するためのID")):
    """
    特定のユーザーのダイレクトメッセージのリストを取得します。

    :param user_id: DMリストを取得するためのユーザーID。
    :return: ダイレクトメッセージのリスト。
    """
    # ここにユーザーのダイレクトメッセージのリストを取得するためのロジックを取得
    # 指定されたユーザーのDMを取得するためにデータベースをクエリするかもしれない

    # イラストレーションのためのダミーのデータ
    dummy_dm_list = [
        {"id": 1, "sender": "user1", "message": "こんにちは"},
        {"id": 2, "sender": "user2", "message": "やあ"},
    ]

    return dummy_dm_list