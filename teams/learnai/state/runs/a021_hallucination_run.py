# Toy next-word scores (illustrative, NOT a real model). Prompt: a book that does not exist.
import math, random
opts = {"Ramesh": 2.0, "Anita": 1.6, "Vikram": 1.5, "Meera": 1.2, "Sanjay": 1.0, "I don't know": -0.6}
z = sum(math.exp(v) for v in opts.values())
p = {k: math.exp(v) / z for k, v in opts.items()}
print("prompt: 'The Tin Lantern' (a book we invented) was written by ...")
for k, v in p.items():
    print(f"{k:14s} {100*v:5.1f}%")
print("top pick:", max(p, key=p.get), f"{100*max(p.values()):.1f}%")
print("sum of the five names:", f"{100*sum(v for k,v in p.items() if k!=chr(73)+chr(32)+'don'+chr(39)+'t know'):.1f}%")
random.seed(7)
names = list(p); w = [p[k] for k in names]
draws = random.choices(names, weights=w, k=5)
print("5 asks (sampling):", draws, "distinct:", len(set(draws)))
