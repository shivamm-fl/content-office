"""a005: toy pretraining. EXAMPLE: tiny invented corpus, a counting next-word model (not a neural network).
'Training' = read text, hide the next word, count; loss = average -log2(p(true next word)) over the text.
Loss falls as the model reads more text. Real LLMs do the same job (predict next token) with a neural network."""
import math
from collections import Counter, defaultdict
corpus = ("the cat sat on the mat . the dog sat on the rug . the cat ate the fish . "
          "the dog ate the bone . the cat sat on the sofa . the dog sat on the mat . "
          "the cat ate the fish . the dog sat on the rug .").split()
V = len(set(corpus))
def loss(counts, text):
    tot = 0; n = 0
    for a, b in zip(text, text[1:]):
        c = counts[a]; p = (c[b] + 1) / (sum(c.values()) + V)   # +1 smoothing so unseen words are not zero
        tot += -math.log2(p); n += 1
    return tot / n
counts = defaultdict(Counter)
print(f"vocabulary: {V} words, text: {len(corpus)} words")
print(f"before reading anything: guess evenly, loss = {math.log2(V):.2f} bits per word")
for upto in (10, 20, 40, len(corpus)):
    counts = defaultdict(Counter)
    for a, b in zip(corpus[:upto], corpus[1:upto]): counts[a][b] += 1
    print(f"after reading {upto:>2} words: loss on the full text = {loss(counts, corpus):.2f} bits per word")
print("after reading all of it, what follows 'the':", dict(counts["the"]))
