from main import group_anagrams
from collections import defaultdict
import random,json,hashlib
from pathlib import Path
def reference(words):
    d=defaultdict(list)
    for w in words:d["".join(sorted(w))].append(w)
    return list(d.values())
def canonical(g):return sorted(tuple(sorted(x)) for x in g)
rng=random.Random(20261104)
examples=[["eat","tea","tan","ate","nat","bat"],["",""],["aab","abb","baa"],["a","a"]]
results=[]
for words in examples:
    actual=group_anagrams(words);expected=reference(words)
    assert canonical(actual)==canonical(expected)
    results.append(dict(input=words,actual=actual,expected=expected))
for _ in range(5000):
    words=["".join(rng.choice("abcde") for _ in range(rng.randint(0,10))) for _ in range(rng.randint(1,25))]
    assert canonical(group_anagrams(words))==canonical(reference(words))
report=dict(code_executed=True,random_cases=5000,examples=results,accepted_claim=False,code_sha256=hashlib.sha256(Path("main.py").read_bytes()).hexdigest())
Path("../fact-verification.json").write_text(json.dumps(report,indent=2))
Path("output.txt").write_text(json.dumps(results,indent=2)+"\n5000 seeded cases match independent sorted-key reference.\n")
print("PASS: examples and 5000 random cases")
