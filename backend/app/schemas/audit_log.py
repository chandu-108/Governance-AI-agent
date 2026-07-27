from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    agent_id: int
    action: str
    permission_checked: str | None = None
    policy_checked: str | None = None
    budget_checked: str | None = None
    decision: str
    reason: str | None = None
    request_id: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuditLogFilter(BaseModel):
    agent_id: int | None = Field(None, json_schema_extra={"example": 1})
    decision: str | None = Field(None, json_schema_extra={"example": "ALLOW"})
    action: str | None = Field(None, json_schema_extra={"example": "EXECUTE"})
