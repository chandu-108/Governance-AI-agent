from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(String(20), default="ACTIVE")  # ACTIVE or INACTIVE
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        server_default=func.now()
    )

    # Relationships
    owner = relationship("User", back_populates="agents")
    permissions = relationship(
        "Permission",
        back_populates="agent",
        cascade="all, delete-orphan"
    )
    budget = relationship(
        "Budget",
        back_populates="agent",
        uselist=False,
        cascade="all, delete-orphan"
    )
    audit_logs = relationship("AuditLog", back_populates="agent")
    emergencies = relationship("Emergency", back_populates="agent")
