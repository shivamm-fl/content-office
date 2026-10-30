# EXAMPLE for q127: an invented refund bot (a stub, no model call). The "new prompt" rule below is written by hand to
# break Hinglish spelling and partial refunds, to show what a varied golden set catches. Not a measurement of any real model.
def old_bot(t):  return "refund" if ("refund" in t or "paisa" in t or "wapas" in t or "partial" in t or "half" in t) else "escalate" if "angry" in t else "ask_order"
def new_bot(t):  # after the prompt change: only plain English "refund" and anger still work
    if "angry" in t: return "escalate"
    if t.startswith("plain"): return "refund"
    if "partial" in t: return "refund" if t.endswith("4") else "ask_order"   # 3 of 4 partial cases break
    if "hinglish" in t: return "ask_order"                                    # all 4 Hinglish spellings break
    return "refund" if "refund" in t else "ask_order"
alike  = [(f"plain refund request {i}", "refund") for i in range(1, 21)]
kinds  = {"plain": "refund", "hinglish": "refund", "partial": "refund", "angry": "escalate", "wrong order id": "ask_order"}
varied = [(f"{k} case {i}" if k != "wrong order id" else f"order id case {i}", exp) for k, exp in kinds.items() for i in range(1, 5)]
varied = [(("plain " if k.startswith("plain") else "") + k, e) for k, e in varied]
def run(name, cases):
    fails = {}
    ok = 0
    for text, exp in cases:
        if new_bot(text) == exp: ok += 1
        else: fails[text.rsplit(" ", 2)[0] if "case" in text else text] = fails.get(text.rsplit(" ", 2)[0] if "case" in text else text, 0) + 1
    print(f"{name}: {ok}/{len(cases)} pass", fails)
run("alike list ", alike)
run("varied list", varied)
