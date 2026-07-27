from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
import app.models

from app.api.auth import router as auth_router
from app.api.agents import router as agents_router
from app.api.policies import router as policies_router
from app.api.permissions import router as permissions_router
from app.api.budgets import router as budgets_router
from app.api.opa import router as opa_router
from app.api.governance import router as governance_router
from app.api.audit import router as audit_router
from app.api.emergency import router as emergency_router
from app.api.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Governance Layer API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    agents_router,
    prefix="/api/agents",
    tags=["Agent Management"]
)

app.include_router(
    policies_router,
    prefix="/api/policies",
    tags=["Policy Management"]
)

app.include_router(
    permissions_router,
    prefix="/api/permissions",
    tags=["Permission Management"]
)

app.include_router(
    budgets_router,
    prefix="/api/budgets",
    tags=["Budget Management"]
)

app.include_router(
    opa_router,
    prefix="/api/opa",
    tags=["OPA Integration"]
)

app.include_router(
    governance_router,
    prefix="/api/governance",
    tags=["Governance Evaluation"]
)

app.include_router(
    audit_router,
    prefix="/api/audit",
    tags=["Audit Logging"]
)

app.include_router(
    emergency_router,
    prefix="/api/emergency",
    tags=["Emergency Stop"]
)

app.include_router(
    dashboard_router,
    prefix="/api/dashboard",
    tags=["Dashboard Analytics"]
)


@app.get("/")
def home():
    return {
        "message": "Governance Layer API Running 🚀"
    }