from app.opa.client import OPAClient


def evaluate_permission(user_id: int, agent_id: int, action: str) -> dict:
    # Mock permission evaluation (Rego placeholder)
    return {"allowed": True, "reason": None}


def evaluate_budget(agent_id: int, amount: float) -> dict:
    # Mock budget evaluation (Rego placeholder)
    return {"allowed": True, "reason": None}


def evaluate_emergency(agent_id: int) -> dict:
    # Mock emergency kill-switch evaluation (Rego placeholder)
    return {"allowed": True, "reason": None}


def evaluate_governance(context: dict) -> dict:
    client = OPAClient()
    return client.evaluate(context)
