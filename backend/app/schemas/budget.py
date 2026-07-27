from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from decimal import Decimal


class BudgetBase(BaseModel):
    agent_id: int = Field(..., json_schema_extra={"example": 1})
    daily_limit: Decimal = Field(..., json_schema_extra={"example": 100.00})
    monthly_limit: Decimal = Field(..., json_schema_extra={"example": 1000.00})
    currency: str = Field("USD", json_schema_extra={"example": "USD"})
    warning_threshold: int = Field(80, json_schema_extra={"example": 80})
    status: str = Field("ACTIVE", json_schema_extra={"example": "ACTIVE"})


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    daily_limit: Decimal | None = Field(None, json_schema_extra={"example": 150.00})
    monthly_limit: Decimal | None = Field(
        None,
        json_schema_extra={"example": 1500.00}
    )
    currency: str | None = Field(None, json_schema_extra={"example": "USD"})
    warning_threshold: int | None = Field(None, json_schema_extra={"example": 90})
    status: str | None = Field(None, json_schema_extra={"example": "PAUSED"})


class BudgetResponse(BudgetBase):
    id: int
    daily_used: Decimal
    monthly_used: Decimal
    last_reset: datetime
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BudgetUsageRequest(BaseModel):
    amount: Decimal = Field(..., json_schema_extra={"example": 12.50})


class BudgetValidateResponse(BaseModel):
    allowed: bool = Field(..., json_schema_extra={"example": True})
    reason: str | None = Field(
        None,
        json_schema_extra={"example": "Daily budget exceeded"}
    )
    warning: bool = Field(..., json_schema_extra={"example": False})
