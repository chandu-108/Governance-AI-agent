# Open Policy Agent (OPA) Integration

This module contains the HTTP client and service layer abstractions for integrating FastAPI with Open Policy Agent (OPA).

## Architecture

```text
React (Frontend)
       │
       ▼
FastAPI (Backend) ───(HTTP POST /v1/data)───► Open Policy Agent (OPA)
       │                                                 │
       │◄───────────(JSON {"allowed": true})─────────────┤
       ▼
Allow/Deny Execution
```

## Folder Purpose & Structure

- `client.py`: Implements `OPAClient` which queries the OPA HTTP server for rule evaluations. Handles timeouts and offline server exceptions gracefully.
- `config.py`: Binds settings parameters (`OPA_URL` and `OPA_POLICY_PACKAGE`) to environment configurations.
- `service.py`: Exposes business helper functions (`evaluate_permission`, `evaluate_budget`, `evaluate_emergency`) that will query OPA.
- `policies/`: Directory reserved for the future Rego policy definition files.

## Future Rego Policies

- `permission.rego`: Validates user permissions (`READ`/`WRITE`/`EXECUTE`/`ADMIN`) against an AI Agent.
- `budget.rego`: Restricts agent executions when daily/monthly spending caps are met or exceeded.
- `emergency.rego`: Intercepts and denies executions if the emergency kill switch is activated.
