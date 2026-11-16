# EXAMPLE (assumed ticket system, not a real product): 12 functions sorted by who triggers them and whether they change anything.
funcs = {
 "create_ticket": ("changes data", "model decides"),
 "close_ticket": ("changes data", "model decides"),
 "assign_ticket": ("changes data", "model decides"),
 "add_comment": ("changes data", "model decides"),
 "escalate_ticket": ("changes data", "model decides"),
 "get_ticket_by_id": ("read only", "app supplies as context"),
 "list_open_tickets": ("read only", "app supplies as context"),
 "customer_history": ("read only", "app supplies as context"),
 "sla_policy_doc": ("read only", "app supplies as context"),
 "triage_new_ticket": ("template", "user picks"),
 "daily_summary": ("template", "user picks"),
 "draft_reply": ("template", "user picks"),
}
kind = {"changes data": "tool", "read only": "resource", "template": "prompt"}
counts = {}
for name, (what, who) in funcs.items():
    counts[kind[what]] = counts.get(kind[what], 0) + 1
print("functions:", len(funcs))
print("tools (actions, model decides):", counts["tool"])
print("resources (read-only data, app supplies):", counts["resource"])
print("prompts (templates, user picks):", counts["prompt"])
print("sum check:", sum(counts.values()) == len(funcs))
print("all-as-tools tool list length the model must choose from:", len(funcs), "vs", counts["tool"])
