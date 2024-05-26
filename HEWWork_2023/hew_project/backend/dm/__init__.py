from fastapi import APIRouter

# モジュール内のrouterをインポート
## 新しくファイルを作成したらここにファイル名を追加する
from dm import (
    dummy,
    post_createDM,
    post_deleteDM,
    createDMGroup,
    post_addDMUser,
    deleteDMGroup,
    removeDMUser,
    getDMGroup,
    getDMMassage,
    dm_group, 
    upload
    )


# routerを作成
router = APIRouter(
    tags=["dm"],
    prefix="/dm",
    )

# routerをinclude
## 新しくファイルを作成したらインポートしたモジュールのrouterをここに追加する
router.include_router(dummy.router)
router.include_router(post_createDM.router) # メッセージ作成
router.include_router(post_deleteDM.router) # メッセージ削除
router.include_router(createDMGroup.router) # グループ作成
router.include_router(post_addDMUser.router) # グループに人を追加
router.include_router(deleteDMGroup.router) # グループ抹消
router.include_router(removeDMUser.router) # グループから脱退
router.include_router(getDMGroup.router) # グループ取得
router.include_router(getDMMassage.router) # メッセージ取得

router.include_router(dm_group.router) # メッセージ取得
router.include_router(upload.router) # 画像アップロード