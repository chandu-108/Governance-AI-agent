from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.agent import Agent
from app.models.policy import Policy
from app.models.permission import Permission
from app.models.budget import Budget
from app.models.audit_log import AuditLog
from app.models.emergency import Emergency


def get_dashboard_summary(db: Session) -> dict:
    total_users = db.query(User).count()
    admins = db.query(User).filter(User.role == "admin").count()
    active_users = db.query(User).filter(User.is_active == True).count()

    total_agents = db.query(Agent).count()
    active_agents = db.query(Agent).filter(Agent.status == "ACTIVE").count()
    inactive_agents = (
        db.query(Agent).filter(Agent.status == "INACTIVE").count()
    )

    total_policies = db.query(Policy).count()
    active_policies = db.query(Policy).filter(Policy.is_active == True).count()

    total_permissions = db.query(Permission).count()

    total_budgets = db.query(Budget).count()
    exceeded_budgets = (
        db.query(Budget).filter(Budget.status == "EXCEEDED").count()
    )

    warning_count = 0
    all_budgets = db.query(Budget).all()
    for b in all_budgets:
        if (
            b.daily_limit > 0
            and (b.daily_used / b.daily_limit) * 100 >= b.warning_threshold
        ):
            warning_count += 1
        elif (
            b.monthly_limit > 0
            and (b.monthly_used / b.monthly_limit) * 100 >= b.warning_threshold
        ):
            warning_count += 1

    total_requests = db.query(AuditLog).count()
    allowed_requests = (
        db.query(AuditLog).filter(AuditLog.decision == "ALLOW").count()
    )
    denied_requests = (
        db.query(AuditLog).filter(AuditLog.decision == "DENY").count()
    )

    global_emergency = (
        db.query(Emergency).filter(Emergency.agent_id == None).first()
    )
    global_enabled = global_emergency.enabled if global_emergency else False
    blocked_agents = (
        db.query(Emergency)
        .filter(Emergency.agent_id != None, Emergency.enabled == True)
        .count()
    )

    return {
        "users": {
            "total": total_users,
            "admins": admins,
            "active": active_users
        },
        "agents": {
            "total": total_agents,
            "active": active_agents,
            "inactive": inactive_agents
        },
        "policies": {
            "total": total_policies,
            "active": active_policies
        },
        "permissions": {
            "total": total_permissions
        },
        "budgets": {
            "total": total_budgets,
            "exceeded": exceeded_budgets,
            "warning": warning_count
        },
        "audit": {
            "total_requests": total_requests,
            "allowed": allowed_requests,
            "denied": denied_requests
        },
        "emergency": {
            "global_enabled": global_enabled,
            "blocked_agents": blocked_agents
        }
    }


def get_user_statistics(db: Session) -> dict:
    total_users = db.query(User).count()
    admins = db.query(User).filter(User.role == "admin").count()
    active_users = db.query(User).filter(User.is_active == True).count()
    inactive_users = total_users - active_users

    # Most active user
    active_user_query = (
        db.query(AuditLog.user_id, func.count(AuditLog.id).label("log_count"))
        .group_by(AuditLog.user_id)
        .order_by(func.count(AuditLog.id).desc())
        .first()
    )
    most_active_user = None
    if active_user_query:
        u_id, count = active_user_query
        user = db.query(User).filter(User.id == u_id).first()
        if user:
            most_active_user = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "request_count": count
            }

    return {
        "total": total_users,
        "admins": admins,
        "active": active_users,
        "inactive": inactive_users,
        "most_active_user": most_active_user
    }


def get_agent_statistics(db: Session) -> dict:
    total_agents = db.query(Agent).count()
    active_agents = db.query(Agent).filter(Agent.status == "ACTIVE").count()
    inactive_agents = total_agents - active_agents

    # Most active agent
    active_agent_query = (
        db.query(AuditLog.agent_id, func.count(AuditLog.id).label("log_count"))
        .group_by(AuditLog.agent_id)
        .order_by(func.count(AuditLog.id).desc())
        .first()
    )
    most_active_agent = None
    if active_agent_query:
        a_id, count = active_agent_query
        agent = db.query(Agent).filter(Agent.id == a_id).first()
        if agent:
            most_active_agent = {
                "id": agent.id,
                "name": agent.name,
                "status": agent.status,
                "request_count": count
            }

    return {
        "total": total_agents,
        "active": active_agents,
        "inactive": inactive_agents,
        "most_active_agent": most_active_agent
    }


def get_policy_statistics(db: Session) -> dict:
    total_policies = db.query(Policy).count()
    active_policies = db.query(Policy).filter(Policy.is_active == True).count()
    inactive_policies = total_policies - active_policies

    # Grouped by type
    type_counts = (
        db.query(Policy.policy_type, func.count(Policy.id))
        .group_by(Policy.policy_type)
        .all()
    )
    by_type = {t: c for t, c in type_counts}

    return {
        "total": total_policies,
        "active": active_policies,
        "inactive": inactive_policies,
        "by_type": by_type
    }


def get_budget_statistics(db: Session) -> dict:
    total_budgets = db.query(Budget).count()
    exceeded_budgets = (
        db.query(Budget).filter(Budget.status == "EXCEEDED").count()
    )

    avg_daily_used = db.query(func.avg(Budget.daily_used)).scalar() or 0.0
    avg_monthly_used = db.query(func.avg(Budget.monthly_used)).scalar() or 0.0

    warning_count = 0
    all_budgets = db.query(Budget).all()
    for b in all_budgets:
        if (
            b.daily_limit > 0
            and (b.daily_used / b.daily_limit) * 100 >= b.warning_threshold
        ):
            warning_count += 1
        elif (
            b.monthly_limit > 0
            and (b.monthly_used / b.monthly_limit) * 100 >= b.warning_threshold
        ):
            warning_count += 1

    return {
        "total": total_budgets,
        "exceeded": exceeded_budgets,
        "warning": warning_count,
        "average_daily_usage": float(avg_daily_used),
        "average_monthly_usage": float(avg_monthly_used)
    }


def get_audit_statistics(db: Session) -> dict:
    total_requests = db.query(AuditLog).count()
    allowed_requests = (
        db.query(AuditLog).filter(AuditLog.decision == "ALLOW").count()
    )
    denied_requests = (
        db.query(AuditLog).filter(AuditLog.decision == "DENY").count()
    )

    allowed_pct = (
        (allowed_requests / total_requests * 100) if total_requests > 0 else 0.0
    )
    denied_pct = (
        (denied_requests / total_requests * 100) if total_requests > 0 else 0.0
    )

    return {
        "total_requests": total_requests,
        "allowed_count": allowed_requests,
        "denied_count": denied_requests,
        "allowed_percentage": round(allowed_pct, 2),
        "denied_percentage": round(denied_pct, 2)
    }


def get_emergency_statistics(db: Session) -> dict:
    global_emergency = (
        db.query(Emergency).filter(Emergency.agent_id == None).first()
    )
    global_enabled = global_emergency.enabled if global_emergency else False

    blocked_agents = (
        db.query(Emergency)
        .filter(Emergency.agent_id != None, Emergency.enabled == True)
        .count()
    )
    emergency_events = db.query(Emergency).count()

    return {
        "global_enabled": global_enabled,
        "blocked_agents_count": blocked_agents,
        "total_emergency_events": emergency_events
    }
