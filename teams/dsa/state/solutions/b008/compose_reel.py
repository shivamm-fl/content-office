import sys,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b008_rotated_search';R=TEAM/'reels'/FOLDER;nums=[6,8,2,4,5]
sc={}
sc['A']=title('Search after rotation','Unique values · target = 8')+array('A',nums,label='Given array')+text(505,900,'return index 1',76,GOOD,'middle')+text(505,1120,'absent → return −1',45,DIM,'middle')
sc['B']=title('Compare one by one','Brute force · stop on a match')+array('B',nums)
sc['B']+=state('B-miss',boxlabel(290,805,430,'6 == 8 ?', 'NO',BAD))+state('B-hit',boxlabel(290,805,430,'8 == 8 ?', 'YES',GOOD)+text(505,1100,'index 1',62,GOOD,'middle'))+text(90,1190,'WORST CASE  O(n)',48,INK)
sc['C']=title('Blind direction fails','Target > middle is not enough')+array('C',nums)+text(505,805,'8 > 2',83,ACC,'middle')+line(510,900,845,900,BAD,8)+line(845,900,810,875,BAD,8)+line(845,900,810,925,BAD,8)+text(675,995,'wrong half',44,BAD,'middle')+text(505,1150,'target 8 is on the LEFT',51,GOOD,'middle')
sc['D']=title('Find a sorted half','Check middle equality first')+array('D',nums)
sc['D']+=text(505,760,'6 > 2 → right half sorted',49,GOOD,'middle')+line(195,940,860,940,DIM,4)+line(220,940,600,940,GOOD,12)
for x,v,col in [(220,2,GOOD),(600,5,GOOD),(850,8,BAD)]:
    dotfill='#0B1220' if v==2 else col
    sc['D']+=f'<circle cx="{x}" cy="940" r="13" fill="{dotfill}" stroke="{col}" stroke-width="4"/>'+text(x,1010,v,51,col,'middle')
sc['D']+=text(505,1140,'8 is outside (2, 5]',59,BAD,'middle')+text(505,1210,'inside → keep · outside → other half',32,DIM,'middle')
sc['E']=title('Choose by the value range','Target 8 · original input')
for k,(left,right,mid,relation,rule) in enumerate([(0,4,2,'8 outside (2, 5]','right = 1'),(0,1,0,'8 is not 6','left = 1'),(1,1,1,'8 == 8','return index 1')]):
    b=array(f'E{k}',nums)+text(505,770,f'left {left} · mid {mid} · right {right}',42,DIM,'middle')+text(505,930,relation,66,GOOD if k==2 else ACC,'middle')+text(505,1120,rule,69,GOOD,'middle')
    for i in range(5):
        if i<left or i>right:b+=line(130+i*162,520,245+i*162,590,BAD,5)
    sc['E']+=state(f'E-step{k}',b)
sc['F']=title('No match: empty interval','Target = 7')
for k,(left,right,mid,label) in enumerate([(0,4,2,'right = 1'),(0,1,0,'left = 1'),(1,1,1,'left = 2'),(2,1,None,'return −1')]):
    b=array(f'F{k}',nums)+text(505,790,f'left {left} · right {right}',49,DIM,'middle')+text(505,980,label,77,BAD if k==3 else ACC,'middle')
    if k==3:b+=text(505,1150,'left > right · no candidates',42,BAD,'middle')
    for i in range(5):
        if i<left or i>right:b+=line(130+i*162,520,245+i*162,590,BAD,5)
    sc['F']+=state(f'F-step{k}',b)
sc['G']=title('Order chooses the direction','At least one half is sorted')+array('G',nums)
sc['G']+=rect(110,800,340,115,stroke=BAD)+text(280,875,'linear O(n)',48,BAD,'middle')+line(475,860,535,860,ACC,6)+rect(560,800,340,115,stroke=GOOD)+text(730,875,'O(log n)',48,GOOD,'middle')+text(505,1100,'EXTRA SPACE  O(1)',55,INK,'middle')
sc['D']=title('Accepted Python','Find a sorted half, then test its range')+state('D-code-left',accepted_code_panel(R,'codeDleft',6,15)+text(505,1170,'IF left sorted: test its range',40,ACC,'middle'))+state('D-code-right',accepted_code_panel(R,'codeDright',16,21)+text(505,1170,'8 outside (2, 5] → right = 1',43,ACC,'middle'))
sc['G']=title('Accepted Python','One interval shrinks at each iteration')+state('G-code-left',accepted_code_panel(R,'codeGleft',6,15))+state('G-code-right',accepted_code_panel(R,'codeGright',16,21))+text(505,1180,'O(log n) time · O(1) extra space',43,GOOD,'middle')
motion='''
// diagram: A
function words(scene,phrase,values){let p=0;const cs=R.caps.filter(c=>c.scene===scene&&c.s>=P[scene][phrase].s&&c.s<P[scene][phrase].e);return values.map(w=>{const k=cs.findIndex((c,j)=>j>=p&&c.t.toLowerCase().replace(/[.,:;]/g,'')===w);if(k<0)throw Error('word missing '+w);p=k+1;return cs[k].s;});}
words('A',1,['six','eight','two','four','five']).forEach((t,i)=>{reset('A',t);cell('A',i,t);});reset('A',P.A[2].s);cell('A',1,P.A[2].s,'#6FD3A6');
// diagram: B
const bt=words('B',1,['six','eight']);step('#B-miss',S.B,bt[1]);step('#B-hit',bt[1],S.C);cell('B',0,S.B,'#E5735F');reset('B',bt[1]);cell('B',1,bt[1],'#6FD3A6');
// diagram: C
cell('C',2,S.C);cell('C',1,S.C,'#6FD3A6');[3,4].forEach(i=>cell('C',i,P.C[0].s,'#E5735F'));
// diagram: D
function focusCode(prefix,lines,t){tl.set('[id^="'+prefix+'-L"] .code-highlight',{opacity:0},t);lines.forEach(n=>tl.set('#'+prefix+'-L'+n+' .code-highlight',{opacity:.2},t));}
const otherwise=R.caps.find(c=>c.scene==='D'&&c.t.toLowerCase().replace(/[.,:;]/g,'')==='otherwise').s;
step('#D-code-left',S.D,otherwise);step('#D-code-right',otherwise,S.E);focusCode('codeDleft',[6,7,8,9,10],S.D);focusCode('codeDleft',[11,12,13,14,15],P.D[1].s);focusCode('codeDright',[16,17,18,19,20],otherwise);
// diagram: E
[S.E,P.E[1].s,P.E[2].s].forEach((t,k)=>{step('#E-step'+k,t,k===2?S.F:P.E[k+1].s);cell('E'+k,[2,0,1][k],t,k===2?'#6FD3A6':'#A78BFA');});
// diagram: F
const ft=[S.F,S.F+(P.F[0].e-P.F[0].s)*.35,S.F+(P.F[0].e-P.F[0].s)*.66,P.F[1].s];ft.forEach((t,k)=>{step('#F-step'+k,t,k===3?S.G:ft[k+1]);if(k<3)cell('F'+k,[2,0,1][k],t);});
// diagram: G
step('#G-code-left',S.G,P.G[1].s);step('#G-code-right',P.G[1].s,R.total);focusCode('codeGleft',[7,11,12],S.G);focusCode('codeGright',[17,18,19,20],P.G[1].s);focusCode('codeGright',[21],P.G[2].s);
'''
des={'A':'Given array [6,8,2,4,5], target 8 returns index1; missing targets return -1','B':'Linear scan compares 6 then8; worst case still reads n values','C':'8>middle2 incorrectly sends ordinary binary search right, discarding the target at index1','D':'At most one rotation drop guarantees a sorted half; test whether the target lies within its numeric range','E':'Target8: (0,4,2) gives right1; (0,1,0) gives left1; (1,1,1) matches and returns1','F':'Target7 intervals [0,4],[0,1],[1,1],empty; left2>right1 gives -1','G':'A sorted-half range comparison discards roughly half each iteration: O(log n), O(1) extra space'}
pics={'A':'Array values highlight on English narration, target cell turns green','B':'Current cell and equality register change from miss6 to match8','C':'Wrong red direction arrow points away from the green target cell','D':'Green sorted suffix and number-line range exclude target8','E':'Three pointer states cross out discarded cells and finish at matching index1','F':'Four candidate interval states exhaust all remaining cells for missing target7','G':'Sorted suffix remains green while linear and logarithmic work are compared'}
des['D']='Accepted Python source lines6–21 in two chunks: middle equality, sorted-left range branch, sorted-right range branch and missing-target return'
des['G']='Both actual Accepted code chunks repeat with source-bound highlights and O(log n) time/O(1) extra space'
pics['D']='Actual Python branches advance on the spoken otherwise transition, paired with the concrete target8 range exclusion'
pics['G']='Two readable code chunks reinforce the shrinking interval and final absent-target return'
plan='# Visual plan — Rotated search\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | target, left, mid, right | SVG and GSAP |\n'
compose('b008',FOLDER,sc,motion,des,plan)
audit_screen_code(R)
