package governance.budget

default allow = true

# Deny if daily_used >= daily_limit
default deny_daily = false
deny_daily {
    input.budget.daily_limit != null
    input.budget.daily_used >= input.budget.daily_limit
}

# Deny if monthly_used >= monthly_limit
default deny_monthly = false
deny_monthly {
    input.budget.monthly_limit != null
    input.budget.monthly_used >= input.budget.monthly_limit
}

allow {
    not deny_daily
    not deny_monthly
}
