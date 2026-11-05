# Illustrative toy next-word probabilities (NOT a real model run). Computes what top-k and top-p keep.
cases = {
 "sharp (Delhi ki capital hai ___)": [("Delhi",0.80),("Dilli",0.10),("India",0.04),("city",0.03),("Mumbai",0.02),("old",0.01)],
 "flat (Chai ke saath ___ )":        [("biscuit",0.22),("samosa",0.20),("pakoda",0.18),("rusk",0.15),("bun",0.13),("maggi",0.12)],
}
def top_k(ps,k): return sorted(ps,key=lambda x:-x[1])[:k]
def top_p(ps,p):
    out=[];c=0.0
    for w,q in sorted(ps,key=lambda x:-x[1]):
        out.append((w,q));c+=q
        if c>=p-1e-9: break
    return out
for name,ps in cases.items():
    assert abs(sum(q for _,q in ps)-1)<1e-9
    k=top_k(ps,3); p=top_p(ps,0.90)
    print(name)
    print(" top_k=3 keeps",[w for w,_ in k],"mass=%.2f"%sum(q for _,q in k))
    print(" top_p=0.90 keeps",[w for w,_ in p],"count=%d mass=%.2f"%(len(p),sum(q for _,q in p)))
