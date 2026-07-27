from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class PolicyBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Limit Daily Trades"})
    description: str | None = Field(
        None,
        json_schema_extra={
            "example": "Prevents agents from exceeding daily budget limits."
        }
    )
    policy_type: str = Field(..., json_schema_extra={"example": "BUDGET"})
    target_resource: str = Field(..., json_schema_extra={"example": "trades"})
    effect: str = Field("ALLOW", json_schema_extra={"example": "ALLOW"})
    priority: int = Field(0, json_schema_extra={"example": 1})
    rego_policy_name: str | None = Field(
        None,
        json_schema_extra={"example": "budget_limit"}
    )
    is_active: bool = Field(True, json_schema_extra={"example": True})


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(BaseModel):
    name: str | None = Field(None, json_schema_extra={"example": "Updated Daily Limit"})
    description: str | None = Field(
        None,
        json_schema_extra={"example": "Updated description"}
    )
    policy_type: str | None = Field(None, json_schema_extra={"example": "BUDGET"})
    target_resource: str | None = Field(
        None,
        json_schema_extra={"example": "trades"}
    )
    effect: str | None = Field(None, json_schema_extra={"example": "DENY"})
    priority: int | None = Field(None, json_schema_extra={"example": 2})
    rego_policy_name: str | None = Field(
        None,
        json_schema_extra={"example": "new_budget_limit"}
    )
    is_active: bool | None = Field(None, json_schema_extra={"example": False})


class PolicyResponse(PolicyBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
