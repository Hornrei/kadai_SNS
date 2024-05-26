from fastapi import APIRouter
from gadgets import(
    get,
    create,
    upload,
    rental
)

router = APIRouter(
    prefix="/gadget",
    tags=["gadget"],
)

router.include_router(get.router)
router.include_router(create.router)
router.include_router(upload.router)
router.include_router(rental.router)
