from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.emergency import Emergency
from app.models.agent import Agent


def enable_global_stop(
    admin_id: int,
    reason: str,
    db: Session
) -> Emergency:
    emergency = db.query(Emergency).filter(Emergency.agent_id == None).first()
    if emergency:
        emergency.enabled = True
        emergency.reason = reason
        emergency.enabled_by = admin_id
    else:
        emergency = Emergency(
            agent_id=None,
            enabled=True,
            reason=reason,
            enabled_by=admin_id
        )
        db.add(emergency)
    db.commit()
    db.refresh(emergency)
    return emergency


def disable_global_stop(admin_id: int, db: Session) -> Emergency:
    emergency = db.query(Emergency).filter(Emergency.agent_id == None).first()
    if not emergency:
        emergency = Emergency(
            agent_id=None,
            enabled=False,
            reason="Disable Global Stop",
            enabled_by=admin_id
        )
        db.add(emergency)
    else:
        emergency.enabled = False
        emergency.enabled_by = admin_id
    db.commit()
    db.refresh(emergency)
    return emergency


def enable_agent_stop(
    agent_id: int,
    admin_id: int,
    reason: str,
    db: Session
) -> Emergency:
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    emergency = (
        db.query(Emergency).filter(Emergency.agent_id == agent_id).first()
    )
    if emergency:
        emergency.enabled = True
        emergency.reason = reason
        emergency.enabled_by = admin_id
    else:
        emergency = Emergency(
            agent_id=agent_id,
            enabled=True,
            reason=reason,
            enabled_by=admin_id
        )
        db.add(emergency)
    db.commit()
    db.refresh(emergency)
    return emergency


def disable_agent_stop(
    agent_id: int,
    admin_id: int,
    db: Session
) -> Emergency:
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    emergency = (
        db.query(Emergency).filter(Emergency.agent_id == agent_id).first()
    )
    if not emergency:
        emergency = Emergency(
            agent_id=agent_id,
            enabled=False,
            reason="Disable Agent Stop",
            enabled_by=admin_id
        )
        db.add(emergency)
    else:
        emergency.enabled = False
        emergency.enabled_by = admin_id
    db.commit()
    db.refresh(emergency)
    return emergency


def is_agent_blocked(agent_id: int, db: Session) -> tuple[bool, str | None]:
    # 1. Check Global Stop
    global_stop = db.query(Emergency).filter(Emergency.agent_id == None).first()
    if global_stop and global_stop.enabled:
        return True, "Emergency Stop Enabled"

    # 2. Check Agent Stop
    agent_stop = (
        db.query(Emergency).filter(Emergency.agent_id == agent_id).first()
    )
    if agent_stop and agent_stop.enabled:
        return True, "Emergency Stop Enabled"

    return False, None
