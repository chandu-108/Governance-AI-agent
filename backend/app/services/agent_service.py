from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate


def create_agent(agent_data: AgentCreate, owner_id: int, db: Session) -> Agent:
    agent = Agent(**agent_data.model_dump(), owner_id=owner_id)
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


def get_all_agents(owner_id: int, db: Session) -> list[Agent]:
    return db.query(Agent).filter(Agent.owner_id == owner_id).all()


def get_agent_by_id(agent_id: int, owner_id: int, db: Session) -> Agent:
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id, Agent.owner_id == owner_id)
        .first()
    )
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    return agent


def update_agent(
    agent_id: int,
    agent_data: AgentUpdate,
    owner_id: int,
    db: Session
) -> Agent:
    agent = get_agent_by_id(agent_id, owner_id, db)
    update_dict = agent_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(agent, key, value)
    db.commit()
    db.refresh(agent)
    return agent


def delete_agent(agent_id: int, owner_id: int, db: Session) -> dict:
    agent = get_agent_by_id(agent_id, owner_id, db)
    db.delete(agent)
    db.commit()
    return {"detail": "Agent deleted successfully"}
