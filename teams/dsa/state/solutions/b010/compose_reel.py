import sys,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b010_container_water';R=TEAM/'reels'/FOLDER;nums=[1,6,2,5,4]

def water(prefix,heights,left,right,unit=65,label='height'):
    xs=[145+i*720/(len(heights)-1) for i in range(len(heights))];base=970
    level=min(heights[left],heights[right]);out=text(90,470,label,32,DIM)
    if level:
        out+=f'<rect x="{xs[left]}" y="{base-level*unit}" width="{xs[right]-xs[left]}" height="{level*unit}" fill="#153F4A"/>'+line(xs[left],base-level*unit,xs[right],base-level*unit,GOOD,4)
    out+=line(110,base,910,base,DIM,3)
    for i,(x,h) in enumerate(zip(xs,heights)):
        col=GOOD if i in [left,right] else DIM
        out+=f'<line id="{prefix}-bar{i}" x1="{x}" y1="{base}" x2="{x}" y2="{base-h*unit}" stroke="{col}" stroke-width="11"/>'
        out+=f'<circle cx="{x}" cy="{base-h*unit}" r="7" fill="{col}"/>'+text(x,base-h*unit-24,h,44,INK,'middle')+text(x,base+54,i,31,DIM,'middle')
    return out

def metrics(area,best):
    return rect(125,1070,340,130,stroke=ACC)+text(295,1115,'AREA',29,ACC,'middle')+text(295,1180,area,58,ACC,'middle')+rect(545,1070,340,130,stroke=GOOD)+text(715,1115,'BEST',29,GOOD,'middle')+text(715,1180,best,58,GOOD,'middle')

sc={}
sc['A']=title('Container With Most Water','Two boundaries · maximum area')+water('A',nums,1,4,label='Given array · heights')+text(505,1100,'min(6, 4) × (4 − 1) = 12',55,GOOD,'middle')+text(505,1200,'return 12',47,GOOD,'middle')
sc['B']=title('Try every pair','Brute force · sample pairs below')
for k,(left,right,area) in enumerate([(0,1,1),(1,3,10),(1,4,12)]):
    sc['B']+=state(f'B-step{k}',water(f'B{k}',nums,left,right)+text(505,1100,f'pair ({left}, {right}) · area {area}',52,ACC,'middle'))
sc['B']+=text(505,1200,'10 pairs · O(n²) work',45,BAD,'middle')
sc['C']=title('Width alone is not enough','The smaller boundary limits the height')
sc['C']+=state('C-wide',water('C0',nums,0,4)+text(505,1100,'width 4 × height 1 = 4',54,BAD,'middle')+text(505,1200,'widest pair · weak result',36,DIM,'middle'))
sc['C']+=state('C-inner',water('C1',nums,1,4)+text(505,1100,'width 3 × height 4 = 12',54,GOOD,'middle')+text(505,1200,'narrower · larger area',37,GOOD,'middle'))
sc['D']=title('Move the shorter side','Hold it: shrinking width cannot help')
sc['D']+=state('D-current',water('D0',nums,0,4)+text(505,1100,'height ≤ 1 · width 4 · area 4',43,ACC,'middle'))
sc['D']+=state('D-held',water('D1',nums,0,3)+text(505,1100,'same left · width 3 · area 3',43,BAD,'middle')+text(505,1200,'holding the shorter side cannot improve',32,DIM,'middle'))
sc['D']+=state('D-new',water('D2',nums,1,4)+text(505,1100,'new boundary → height limit 4',44,GOOD,'middle')+text(505,1200,'possible improvement · not a guarantee',32,DIM,'middle'))
sc['E']=title('Measure area, keep best','One chronological two-pointer pass')
for k,(left,right,area,best) in enumerate([(0,4,4,4),(1,4,12,12),(1,3,10,12),(1,2,2,12)]):
    sc['E']+=state(f'E-step{k}',water(f'E{k}',nums,left,right)+metrics(area,best))
sc['F']=title('Equal and zero heights','Width is the index difference')
sc['F']+=state('F-equal',water('F0',[3,3],0,1,unit=95,label='Given array')+text(505,1110,'3 × (1 − 0) = 3',64,GOOD,'middle'))
sc['F']+=state('F-zero',water('F1',[0,0],0,1,label='Given array')+text(505,785,'no height → no water',46,DIM,'middle')+text(505,1110,'return 0',76,GOOD,'middle'))
sc['G']=title('Accepted Python','Update area and best before moving')+accepted_code_panel(R,'codeG',6,16)+text(505,1180,'O(n) time · O(1) extra space',46,GOOD,'middle')
motion='''
function colorBar(prefix,i,t,color){tl.set('#'+prefix+'-bar'+i,{attr:{stroke:color}},t);}
// diagram: A
const ac=R.caps.filter(c=>c.scene==='A'&&c.s>=P.A[1].s&&c.s<P.A[1].e);let ap=0;
['one','six','two','five','four'].forEach((w,i)=>{const k=ac.findIndex((c,j)=>j>=ap&&c.t.toLowerCase().replace(/[.,:;]/g,'')===w);if(k<0)throw Error('input word missing '+w);ap=k+1;tl.set('[id^="A-bar"]',{attr:{stroke:'#9DAEC5'}},ac[k].s);colorBar('A',i,ac[k].s,'#A78BFA');});
tl.set('[id^="A-bar"]',{attr:{stroke:'#9DAEC5'}},P.A[2].s);[1,4].forEach(i=>colorBar('A',i,P.A[2].s,'#6FD3A6'));
// diagram: B
[S.B,P.B[1].s,P.B[2].s].forEach((t,k)=>step('#B-step'+k,t,k===2?S.C:P.B[k+1].s));
// diagram: C
step('#C-wide',S.C,P.C[1].s);step('#C-inner',P.C[1].s,S.D);
// diagram: D
step('#D-current',S.D,P.D[1].s);step('#D-held',P.D[1].s,P.D[2].s);step('#D-new',P.D[2].s,S.E);colorBar('D1',0,P.D[1].s,'#A78BFA');
// diagram: E
[S.E,P.E[1].s,P.E[2].s,P.E[3].s].forEach((t,k)=>step('#E-step'+k,t,k===3?S.F:P.E[k+1].s));
// diagram: F
step('#F-equal',S.F,P.F[1].s);step('#F-zero',P.F[1].s,S.G);
// diagram: G
function focusCode(lines,t){tl.set('[id^="codeG-L"] .code-highlight',{opacity:0},t);lines.forEach(n=>tl.set('#codeG-L'+n+' .code-highlight',{opacity:.2},t));}
focusCode([9,10,11],S.G);focusCode([8,12,13,14,15],P.G[1].s);focusCode([12,13,15],P.G[2].s);
'''
des={'A':'Original heights [1,6,2,5,4] form maximum area12 at indices1 and4; use minimum height times index gap','B':'Enumerate ten pairs for five lines; sample areas1,10,12 show quadratic partner scans','C':'Widest endpoints give4, but a narrower pair gives12, so width alone is insufficient','D':'A fixed shorter boundary cannot improve with any smaller width; discard it safely, with either move allowed on a tie','E':'Actual areas4,12,10,2; global best4,12,12,12 preserves the maximum','F':'Equal [3,3] gives3, all-zero [0,0] gives0; width is a coordinate difference','G':'Actual Accepted source lines6–16: measure area, update best, move the shorter side, return best; O(n), O(1) extra'}
pics={'A':'Height lines and a scaled water rectangle show the returned maximum capacity','B':'Three actual candidate containers change selected endpoints and measured area','C':'A shallow wide rectangle changes into a taller narrower rectangle with triple the area','D':'Fixed short boundary and shrinking water rectangle prove discarded candidates cannot win','E':'Four exact endpoint states show water area and separate global-best registers','F':'Two equal boundaries store water; zero-height boundaries store none','G':'Readable source-bound Python highlights area/best updates and the shorter-side condition'}
plan='# Visual plan — Container With Most Water\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | height, index, area, best | SVG and GSAP |\n'
compose('b010',FOLDER,sc,motion,des,plan)
audit_screen_code(R)
