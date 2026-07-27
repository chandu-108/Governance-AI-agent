from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from decimal import Decimal
from datetime import datetime, timezone
from app.models.budget import Budget
from app.models.agent import Agent
from app.schemas.budget import BudgetCreate, BudgetUpdate


def create_budget(
    budget_data: BudgetCreate,
    admin_id: int,
    db: Session
) -> Budget:
    # 1. Validate Agent exists
    agent = db.query(Agent).filter(Agent.id == budget_data.agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    # 2. Prevent multiple budgets for the same Agent
    existing_budget = (
        db.query(Budget).filter(Budget.agent_id == budget_data.agent_id).first()
    )
    if existing_budget:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Budget already exists for this Agent"
        )

    db_budget = Budget(
        agent_id=budget_data.agent_id,
        daily_limit=budget_data.daily_limit,
        monthly_limit=budget_data.monthly_limit,
        currency=budget_data.currency,
        warning_threshold=budget_data.warning_threshold,
        status=budget_data.status,
        created_by=admin_id
    )
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


def get_all_budgets(db: Session) -> list[Budget]:
    return db.query(Budget).all()


def get_budget(budget_id: int, db: Session) -> Budget:
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )
    return budget


def update_budget(
    budget_id: int,
    budget_data: BudgetUpdate,
    db: Session
) -> Budget:
    budget = get_budget(budget_id, db)
    update_dict = budget_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(budget, key, value)
    db.commit()
    db.refresh(budget)
    return budget


def delete_budget(budget_id: int, db: Session) -> dict:
    budget = get_budget(budget_id, db)
    db.delete(budget)
    db.commit()
    return {"detail": "Budget deleted successfully"}


def update_usage(budget_id: int, amount: Decimal, db: Session) -> Budget:
    budget = get_budget(budget_id, db)

    # Add usage
    budget.daily_used += amount
    budget.monthly_used += amount

    # Recalculate status: if limits are exceeded, change status to EXCEEDED
    if (
        budget.daily_used >= budget.daily_limit
        or budget.monthly_used >= budget.monthly_limit
    ):
        budget.status = "EXCEEDED"

    db.commit()
    db.refresh(budget)
    return budget


def reset_daily_budget(budget_id: int, db: Session) -> Budget:
    budget = get_budget(budget_id, db)
    budget.daily_used = Decimal("0.00")
    budget.last_reset = datetime.now(timezone.utc)
    if budget.status == "EXCEEDED" and budget.monthly_used < budget.monthly_limit:
        budget.status = "ACTIVE"
    db.commit()
    db.refresh(budget)
    return budget


def reset_monthly_budget(budget_id: int, db: Session) -> Budget:
    budget = get_budget(budget_id, db)
    budget.daily_used = Decimal("0.00")
    budget.monthly_used = Decimal("0.00")
    budget.last_reset = datetime.now(timezone.utc)
    if budget.status == "EXCEEDED":
        budget.status = "ACTIVE"
    db.commit()
    db.refresh(budget)
    return budget


def validate_budget(budget_id: int, db: Session) -> dict:
    budget = get_budget(budget_id, db)

    # If paused, deny execution
    if budget.status == "PAUSED":
        return {"allowed": False, "reason": "Budget paused", "warning": False}

    # If limits are exceeded
    if budget.daily_used >= budget.daily_limit:
        if budget.status != "EXCEEDED":
            budget.status = "EXCEEDED"
            db.commit()
        return {
            "allowed": False,
            "reason": "Daily budget exceeded",
            "warning": False
        }

    if budget.monthly_used >= budget.monthly_limit:
        if budget.status != "EXCEEDED":
            budget.status = "EXCEEDED"
            db.commit()
        return {
            "allowed": False,
            "reason": "Monthly budget exceeded",
            "warning": False
        }

    # Check warning threshold
    warning = False
    daily_ratio = (budget.daily_used / budget.daily_limit) * 100
    monthly_ratio = (budget.monthly_used / budget.monthly_limit) * 100

    if (
        daily_ratio >= budget.warning_threshold
        or monthly_ratio >= budget.warning_threshold
    ):
        warning = True

    return {"allowed": True, "reason": None, "warning": warning}
