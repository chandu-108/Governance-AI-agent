from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class EmergencyCreate(BaseModel):
    reason: str | None = Field(
        None,
        json_schema_extra={"example": "Security breach detected"}
    )


class EmergencyUpdate(BaseModel):
    enabled: bool = Field(..., json_schema_extra={"example": True})
    reason: str | None = Field(
        None,
        json_schema_extra={"example": "Security breach resolved"}
    )


class EmergencyResponse(BaseModel):
    id: int
    agent_id: int | None
    enabled: bool
    reason: str | None
    enabled_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
