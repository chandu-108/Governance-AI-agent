import json
from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services import governance_service, audit_service, emergency_service
from app.opa import service as opa_service

router = APIRouter()


class GovernanceEvaluateRequest(BaseModel):
    agent_id: int = Field(..., json_schema_extra={"example": 1})
    action: str = Field(..., json_schema_extra={"example": "EXECUTE"})


@router.post("/evaluate", status_code=status.HTTP_200_OK)
def evaluate(
    payload: GovernanceEvaluateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Capture metadata
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    request_id = request.headers.get("x-request-id")

    # 1. Emergency Kill Switch Check
    blocked, block_reason = emergency_service.is_agent_blocked(
        payload.agent_id,
        db
    )
    if blocked:
        # Build context for audit logs (even on deny)
        context = governance_service.build_governance_context(
            user_id=current_user.id,
            agent_id=payload.agent_id,
            requested_action=payload.action,
            db=db
        )
        # Log the emergency block event
        log_data = {
            "user_id": current_user.id,
            "agent_id": payload.agent_id,
            "action": payload.action,
            "permission_checked": json.dumps(context.get("permission")),
            "policy_checked": json.dumps(context.get("policies")),
            "budget_checked": json.dumps(context.get("budget")),
            "decision": "DENY",
            "reason": block_reason,
            "request_id": request_id,
            "ip_address": ip_address,
            "user_agent": user_agent
        }
        audit_service.create_audit_log(log_data, db)

        return {
            "allowed": False,
            "reason": block_reason,
            "context": context
        }

    # 2. Standard Evaluation (OPA validation pipeline)
    context = governance_service.build_governance_context(
        user_id=current_user.id,
        agent_id=payload.agent_id,
        requested_action=payload.action,
        db=db
    )
    decision = opa_service.evaluate_governance(context)

    # Save to Audit Log
    log_data = {
        "user_id": current_user.id,
        "agent_id": payload.agent_id,
        "action": payload.action,
        "permission_checked": json.dumps(context.get("permission")),
        "policy_checked": json.dumps(context.get("policies")),
        "budget_checked": json.dumps(context.get("budget")),
        "decision": "ALLOW" if decision["allowed"] else "DENY",
        "reason": decision["reason"],
        "request_id": request_id,
        "ip_address": ip_address,
        "user_agent": user_agent
    }
    audit_service.create_audit_log(log_data, db)

    return {
        "allowed": decision["allowed"],
        "reason": decision["reason"],
        "context": context
    }
