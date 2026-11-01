# EXAMPLE attention for the word "bank" with invented 2-number vectors (water, money).
# Formula of Vaswani et al. 2017: weights = softmax(q . k / sqrt(d_k)), output = sum(weight * value). d_k = 2 here.
import math
def softmax(s):
    e = [math.exp(x) for x in s]; t = sum(e); return [x / t for x in e]
q = (1.0, 1.0)   # bank's question: is there a water clue or a money clue?
def attend(words, keys, vals):
    s = [(q[0] * k[0] + q[1] * k[1]) / math.sqrt(2) for k in keys]
    w = softmax(s)
    mix = [sum(wi * v[j] for wi, v in zip(w, vals)) for j in range(2)]
    print("  ".join("%s %.1f%%" % (a, 100 * b) for a, b in zip(words, w)), " sum %.1f" % (100 * sum(w)))
    print("  mix water %.2f money %.2f" % tuple(mix))
print("I sat on the river bank")
attend(["I", "sat", "on", "the", "river", "bank"],
       [(0.36, 0.36), (0.5, 0.4), (0.3, 0.3), (0.2, 0.3), (5.5, 0.0), (1.5, 1.5)],
       [(0.1, 0.1)] * 4 + [(2.59, 0.08), (0.5, 0.5)])
print("I went to the bank loan")
attend(["I", "went", "to", "the", "bank", "loan"],
       [(0.36, 0.36), (0.5, 0.4), (0.3, 0.3), (0.2, 0.3), (1.5, 1.5), (0.0, 5.5)],
       [(0.1, 0.1)] * 4 + [(0.5, 0.5), (0.07, 2.59)])
