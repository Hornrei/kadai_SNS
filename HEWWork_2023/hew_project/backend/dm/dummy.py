from fastapi import APIRouter, Request

router = APIRouter(tags=["dummy"])

@router.post("/dummy")
async def create(request: Request):
    return {"dummy":"dummy"}
