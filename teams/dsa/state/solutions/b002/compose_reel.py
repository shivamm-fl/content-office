"""Stock-profit lesson: actual accepted source, real trace and voice timings."""
import html, json
from pathlib import Path

HERE=Path(__file__).resolve().parent
R=HERE.parents[2]/'reels/b002_stock_profit'
D=json.loads((R/'data.json').read_text(encoding='utf-8'))['hi']
S,P,T=D['starts'],D['ph'],D['total']
ACC,INK,DIM,GOOD,BAD,PANEL='#A78BFA','#F3EFE6','#9DAEC5','#6FD3A6','#E5735F','#172239'
def text(x,y,s,size=48,color=INK,anchor='start',extra=''):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" text-anchor="{anchor}" {extra}>{html.escape(str(s))}</text>'
def rect(x,y,w,h,fill=PANEL,stroke='#34425D',id='',rx=14):
    return f'<rect id="{id}" x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def line(x1,y1,x2,y2,color=DIM,w=4):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}"/>'
def title(a,b=''):
    return text(90,330,a,73)+text(90,395,b,35,DIM)
def state(id,body):return f'<g class="state" id="{id}">{body}</g>'
def cells(prefix,nums=(8,3,6,2,7),y=485):
    w=150; gap=170; x0=115
    if len(nums)==3:w=200;gap=240;x0=185
    out=text(90,y-30,'PRICE',30,DIM)
    for i,p in enumerate(nums):
        x=x0+i*gap
        out+=rect(x,y,w,125,id=f'{prefix}-c{i}')+text(x+w/2,y+87,p,72,INK,'middle')+text(x+w/2,y+177,f'D{i+1}',32,DIM,'middle')
    return out
def chart(prefix,nums=(8,3,6,2,7),ybase=930):
    xs=[180+170*i for i in range(len(nums))]
    ys=[ybase-p*41 for p in nums]
    out=line(125,ybase,910,ybase,'#52617D',3)
    for i in range(len(nums)-1):out+=line(xs[i],ys[i],xs[i+1],ys[i+1],DIM,5)
    for i,(x,y) in enumerate(zip(xs,ys)):
        out+=line(x,ybase,x,y,'#26364F',2)+f'<circle id="{prefix}-p{i}" cx="{x}" cy="{y}" r="11" fill="{ACC}"/>'+text(x,y-26,nums[i],43,INK,'middle')+text(x,ybase+50,f'D{i+1}',31,DIM,'middle')
    return out

plan='''# Visual plan — Blind 75 02: Stock Profit
One original chronological price sequence survives both algorithms. Minimum and profit remain distinct.

| Scene | Spoken | Picture | Labels | Built with |
|---|---|---|---|---|
| A | One buy then later sell | A price line connects five dated points with a forward-only transaction bracket | BUY, SELL | custom SVG |
| B | Ten chronological pairs | Two outlined array cells step through ten valid pairs and reveal candidate profits | PAIR, PROFIT | custom SVG and GSAP |
| C | Repeated earlier-price scan | Ten pair arcs connect the same row above the computed quadratic operation count | comparisons | custom SVG |
| D | Cheapest earlier buy | A fixed sell point receives lines from three earlier buy choices, with the cheapest highlighted | SELL, LOWEST | custom SVG |
| E | Track two numbers | The exact accepted loop appears line by line beside different lowest and best registers | LOWEST, BEST | custom SVG and registry code-highlight pattern |
| F | Work the example | Current price advances across five cells while minimum and best-profit registers update | CANDIDATE, BEST | custom SVG and GSAP |
| G | Chronology trap | Three dated price cells cross the invalid backwards transaction, then show a valid forward buy and sell | INVALID, VALID | custom SVG |
| H | Complexity | A single scan cursor crosses five price cells above constant-sized registers and the comparison of time costs | TIME, EXTRA SPACE | custom SVG |
'''
(R/'visual_plan.md').write_text(plan,encoding='utf-8')
sc={}
sc['A']=title('Buy before you sell','One transaction · profit cannot be negative')+chart('A')
sc['A']+=line(350,1065,860,1065,GOOD,5)+text(350,1030,'BUY 3',36,GOOD,'middle')+text(860,1030,'SELL 7',36,GOOD,'middle')+text(605,1145,'sell day > buy day',44,INK,'middle')
sc['B']=title('Try every valid pair','Brute force · buy day < sell day')+cells('B')
pairs=[(i,j) for i in range(5) for j in range(i+1,5)]
for k,(i,j) in enumerate(pairs):
    nums=[8,3,6,2,7];diff=nums[j]-nums[i]
    b=text(505,800,f'PAIR {k+1} / 10',36,DIM,'middle')+text(505,925,f'{nums[j]} − {nums[i]} = {diff}',85,GOOD if diff>0 else INK,'middle')
    b+=text(505,1040,f'buy D{i+1} → sell D{j+1}',43,DIM,'middle')
    if k==9:b+=text(505,1150,'BEST PROFIT  5',47,GOOD,'middle')
    sc['B']+=state(f'B-p{k}',b)
sc['C']=title('Repeated earlier scans','Correct answer · quadratic work')+cells('C',y=455)
for i,j in pairs:
    x1,x2=190+i*170,190+j*170
    sc['C']+=f'<path d="M{x1} 650 Q{(x1+x2)/2} {710+(j-i)*21} {x2} 650" stroke="{ACC}" stroke-width="3" fill="none" opacity=".65"/>'
sc['C']+=text(505,835,'n(n − 1) / 2',67,INK,'middle')+text(505,930,'n = 100,000',45,DIM,'middle')+text(505,1050,'4,999,950,000',78,BAD,'middle')+text(505,1125,'pair comparisons · worst case',34,DIM,'middle')
sc['D']=title('Fix the sell day','Which earlier buy maximizes profit?')+cells('D')
for i,p in enumerate([8,3,6,2]):
    x=190+i*170
    sc['D']+=line(x,790,850,850,GOOD if i==3 else '#52617D',6 if i==3 else 3)
    sc['D']+=text(x,750,f'7 − {p}',36,GOOD if i==3 else DIM,'middle')
sc['D']+=rect(740,830,220,95,stroke=ACC)+text(850,892,'SELL 7',46,ACC,'middle')
sc['D']+=state('D-low',rect(155,950,700,125,stroke=GOOD)+text(505,1030,'LOWEST EARLIER = 2',49,GOOD,'middle'))
sc['D']+=text(505,1165,'fixed sell − smallest earlier buy',40,INK,'middle')
sc['E']=title('Keep two numbers','Update best, then update lowest')
code=(R/'solution.py').read_text(encoding='utf-8').splitlines()[5:11]
code=[l[8:] if l.startswith('        ') else l for l in code]
sc['E']+=rect(80,475,865,390,fill='#101B2D')+rect(89,488,844,53,fill='#314065',stroke='#314065',id='E-highlight',rx=6)
for k,l in enumerate(code):sc['E']+=text(105,527+k*55,l,31,INK,extra='font-family="Code" xml:space="preserve"')
sc['E']+=rect(110,940,365,160,stroke=GOOD)+rect(535,940,365,160,stroke=ACC)
sc['E']+=text(292,997,'LOWEST',36,GOOD,'middle')+text(292,1065,'buy price',42,INK,'middle')+text(718,997,'BEST',36,ACC,'middle')+text(718,1065,'profit',42,INK,'middle')
sc['F']=title('One chronological pass','prices = [8, 3, 6, 2, 7]')+cells('F')
trace=json.loads((HERE/'local-verification.json').read_text(encoding='utf-8'))['trace']
for k,t in enumerate(trace):
    b=text(505,800,f'CURRENT  {t["price"]}',42,DIM,'middle')
    b+=rect(100,850,390,155,stroke=GOOD)+text(295,905,'LOWEST',33,GOOD,'middle')+text(295,978,t['lowest'],70,GOOD,'middle')
    b+=rect(535,850,390,155,stroke=ACC)+text(730,905,'BEST PROFIT',33,ACC,'middle')+text(730,978,t['best'],70,ACC,'middle')
    earlier=8 if k==0 else min([8,3,6,2,7][:k])
    b+=text(505,1110,f'candidate: {t["price"]} − {earlier} = {t["candidate"]}',46,GOOD if t['candidate']>0 else DIM,'middle')
    sc['F']+=state(f'F-step{k}',b)
sc['G']=title('The chronology trap','Global maximum − minimum can be invalid')+cells('G',[9,1,2])
wrong=line(525,805,285,805,BAD,6)+text(405,765,'BUY 1 → SELL 9?',43,BAD,'middle')+text(405,878,'sell happened first',38,BAD,'middle')
wrong+=line(355,788,455,842,BAD,7)
right=line(525,965,765,965,GOOD,6)+text(645,930,'BUY 1 → SELL 2',42,GOOD,'middle')+text(645,1040,'PROFIT 1',58,GOOD,'middle')
sc['G']+=state('G-wrong',wrong)+state('G-right',right)+state('G-zero',text(505,1160,'[7, 4, 1] → profit 0',46,INK,'middle'))
sc['H']=title('Why the scan works','One current price · two remembered numbers')+cells('H',y=465)
sc['H']+=rect(135,765,300,110,stroke=GOOD)+text(285,837,'lowest',47,GOOD,'middle')+rect(575,765,300,110,stroke=ACC)+text(725,837,'best',47,ACC,'middle')
sc['H']+=text(90,985,'TIME',33,DIM)+text(90,1060,'O(n²) → O(n)',75,ACC)+text(90,1165,'EXTRA SPACE  O(1)',49,INK)

caps=[];buf=[]
for c in D['caps']:
    if buf and (len(buf)>=3 or len(' '.join(x['t'] for x in buf+[c]))>22 or buf[-1]['scene']!=c['scene']):caps.append(buf);buf=[]
    buf.append(c)
if buf:caps.append(buf)
captions=''
for i,ch in enumerate(caps):
    spans=' '.join(f'<span id="w{i}-{j}">{html.escape(c["t"])}</span>' for j,c in enumerate(ch))
    captions+=f'<div class="clip caption" id="cap{i}" data-track-index="2" data-track-kind="captions" data-start="{ch[0]["s"]}" data-duration="{ch[-1]["e"]-ch[0]["s"]}">{spans}</div>\n'
parts=[]
for i,(s,body) in enumerate(sc.items()):
    end=S[list(sc)[i+1]] if i+1<len(sc) else T
    parts.append(f'<section id="scene-{s}" class="clip" data-start="{S[s]}" data-duration="{end-S[s]:.3f}" data-track-index="1" data-track-kind="graphics"><div class="visual" id="v{s}"><svg viewBox="0 0 1080 1920" width="1080" height="1920" role="img" aria-label="{s} stock-profit diagram">{body}</svg></div></section>')
js='''const R=window.REEL.hi,S=R.starts,P=R.ph;
const tl=gsap.timeline({paused:true});
const order=Object.keys(P);
order.forEach((s,i)=>{tl.set('#v'+s,{opacity:1},S[s]);if(i<order.length-1)tl.set('#v'+s,{opacity:0},S[order[i+1]]);});
tl.fromTo('#progress',{scaleX:0},{scaleX:1,duration:R.total,ease:'none'},0);
function step(id,t,end){tl.set(id,{opacity:1},t);tl.set(id,{opacity:0},end);}
function cell(prefix,i,t,color){tl.to('#'+prefix+'-c'+i,{attr:{stroke:color,fill:color==='#6FD3A6'?'#173B35':'#30264C'},duration:.2},t);}
// diagram: A
tl.to('#A-p1',{attr:{r:17,fill:'#6FD3A6'},duration:.3},P.A[2].s);
tl.to('#A-p4',{attr:{r:17,fill:'#6FD3A6'},duration:.3},P.A[2].s+1);
// diagram: B
const pairs=[[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]];
const bTimes=[S.B,S.B+.7,S.B+1.4,S.B+2.1,P.B[2].s,P.B[2].s+1.3,P.B[2].s+1.8,P.B[2].s+2.3,P.B[2].s+2.8,P.B[2].s+3.3];
pairs.forEach((pair,k)=>{const t=bTimes[k],end=k===9?S.C:bTimes[k+1];step('#B-p'+k,t,end);tl.set('[id^="B-c"]',{attr:{stroke:'#34425D',fill:'#172239'}},t);pair.forEach(i=>cell('B',i,t,k===9?'#6FD3A6':'#A78BFA'));});
// diagram: C
tl.fromTo('#vC path',{opacity:.2},{opacity:.65,stagger:.06,duration:.3},S.C);
// diagram: D
cell('D',4,S.D+.2,'#A78BFA');cell('D',3,P.D[1].s,'#6FD3A6');step('#D-low',P.D[1].s,S.E);
// diagram: E
tl.to('#E-highlight',{y:110,duration:.35},P.E[1].s);
tl.to('#E-highlight',{y:165,duration:.35},P.E[1].s+1.8);
tl.to('#E-highlight',{y:220,duration:.35},P.E[1].s+4);
// diagram: F
const fTimes=[S.F,S.F+.9,P.F[1].s,P.F[2].s,P.F[2].s+1.2];
fTimes.forEach((t,k)=>{step('#F-step'+k,t,k===4?S.G:fTimes[k+1]);tl.set('[id^="F-c"]',{attr:{stroke:'#34425D',fill:'#172239'}},t);cell('F',k,t,k===4?'#6FD3A6':'#A78BFA');});
// diagram: G
step('#G-wrong',S.G,S.H);step('#G-right',P.G[1].s,S.H);step('#G-zero',P.G[2].s,S.H);
cell('G',0,S.G+.3,'#E5735F');cell('G',1,P.G[1].s,'#6FD3A6');cell('G',2,P.G[1].s+1.1,'#6FD3A6');
// diagram: H
[0,1,2,3,4].forEach((i)=>cell('H',i,S.H+i*.4,'#A78BFA'));
window.__timelines=window.__timelines||{};window.__timelines.main=tl;
'''
for i,ch in enumerate(caps):
    js+=f"tl.set('#cap{i}',{{opacity:1}},{ch[0]['s']});tl.set('#cap{i}',{{opacity:0}},{ch[-1]['e']+.03});\n"
    for j,c in enumerate(ch):js+=f"tl.set('#w{i}-{j}',{{color:'{ACC}'}},{c['s']});\n"
audio=''.join(f'<audio class="clip" id="{name}" data-track-index="{i+3}" data-track-kind="audio" src="audio/hi/{name}.wav" data-start="0" data-duration="{T}"></audio>' for i,name in enumerate(['voice','bed','sfx']))
out=f'''<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>Blind 75 02 — Stock Profit</title>
<script src="assets/gsap.min.js"></script><script src="data.js"></script><style>
@font-face{{font-family:Head;src:url('fonts/SpaceGrotesk.ttf');font-weight:300 700}}
@font-face{{font-family:Code;src:url('fonts/JetBrainsMono.ttf');font-weight:100 800}}
@font-face{{font-family:Hindi;src:url('fonts/NotoSansDevanagari.ttf')}}
*{{box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#0B1220}}
#root{{position:relative;width:1080px;height:1920px;background:#0B1220;color:{INK};font-family:Head,Hindi,sans-serif}}
.clip,.visual{{position:absolute;inset:0}}.visual,.state{{opacity:0}}svg{{font-family:Head,Hindi,sans-serif;font-weight:600}}
#series{{position:absolute;left:90px;top:178px;font:600 30px Head;letter-spacing:2px;color:{ACC};z-index:20}}
#handle{{position:absolute;right:140px;top:180px;font:500 28px Head;color:{DIM};z-index:20}}
#source{{position:absolute;left:90px;top:1403px;font:500 27px Head;color:{DIM};z-index:20}}
#caption-lane{{position:absolute;left:75px;top:1248px;width:870px;height:145px;z-index:30}}
.caption{{position:absolute;left:0;top:0;width:870px;text-align:center;font-size:65px;font-weight:700;line-height:1.12;color:{INK};opacity:0}}
#progress-track{{position:absolute;left:90px;top:1460px;width:850px;height:5px;background:#25334D}}
#progress{{height:5px;width:850px;background:{ACC};transform-origin:left}}
</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="{T}" data-width="1080" data-height="1920">
<div id="series">BLIND 75 · 02 / 75</div><div id="handle">@dsa.learnvora</div>
{''.join(parts)}<div id="caption-lane" data-track-kind="captions">{captions}</div><div id="source">Problem: LeetCode #121</div><div id="progress-track"><div id="progress"></div></div>{audio}</main><script>{js}</script></body></html>'''
(R/'index.html').write_text(out,encoding='utf-8')
story=['One buy then later sell; zero if no profitable transaction','Ten chronological pairs; compare differences','Earlier prices repeatedly scanned; n(n-1)/2 operations','For fixed sell, smallest earlier buy maximizes the difference','Exact accepted loop and distinct lowest-price/best-profit registers','Real [8,3,6,2,7] trace returns five','Global max-minus-min violates chronology on [9,1,2]; falling prices return zero','Single scan, O(n) time and O(1) extra space']
board='# Storyboard — Blind 75 02: Stock Profit\n\nOwner voice, saved tempo 0.9. Exact LeetCode Accepted source #2187018088 (213/213).\n\n| Scene | Seconds | Viewer learns |\n|---|---|---|\n'
for i,(s,desc) in enumerate(zip(sc,story)):
    end=S[list(sc)[i+1]] if i+1<len(sc) else T
    board+=f'| {s} | {S[s]:.1f}–{end:.1f} | {desc} |\n'
(R/'STORYBOARD.md').write_text(board,encoding='utf-8')
(R/'SPEC.md').write_text(f'''GOAL: Explain why the cheapest earlier buy replaces all earlier-price scans.
OUTPUT: 1080x1920, 30fps, {T}s, owner's established voice at tempo 0.9.
STORY: Same original [8,3,6,2,7] example through valid pairs, quadratic count, prefix minimum, exact loop, trace and chronology trap.
LOOK: #0B1220 navy, #F3EFE6 ivory, #A78BFA current, #6FD3A6 successful, #E5735F invalid. 73px headings, 72px values, 31px code, 65px captions.
MOTION: Phrase-synced states, .2s outlines, .35s code highlight; deterministic hard scene cuts.
SOUND: ElevenLabs owner's authorized voice, Flash v2.5, saved owner_tempo 0.9; bundled ducked bed and restrained action cues.
BANNED: gradients, glow, particles, brand outro, invented runtimes/TLE claims, different code, backwards profitable transaction.
SOURCE: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
ACCEPTED: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/submissions/2187018088/
QA: Code hash unchanged, ten i<j pairs, real prefix-min trace, chronology, zero fallback, 60–120s, phone-readable captions. Sound measured, no human listening pass claimed.
''',encoding='utf-8')
print(f'Composed {len(sc)} scenes and {len(caps)} caption groups; {T}s, owner tempo 0.9.')
