package governance.agent

default allow = false

allow {
    input.agent.status == "ACTIVE"
}
