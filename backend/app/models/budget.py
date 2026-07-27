from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), unique=True, nullable=False)
    daily_limit = Column(Numeric(10, 2), nullable=False)
    monthly_limit = Column(Numeric(10, 2), nullable=False)
    daily_used = Column(Numeric(10, 2), default=0.00)
    monthly_used = Column(Numeric(10, 2), default=0.00)
    currency = Column(String(10), default="USD")
    warning_threshold = Column(Integer, default=80)
    status = Column(String(20), default="ACTIVE")  # ACTIVE, PAUSED, EXCEEDED
    last_reset = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        server_default=func.now()
    )

    # Relationships
    agent = relationship("Agent", back_populates="budget", uselist=False)
    creator = relationship("User", back_populates="created_budgets")
