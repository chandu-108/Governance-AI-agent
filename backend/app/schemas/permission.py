from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from enum import Enum


class PermissionEnum(str, Enum):
    READ = "READ"
    WRITE = "WRITE"
    EXECUTE = "EXECUTE"
    ADMIN = "ADMIN"


class PermissionCreate(BaseModel):
    user_id: int = Field(..., json_schema_extra={"example": 1})
    agent_id: int = Field(..., json_schema_extra={"example": 1})
    permission: PermissionEnum = Field(
        ...,
        json_schema_extra={"example": "EXECUTE"}
    )


class PermissionUpdate(BaseModel):
    permission: PermissionEnum = Field(
        ...,
        json_schema_extra={"example": "ADMIN"}
    )


class PermissionResponse(BaseModel):
    id: int
    user_id: int
    agent_id: int
    permission: PermissionEnum
    granted_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
