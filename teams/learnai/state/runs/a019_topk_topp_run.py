sharp=[("Delhi",.80),("Dilli",.10),("India",.04),("city",.03),("Mumbai",.02),("old",.01)]
flat=[("biscuit",.22),("samosa",.20),("pakoda",.18),("rusk",.15),("bun",.13),("maggi",.12)]
def topk(l,k): return l[:k]
def topp(l,p):
    out=[];c=0
    for w,x in l:
        out.append((w,x));c+=x
        if c>=p-1e-9: break
    return out
for n,l in(("sharp",sharp),("flat",flat)):
    for lab,r in(("top_k=3",topk(l,3)),("top_p=0.90",topp(l,.9)),("top_p=0.50",topp(l,.5))):
        print(n,lab,[w for w,_ in r],"mass=%.2f"%sum(x for _,x in r))
