"""q112: why cosine and not raw distance. EXAMPLE: invented word-count vectors [refund, payment, cricket].
Doc A is a short note; doc B is the same note repeated 5 times (same topic, 5x the length); doc C is a short cricket note."""
import math
q = [1, 1, 0]            # query: 'refund payment'
A = [1, 1, 0]            # short refund note
B = [5, 5, 0]            # same refund note, 5 times longer
C = [0, 0, 1]            # cricket note
def dist(x, y): return math.sqrt(sum((a-b)**2 for a, b in zip(x, y)))
def cos(x, y):
    d = sum(a*b for a, b in zip(x, y)); return d / (math.sqrt(sum(a*a for a in x)) * math.sqrt(sum(b*b for b in y)))
for n, v in (("A short refund note", A), ("B refund note x5", B), ("C cricket note", C)):
    print(f"{n:20s} distance {dist(q, v):.2f}   cosine {cos(q, v):.2f}")
def unit(x): m = math.sqrt(sum(a*a for a in x)); return [a/m for a in x]
print("after scaling every vector to length 1:")
for n, v in (("A", A), ("B", B), ("C", C)):
    print(f"{n} distance {dist(unit(q), unit(v)):.2f}   cosine {cos(q, v):.2f}")
