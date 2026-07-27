from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class AgentBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "FinBERT Agent"})
    description: str | None = Field(
        None,
        json_schema_extra={"example": "Sentiment analyzer for financial reports"}
    )
    status: str = Field("ACTIVE", json_schema_extra={"example": "ACTIVE"})


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: str | None = Field(None, json_schema_extra={"example": "FinBERT Agent v2"})
    description: str | None = Field(
        None,
        json_schema_extra={"example": "Updated sentiment analyzer"}
    )
    status: str | None = Field(None, json_schema_extra={"example": "INACTIVE"})


class AgentResponse(AgentBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
