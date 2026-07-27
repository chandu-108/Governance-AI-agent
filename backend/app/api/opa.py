from fastapi import APIRouter
from app.opa.client import OPAClient

router = APIRouter()
client = OPAClient()


@router.get("/health")
def check_opa_health():
    is_healthy = client.health_check()
    if is_healthy:
        return {"status": "healthy"}
    return {"status": "unavailable"}
