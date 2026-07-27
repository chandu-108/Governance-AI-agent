from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.budget import (
    BudgetCreate,
    BudgetUpdate,
    BudgetResponse,
    BudgetUsageRequest,
    BudgetValidateResponse
)
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.services import budget_service

router = APIRouter()


@router.post(
    "/",
    response_model=BudgetResponse,
    status_code=status.HTTP_201_CREATED
)
def create(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return budget_service.create_budget(budget, current_admin.id, db)


@router.get("/", response_model=list[BudgetResponse])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return budget_service.get_all_budgets(db)


@router.get("/{budget_id}", response_model=BudgetResponse)
def get_by_id(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return budget_service.get_budget(budget_id, db)


@router.put("/{budget_id}", response_model=BudgetResponse)
def update(
    budget_id: int,
    budget: BudgetUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return budget_service.update_budget(budget_id, budget, db)


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    budget_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    budget_service.delete_budget(budget_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{budget_id}/usage", response_model=BudgetResponse)
def add_usage(
    budget_id: int,
    usage: BudgetUsageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return budget_service.update_usage(budget_id, usage.amount, db)


@router.post("/{budget_id}/validate", response_model=BudgetValidateResponse)
def validate(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return budget_service.validate_budget(budget_id, db)
