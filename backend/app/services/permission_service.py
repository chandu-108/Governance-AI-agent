from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.permission import Permission
from app.models.user import User
from app.models.agent import Agent
from app.schemas.permission import PermissionCreate, PermissionUpdate


def assign_permission(
    permission_data: PermissionCreate,
    admin_id: int,
    db: Session
) -> Permission:
    # 1. Validate User exists
    user = db.query(User).filter(User.id == permission_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # 2. Validate Agent exists
    agent = db.query(Agent).filter(Agent.id == permission_data.agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    # 3. Prevent duplicate permissions
    existing_permission = (
        db.query(Permission)
        .filter(
            Permission.user_id == permission_data.user_id,
            Permission.agent_id == permission_data.agent_id
        )
        .first()
    )
    if existing_permission:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Permission already assigned for this user and agent"
        )

    # Create permission
    db_permission = Permission(
        user_id=permission_data.user_id,
        agent_id=permission_data.agent_id,
        permission=permission_data.permission.value,  # extract string from enum
        granted_by=admin_id
    )
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission


def get_permissions(db: Session) -> list[Permission]:
    return db.query(Permission).all()


def get_permission_by_id(permission_id: int, db: Session) -> Permission:
    db_permission = (
        db.query(Permission)
        .filter(Permission.id == permission_id)
        .first()
    )
    if not db_permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission record not found"
        )
    return db_permission


def update_permission(
    permission_id: int,
    permission_data: PermissionUpdate,
    db: Session
) -> Permission:
    db_permission = get_permission_by_id(permission_id, db)
    db_permission.permission = permission_data.permission.value
    db.commit()
    db.refresh(db_permission)
    return db_permission


def delete_permission(permission_id: int, db: Session) -> dict:
    db_permission = get_permission_by_id(permission_id, db)
    db.delete(db_permission)
    db.commit()
    return {"detail": "Permission successfully removed"}
