import sys,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b006_maximum_product';R=TEAM/'reels'/FOLDER;nums=[-2,3,-4]
sc={}
sc['A']=title('Maximum Product','Subarray · contiguous, non-empty')+array('A',nums,label='Given array')+text(505,855,'−2 × 3 × −4 = 24',73,GOOD,'middle')+text(505,1090,'return 24',66,GOOD,'middle')
sc['B']=title('Try every range','Brute force · running products')+array('B',nums)
for k,(i,j,val) in enumerate([(0,0,-2),(0,1,-6),(0,2,24),(1,1,3),(1,2,-12),(2,2,-4)]):
    sc['B']+=state(f'B-step{k}',text(505,790,f'range [{i}, {j}]',50,DIM,'middle')+boxlabel(300,845,410,'PRODUCT',val,GOOD if val==24 else ACC))
sc['B']+=text(505,1160,'6 ranges · best 24',45,INK,'middle')
sc['C']=title('One extreme fails','Maximum-only shortcut loses information')+array('C',nums)
sc['C']+=state('C-lost',text(505,800,'old maximum = 3',51,ACC,'middle')+text(505,920,'3 × −4 = −12',74,BAD,'middle')+text(505,1080,'best so far stays 3 · wrong',39,BAD,'middle'))
sc['C']+=state('C-found',text(505,800,'old minimum = −6',51,ACC,'middle')+text(505,930,'−6 × −4 = 24',80,GOOD,'middle')+text(505,1090,'lost minimum → missed maximum',38,INK,'middle'))
sc['D']=title('Keep both extremes','Negative multiplication reverses order')+boxlabel(110,475,365,'OLD MAX',3,GOOD)+boxlabel(535,475,365,'OLD MIN',-6,ACC)
sc['D']+=text(505,730,'current x = −4',56,INK,'middle')
for i,(name,val,col) in enumerate([('x',-4,DIM),('old max × x',-12,ACC),('old min × x',24,GOOD)]):
    x=100+i*280;sc['D']+=rect(x,795,250,165,stroke=col)+text(x+125,845,name,29,col,'middle')+text(x+125,925,val,69,col,'middle')
sc['D']+=text(505,1080,'new max 24 · new min −12',49,GOOD,'middle')+text(505,1170,'also allow a new one-element start',36,DIM,'middle')
sc['E']=title('Two ending products','One chronological pass')+array('E',nums,y=465)
for k,(hi,lo,best) in enumerate([(-2,-2,-2),(3,-6,3),(24,-12,24)]):
    b=boxlabel(110,775,365,'MAX ENDING',hi,GOOD)+boxlabel(535,775,365,'MIN ENDING',lo,ACC)+text(505,1100,f'GLOBAL BEST  {best}',60,GOOD,'middle')
    sc['E']+=state(f'E-step{k}',b)
sc['F']=title('Zero cannot be skipped','A subarray has no gaps')+array('F',[-2,0,-3],label='Given array')+text(505,810,'answer = 0',78,GOOD,'middle')
sc['F']+=state('F-skip',text(505,995,'−2 × −3 = 6',72,BAD,'middle')+line(265,940,745,1020,BAD,7)+text(505,1160,'skips index 1 · invalid',43,BAD,'middle'))
sc['G']=title('Both come from old states','One scan · three candidates per element')+rect(110,485,790,150,stroke=GOOD)+text(505,585,'max(x, H × x, L × x)',57,GOOD,'middle')+rect(110,685,790,150,stroke=ACC)+text(505,785,'min(x, H × x, L × x)',57,ACC,'middle')
sc['G']+=text(505,930,'H and L = previous extremes',38,DIM,'middle')+text(90,1060,'TIME  O(n)',61,GOOD)+text(90,1170,'EXTRA SPACE  O(1)',52,INK)
sc['G']=title('Accepted Python','Both new extremes use the old states')+accepted_code_panel(R,'codeG',6,13)+text(505,1150,'O(n) time · O(1) extra space',46,GOOD,'middle')
motion='''
// diagram: A
const ac=R.caps.filter(c=>c.scene==='A'&&c.s>=P.A[1].s&&c.s<P.A[1].e);let ap=0;
['minus','three','minus'].forEach((w,i)=>{const k=ac.findIndex((c,j)=>j>=ap&&c.t.toLowerCase().replace(/[.,:;]/g,'')===w);ap=k+1;reset('A',ac[k].s);cell('A',i,ac[k].s);});
reset('A',P.A[2].s);[0,1,2].forEach(i=>cell('A',i,P.A[2].s,'#6FD3A6'));
// diagram: B
const ranges=[[0,0],[0,1],[0,2],[1,1],[1,2],[2,2]];
ranges.forEach(([i,j],k)=>{const t=S.B+.4+k*.85;step('#B-step'+k,t,k===5?S.C:S.B+.4+(k+1)*.85);reset('B',t);for(let z=i;z<=j;z++)cell('B',z,t,k===2?'#6FD3A6':'#A78BFA');});
// diagram: C
step('#C-lost',S.C,P.C[2].s);step('#C-found',P.C[2].s,S.D);cell('C',2,S.C+.2);cell('C',0,P.C[2].s,'#6FD3A6');
// diagram: D
// diagram: E
[S.E,P.E[1].s,P.E[2].s].forEach((t,k)=>{step('#E-step'+k,t,k===2?S.F:[P.E[1].s,P.E[2].s][k]);reset('E',t);cell('E',k,t,k===2?'#6FD3A6':'#A78BFA');});
// diagram: F
cell('F',1,P.F[1].s,'#E5735F');step('#F-skip',P.F[2].s,S.G);
// diagram: G
function focusCode(lines,t){tl.set('[id^="codeG-L"] .code-highlight',{opacity:0},t);lines.forEach(n=>tl.set('#codeG-L'+n+' .code-highlight',{opacity:.2},t));}
focusCode([6,7,8],S.G);focusCode([9,10,11,12],P.G[1].s);focusCode([9,11],P.G[2].s);
'''
des={'A':'Given array [-2,3,-4]; largest contiguous nonempty product is 24','B':'All six ranges from three elements; repeated products cost O(n squared)','C':'Maximum-only state loses prior -6, missing -6 times -4 equals 24','D':'Negative multiplication reverses order; x and both previous extremes exhaust the candidates','E':'High [-2,3,24], low [-2,-6,-12], best [-2,3,24]','F':'[-2,0,-3] returns zero; skipping the middle zero to get six is invalid','G':'Both new extremes use old states; three candidates give O(n) time and O(1) extra space'}
pics={'A':'Three signed array cells highlight on the English spoken input values','B':'Range boundaries advance through six actual products and show each register value','C':'A maximum-only result fails before the forgotten minimum produces twenty four','D':'Two old extreme registers feed three numerical multiplication candidates','E':'Current signed cell advances while separate maximum and minimum registers update','F':'A central zero blocks a crossed-out product of disconnected outer cells','G':'Maximum and minimum candidate equations share explicitly previous extreme variables'}
des['G']='Exact Accepted Python method body, lines6–13; old high/low feed both updates; O(n) time and O(1) extra space'
pics['G']='Source-bound Python code highlights initialization, previous extremes, both updates and best tracking'
plan='# Visual plan — Maximum Product Subarray\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | max, min, current | custom SVG and GSAP |\n'
compose('b006',FOLDER,sc,motion,des,plan)
audit_screen_code(R)
