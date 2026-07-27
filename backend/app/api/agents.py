from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services import agent_service

router = APIRouter()


@router.post(
    "/",
    response_model=AgentResponse,
    status_code=status.HTTP_201_CREATED
)
def create(
    agent: AgentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return agent_service.create_agent(agent, current_user.id, db)


@router.get("/", response_model=list[AgentResponse])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return agent_service.get_all_agents(current_user.id, db)


@router.get("/{id}", response_model=AgentResponse)
def get_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return agent_service.get_agent_by_id(id, current_user.id, db)


@router.put("/{id}", response_model=AgentResponse)
def update(
    id: int,
    agent: AgentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return agent_service.update_agent(id, agent, current_user.id, db)


@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return agent_service.delete_agent(id, current_user.id, db)
