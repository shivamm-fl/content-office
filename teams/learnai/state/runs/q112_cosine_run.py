"""q112: distance vs cosine on invented word counts [refund, payment, cricket]."""
import math
def norm(v): n = math.sqrt(sum(x*x for x in v)); return [x/n for x in v]
def dist(a, b): return math.sqrt(sum((x-y)**2 for x, y in zip(a, b)))
def cos(a, b): return sum(x*y for x, y in zip(a, b)) / (math.sqrt(sum(x*x for x in a)) * math.sqrt(sum(x*x for x in b)))
q = [1, 1, 0]
notes = {"short refund": [1, 1, 0], "refund x5": [5, 5, 0], "cricket": [0, 0, 1]}
for name, v in notes.items():
    print(f"{name:13s} raw: dist {dist(q, v):.2f} cos {cos(q, v):.2f} | scaled to length 1: dist {dist(norm(q), norm(v)):.2f} cos {cos(norm(q), norm(v)):.2f}")
