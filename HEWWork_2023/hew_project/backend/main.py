import uvicorn
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import secrets

app = FastAPI()

# CORSの設定
app.add_middleware(SessionMiddleware, secret_key="kore_ha-secret-zyanne*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:4173",
        "http://host.docker.internal:8080",
        "https://example.com",
        "https://api.example.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# root_routerを作成
root_router = APIRouter(prefix="/api/v1")

# __init__.pyをインポート
## 新しくモジュール(フォルダ)を追加したらここにインポートする
import auth
import user
import post
import gadgets
import dm
import schedule

import developer

# 各モジュールの__init__.pyにあるrouterをインポート
# 新しくモジュールを作成したらここにインポートしたルーターを追加
root_router.include_router(user.router)
root_router.include_router(auth.router)
root_router.include_router(post.router)
root_router.include_router(gadgets.router)
root_router.include_router(dm.router)
root_router.include_router(schedule.router)
root_router.include_router(developer.router)

# root_routerをappにinclude
app.include_router(root_router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        reload=True,
    )
