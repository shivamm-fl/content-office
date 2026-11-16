# EXAMPLE (assumed ticket system, not a real product): 12 functions sorted by who triggers them and whether they change data.
funcs = [
 ("create_ticket","change"),("close_ticket","change"),("assign_ticket","change"),("add_comment","change"),("escalate_ticket","change"),
 ("ticket_by_id","read"),("open_tickets","read"),("customer_history","read"),("sla_policy_doc","read"),
 ("triage","workflow"),("daily_summary","workflow"),("draft_reply","workflow")]
kind = {"change":"tool (model decides to call)","read":"resource (app supplies, has a URI)","workflow":"prompt (user picks, like a slash command)"}
print("functions:", len(funcs))
for k in ("change","read","workflow"):
    names=[n for n,c in funcs if c==k]
    print(len(names), kind[k], names)
