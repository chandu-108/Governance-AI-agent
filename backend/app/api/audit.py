from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.audit_log import AuditLogResponse
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services import audit_service

router = APIRouter()


@router.get("/", response_model=list[AuditLogResponse])
def get_all_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return audit_service.get_logs(db, current_user)


@router.get("/filter", response_model=list[AuditLogResponse])
def get_filtered_logs(
    agent_id: int | None = Query(None),
    decision: str | None = Query(None),
    action: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filters = {
        "agent_id": agent_id,
        "decision": decision,
        "action": action
    }
    return audit_service.filter_logs(filters, db, current_user)


@router.get("/{id}", response_model=AuditLogResponse)
def get_log_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return audit_service.get_log(id, db, current_user)
