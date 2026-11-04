import math
words=["cricket","football","chess","hockey"]
logits=[2.0,1.0,0.5,0.0]
def sm(l,t):
    e=[math.exp(x/t) for x in l]; s=sum(e); return [x/s for x in e]
for t in (0.2,0.7,1.0,2.0):
    print("T=%.1f"%t, " ".join("%s=%.1f%%"%(w,100*p) for w,p in zip(words,sm(logits,t))))
