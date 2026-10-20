"""q109: a refund rule kept in code, outside the model. The system prompt says 'refund up to 500 rupees'; a user asks for more.
No model is called: this shows where a hard limit must live (OWASP LLM07 2025: do not use the system prompt as a security control)."""
LIMIT = 500
def approve(requested, model_said_yes):
    # the model's answer is only a request; the code decides
    return model_said_yes and requested <= LIMIT
for req, said in [(300, True), (2000, True), (2000, False)]:
    print(f"user asks {req}, model said yes={said} -> approved: {approve(req, said)}")
