"""a004: next-word guesses with odds. A tiny EXAMPLE corpus (invented sentences); count which word follows 'the' + word pair context.
Not a real LLM: it shows the idea of 'a list of guesses with odds, pick one, repeat'."""
from collections import Counter
corpus = ("the cat sat on the mat . the cat sat on the sofa . the cat sat on the mat . the dog sat on the mat . "
          "the cat ran to the door . the dog ran to the park . the cat sat on the bed . the dog sat on the sofa .").split()
ctx = ("sat", "on", "the")
c = Counter(corpus[i+3] for i in range(len(corpus)-3) if tuple(corpus[i:i+3]) == ctx)
n = sum(c.values())
print("context:", " ".join(ctx), "| seen", n, "times")
for w, k in c.most_common(): print(f"  {w:5s} {k}/{n} = {100*k/n:.0f}%")
text = list(ctx); 
for _ in range(2):
    pass
print("pick top guess -> 'sat on the", c.most_common(1)[0][0] + "'")
