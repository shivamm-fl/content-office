import sys,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b005_maximum_subarray';R=TEAM/'reels'/FOLDER;nums=[-3,4,-1,2,-6,3]
sc={}
sc['A']=title('Maximum Subarray','Contiguous · non-empty')+array('A',nums,label='Given array')+line(250,735,635,735,GOOD,6)+text(505,870,'4 − 1 + 2 = 5',78,GOOD,'middle')+text(505,1080,'no gaps allowed',46,DIM,'middle')
sc['B']=title('Try every range','Choose a start, then extend the end')+array('B',nums)
for k,(i,j,total) in enumerate([(0,0,-3),(0,1,1),(0,2,0),(0,3,2),(1,1,4),(1,2,3),(1,3,5)]):
    b=text(505,810,f'range [{i}, {j}]',51,DIM,'middle')+boxlabel(300,865,410,'RUNNING SUM',total,GOOD if total==5 else ACC)
    sc['B']+=state(f'B-step{k}',b)
sc['B']+=text(505,1160,'6 × 7 / 2 = 21 ranges',44,INK,'middle')
sc['C']=title('Overlapping work','Every start reprocesses old elements')+array('C',nums,y=460)
for k in range(4):
    sc['C']+=line(170+k*135,705+k*38,850,705+k*38,ACC,5)
sc['C']+=text(505,950,'n(n + 1) / 2',68,INK,'middle')+text(505,1060,'5,000,050,000',78,BAD,'middle')+text(505,1140,'ranges at n = 100,000',38,DIM,'middle')
sc['D']=title('Restart or extend?','Best sum ending at the current index')+array('D',nums,y=460)
sc['D']+=line(250,690,770,690,BAD,5)+text(505,745,'previous ending = −1',38,BAD,'middle')
sc['D']+=boxlabel(110,770,365,'RESTART',3,GOOD)+boxlabel(535,770,365,'EXTEND','−1 + 3 = 2',ACC)
sc['D']+=text(505,1050,'max(x, previous ending + x)',49,INK,'middle')+text(505,1160,'drop a negative previous sum',39,GOOD,'middle')
sc['E']=title('Ending is not best','One chronological scan')+array('E',nums,y=465)
ending=[-3,4,3,5,-1,3];best=[-3,4,4,5,5,5]
for k,(end,b) in enumerate(zip(ending,best)):
    body=text(505,760,f'CURRENT  {nums[k]}',45,DIM,'middle')+boxlabel(110,825,365,'ENDING HERE',end,ACC)+boxlabel(535,825,365,'BEST ANYWHERE',b,GOOD)
    if k==2:body+=text(505,1120,'keep −1: previous sum was +4',39,INK,'middle')
    elif k==5:body+=text(505,1120,'restart at 3 · best stays 5',43,GOOD,'middle')
    else:body+=text(505,1120,'restart' if k in [0,1] else 'extend',48,INK,'middle')
    sc['E']+=state(f'E-step{k}',body)
sc['F']=title('Non-empty matters','All-negative input')+array('F',[-5,-2,-7])
sc['F']+=text(505,840,'0',90,BAD,'middle')+line(450,790,560,860,BAD,7)+text(505,1020,'answer = −2',76,GOOD,'middle')+text(505,1150,'initialize from nums[0]',43,INK,'middle')
sc['G']=title('Keep only two sums','O(n) time · O(1) extra space')+codebox(R,y=505,size=31)+boxlabel(110,950,365,'LAST ENDING',3,ACC)+boxlabel(535,950,365,'ANSWER',5,GOOD)
motion='''
// diagram: A
const inputCaps=R.caps.filter(c=>c.scene==='A'&&c.s>=P.A[1].s&&c.s<P.A[1].e);
let inputPos=0;
['minus','four','minus','two','minus','three'].forEach((word,i)=>{
 const k=inputCaps.findIndex((c,j)=>j>=inputPos&&c.t.toLowerCase().replace(/[.,:;]/g,'')===word);
 const t=inputCaps[k].s;inputPos=k+1;reset('A',t);cell('A',i,t);
});
reset('A',P.A[2].s);[1,2,3].forEach(i=>cell('A',i,P.A[2].s,'#6FD3A6'));
// diagram: B
const ranges=[[0,0],[0,1],[0,2],[0,3],[1,1],[1,2],[1,3]],bt=[];
for(let k=0;k<4;k++)bt.push(P.B[1].s+k*.6);
for(let k=0;k<3;k++)bt.push(P.B[2].s+k*.6);
ranges.forEach(([i,j],k)=>{const t=bt[k];step('#B-step'+k,t,k===6?S.C:bt[k+1]);reset('B',t);for(let z=i;z<=j;z++)cell('B',z,t,k===6?'#6FD3A6':'#A78BFA');});
// diagram: C
tl.fromTo('#vC line',{opacity:.15},{opacity:.65,stagger:.2,duration:.3},S.C);
// diagram: D
[1,2,3,4].forEach(i=>cell('D',i,S.D+.4,'#E5735F'));cell('D',5,P.D[1].s,'#6FD3A6');
// diagram: E
const et=[S.E,R.caps.find(c=>c.scene==='E'&&c.t.toLowerCase()==='four').s,P.E[1].s,R.caps.find(c=>c.scene==='E'&&c.t.toLowerCase()==='two').s,P.E[2].s,P.E[3].s];
et.forEach((t,k)=>{step('#E-step'+k,t,k===5?S.F:et[k+1]);reset('E',t);cell('E',k,t,k===3?'#6FD3A6':'#A78BFA');});
// diagram: F
cell('F',1,P.F[1].s,'#6FD3A6');
// diagram: G
'''
des={'A':'Largest nonempty contiguous sum is 5 from [4,-1,2]','B':'Choose each start and extend its right endpoint using running sums','C':'Repeated ranges cause quadratic work: 5000050000 at n=100000','D':'Either restart at x or extend the best previous ending; negative previous sum hurts','E':'Ending [-3,4,3,5,-1,3], best [-3,4,4,5,5,5]; do not confuse last ending and answer','F':'Nonempty all-negative array returns -2, not zero; initialize from first element','G':'Exact Accepted loop, linear time, constant extra space, ending versus best'}
pics={'A':'Six array cells highlight the contiguous winning middle three elements','B':'A start and end outline expand a range while its sum register updates','C':'Overlapping range brackets begin at different cells and share their tail','D':'A negative previous sum and current three compare restart and extend choices','E':'Current cell advances while ending-here and best-anywhere registers diverge','F':'Three negative cells highlight the least negative answer and cross out zero','G':'Accepted code sits above distinct ending and global answer registers'}
plan='# Visual plan — Maximum Subarray\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | ending, best | custom SVG and GSAP |\n'
compose('b005',FOLDER,sc,motion,des,plan)
