from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False, index=True)

    password = Column(String(255), nullable=False)

    role = Column(String(20), default="user")

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    agents = relationship("Agent", back_populates="owner", cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="creator", cascade="all, delete-orphan")
    permissions = relationship(
        "Permission",
        foreign_keys="[Permission.user_id]",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    granted_permissions = relationship(
        "Permission",
        foreign_keys="[Permission.granted_by]",
        back_populates="granter"
    )
    created_budgets = relationship("Budget", back_populates="creator")
    audit_logs = relationship("AuditLog", back_populates="user")
    emergencies = relationship("Emergency", back_populates="user")