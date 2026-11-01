"""Preproduction design; execute only after genuine Accepted and prepared audio."""
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE.parent))
from studio_common import *
FOLDER='b011_sum_integers';R=TEAM/'reels'/FOLDER

def bits(prefix,value,y,label,color=ACC):
    out=text(100,y-28,label,31,DIM)
    for i,bit in enumerate(f'{value:04b}'):
        x=305+i*130
        out+=rect(x,y,105,90,stroke=color if bit=='1' else DIM)+text(x+52,y+63,bit,52,color if bit=='1' else DIM,'middle')
    return out

def registers(a,b,y=900):
    return boxlabel(130,y,340,'PARTIAL SUM',a)+boxlabel(550,y,340,'CARRY',b,GOOD)

sc={}
sc['A']=title('Sum without + or −','Two integers · exact result')+text(505,540,'Given integers',36,DIM,'middle')+boxlabel(130,600,340,'a',5)+boxlabel(550,600,340,'b',3,GOOD)+text(505,925,'5 + 3 = 8',90,INK,'middle')+text(505,1060,'+ and − are forbidden',45,BAD,'middle')+text(505,1170,'return 8',58,GOOD,'middle')
sc['B']=title('Repeated increments','Naive idea · invalid under the constraint')
for k,value in enumerate([5,6,7,8]):
    sc['B']+=state(f'B-step{k}',text(505,755,value,170,ACC,'middle')+text(505,865,f'{k} of 3 increments',43,DIM,'middle'))
sc['B']+=text(505,1020,'increment still needs +',46,BAD,'middle')+text(505,1160,'steps grow with magnitude',39,DIM,'middle')
sc['C']=title('XOR misses the carry','Low 4 bits · positive example')+bits('C-a',5,520,'a = 5')+bits('C-b',3,675,'b = 3',GOOD)+line(300,800,825,800)+bits('C-x',6,840,'a XOR b')+text(505,1080,'6 ≠ 8',80,BAD,'middle')+text(505,1180,'both 1 → carry omitted',44,BAD,'middle')
sc['D']=title('Split sum and carry','Use the same old a and b for both')
sc['D']+=bits('D-a',5,505,'a = 5')+bits('D-b',3,645,'b = 3',GOOD)
sc['D']+=state('D-xor',bits('D-x',6,840,'XOR → 6')+text(505,1080,'sum without carry',48,ACC,'middle'))
sc['D']+=state('D-and',bits('D-and-row',1,840,'AND → 1',GOOD)+text(505,1080,'shared 1 bits',48,GOOD,'middle'))
sc['D']+=state('D-shift',bits('D-shift-row',2,840,'AND << 1',GOOD)+text(505,1080,'carry → next position',47,GOOD,'middle'))
sc['D']+=state('D-pair',registers(6,2,840)+text(505,1090,'repeat until carry = 0',47,GOOD,'middle'))
sc['E']=title('Follow every carry','Low 4 bits · exact loop states')
for k,(a,b) in enumerate([(5,3),(6,2),(4,4),(0,8),(8,0)]):
    sc['E']+=state(f'E-step{k}',bits(f'E{k}-a',a,520,f'a = {a}')+bits(f'E{k}-b',b,700,f'b = {b}',GOOD)+registers(a,b,925)+text(505,1180,'STOP · return 8' if b==0 else 'XOR · shifted AND → next pair',39,GOOD if b==0 else DIM,'middle'))
sc['F']=title('Bound negative sign bits','32 bits · mask = 0xFFFFFFFF')
sc['F']+=state('F-mask',text(505,600,'…11111110',72,ACC,'middle')+text(505,685,'Python −2 · sign extension',39,DIM,'middle')+text(505,860,'keep only 32 bits',52,GOOD,'middle')+text(505,1000,'0xFFFFFFFE',67,GOOD,'middle')+text(505,1170,'mask sum AND carry',41,DIM,'middle'))
sc['F']+=state('F-signed',text(505,520,'Given integers: −2, −3',42,DIM,'middle')+text(505,655,'0xFFFFFFFE',63,ACC,'middle')+text(505,750,'0xFFFFFFFD',63,GOOD,'middle')+text(505,885,'result  0xFFFFFFFB',55,INK,'middle')+text(505,985,'sign bit = 1 → signed conversion',37,ACC,'middle')+text(505,1090,'~0x00000004 = −5',54,GOOD,'middle')+text(505,1185,'~(a XOR mask)',36,DIM,'middle'))
sc['G']=title('Accepted Python','Fixed 32-bit work · no + or −')+accepted_code_panel(R,'codeG',3,7,y=500,size=32,gap=54)+text(505,1070,'carry moves left · ≤ 32 rounds',42,GOOD,'middle')+text(505,1180,'O(1) time · O(1) extra space',45,GOOD,'middle')
motion='''
// diagram: A
// diagram: B
function spoken(scene,phrase,word,occurrence=0){const found=R.caps.filter(c=>c.scene===scene&&c.s>=P[scene][phrase].s&&c.s<P[scene][phrase].e&&c.t.toLowerCase().replace(/[.,:;!?]/g,'')===word);if(!found[occurrence])throw Error('Missing spoken token '+scene+word);return found[occurrence].s;}
const bt=[S.B,spoken('B',0,'six'),spoken('B',0,'seven'),spoken('B',0,'eight')];
bt.forEach((t,k)=>step('#B-step'+k,t,k===3?S.C:bt[k+1]));
// diagram: C
// diagram: D
const da=spoken('D',0,'and');
step('#D-xor',S.D,da);step('#D-and',da,P.D[1].s);step('#D-shift',P.D[1].s,P.D[2].s);step('#D-pair',P.D[2].s,S.E);
// diagram: E
const et=[S.E,spoken('E',0,'six'),spoken('E',1,'four'),spoken('E',2,'zero'),spoken('E',3,'eight',1)];
et.forEach((t,k)=>step('#E-step'+k,t,k===4?S.F:et[k+1]));
// diagram: F
step('#F-mask',S.F,P.F[1].s);step('#F-signed',P.F[1].s,S.G);
// diagram: G
function codeFocus(lines,t){tl.set('[id^="codeG-L"] .code-highlight',{opacity:0},t);lines.forEach(n=>tl.set('#codeG-L'+n+' .code-highlight',{opacity:.2},t));}
codeFocus([3,4,6,7],S.G);codeFocus([5,6],P.G[1].s);codeFocus([6],P.G[2].s);
'''
des={
 'A':'Scalar inputs5 and3 require8 without plus/minus operators',
 'B':'Repeated increments5,6,7,8 grow with magnitude and still violate the forbidden-operator rule',
 'C':'Low four bits show5 XOR3 equals6, not8: carry is missing',
 'D':'Shared old values produce XOR partial sum6 and AND1 shifted left to carry2, repeated to zero carry',
 'E':'Exact simultaneous states(5,3),(6,2),(4,4),(0,8),(8,0); carry zero returns8',
 'F':'Mask32 bounds negative sign extension; -2 and-3 yieldFFFFFFFB, converted via ~(a XOR mask) to-5',
 'G':'Full actual method body lines3–7; fixed32-bit carry propagation gives constant time and space'
}
plan='# Visual plan — Sum of Two Integers\n\n| Scene | Spoken | Picture | Labels | Built with |\n|---|---|---|---|---|\n'+''.join(f'| {s} | {des[s]} | Binary cells, current values and source-bound code | sum, carry, sign | SVG and GSAP |\n' for s in sc)
compose('b011',FOLDER,sc,motion,des,plan)
audit_screen_code(R)
