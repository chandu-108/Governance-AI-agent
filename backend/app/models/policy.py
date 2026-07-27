from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    policy_type = Column(String(50), nullable=False)
    target_resource = Column(String(100), nullable=False)
    effect = Column(String(10), default="ALLOW")  # ALLOW or DENY
    priority = Column(Integer, default=0)
    rego_policy_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now(),
        server_default=func.now()
    )

    # Relationships
    creator = relationship("User", back_populates="policies")
