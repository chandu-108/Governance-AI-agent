from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.agent import Agent
from app.models.permission import Permission
from app.models.budget import Budget
from app.models.policy import Policy


def build_governance_context(
    user_id: int,
    agent_id: int,
    requested_action: str,
    db: Session
) -> dict:
    # 1. Query User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # 2. Query Agent
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    # 3. Query Permission (specific to this user and agent)
    permission = (
        db.query(Permission)
        .filter(
            Permission.user_id == user_id,
            Permission.agent_id == agent_id
        )
        .first()
    )

    # 4. Query Budget (for the agent)
    budget = db.query(Budget).filter(Budget.agent_id == agent_id).first()

    # 5. Query all Policies
    policies = db.query(Policy).all()

    # Format return dictionary
    return {
        "user": {
            "id": user.id,
            "role": user.role
        },
        "agent": {
            "id": agent.id,
            "status": agent.status
        },
        "permission": {
            "level": permission.permission if permission else None
        },
        "budget": {
            "daily_limit": float(budget.daily_limit) if budget else None,
            "daily_used": float(budget.daily_used) if budget else None,
            "monthly_limit": float(budget.monthly_limit) if budget else None,
            "monthly_used": float(budget.monthly_used) if budget else None
        },
        "policies": [
            {
                "id": p.id,
                "name": p.name,
                "policy_type": p.policy_type,
                "target_resource": p.target_resource,
                "effect": p.effect,
                "priority": p.priority,
                "rego_policy_name": p.rego_policy_name,
                "is_active": p.is_active
            }
            for p in policies
        ],
        "action": requested_action
    }
