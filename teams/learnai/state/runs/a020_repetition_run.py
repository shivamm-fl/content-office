# Illustrative toy (NOT a real model). Shows a repetition penalty lowering the score of words already used.
# The divide-by-penalty rule below is the toy's own simple rule (positive scores only); the docs say only: penalty > 1 penalises previously generated tokens.
import math
scores = {"chai": 3.0, "peeni": 2.4, "hai": 2.0, "garam": 1.5}   # toy next-word scores
used = ["chai"]
def probs(s):
    z = sum(math.exp(v) for v in s.values()); return {w: math.exp(v)/z for w, v in s.items()}
before = probs(scores)
for pen in (1.0, 1.2, 1.5):
    s = {w: (v/pen if w in used and v > 0 else v) for w, v in scores.items()}
    p = probs(s); top = max(p, key=p.get)
    print(f"penalty {pen}: " + ", ".join(f"{w} {p[w]*100:.0f}%" for w in p) + f" -> top = {top}")
