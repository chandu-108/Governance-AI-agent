from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.policy import PolicyCreate, PolicyUpdate, PolicyResponse
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.services import policy_service

router = APIRouter()


@router.post(
    "/",
    response_model=PolicyResponse,
    status_code=status.HTTP_201_CREATED
)
def create(
    policy: PolicyCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return policy_service.create_policy(policy, current_admin.id, db)


@router.get("/", response_model=list[PolicyResponse])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return policy_service.get_all_policies(db)


@router.get("/{id}", response_model=PolicyResponse)
def get_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return policy_service.get_policy(id, db)


@router.put("/{id}", response_model=PolicyResponse)
def update(
    id: int,
    policy: PolicyUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return policy_service.update_policy(id, policy, db)


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete(
    id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return policy_service.delete_policy(id, db)
