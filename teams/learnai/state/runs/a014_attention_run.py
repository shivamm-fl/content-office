# EXAMPLE only: invented 2-number vectors (d_k = 2) for the sentence "I sat on the river bank".
# Formula from the 2017 paper: softmax(q.k / sqrt(d_k)), then a weighted mix of the values.
import math
words = ["I", "sat", "on", "the", "river", "bank"]
# keys: [about water, about money] (invented)
K = {"I":[0.1,0.1],"sat":[0.2,0.0],"on":[0.0,0.1],"the":[0.0,0.0],"river":[2.5,0.0],"bank":[1.0,1.0]}
V = {w:K[w][:] for w in words}   # values: reuse the same 2 numbers for the demo
q = [2.0, 0.5]                    # the query of "bank": looking for water or money clues
dk = 2
scores = [sum(a*b for a,b in zip(q,K[w]))/math.sqrt(dk) for w in words]
m = max(scores); ex = [math.exp(s-m) for s in scores]; t = sum(ex)
w = [e/t for e in ex]
for a,s,x in zip(words,scores,w): print(f"{a:6s} score {s:5.2f} weight {x*100:5.1f}%")
print("weights sum", round(sum(w)*100,1))
mix = [sum(x*V[a][i] for a,x in zip(words,w)) for i in range(2)]
print("mix [water, money]:", [round(v,2) for v in mix])
# same word, other sentence: "I went to the bank loan" -> money clue
K2 = {"I":[0.1,0.1],"went":[0.0,0.1],"to":[0.0,0.0],"the":[0.0,0.0],"loan":[0.0,2.5],"bank":[1.0,1.0]}
q2=[0.5,2.0]; ws2=list(K2)
sc=[sum(a*b for a,b in zip(q2,K2[x]))/math.sqrt(dk) for x in ws2]; m=max(sc); ex=[math.exp(s-m) for s in sc]; t=sum(ex)
for a,e in zip(ws2,ex): print(f"{a:6s} weight {e/t*100:5.1f}%")
mix2=[sum(e/t*K2[a][i] for a,e in zip(ws2,ex)) for i in range(2)]
print("mix2 [water, money]:", [round(v,2) for v in mix2])
