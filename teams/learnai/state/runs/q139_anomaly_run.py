import statistics as s
base=[480,520,510,495,505,530,490,515,500,525,485,510,498,502,520,507,493,512,488,505]
def z(data):
    m=s.mean(data); sd=s.pstdev(data); return [(x-m)/sd for x in data]
def mz(data):
    med=s.median(data); mad=s.median([abs(x-med) for x in data]); return [0.6745*(x-med)/mad for x in data]
for label,extra in (("one big charge",[50000]),("two big charges",[50000,40000])):
    d=base+extra
    zz=z(d); mm=mz(d)
    print(label,"n=%d mean=%.0f std=%.0f median=%.0f"%(len(d),s.mean(d),s.pstdev(d),s.median(d)))
    for i in range(len(base),len(d)):
        print("  value",d[i],"z=%.2f flagged(|z|>3)=%s  modified_z=%.1f flagged(>3.5)=%s"%(zz[i],abs(zz[i])>3,mm[i],abs(mm[i])>3.5))
    print("  normal values flagged by modified z:",sum(abs(v)>3.5 for v in mm[:len(base)]))
