package governance.permission

default allow = false

allow {
    input.permission.level == "EXECUTE"
}

allow {
    input.permission.level == "ADMIN"
}
