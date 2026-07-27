from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.emergency import EmergencyCreate, EmergencyResponse
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.models.emergency import Emergency
from app.services import emergency_service

router = APIRouter()


@router.post("/global/enable", response_model=EmergencyResponse)
def enable_global(
    payload: EmergencyCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    reason = payload.reason or "Global emergency stop enabled"
    return emergency_service.enable_global_stop(current_admin.id, reason, db)


@router.post("/global/disable", response_model=EmergencyResponse)
def disable_global(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return emergency_service.disable_global_stop(current_admin.id, db)


@router.post("/agent/{agent_id}/enable", response_model=EmergencyResponse)
def enable_agent(
    agent_id: int,
    payload: EmergencyCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    reason = payload.reason or f"Emergency stop enabled for agent {agent_id}"
    return emergency_service.enable_agent_stop(
        agent_id,
        current_admin.id,
        reason,
        db
    )


@router.post("/agent/{agent_id}/disable", response_model=EmergencyResponse)
def disable_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return emergency_service.disable_agent_stop(agent_id, current_admin.id, db)


@router.get("/status")
def get_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    global_stop = db.query(Emergency).filter(Emergency.agent_id == None).first()
    agent_stops = (
        db.query(Emergency)
        .filter(Emergency.agent_id != None, Emergency.enabled == True)
        .all()
    )

    return {
        "global_stop": {
            "enabled": global_stop.enabled if global_stop else False,
            "reason": global_stop.reason if global_stop else None,
            "enabled_by": global_stop.enabled_by if global_stop else None,
            "updated_at": global_stop.updated_at if global_stop else None
        },
        "agent_stops": [
            {
                "agent_id": stop.agent_id,
                "enabled": stop.enabled,
                "reason": stop.reason,
                "enabled_by": stop.enabled_by,
                "updated_at": stop.updated_at
            }
            for stop in agent_stops
        ]
    }
