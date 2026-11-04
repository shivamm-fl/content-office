# q139: invented card charges (EXAMPLE). Population standard deviation (pstdev), modified z = 0.6745*(x-median)/MAD, flag > 3.5 (NIST).
import statistics as st
normal=[480,481,484,487,492,495,500,500,500,502,506,506,511,513,517,518,519,520,524,526]
def z(d):
    m=st.mean(d); s=st.pstdev(d); return m,s,[(x-m)/s for x in d]
def mz(d):
    med=st.median(d); mad=st.median([abs(x-med) for x in d]); return med,mad,[0.6745*(x-med)/mad for x in d]
for name,extra in [("one big charge",[50000]),("two big charges",[50000,40000])]:
    d=normal+extra; m,s,zs=z(d)
    print(name,"| mean",round(m),"std",round(s),"| z of big charges",[round(v,2) for v in zs[20:]],"| normal flagged by z>3:",sum(v>3 for v in zs[:20]))
    med,mad,ms=mz(d)
    print("  median",med,"MAD",mad,"| modified z of big",[round(v) for v in ms[20:]],"| normal flagged by modz>3.5:",sum(abs(v)>3.5 for v in ms[:20]))
