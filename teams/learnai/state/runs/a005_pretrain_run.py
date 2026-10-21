"""a005: pretraining as 'guess the next word, the text is the answer sheet'. A tiny EXAMPLE corpus (invented, 53 words,
12 distinct words). The toy model counts, for every word, which word came next in the text it has read so far
(add-one smoothing so an unseen word still gets a small chance). Loss = average bits of surprise per word when the
model guesses every next word of the whole text (lower = better guesses). Not a real LLM."""
import math, json
from collections import Counter, defaultdict
text = ("the dog sat on the rug the cat sat on the mat the cat ran to the door the dog sat on the bed "
        "the cat sat on the rug the dog ran to the park the dog sat on the mat the cat ran to the park "
        "cat ran to the door").split()
V = sorted(set(text))
def loss(n_read):
    nxt = defaultdict(Counter)
    for a, b in zip(text[:n_read], text[1:n_read]): nxt[a][b] += 1
    bits = 0
    for a, b in zip(text, text[1:]):
        c = nxt[a]; bits += -math.log2((c[b] + 1) / (sum(c.values()) + len(V)))
    return bits / (len(text) - 1)
print("words:", len(text), "distinct:", len(V))
out = {0: math.log2(len(V))}
print(f"read  0 words: loss {out[0]:.2f} bits (even guess among {len(V)})")
for n in (10, 20, 40, 53): out[n] = loss(n); print(f"read {n:2d} words: loss {out[n]:.2f}")
nxt = defaultdict(Counter)
for a, b in zip(text, text[1:]): nxt[a][b] += 1
print("after 'the':", nxt["the"].most_common())
json.dump({str(k): round(v, 4) for k, v in out.items()}, open("state/runs/a005_pretrain_run.json", "w"))
