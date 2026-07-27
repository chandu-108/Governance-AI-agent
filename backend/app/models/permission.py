from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    permission = Column(String(20), nullable=False)  # READ, WRITE, EXECUTE, ADMIN
    granted_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        server_default=func.now()
    )

    # Unique constraint to prevent duplicate permission records
    __table_args__ = (
        UniqueConstraint("user_id", "agent_id", name="uq_user_agent_permission"),
    )

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="permissions")
    agent = relationship("Agent", back_populates="permissions")
    granter = relationship(
        "User",
        foreign_keys=[granted_by],
        back_populates="granted_permissions"
    )
