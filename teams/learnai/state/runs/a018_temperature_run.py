# EXAMPLE only: invented scores for the next word after "Mera favourite khel hai".
# softmax(score / T) for four options at different temperatures.
import math
words = ["cricket", "football", "chess", "hockey"]
scores = [2.0, 1.0, 0.5, 0.0]
for T in (0.2, 0.7, 1.0, 2.0):
    e = [math.exp(s / T) for s in scores]
    t = sum(e)
    print(f"T={T}: " + ", ".join(f"{w} {100*x/t:.1f}%" for w, x in zip(words, e)))
