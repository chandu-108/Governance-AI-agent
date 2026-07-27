package governance

default allow = false
default reason = "Unknown validation failure"

# If everything is allowed
allow {
    data.governance.permission.allow
    data.governance.budget.allow
    data.governance.agent.allow
}

# Set reason based on failing policies
reason = "All policies satisfied" {
    allow
}

reason = "Access denied: insufficient permission level" {
    not allow
    not data.governance.permission.allow
}

reason = "Access denied: agent status is not ACTIVE" {
    not allow
    data.governance.permission.allow
    not data.governance.agent.allow
}

reason = "Access denied: budget limit exceeded" {
    not allow
    data.governance.permission.allow
    data.governance.agent.allow
    not data.governance.budget.allow
}
