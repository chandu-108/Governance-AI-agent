from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.permission import (
    PermissionCreate,
    PermissionUpdate,
    PermissionResponse
)
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.services import permission_service

router = APIRouter()


@router.post(
    "/",
    response_model=PermissionResponse,
    status_code=status.HTTP_201_CREATED
)
def create(
    permission: PermissionCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return permission_service.assign_permission(permission, current_admin.id, db)


@router.get("/", response_model=list[PermissionResponse])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return permission_service.get_permissions(db)


@router.get("/{permission_id}", response_model=PermissionResponse)
def get_by_id(
    permission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return permission_service.get_permission_by_id(permission_id, db)


@router.put("/{permission_id}", response_model=PermissionResponse)
def update(
    permission_id: int,
    permission: PermissionUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return permission_service.update_permission(permission_id, permission, db)


@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    permission_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    permission_service.delete_permission(permission_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
