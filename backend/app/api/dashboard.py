from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_admin
from app.models.user import User
from app.services import dashboard_service

router = APIRouter()


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return dashboard_service.get_dashboard_summary(db)


@router.get("/users")
def get_users_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return dashboard_service.get_user_statistics(db)


@router.get("/agents")
def get_agents_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return dashboard_service.get_agent_statistics(db)


@router.get("/policies")
def get_policies_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return dashboard_service.get_policy_statistics(db)


@router.get("/budgets")
def get_budgets_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return dashboard_service.get_budget_statistics(db)


@router.get("/audit")
def get_audit_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return dashboard_service.get_audit_statistics(db)


@router.get("/emergency")
def get_emergency_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return dashboard_service.get_emergency_statistics(db)
