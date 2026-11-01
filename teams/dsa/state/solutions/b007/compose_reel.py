import sys,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b007_rotated_minimum';R=TEAM/'reels'/FOLDER;nums=[7,9,1,3,5]
sc={}
sc['A']=title('Find the minimum','Sorted, rotated · unique values')+array('A',nums,label='Given array')+text(505,915,'minimum = 1',77,GOOD,'middle')
sc['B']=title('Read every value','Brute force · linear scan')+array('B',nums)
for k,val in enumerate([7,7,1,1,1]):
    sc['B']+=state(f'B-step{k}',boxlabel(300,810,410,'RUNNING MIN',val,GOOD))
sc['B']+=text(90,1140,'SCAN  O(n)',57,INK)+text(90,1210,'TARGET  O(log n)',43,ACC)
sc['C']=title('Rotation leaves a clue','One possible descending boundary')+array('C',nums)
for i,v in enumerate(nums):
    x=180+i*165;y=1060-v*35
    if i:sc['C']+=line(x-165,1060-nums[i-1]*35,x,y,BAD if i==2 else ACC,6)
    sc['C']+=f'<circle cx="{x}" cy="{y}" r="13" fill="{BAD if i==2 else GOOD}"/>'+text(x,y-30,v,42,INK,'middle')
sc['C']+=text(505,1190,'9 → 1: rotation drop',44,BAD,'middle')
sc['D']=title('Compare middle with right','Keep the interval containing the minimum')
intro=array('D0',nums)+text(505,900,'nums[mid] ? nums[right]',48,ACC,'middle')
sc['D']+=state('D-intro',intro)
case1=array('D1',[7,9,1],label='CASE 1 · candidate interval [0, 2]')+text(505,815,'9 > 1',78,ACC,'middle')+text(505,950,'minimum strictly after mid',43,GOOD,'middle')+text(505,1100,'left = mid + 1',65,GOOD,'middle')+line(150,535,530,585,BAD,7)
case2=array('D2',nums,label='CASE 2 · candidate interval [0, 4]')+text(505,815,'1 < 5',78,ACC,'middle')+text(505,950,'mid … right is sorted',43,GOOD,'middle')+text(505,1100,'right = mid',65,GOOD,'middle')+text(505,1190,'keep mid: it may be the minimum',34,DIM,'middle')
sc['D']+=state('D-case1',case1)+state('D-case2',case2)
sc['E']=title('Follow the interval','Original input · one chronological search')
for k,(left,right,mid,label,rule) in enumerate([(0,4,2,'1 < 5','right = 2'),(0,2,1,'9 > 1','left = 2'),(2,2,2,'left = right = 2','return 1')]):
    b=array(f'E{k}',nums)+text(505,780,f'left {left} · mid {mid} · right {right}',42,DIM,'middle')+text(505,935,label,74,GOOD if k==2 else ACC,'middle')+text(505,1120,rule,72,GOOD,'middle')
    for i in range(5):
        if i<left or i>right:b+=line(130+i*162,520,245+i*162,590,BAD,5)
    sc['E']+=state(f'E-step{k}',b)
sc['F']=title('Keep a possible answer','Never use right = mid − 1 here')
sc['F']+=state('F-error',array('F0',nums)+text(505,820,'mid = 2 · value = 1',54,GOOD,'middle')+text(505,1000,'right = 1',70,BAD,'middle')+line(450,500,570,605,BAD,8)+text(505,1170,'would discard the actual minimum',37,BAD,'middle'))
sc['F']+=state('F-sorted',array('F1',[1,3,5],label='Given array · already sorted')+text(505,850,'right: 2 → 1 → 0',60,ACC,'middle')+text(505,1080,'minimum = 1',76,GOOD,'middle'))
sc['F']+=state('F-single',array('F2',[4],label='Single-element input',start=375,span=280)+text(505,890,'left = right = 0',57,ACC,'middle')+text(505,1090,'return 4 · no iteration',51,GOOD,'middle'))
sc['G']=title('Halve the search interval','Illustrative interval sizes · n = 16')
for k,(count,y) in enumerate([(16,495),(8,640),(4,785),(2,930),(1,1075)]):
    width=700/(2**k);sc['G']+=rect(110,y,width,55,fill='#30264C',stroke=ACC,rx=5)+text(910,y+42,count,40,INK,'end')
sc['G']+=text(90,1210,'O(log n) time · O(1) extra space',44,GOOD)
sc['G']=title('Accepted Python','Keep mid when it may be the minimum')+accepted_code_panel(R,'codeG',6,13)+text(505,1130,'O(log n) time · O(1) extra space',44,GOOD,'middle')
motion='''
// diagram: A
function words(scene,phrase,values){let p=0;const cs=R.caps.filter(c=>c.scene===scene&&c.s>=P[scene][phrase].s&&c.s<P[scene][phrase].e);return values.map(w=>{const k=cs.findIndex((c,j)=>j>=p&&c.t.toLowerCase().replace(/[.,:;]/g,'')===w);if(k<0)throw Error('word missing: '+w);p=k+1;return cs[k].s;});}
words('A',1,['seven','nine','one','three','five']).forEach((t,i)=>{reset('A',t);cell('A',i,t);});cell('A',2,P.A[2].s,'#6FD3A6');
// diagram: B
const bt=words('B',1,['seven','seven','one','one','one']);step('#B-step0',S.B,bt[1]);bt.forEach((t,k)=>{reset('B',t);cell('B',k,t);if(k)step('#B-step'+k,t,k===4?S.C:bt[k+1]);});
// diagram: C
cell('C',0,S.C);cell('C',2,P.C[1].s,'#6FD3A6');
// diagram: D
step('#D-intro',S.D,P.D[1].s);step('#D-case1',P.D[1].s,P.D[2].s);step('#D-case2',P.D[2].s,S.E);cell('D0',2,S.D);cell('D0',4,S.D);cell('D1',1,P.D[1].s);cell('D1',2,P.D[1].s,'#6FD3A6');cell('D2',2,P.D[2].s,'#6FD3A6');cell('D2',4,P.D[2].s);
// diagram: E
const eEnd=R.caps.filter(c=>c.scene==='E'&&c.t.toLowerCase().replace(/[.,:;]/g,'')==='दोनों');
const meet=P.E[2].e-2.0;step('#E-step0',S.E,P.E[2].s);step('#E-step1',P.E[2].s,meet);step('#E-step2',meet,S.F);cell('E0',2,S.E,'#6FD3A6');cell('E0',4,S.E);cell('E1',1,P.E[2].s);cell('E1',2,P.E[2].s,'#6FD3A6');cell('E2',2,meet,'#6FD3A6');
// diagram: F
step('#F-error',S.F,P.F[1].s);step('#F-sorted',P.F[1].s,P.F[2].s);step('#F-single',P.F[2].s,S.G);cell('F0',2,S.F,'#E5735F');cell('F1',0,P.F[1].s,'#6FD3A6');cell('F2',0,P.F[2].s,'#6FD3A6');
// diagram: G
function focusCode(lines,t){tl.set('[id^="codeG-L"] .code-highlight',{opacity:0},t);lines.forEach(n=>tl.set('#codeG-L'+n+' .code-highlight',{opacity:.2},t));}
focusCode([6,7,8],S.G);focusCode([9,10],P.G[1].s);focusCode([11,12,13],P.G[2].s);
'''
des={'A':'Original unique sorted-rotated input [7,9,1,3,5] has minimum 1','B':'Five running minima [7,7,1,1,1] illustrate O(n) scan versus required O(log n)','C':'The 9-to-1 drop breaks global sorting but preserves enough order to discard half','D':'Compare middle with right; larger middle moves left to mid+1, otherwise retain mid with right=mid','E':'Original trace: (0,4,2) goes to right=2; (0,2,1) goes to left=2; convergence returns 1','F':'mid-1 drops the actual minimum; already sorted and one-element boundaries also work','G':'Illustrative interval counts halve 16,8,4,2,1; logarithmic time, constant extra space'}
pics={'A':'English spoken values advance the active cell; smallest cell then turns green','B':'Active scan cell and running minimum change on the five spoken values','C':'A numeric line plot drops from nine to one at the rotation boundary','D':'Two concrete interval diagrams show the comparison, discarded candidates and retained minimum','E':'Three interval states cross out discarded values and update left, middle and right','F':'Wrong boundary crosses out one, then separate sorted and singleton arrays prove edge cases','G':'Five shrinking interval bars count down to one remaining candidate'}
des['G']='Exact Accepted Python method body, lines6–13: interval guard, midpoint, both boundary updates and return; O(log n) time, O(1) extra'
pics['G']='Readable actual Python highlights mid+1 branch, retained-mid branch and converged return'
plan='# Visual plan — Rotated minimum\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | left, mid, right | SVG and GSAP |\n'
compose('b007',FOLDER,sc,motion,des,plan)
audit_screen_code(R)
