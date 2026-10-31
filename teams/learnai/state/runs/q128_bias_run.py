# EXAMPLE only: an invented stub "screening model" with a built-in lean, to show how a paired test measures it.
# Same 200 resumes, only the name changes (group A names vs group B names). Compare shortlist rates and flipped decisions.
import random
random.seed(7)
N = 200
quality = [random.random() for _ in range(N)]          # same resume quality for both versions
def stub_model(q, group):                              # invented: group B gets a 0.08 penalty
    return q + (0.0 if group == "A" else -0.08) > 0.5
a = [stub_model(q, "A") for q in quality]
b = [stub_model(q, "B") for q in quality]
flips = sum(1 for x, y in zip(a, b) if x != y)
print("pairs", N)
print("shortlisted with group A name", sum(a), f"({100*sum(a)/N:.1f}%)")
print("shortlisted with group B name", sum(b), f"({100*sum(b)/N:.1f}%)")
print("pairs where only the name flipped the decision", flips)
# eyeballing 5 answers
print("first 5 pairs", [(x, y) for x, y in zip(a[:5], b[:5])])
