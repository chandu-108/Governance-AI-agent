from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate


def create_policy(
    policy_data: PolicyCreate,
    user_id: int,
    db: Session
) -> Policy:
    policy = Policy(**policy_data.model_dump(), created_by=user_id)
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


def get_all_policies(db: Session) -> list[Policy]:
    return db.query(Policy).all()


def get_policy(policy_id: int, db: Session) -> Policy:
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )
    return policy


def update_policy(
    policy_id: int,
    policy_data: PolicyUpdate,
    db: Session
) -> Policy:
    policy = get_policy(policy_id, db)
    update_dict = policy_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(policy, key, value)
    db.commit()
    db.refresh(policy)
    return policy


def delete_policy(policy_id: int, db: Session) -> dict:
    policy = get_policy(policy_id, db)
    db.delete(policy)
    db.commit()
    return {"detail": "Policy deleted successfully"}
