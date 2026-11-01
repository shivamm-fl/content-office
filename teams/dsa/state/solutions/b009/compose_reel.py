import sys,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b009_three_sum';R=TEAM/'reels'/FOLDER;original=[1,-2,2,0,1,-2];nums=sorted(original)
sc={}
sc['A']=title('Three Sum','Three distinct indices · sum = 0')+array('A',original,label='Given array')+boxlabel(110,830,365,'TRIPLET 1','−2, 0, 2',GOOD)+boxlabel(535,830,365,'TRIPLET 2','−2, 1, 1',GOOD)+text(505,1160,'unique value-triplets',46,DIM,'middle')
sc['B']=title('Choose three indices','Brute force · i < j < k')+array('B',original)
for k,(indices,val) in enumerate([((0,1,2),1),((0,1,4),0),((0,4,5),0)]):
    label=', '.join(map(str,indices));sc['B']+=state(f'B-step{k}',text(505,790,f'indices ({label})',43,DIM,'middle')+boxlabel(305,840,400,'SUM',val,GOOD if val==0 else ACC))
sc['B']+=text(505,1110,'C(6, 3) = 20',53,INK,'middle')+text(505,1210,'O(n³) work',48,BAD,'middle')
sc['C']=title('Sort a copy, fix an anchor','Then search a sorted suffix')+array('C0',original,y=470,label='original input')+array('C1',nums,y=840,label='sorted copy')
sc['C']+=line(505,690,505,760,ACC,6)+line(505,760,480,735,ACC,6)+line(505,760,530,735,ACC,6)+text(560,735,'sort(copy)',35,ACC)
sc['C']+=text(505,1175,'anchor + left + right',47,ACC,'middle')
sc['D']=title('Sorted order moves pointers','Branch examples · fixed anchor −2')
for key,left,right,eq,rule in [('low',1,5,'−2 + (−2) + 2 = −2','sum < 0 → left + 1'),('high',3,5,'−2 + 1 + 2 = 1','sum > 0 → right − 1'),('hit',3,4,'−2 + 1 + 1 = 0','save · move both inward')]:
    b=array(f'D-{key}',nums)+text(505,820,eq,63,GOOD if key=='hit' else ACC,'middle')+text(505,1000,rule,54,GOOD,'middle')
    if key=='low':b+=text(505,1160,'same left + right inward → no larger sum',32,DIM,'middle')
    if key=='high':b+=text(505,1160,'same right + left inward → no smaller sum',32,DIM,'middle')
    sc['D']+=state('D-'+key,b)
sc['E']=title('Follow one anchor','Sorted copy · anchor index 0 = −2')
for k,(left,right,sumval,eq) in enumerate([(1,5,-2,'−2 + (−2) + 2 = −2'),(2,5,0,'−2 + 0 + 2 = 0'),(3,4,0,'−2 + 1 + 1 = 0')]):
    b=array(f'E{k}',nums)+text(505,790,f'left {left} · right {right}',43,DIM,'middle')+text(505,940,eq,62,GOOD if k else ACC,'middle')
    if k==0:b+=text(505,1120,'left → index 2',55,ACC,'middle')
    else:b+=text(505,1120,'SAVE '+('[-2, 0, 2]' if k==1 else '[-2, 1, 1]'),57,GOOD,'middle')
    sc['E']+=state(f'E-step{k}',b)
sc['F']=title('Skip repeated choices','Preserve repeated input values')
sc['F']+=state('F-anchor',array('F0',nums,label='skip index 1 as a repeated anchor')+line(267,515,383,600,BAD,6)+text(505,900,'same anchor −2 → same triplets',43,DIM,'middle')+text(505,1110,'skip choices · preserve values',44,GOOD,'middle'))
sc['F']+=state('F-delete',array('F1',[-2,0,1,2],label='WRONG: deduplicated input')+text(505,855,'[-2, 1, 1]',76,BAD,'middle')+line(270,800,740,885,BAD,6)+text(505,1080,'needs two separate 1 indices',43,BAD,'middle'))
sc['F']+=state('F-zero',array('F2',[0,0,0],label='Given array')+text(505,855,'[0, 0, 0]',84,GOOD,'middle')+text(505,1090,'one unique triplet',52,GOOD,'middle'))
sc['G']=title('A scan for each anchor','Pointers move inward without backtracking')+array('G',nums,label='sorted copy · O(n) auxiliary space')+text(505,835,'O(n) anchors × O(n) scan',51,ACC,'middle')+text(505,990,'TIME  O(n²)',70,GOOD,'middle')+text(505,1115,'EXTRA SPACE  O(n)',56,INK,'middle')+text(505,1210,'returned triplets O(k) counted separately',32,DIM,'middle')

# Actual Accepted method body is taught in three readable, source-bound parts.
def small_array(prefix,values,y=1050):
    out=''
    for i,v in enumerate(values):
        x=115+i*(810/len(values));w=810/len(values)-20
        out+=rect(x,y,w,70,id=f'{prefix}-c{i}')+text(x+w/2,y+51,v,44,INK,'middle')
    return out
sc['C']=title('Accepted Python · setup','Method body · sort, anchor, initial pointers')+accepted_code_panel(R,'codeC',6,13)+small_array('C1',nums)+text(505,1195,'sorted copy · anchor index 0',34,ACC,'middle')
sc['D']=title('Accepted Python · scan','Continue inside the anchor loop')+accepted_code_panel(R,'codeD',14,23)
for key,label in [('low','sum −2 → advance left'),('high','sum 1 → decrease right'),('hit','sum 0 → save, move both')]:
    sc['D']+=state('D-'+key,text(505,1185,label,42,GOOD if key=='hit' else ACC,'middle'))
sc['F']=title('Accepted Python · dedup','Preserve values; skip repeated choices')
sc['F']+=state('F-code-anchor',accepted_code_panel(R,'codeFanchor',6,13))
sc['F']+=state('F-code-next',accepted_code_panel(R,'codeFnext',24,28))
sc['F']+=state('F-anchor',text(505,1080,'repeated anchor −2 → skip',43,ACC,'middle'))
sc['F']+=state('F-pointer-note',text(505,1080,'skip repeated left/right values',43,ACC,'middle'))
sc['F']+=state('F-delete',text(505,1050,'set(nums) loses [-2, 1, 1]',46,BAD,'middle'))
sc['F']+=state('F-zero',small_array('F2',[0,0,0],y=1015)+text(505,1175,'one output: [0, 0, 0]',45,GOOD,'middle'))
motion='''
// diagram: A
function spoken(scene,phrase,prefix,groups){const cs=R.caps.filter(c=>c.scene===scene&&c.s>=P[scene][phrase].s&&c.s<P[scene][phrase].e);let at=0;groups.forEach((ws,i)=>{let start;ws.forEach((w,j)=>{const k=cs.findIndex((c,z)=>z>=at&&c.t.toLowerCase().replace(/[.,:;]/g,'')===w);if(k<0)throw Error('Missing '+w);at=k+1;if(!j)start=cs[k].s;});reset(prefix,start);cell(prefix,i,start);});}
spoken('A',1,'A',[['one'],['minus','two'],['two'],['zero'],['one'],['minus','two']]);
// diagram: B
const bmid=P.B[1].s+(P.B[1].e-P.B[1].s)*.65;const bt=[S.B,P.B[1].s,bmid];const combos=[[0,1,2],[0,1,4],[0,4,5]];bt.forEach((t,k)=>{step('#B-step'+k,t,k===2?S.C:bt[k+1]);reset('B',t);combos[k].forEach(i=>cell('B',i,t,k?'#6FD3A6':'#A78BFA'));});
// diagram: C
cell('C1',0,P.C[1].s);cell('C1',1,P.C[1].s,'#6FD3A6');cell('C1',5,P.C[1].s,'#6FD3A6');
// diagram: D
const dz=R.caps.find(c=>c.scene==='D'&&c.s>=P.D[1].s&&c.t.toLowerCase().replace(/[.,:;]/g,'')==='zero').s;
step('#D-low',S.D,P.D[1].s);step('#D-high',P.D[1].s,dz);step('#D-hit',dz,S.E);
function codeFocus(prefix,lines,t){tl.set('[id^="'+prefix+'-L"] .code-highlight',{opacity:0},t);lines.forEach(n=>tl.set('#'+prefix+'-L'+n+' .code-highlight',{opacity:.2},t));}
codeFocus('codeC',[6],S.C);codeFocus('codeC',[8,13],P.C[1].s);
codeFocus('codeD',[14,15,16,17],S.D);codeFocus('codeD',[18,19],P.D[1].s);codeFocus('codeD',[20,21,22,23],dz);
// diagram: E
[S.E,P.E[1].s,P.E[2].s].forEach((t,k)=>{step('#E-step'+k,t,k===2?S.F:P.E[k+1].s);cell('E'+k,0,t);cell('E'+k,[1,2,3][k],t,'#6FD3A6');cell('E'+k,[5,5,4][k],t,'#6FD3A6');});
// diagram: F
const fm=R.caps.find(c=>c.scene==='F'&&c.t.toLowerCase().replace(/[.,:;]/g,'')==='match').s;
step('#F-code-anchor',S.F,fm);step('#F-code-next',fm,S.G);codeFocus('codeFanchor',[9,10],S.F);codeFocus('codeFnext',[24,25,26,27],fm);codeFocus('codeFnext',[28],P.F[2].s);
step('#F-anchor',S.F,fm);step('#F-pointer-note',fm,P.F[1].s);step('#F-delete',P.F[1].s,P.F[2].s);step('#F-zero',P.F[2].s,S.G);[0,1,2].forEach(i=>cell('F2',i,P.F[2].s,'#6FD3A6'));
// diagram: G
cell('G',0,S.G);[1,5].forEach(i=>cell('G',i,S.G,'#6FD3A6'));
'''
des={'A':'Original [1,-2,2,0,1,-2] yields two unique value-triplets, using three distinct indices','B':'Twenty index triples; different index choices can produce the same [-2,1,1] value-triplet','C':'Accepted source lines6–13: sorted copy, result, anchor loop, duplicate anchor guard, positive early exit and initial pointers','D':'Accepted source lines14–23: scan, sum comparisons, save and inward pointer updates, highlighted with numerical branch examples','E':'Anchor -2: sum-2, then zero with[-2,0,2], then zero with[-2,1,1] at distinct indices','F':'Accepted duplicate skips and final return, source lines24–28; preserve multiplicities and all-zero unique output','G':'O(n) inward scan per anchor gives O(n squared); this sorted-copy Python implementation uses O(n) auxiliary space, excluding returned triplets'}
pics={'A':'Six signed cells and two actual unique output triples','B':'Three-index highlights change while equal outputs from different indices are distinguished','C':'Readable source-bound Accepted Python with a compact sorted array and active anchor','D':'Actual Python loop highlights low, high and zero branches with a matching sum register','E':'Three exact pointer states produce both valid triplets','F':'Actual duplicate-skip and return code highlights alongside duplicate-choice and all-zero examples','G':'Sorted copy and active endpoints ground the per-anchor scan and memory accounting'}
plan='# Visual plan — Three Sum\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | anchor, left, right, sum | SVG and GSAP |\n'
compose('b009',FOLDER,sc,motion,des,plan)
audit_screen_code(R)
