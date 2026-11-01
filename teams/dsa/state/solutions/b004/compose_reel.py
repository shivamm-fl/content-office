import sys,json
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b004_product_except_self';R=TEAM/'reels'/FOLDER
sc={}
sc['A']=title('Product Except Self','Exclude this element · no division')+array('A',[2,3,4,5])+text(505,805,'2 × 4 × 5 = 40',76,GOOD,'middle')+array('Aout',['?',40,'?','?'],y=940,label='answer')
sc['B']=title('Recompute the rest','Brute force · one scan per answer')+array('B',[2,3,4,5])
for k,(eq,out) in enumerate([('3 × 4 × 5 = 60',[60,'?','?','?']),('2 × 4 × 5 = 40',[60,40,'?','?'])]):
    sc['B']+=state(f'B-step{k}',text(505,805,eq,73,GOOD,'middle')+array(f'B{k}out',out,y=940,label='answer'))
sc['C']=title('Multiply. Repeat.','Same factors rebuilt for every output')+array('C',[2,3,4,5],y=460)
for i in range(4):
    for j in range(4):
        if i!=j:
            a,b=205+i*202.5,205+j*202.5
            sc['C']+=f'<path d="M{a} 675 Q{(a+b)/2} {730+abs(j-i)*19} {b} 675" stroke="{ACC}" fill="none" stroke-width="3" opacity=".5"/>'
sc['C']+=text(505,875,'n(n − 1)',68,INK,'middle')+text(505,965,'n = 100,000',43,DIM,'middle')+text(505,1070,'9,999,900,000',78,BAD,'middle')+text(505,1150,'multiplications · no division allowed',33,DIM,'middle')
sc['D']=title('Split around i','Strictly left × strictly right')+array('D',[2,3,4,5])
sc['D']+=rect(115,725,185,95,stroke=GOOD)+text(207,790,'LEFT 2',40,GOOD,'middle')+rect(520,725,390,95,stroke=ACC)+text(715,790,'RIGHT 4 × 5',45,ACC,'middle')
sc['D']+=text(407,790,'skip 3',38,BAD,'middle')+line(335,745,475,810,BAD,5)
sc['D']+=text(505,980,'2 × 20 = 40',88,GOOD,'middle')+text(505,1130,'all remaining elements, exactly once',37,DIM,'middle')
sc['E']=title('Left to right','Store prefix before multiplying current')+array('E',[2,3,4,5])+array('Eout',[1,2,6,24],y=855,label='answer = product strictly to the left')
sc['E']+=text(505,1140,'empty product = 1',46,ACC,'middle')
sc['F']=title('Right to left','Combine running suffix with stored prefix')+array('F',[2,3,4,5],y=465)
for k,(i,suffix,out,eq) in enumerate([(3,1,[1,2,6,24],'24 × 1 = 24'),(2,5,[1,2,30,24],'6 × 5 = 30'),(1,20,[1,40,30,24],'2 × 20 = 40'),(0,60,[60,40,30,24],'1 × 60 = 60')]):
    b=text(505,770,eq,79,GOOD,'middle')+array(f'F{k}out',out,y=880,label='answer')+text(505,1170,f'suffix before current = {suffix}',40,ACC,'middle')
    sc['F']+=state(f'F-step{k}',b)
sc['G']=title('Zeros still work','No division required')+array('G',[2,0,4],y=485)+array('Gout',[0,8,0],y=875,label='answer')+text(505,780,'2 × 4 = 8',84,GOOD,'middle')+text(505,1160,'only this output excludes the zero',38,DIM,'middle')
sc['H']=title('Two passes, one output','Memory accounting matters')+array('H',[2,3,4,5],y=475)+array('Hout',[60,40,30,24],y=760,label='returned answer · O(n) space')
sc['H']+=text(90,1030,'TIME  O(n)',59,ACC)+text(90,1130,'EXTRA  O(1)',59,GOOD)+text(90,1190,'excluding the required output array',32,DIM)
sc['H']=title('Accepted Python','Two passes · method body')+accepted_code_panel(R,'codeH',6,15)+text(505,1100,'O(n) time · O(1) extra space',46,GOOD,'middle')+text(505,1190,'required output O(n) counted separately',32,DIM,'middle')
motion='''
// diagram: A
cell('A',1,S.A+.3,'#E5735F');[0,2,3].forEach(i=>cell('A',i,P.A[2].s,'#6FD3A6'));
// diagram: B
step('#B-step0',S.B,P.B[2].s);step('#B-step1',P.B[2].s,S.C);cell('B',0,S.B,'#E5735F');reset('B',P.B[2].s);cell('B',1,P.B[2].s,'#E5735F');
// diagram: C
tl.fromTo('#vC path',{opacity:.1},{opacity:.5,stagger:.04,duration:.3},S.C);
// diagram: D
cell('D',1,S.D+.2,'#E5735F');cell('D',0,P.D[1].s,'#6FD3A6');[2,3].forEach(i=>cell('D',i,P.D[1].s+.7));
// diagram: E
[0,1,2,3].forEach(i=>{cell('E',i,P.E[1].s+i*.45);cell('Eout',i,P.E[1].s+i*.45,'#6FD3A6');});
// diagram: F
const ft=[S.F,P.F[2].s,P.F[3].s,R.caps.find(c=>c.scene==='F'&&c.t==='pehle').s];
ft.forEach((t,k)=>{step('#F-step'+k,t,k===3?S.G:ft[k+1]);reset('F',t);cell('F',3-k,t);cell('F'+k+'out',3-k,t,'#6FD3A6');});
// diagram: G
cell('G',1,S.G+.4,'#E5735F');cell('Gout',1,P.G[1].s,'#6FD3A6');
// diagram: H
function focusCode(lines,t){tl.set('[id^="codeH-L"] .code-highlight',{opacity:0},t);lines.forEach(n=>tl.set('#codeH-L'+n+' .code-highlight',{opacity:.2},t));}
focusCode([6,7,8,9,10],S.H);focusCode([11,12,13,14,15],P.H[1].s);focusCode([9,10],P.H[2].s);
'''
des={'A':'Each output excludes its own element; removing 3 gives 40','B':'Repeated whole scans multiply all other elements for each index','C':'n(n−1) repeated multiplications; division prohibited','D':'Exclusion partitions remaining values into strictly-left and strictly-right factors','E':'Store prefix before including current; prefix output [1,2,6,24]','F':'Suffixes 1,5,20,60 combine in reverse, producing [60,40,30,24]','G':'Zero input [2,0,4] yields [0,8,0] without dividing','H':'O(n) time; O(n) required output and O(1) extra space excluding output'}
pics={'A':'A crossed current array element is excluded from the product expression','B':'Current excluded cell advances as product expressions fill corresponding outputs','C':'Repeated pair arcs connect every element except the current index','D':'A skipped middle cell splits green left and violet right factors','E':'An output row fills with products strictly before each current cell','F':'A reverse cursor combines a suffix scalar with each stored prefix','G':'A central zero highlights the only nonzero output formed by other factors','H':'Input and returned output rows distinguish required memory from scalar workspace'}
des['H']='Exact Accepted method body, lines6–15: prefix pass, suffix pass and returned answer; O(n) time and O(1) extra excluding required output'
pics['H']='Readable Accepted Python with synchronized prefix/suffix highlights and explicit output-memory accounting'
plan='# Visual plan — Product Except Self\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'
for s in sc:plan+=f'| {s} | {des[s]} | {pics[s]} | prefix, suffix, answer | custom SVG and GSAP |\n'
compose('b004',FOLDER,sc,motion,des,plan)
audit_screen_code(R)
