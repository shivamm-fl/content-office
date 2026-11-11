"""Source-bound diagrams for Blind75 b012-b021; requires prepared real audio."""
import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'teams/dsa/state/solutions'
sys.path.insert(0,str(BASE))
from studio_common import *

def note(value,y=1140,color=GOOD,size=44):return text(505,y,value,size,color,'middle')
def vals(prefix,values,y=530,label='Given array',selected=()):
    result=text(90,y-35,label,30,DIM);step=830/len(values)
    for i,value in enumerate(values):
        x=100+i*step;selected_cell=i in selected;col=GOOD if selected_cell else INK
        result+=rect(x,y,step-20,120,fill='#173B35' if selected_cell else PANEL,stroke=GOOD if selected_cell else '#34425D',id=f'{prefix}-c{i}')
        result+=text(x+(step-20)/2,y+83,value,65 if len(str(value))<3 else 51,col,'middle')+text(x+(step-20)/2,y+171,i,31,DIM,'middle')
    return result
def binary(value,y,label,width=5,color=ACC):
    out=text(100,y-30,label,33,DIM)
    step=700/width;left=160
    for i,b in enumerate(f'{value:0{width}b}'):
        out+=rect(left+i*step,y,step-15,90,stroke=color if b=='1' else DIM)+text(left+i*step+(step-15)/2,y+65,b,54,color if b=='1' else DIM,'middle')
    return out
def arrow(x1,y1,x2,y2,col=ACC):
    return line(x1,y1,x2,y2,col)+f'<path d="M{x2-9},{y2-12} L{x2},{y2} L{x2+9},{y2-12}" fill="none" stroke="{col}" stroke-width="4"/>'
def registers(a,b,la='VALUE',lb='COUNT',y=950):return boxlabel(110,y,360,la,a)+boxlabel(550,y,360,lb,b,GOOD)
def branch(root,left,right,y=520):
    return boxlabel(350,y,310,'REMAINING',root)+line(505,y+155,280,y+240)+line(505,y+155,730,y+240)+boxlabel(130,y+250,300,'CHOICE 1',left)+boxlabel(580,y+250,300,'CHOICE 2',right)
def grid(rows,cols,matrix,active=None,y=545,scale=120):
    out='';left=255
    for j,c in enumerate(cols):out+=text(left+j*scale+scale/2,y-40,c,43,ACC,'middle')
    for i,r in enumerate(rows):
        out+=text(left-65,y+i*scale+scale*.66,r,44,ACC,'middle')
        for j,v in enumerate(matrix[i]):
            col=GOOD if active==(i,j) else DIM
            out+=rect(left+j*scale,y+i*scale,scale-8,scale-8,stroke=col)+text(left+j*scale+scale*.45,y+i*scale+scale*.66,v,48,col,'middle')
    return out
def words(parts,y=575):
    step=820/len(parts);out=''
    for i,part in enumerate(parts):out+=rect(100+i*step,y,step-18,135,stroke=ACC)+text(100+i*step+(step-18)/2,y+88,part,58,INK,'middle')
    return out

def diagrams(n):
    """A-E: each tuple is a diagram and phrase/word sync point for its arrival."""
    d={}
    if n==12:
        d['A']=[(binary(12,540,'n = 12',4)+note('set bits = 2',990),None)]
        d['B']=[(binary(v,550,f'n = {v}',4)+registers(v,k,'REMAINING','CHECKS'),p) for v,k,p in [(12,0,None),(6,1,(1,'six',0)),(3,2,(1,'three',0)),(1,3,(1,'one',0)),(0,4,(1,'four',0))]]
        d['C']=[(binary(16,570,'16 · scan 5 positions',5)+note('only 1 set bit',1010,BAD),None)]
        d['D']=[(binary(12,510,'n = 12',4)+binary(11,700,'n − 1 = 11',4,GOOD)+note('1100 AND 1011 = 1000',1060)+note('exactly one 1 removed',1170,DIM,35),None)]
        d['E']=[(binary(v,545,f'n = {v}',4)+registers(v,k)+note(label,1185),p) for v,k,label,p in [(12,0,'start',None),(8,1,'12 AND 11 = 8',(0,'one',5)),(0,2,'8 AND 7 = 0 · stop',(1,'zero',0))]]
    elif n==13:
        d['A']=[(boxlabel(340,480,330,'n',6)+vals('A',[0,1,1,2,1,2,2],790,'counts · index = number')+note('return every count',1170),None)]
        d['B']=[(binary(3,530,'3 · count 2',3)+binary(6,770,'6 · count 2',3,GOOD)+note('shared prefix 11',1120,DIM),None)]
        d['C']=[(binary(6,510,'6 = 110',3)+arrow(505,650,505,750)+binary(3,800,'6 >> 1 = 3 · already solved',3,GOOD),None)]
        d['D']=[(boxlabel(115,530,350,'count[6 >> 1]',2)+boxlabel(560,530,350,'6 AND 1',0,GOOD)+arrow(290,710,505,880)+arrow(735,710,505,880)+boxlabel(340,900,330,'count[6]',2,GOOD),None)]
        data=[0,1,1,2,1,2,2]
        d['E']=[(vals(f'E{k}',[data[i] if i<=k else '·' for i in range(7)],575,'counts · ascending index',selected=(k,))+note(f'count[{k}] = count[{k>>1}] + {k&1}' if k else 'base · count[0] = 0',1000)+note(f'return {data}' if k==6 else 'smaller index is ready',1160,DIM,35),p) for k,p in [(0,None),(1,(0,'one',0)),(2,(1,'two',0)),(3,(1,'three',0)),(4,(2,'four',0)),(5,(2,'five',0)),(6,(2,'six',0))]]
    elif n==14:
        d['A']=[(vals('A',[4,0,2,1],530)+vals('Ar',[0,1,2,3,4],840,'full range',selected=(3,))+note('missing = 3',1160),None)]
        d['B']=[(boxlabel(340,480,330,'CANDIDATE',3)+vals('B',[4,0,2,1],800,'search each value')+note('3 is absent',1160,BAD),None)]
        body=vals('C',[4,0,2,1],850,'same array scanned again')
        for i in range(5):
            x=150+i*170;body+=text(x,560,i,60,ACC,'middle')+line(x,600,505,800,BAD,2)
        d['C']=[(body+note('candidate × array scan',1160,BAD),None)]
        d['D']=[(vals('D1',[0,1,2,3,4],520,'full range')+vals('D2',[4,0,2,1],850,'present values')+note('x XOR x = 0 · unpaired 3 remains',1160,GOOD,36),None)]
        d['E']=[(vals(f'E{k}',[4,0,2,1],520,'nums',selected=(() if k==0 else (k-1,)))+boxlabel(340,900,330,'ACCUMULATOR',acc,GOOD)+note(label,1180,DIM,37),p) for k,acc,label,p in [(0,4,'seed n = 4',None),(1,0,'4 XOR 0 XOR 4 = 0',(1,'zero',1)),(2,1,'0 XOR 1 XOR 0 = 1',(1,'one',1)),(3,1,'1 XOR 2 XOR 2 = 1',(2,'two',0)),(4,3,'1 XOR 3 XOR 1 = 3',(2,'three',0))]]
    elif n==15:
        pattern=lambda value,y: text(505,y,' '.join(f'{value:032b}'[i:i+8] for i in range(0,32,8)),32,ACC,'middle')
        d['A']=[(boxlabel(340,490,330,'n',10)+pattern(10,820)+note('reverse all 32 positions',1080),None)]
        d['B']=[(binary(10,500,'only 4 bits',4)+binary(5,760,'WRONG WIDTH → 5',4,BAD)+note('pad to 32 before reversing',1150,BAD,38),None)]
        d['C']=[(rect(110,560,800,155,stroke=BAD)+text(505,655,'32-character temporary buffer',42,BAD,'middle')+registers(10,0,'INPUT','RESULT',900),None)]
        d['D']=[(binary(10,500,'input · last bit = 0',4)+arrow(800,650,800,820)+boxlabel(115,850,350,'RESULT << 1',0)+boxlabel(560,850,350,'APPEND n & 1',0,GOOD)+note('consume 1 bit · repeat 32 times',1160,DIM,37),None)]
        d['E']=[(registers(inp,result,'INPUT','RESULT',700)+note(label,1050)+note('continue after input becomes 0',1180,DIM,34),p) for inp,result,label,p in [(10,0,'start · 0 of 32 rounds',None),(5,0,'consume 0 · result 0',(0,'zero',1)),(2,1,'consume 1 · result 1',(1,'one',0)),(1,2,'consume 0 · result 2',(1,'two',0)),(0,5,'consume 1 · result 5',(1,'five',0)),(0,1342177280,'28 more zero bits → 0x50000000',(2,'twenty',0))]]
        # Full decimal output needs a wide register rather than two narrow boxes.
        d['E'][-1]=(pattern(1342177280,615)+boxlabel(100,790,810,'RESULT',1342177280,GOOD)+note('32 rounds complete',1170),d['E'][-1][1])
    elif n==16:
        stairs=''
        for k in range(5):
            x=145+k*145;y=1040-k*95
            stairs+=rect(x,y,140,115,stroke=ACC)+text(x+70,y+76,k+1,50,INK,'middle')
            if k<4:stairs+=line(x+70,y-15,x+215,y-110,GOOD)
        d['A']=[(stairs+note('1-step or 2-step moves · 8 routes',1190,GOOD,38),None)]
        d['B']=[(branch(5,4,3)+text(280,1060,'→ 3, 2',47,ACC,'middle')+text(730,1060,'→ 2, 1',47,ACC,'middle'),None)]
        d['C']=[(branch(5,4,3)+boxlabel(140,1010,290,'RECOMPUTED',3,BAD)+line(280,950,285,1005,BAD)+note('same remaining-stairs question',1190,BAD,36),None)]
        d['D']=[(boxlabel(100,550,370,'WAYS i − 1','a')+boxlabel(550,550,370,'WAYS i − 2','b',GOOD)+arrow(285,745,505,900)+arrow(735,745,505,900)+boxlabel(340,930,330,'WAYS i','a + b',GOOD),None)]
        d['E']=[(registers(a,b,'PREVIOUS','CURRENT',720)+note(label,1100),p) for a,b,label,p in [(1,1,'ways[0] = 1 · ways[1] = 1',None),(1,2,'ways[2] = 1 + 1 = 2',(1,'two',0)),(2,3,'ways[3] = 1 + 2 = 3',(1,'three',0)),(3,5,'ways[4] = 2 + 3 = 5',(2,'four',0)),(5,8,'ways[5] = 3 + 5 = 8',(2,'five',1))]]
    elif n==17:
        d['A']=[(vals('A',[1,3,4],500,'Given array · coins')+words(['3','3'],850)+note('amount 6 · minimum 2 coins',1160),None)]
        d['B']=[(boxlabel(340,485,330,'REMAINING',6)+vals('B',[5,3,2],860,'after choosing coin 1, 3, 4')+line(505,650,250,820)+line(505,650,505,820)+line(505,650,760,820),None)]
        d['C']=[(words(['4','1','1'],515)+note('3 coins · greedy',740,BAD)+words(['3','3'],860)+note('2 coins · optimum',1080),None)]
        d['D']=[(vals('D',[5,3,2],530,'predecessor totals for total 6')+vals('Dcost',[3,2,3],850,'dp[6 − coin] + 1',selected=(1,))+note('minimum candidate = 2',1170),None)]
        costs=[0,1,2,1,1,2,2]
        d['E']=[(vals('Ecost',costs,560,'dp · totals 0 through 6')+note('last coin → candidate count',835,DIM)+vals(f'Ecand{k}',[3,2,3],920,'coins 1, 3, 4',selected=sel),p) for k,sel,p in [(0,(),None),(1,(0,),(1,'one',0)),(2,(1,),(1,'three',1)),(3,(2,),(1,'four',0))]]
        d['E'].append((vals('Ebest',costs,560,'dp · totals 0 through 6',selected=(6,))+note('minimum 2 coins · 3 + 3',835,GOOD)+vals('Ewinner',[3,2,3],920,'last coin 1, 3, 4 · compare counts',selected=(1,)),(1,'minimum',0)))
    elif n==18:
        d['A']=[(vals('A',[-4,6,2,7,3,8],510,selected=(0,2,4,5))+vals('As',[-4,2,3,8],865,'strictly increasing · length 4',selected=(0,1,2,3)),None)]
        d['B']=[(branch('value','TAKE','SKIP')+note('2 choices per element → 2ⁿ subsets',1160,BAD,38),None)]
        d['C']=[(vals('C',[6,2],530,'same length · possible endings')+arrow(505,740,505,870)+boxlabel(340,900,330,'NEXT VALUE',3,GOOD)+note('2 can extend to 3 · 6 cannot',1170,GOOD,37),None)]
        d['D']=[(vals('D',[-4,2,7],510,'tails · minimum ending by length')+boxlabel(340,835,330,'NEW VALUE',3,GOOD)+note('first tail ≥ 3 is 7 · replace it',1170,GOOD,36),None)]
        sequences=[[-4],[-4,6],[-4,2],[-4,2,7],[-4,2,3],[-4,2,3,8]]
        d['E']=[(vals(f'Et{k}',v,640,'tails · minimum endings',selected=(len(v)-1,))+note(label,1050)+note('length = '+str(len(v)),1170,DIM),p) for k,(v,label,p) in enumerate(zip(sequences,['start','append 6','replace 6 with 2','append 7','replace 7 with 3','append 8'],[None,(0,'six',0),(0,'two',0),(1,'seven',0),(1,'three',0),(1,'eight',0)]))]
    elif n==19:
        d['A']=[(words(['a','x','b','y'],520)+words(['a','b','y'],860)+note('a → b → y · length 3',1170),None)]
        d['B']=[(branch('a','TAKE','SKIP')+note('4 letters → 16 candidate subsets',1160,BAD,39),None)]
        d['C']=[(grid(['a','ax','axb','axby'],['a','ab','aby'],[['·']*3 for _ in range(4)],scale=120)+note('one state per prefix pair',1180,BAD,38),None)]
        d['D']=[(grid(['a','b'],['a','b'],[[1,1],[1,2]],active=(1,1),scale=190)+note('match → diagonal + 1',1110),None),(grid(['a','x'],['a','b'],[[1,1],[1,1]],active=(1,1),scale=190)+note('mismatch → max(up, left)',1110),(2,None,0))]
        rows=[[1,1,1],[1,1,1],[1,2,2],[1,2,3]]
        d['E']=[(grid(['a','x','b','y'],['a','b','y'],[r if i<=k else ['·']*3 for i,r in enumerate(rows)],active=(k,2),scale=120)+note('bottom right = 3' if k==3 else 'fill prefixes from smaller states',1180,GOOD,36),p) for k,p in [(0,None),(1,(1,'x',0)),(2,(2,'b',0)),(3,(2,'y',0))]]
    elif n==20:
        d['A']=[(words(['ca','rs'],540)+words(['car','ca','rs'],860)+note('cars = ca | rs → true',1170),None)]
        d['B']=[(words(['car','s'],510)+note('dead end · s not in dictionary',760,BAD,38)+words(['ca','rs'],875)+note('whole string covered',1160),None)]
        d['C']=[(words(['car','s'],545)+note('longest prefix leaves an invalid suffix',820,BAD,35)+words(['ca','rs'],950),None)]
        d['D']=[(words(['c','a','r','s'],500)+vals('D',['T','F','T','·','·'],840,'reachable prefix lengths 0…4')+note('reachable[2] AND exact "rs" → reach 4',1170,GOOD,34),None)]
        flags=['T','F','T','T','T']
        d['E']=[(words(['c','a','r','s'],500)+vals(f'Ew{k}',[v if i<=k else '·' for i,v in enumerate(flags)],840,'reachable prefix lengths',selected=(k,))+note(label,1170,GOOD,38),p) for k,label,p in [(0,'empty prefix → true',None),(1,'"c" → false',(0,'one',0)),(2,'"ca" from 0 → true',(1,'two',0)),(3,'"car" from 0 → true',(1,'three',0)),(4,'"rs" from 2 → true',(2,'four',0))]]
    elif n==21:
        d['A']=[(vals('A',[1,2],480,'Given array · target 4')+words(['1+1+1+1','1+1+2','1+2+1'],790)+words(['2+1+1','2+2'],1010),None)]
        d['B']=[(branch(4,3,2)+note('append 1 or 2 · explore every path',1160,DIM,38),None)]
        d['C']=[(words(['1,1,2','2,1,1'],540)+note('different order → different sequence',830,BAD,35)+boxlabel(340,950,330,'REPEATED TOTAL',2,BAD),None)]
        d['D']=[(boxlabel(100,520,370,'LAST VALUE 1','ways[3]')+boxlabel(550,520,370,'LAST VALUE 2','ways[2]',GOOD)+arrow(285,720,505,880)+arrow(735,720,505,880)+boxlabel(340,910,330,'ways[4]','3 + 2',GOOD),None)]
        seq=[1,1,2,3,5]
        d['E']=[(vals(f'E{k}',[v if i<=k else '·' for i,v in enumerate(seq)],650,'ways · target index',selected=(k,))+note(label,1050)+note('total outer · values inner',1170,DIM,36),p) for k,label,p in [(0,'ways[0] = 1 · empty sequence',None),(1,'ways[1] = ways[0] = 1',(0,'one',0)),(2,'ways[2] = 1 + 1 = 2',(1,'two',0)),(3,'ways[3] = 2 + 1 = 3',(1,'three',0)),(4,'ways[4] = 3 + 2 = 5',(2,'four',0))]]
    return d

def build(n):
    rid=f'b{n:03}';lesson=json.loads((BASE/rid/'lesson.json').read_text(encoding='utf-8'));folder=lesson['folder'];r=TEAM/'reels'/folder
    d=diagrams(n);sc={};motion='''
function cue(scene,phrase,word=null,occurrence=0){
 const p=P[scene][phrase];if(!p)throw Error('missing phrase '+scene+phrase);
 if(word===null)return p.s;
 const hits=R.caps.filter(c=>c.scene===scene&&c.s>=p.s&&c.s<p.e&&c.t.toLowerCase().replace(/[^a-z0-9]/g,'')===word.toLowerCase());
 if(!hits[occurrence])throw Error('missing word '+scene+phrase+' '+word+' #'+occurrence);
 return hits[occurrence].s;
}
'''
    for key,frames in d.items():
        # Fewer words, larger pictures: all important labels remain above captions.
        headings={'A':lesson['title'],'B':'Brute force','C':'Where it costs','D':'Why the optimization works','E':'Follow the same input'}
        subtitles={'A':'Input → required output','B':'Correct baseline · explicit choices','C':'Repeated work or a concrete trap','D':'Preserve the invariant','E':'Chronological state changes'}
        heading=headings[key];heading_size=58 if len(heading)>25 else 66
        sc[key]=text(90,330,heading,heading_size)+text(90,395,subtitles[key],34,DIM)
        ts=[]
        for i,(body,point) in enumerate(frames):
            sid=f'{key}-step{i}';sc[key]+=state(sid,body)
            if point is None:t=f'S.{key}'
            else:t=f'cue("{key}",{point[0]},{json.dumps(point[1])},{point[2]})'
            ts.append(t)
        motion+=f'// diagram: {key}\n'
        for i,t in enumerate(ts):
            end=ts[i+1] if i+1<len(ts) else f'S.{chr(ord(key)+1)}'
            motion+=f'step("#{key}-step{i}",{t},{end});\n'
    source=(r/'solution.py').read_text(encoding='utf-8').splitlines()
    start=next(i+2 for i,l in enumerate(source) if l.startswith('    def '));last=len(source)
    # Preserve raw source in the audit; long lines wrap visibly with an editor arrow.
    split={17:10,19:6,20:9}.get(n)
    if split:
        sc['F']=title('Accepted Python','Exact submitted source · phrase-synced chunks')
        sc['F']+=state('F-code-init',accepted_code_panel(r,'codeF0',start,split,y=495,size=32,gap=48))
        sc['F']+=state('F-code-core',accepted_code_panel(r,'codeF1',split if n==17 else split+1,last,y=495,size=31,gap=47))
        sc['G']=title('Accepted Python · result','Exact submitted code · continuation')+accepted_code_panel(r,'codeG',split+1,last,y=495,size=31,gap=47)
    else:
        font={12:42,14:37}.get(n,32);gap={12:65,14:57}.get(n,48)
        sc['F']=title('Accepted Python',lesson['slug'])+accepted_code_panel(r,'codeF',start,last,y=495,size=font,gap=gap)
        if n==18:sc['F']+=text(105,450,'from bisect import bisect_left',31,ACC,extra='font-family="Code"')
        sc['G']=title('Cost and boundary','Same algorithm · honest complexity')+accepted_code_panel(r,'codeG',start,last,y=495,size=font,gap=gap)
    complexities={12:'k removals · O(1) scalars',13:'O(n) time · O(n) output',14:'O(n) time · O(1) extra',15:'32 rounds · O(1) extra',16:'O(n) time · O(1) extra',17:'O(A × M) time · O(A) extra',18:'O(n log n) time · O(n) extra',19:'O(m × n) time · O(m × n) extra',20:'O(n × M × L) time · O(n) extra',21:'O(A × M) time · O(A) extra'}
    sc['G']+=note(complexities[n],1200,GOOD,39)
    motion+='// diagram: F\n// diagram: G\n'
    motion+='function codeFocus(prefix,lines,t){tl.set("[id^="+prefix+"-L] .code-highlight",{opacity:0},t);lines.forEach(n=>tl.set("#"+prefix+"-L"+n+" .code-highlight",{opacity:.2},t));}\n'
    if split:
        pivot={17:'P.F[1].s',19:'P.F[1].s',20:'cue("F",0,"negative")',21:'cue("F",0,"value")'}[n]
        motion+=f'step("#F-code-init",S.F,{pivot});step("#F-code-core",{pivot},S.G);\n'
        if n==17:
            motion+='codeFocus("codeF0",[8,9,10],S.F);codeFocus("codeF1",[10,11],P.F[1].s);codeFocus("codeF1",[11],P.F[2].s);\n'
        if n==19:
            motion+='codeFocus("codeF0",[3,4,5,6],S.F);codeFocus("codeF1",[7,8],P.F[1].s);codeFocus("codeF1",[9,10],cue("F",1,"else"));codeFocus("codeF1",[9,10],P.F[2].s);\n'
        if n==20:
            motion+='codeFocus("codeF0",[8,9],S.F);codeFocus("codeF1",[10,11],cue("F",0,"negative"));codeFocus("codeF1",[11],P.F[1].s);codeFocus("codeF1",[12],cue("F",1,"true"));codeFocus("codeF1",[13],cue("F",1,"break"));codeFocus("codeF1",[14],P.F[2].s);\n'
        if n==21:
            motion+='codeFocus("codeF0",[8,9],S.F);codeFocus("codeF1",[10],cue("F",0,"value"));codeFocus("codeF1",[11],cue("F",0,"otherwise"));tl.set("#F-code-core",{opacity:0},P.F[1].s);step("#F-code-init",P.F[1].s,S.G);codeFocus("codeF0",[8,9],P.F[1].s);\n'
        motion+=f'codeFocus("codeG",[{last}],S.G);codeFocus("codeG",[],P.G[1].s);\n'
    else:
        if n==18:
            motion+='codeFocus("codeF",[9],S.F);codeFocus("codeF",[10,11],cue("F",0,"append"));codeFocus("codeF",[12,13],cue("F",0,"otherwise"));codeFocus("codeF",[13],P.F[1].s);\n'
            motion+='codeFocus("codeG",[14],S.G);codeFocus("codeG",[],P.G[1].s);\n'
        if n==21:
            motion+='codeFocus("codeF",[8,9],S.F);codeFocus("codeF",[10],cue("F",0,"value"));codeFocus("codeF",[11],cue("F",0,"otherwise"));codeFocus("codeF",[8,9],P.F[1].s);codeFocus("codeG",[12],S.G);codeFocus("codeG",[],P.G[1].s);\n'
    for key,first,end in [('F',start,split or last),('G',split+1 if split else start,last)]:
        if split or n in (18,21):continue
        nums=list(range(first,end+1));count=len(nums)
        # Sequential source highlights follow phrase arrivals; full body stays readable.
        for pi in range(len(lesson['copy'][key].split('|'))):
            chosen=nums[min(pi*count//len(lesson['copy'][key].split('|')),count-1)]
            motion+=f'tl.set("#code{key} .code-highlight",{{opacity:0}},cue("{key}",{pi}));\n' if False else f'tl.set("[id^=code{key}-L] .code-highlight",{{opacity:0}},cue("{key}",{pi}));tl.set("#code{key}-L{chosen} .code-highlight",{{opacity:.2}},cue("{key}",{pi}));\n'
    des=lesson['descriptions'];plan='# Visual plan — '+lesson['title']+'\n\n'+''.join(f'- {k}: {v}\n' for k,v in des.items())
    compose(rid,folder,sc,motion,des,plan)
    result=audit_screen_code(r)
    assert result['has_on_screen_code'] and result['method_body_complete'],result

if __name__=='__main__':
    for n in map(int,sys.argv[1:] or range(12,22)):build(n)
