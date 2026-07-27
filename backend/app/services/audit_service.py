from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.audit_log import AuditLog
from app.models.user import User


def create_audit_log(log_data: dict, db: Session) -> AuditLog:
    db_log = AuditLog(
        user_id=log_data.get("user_id"),
        agent_id=log_data.get("agent_id"),
        action=log_data.get("action"),
        permission_checked=log_data.get("permission_checked"),
        policy_checked=log_data.get("policy_checked"),
        budget_checked=log_data.get("budget_checked"),
        decision=log_data.get("decision"),
        reason=log_data.get("reason"),
        request_id=log_data.get("request_id"),
        ip_address=log_data.get("ip_address"),
        user_agent=log_data.get("user_agent")
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_logs(db: Session, user: User) -> list[AuditLog]:
    if user.role == "admin":
        return db.query(AuditLog).all()
    return db.query(AuditLog).filter(AuditLog.user_id == user.id).all()


def get_log(log_id: int, db: Session, user: User) -> AuditLog:
    log = db.query(AuditLog).filter(AuditLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit log not found"
        )

    # Scoping security rule
    if user.role != "admin" and log.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this log record"
        )
    return log


def filter_logs(filters: dict, db: Session, user: User) -> list[AuditLog]:
    query = db.query(AuditLog)

    # Force scope restriction if regular user
    if user.role != "admin":
        query = query.filter(AuditLog.user_id == user.id)

    # Apply filters if provided
    if filters.get("agent_id") is not None:
        query = query.filter(AuditLog.agent_id == filters["agent_id"])
    if filters.get("decision") is not None:
        query = query.filter(AuditLog.decision == filters["decision"])
    if filters.get("action") is not None:
        query = query.filter(AuditLog.action == filters["action"])

    return query.all()
