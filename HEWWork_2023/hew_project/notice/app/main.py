import uvicorn
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"] 
)

root_router = APIRouter(prefix="/api")

import app.notice as notice

root_router.include_router(notice.router)

app.include_router(root_router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        reload=True,
    )
