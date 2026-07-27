from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    action = Column(String(50), nullable=False)
    permission_checked = Column(Text, nullable=True)
    policy_checked = Column(Text, nullable=True)
    budget_checked = Column(Text, nullable=True)
    decision = Column(String(20), nullable=False)  # ALLOW or DENY
    reason = Column(String(255), nullable=True)
    request_id = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="audit_logs")
    agent = relationship("Agent", back_populates="audit_logs")
