"""A toy next-word distribution after "Aaj mausam bahut ___": eight candidate words with invented logits (EXAMPLE).
Shows what temperature, top-k and top-p do to the chances. Order of the stack here: temperature, then top-k, then top-p, then renormalise."""
import json
import numpy as np

words = ["accha", "garam", "thanda", "sundar", "kharab", "ajeeb", "neela", "namkeen"]
logits = np.array([3.0, 2.6, 2.2, 1.8, 1.2, 0.5, -0.3, -1.1])


def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()


def temperature(z, t):
    return softmax(z / t)


def top_k(p, k):
    order = np.argsort(-p)
    keep = np.zeros_like(p, dtype=bool)
    keep[order[:k]] = True
    q = np.where(keep, p, 0.0)
    return q / q.sum(), int(keep.sum())


def top_p(p, thr):
    order = np.argsort(-p)
    cum = np.cumsum(p[order])
    n = int(np.searchsorted(cum, thr) + 1)   # the smallest set whose cumulative chance reaches thr
    keep = np.zeros_like(p, dtype=bool)
    keep[order[:n]] = True
    q = np.where(keep, p, 0.0)
    return q / q.sum(), n, cum


def show(name, p):
    print(f"{name:28s}", "  ".join(f"{w}:{100 * x:5.1f}" for w, x in zip(words, p)))


out = {}
p1 = temperature(logits, 1.0)
show("T=1", p1)
for t in (0.5, 1.5):
    show(f"T={t}", temperature(logits, t))
print("namkeen chance %%: T0.5 %.3f | T1 %.3f | T1.5 %.3f" % tuple(100 * temperature(logits, t)[-1] for t in (0.5, 1.0, 1.5)))
pk, kept = top_k(p1, 3); show("T=1, top-k=3 (kept %d)" % kept, pk)
pp, n, cum = top_p(p1, 0.9); show("T=1, top-p=0.9 (kept %d)" % n, pp)
print("cumulative at T=1 (sorted):", [round(100 * c, 1) for c in cum])
p15 = temperature(logits, 1.5)
pp15, n15, cum15 = top_p(p15, 0.9); show("T=1.5, top-p=0.9 (kept %d)" % n15, pp15)
print("cumulative at T=1.5 (sorted):", [round(100 * c, 1) for c in np.cumsum(np.sort(p15)[::-1])])
print("top-p 0.9 keeps %d words at T=1, %d words at T=1.5" % (n, n15))
# the stack: temperature 0.7, top-k 5, top-p 0.9
p07 = temperature(logits, 0.7)
a, k5 = top_k(p07, 5)
b, n_b, _ = top_p(a, 0.9)
show("T=0.7", p07); show("T=0.7 then top-k=5", a); show("then top-p=0.9 (kept %d)" % n_b, b)
# how often the tail word appears in 1,000 draws (seeded), plain T=1 vs top-p 0.9 vs T=1.5
rng = np.random.default_rng(7)
for name, p in (("T=1", p1), ("T=1.5", p15), ("T=1 top-p 0.9", pp), ("T=1.5 top-p 0.9", pp15), ("T=1 top-k 3", pk)):
    draws = rng.choice(len(words), size=10000, p=p)
    print(f"{name:20s} namkeen in 10,000 draws: {int((draws == 7).sum())}   neela: {int((draws == 6).sum())}")
