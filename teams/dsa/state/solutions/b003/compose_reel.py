import json,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b003_contains_duplicate';R=TEAM/'reels'/FOLDER
def seen(prefix,values,y=855,hit=None):
    b=rect(145,y,720,180,stroke=ACC)+text(170,y+42,'SEEN SET',30,DIM)
    if not values:return b+text(505,y+120,'empty',52,DIM,'middle')
    for i,v in enumerate(values):
        x=215+i*210
        b+=rect(x,y+66,145,85,stroke=GOOD if v==hit else '#52617D')+text(x+72,y+126,v,53,GOOD if v==hit else INK,'middle')
    return b
sc={}
sc['A']=title('Contains Duplicate','Any repeated value?')+array('A',[5,2,9,2])+line(403,730,808,730,GOOD,5)+text(605,830,'2 = 2',85,GOOD,'middle')+text(505,1060,'return true',66,GOOD,'middle')
sc['B']=title('Compare every pair','Brute force · i < j')+array('B',[5,2,9,2])
pairs=[(0,1),(0,2),(0,3),(1,2),(1,3)]
for k,(i,j) in enumerate(pairs):
    nums=[5,2,9,2];hit=nums[i]==nums[j]
    b=text(505,795,f'CHECK {k+1}',36,DIM,'middle')+text(505,920,f'{nums[i]} {"=" if hit else "≠"} {nums[j]}',92,GOOD if hit else INK,'middle')+text(505,1070,'return true' if hit else 'keep searching',52,GOOD if hit else DIM,'middle')
    sc['B']+=state(f'B-p{k}',b)
sc['C']=title('Repeated searching','Worst case: every value distinct')+array('C',[5,2,9,6],y=470)
for i in range(4):
    for j in range(i+1,4):
        a,b=206+i*202.5,206+j*202.5
        sc['C']+=f'<path d="M{a} 680 Q{(a+b)/2} {740+(j-i)*20} {b} 680" stroke="{ACC}" fill="none" stroke-width="4"/>'
sc['C']+=text(505,865,'n(n − 1) / 2',65,INK,'middle')+text(505,950,'n = 100,000',44,DIM,'middle')+text(505,1060,'4,999,950,000',78,BAD,'middle')+text(505,1135,'pair comparisons · worst case',33,DIM,'middle')
sc['D']=title('Remember seen values','Is this value already in the past?')+array('D',[5,2,9,2])+text(505,780,'current 2 ∈ seen?',61,ACC,'middle')+seen('D',[5,2,9],hit=2)+text(505,1150,'average O(1) membership',40,DIM,'middle')
sc['E']=title('Check → then add','One pass · [5, 2, 9, 2]')+array('E',[5,2,9,2])
for k,(x,values) in enumerate([(5,[]),(2,[5]),(9,[5,2]),(2,[5,2,9])]):
    b=text(505,770,f'{x} {"already seen" if k==3 else "not seen"}',60,GOOD if k==3 else ACC,'middle')+seen(f'E{k}',values,hit=2 if k==3 else None)
    b+=text(505,1150,'return true' if k==3 else f'add {x}',55,GOOD if k==3 else INK,'middle')
    sc['E']+=state(f'E-step{k}',b)
sc['F']=title('Avoid self-matching','Check the past before adding the present')+array('F',[5],start=425,span=200)
sc['F']+=state('F-bad',text(505,805,'add → check',58,BAD,'middle')+seen('F',[5],y=855)+text(505,1135,'first 5 matches itself!',43,BAD,'middle'))
sc['F']+=state('F-good',text(505,805,'check → add',58,GOOD,'middle')+seen('Fgood',[],y=855)+text(505,1135,'all distinct → false',48,GOOD,'middle'))
sc['G']=title('The memory trade-off','Hash-set operations: average time')+text(90,505,'O(n²) → O(n)',76,ACC)+codebox(R,y=610,size=31)+text(90,1135,'EXTRA SPACE  O(n)',49,INK)
motion='''
// diagram: A
cell('A',1,S.A+3,'#6FD3A6');cell('A',3,S.A+4,'#6FD3A6');
// diagram: B
const bt=[S.B,S.B+.8,S.B+1.6,P.B[1].s,P.B[1].s+2];
[[0,1],[0,2],[0,3],[1,2],[1,3]].forEach((p,k)=>{const t=bt[k];step('#B-p'+k,t,k===4?S.C:bt[k+1]);reset('B',t);p.forEach(i=>cell('B',i,t,k===4?'#6FD3A6':'#A78BFA'));});
// diagram: C
tl.fromTo('#vC path',{opacity:.2},{opacity:.65,stagger:.1,duration:.3},S.C);
// diagram: D
cell('D',3,S.D+.4);cell('D',1,P.D[1].s,'#6FD3A6');
// diagram: E
const et=[S.E,P.E[1].s,P.E[1].s+1.5,P.E[2].s];
et.forEach((t,k)=>{step('#E-step'+k,t,k===3?S.F:et[k+1]);reset('E',t);cell('E',k,t,k===3?'#6FD3A6':'#A78BFA');});
// diagram: F
step('#F-good',S.F,P.F[1].s);step('#F-bad',P.F[1].s,P.F[2].s);step('#F-good',P.F[2].s,S.G);
// diagram: G
'''
des={'A':'Any repeated value returns true; all distinct returns false','B':'Five pair comparisons find the twos at distinct indices','C':'All distinct values force every pair; quadratic operation count','D':'Current value repeats exactly when it is in the earlier-value set','E':'Check then add 5,2,9; final 2 is already present','F':'Add-first falsely self-matches; all-distinct completion returns false','G':'Average O(n) time costs O(n) extra space; exact Accepted loop'}
plan='# Visual plan — Contains Duplicate\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
pics={'A':'Four indexed array cells connect equal values with a bracket','B':'Two cell outlines advance through actual pair comparisons until equality','C':'All pair arcs accumulate over a distinct four-cell array','D':'Current array value connects to matching chip inside the seen set','E':'Current cell advances while the seen set accumulates prior values','F':'One cell demonstrates a false self-match before a correct empty-set check','G':'Accepted loop and quadratic-to-linear equation connect time to extra memory'}
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | seen, current | custom SVG and GSAP |\n'
compose('b003',FOLDER,sc,motion,des,plan)
