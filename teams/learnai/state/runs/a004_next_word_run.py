"""a004: toy next-word counting model on an invented 8-sentence corpus (not a real LLM).
Counts which word follows 'sat on the', turns the counts into odds, picks the top one and appends it."""
from collections import Counter
corpus = [
    "the cat sat on the mat", "the cat sat on the mat", "the dog sat on the mat",
    "the cat sat on the sofa", "the dog sat on the sofa", "the cat sat on the bed",
    "the cat ran to the door", "the dog ran to the park",
]
ctx = ("sat", "on", "the")
c = Counter()
for s in corpus:
    w = s.split()
    for i in range(len(w) - 3):
        if tuple(w[i:i+3]) == ctx:
            c[w[i+3]] += 1
n = sum(c.values())
print("sentences:", len(corpus), "| 'sat on the' seen", n, "times")
for word, k in c.most_common():
    print("%s %d/%d = %.0f %%" % (word, k, n, 100 * k / n))
print("sum of odds: %.0f %%" % (100 * sum(c.values()) / n))
top = c.most_common(1)[0][0]
print("picked (top):", top, "-> the cat sat on the " + top)
