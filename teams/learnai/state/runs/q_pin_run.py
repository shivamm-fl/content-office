# Invented example (maan lo): two made-up model versions, not real products.
import json
PROMPTS = ["p1", "p2", "p3", "p4", "p5"]
def model_a(p):  # maan lo: v1, returns clean JSON
    return json.dumps({"id": p, "label": "ok"})
def model_b(p):  # maan lo: v2, wraps JSON in extra text on 3 of 5 prompts
    raw = json.dumps({"id": p, "label": "ok"})
    return "Sure! Here is your JSON: " + raw if p in ("p1", "p3", "p5") else raw
def passes(out):
    try:
        return json.loads(out)["label"] == "ok"
    except Exception:
        return False
for name, m in (("model_v1 (maan lo)", model_a), ("model_v2 (maan lo)", model_b)):
    res = [passes(m(p)) for p in PROMPTS]
    print(name, "pass", sum(res), "/", len(PROMPTS), res)
