from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional

router = APIRouter(tags=["direct_messages"])

@router.post("/{conversation_id}/images")
async def upload_image(conversation_id: str, image: UploadFile = File(...), caption: Optional[str] = None):
    # 画像データのサイズをチェックします。
    if image.file._file.size > 25 * 1024 * 1024:  # 25MB
        raise HTTPException(status_code=400, detail="Image file size exceeds the 25MB limit.")

    # 画像データの形式をチェック
    # JPEG、PNG、およびGIFを許可
    if image.filename.split(".")[-1] not in ["jpg", "jpeg", "png", "gif"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG, PNG, and GIF are allowed.")

    # ここで画像データを処理
    # image.fileにはアップロードされたファイルのデータが、
    # image.filenameにはアップロードされたファイルの名前が含まれる

    # 画像データを保存し、新しいimage_idを生成
    image_id = "newly_created_image_id"

    return {
        "status": "success",
        "message": "Image uploaded successfully",
        "image_id": image_id
    }
