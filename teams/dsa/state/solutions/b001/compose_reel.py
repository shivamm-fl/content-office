"""Build editable, deterministic HTML from the real narration timings and tested example trace."""
import html, json
from pathlib import Path

TEAM = Path(__file__).resolve().parents[3]
R = TEAM / "reels/b001_two_sum"
D = json.loads((R / "data.json").read_text(encoding="utf-8"))["hi"]
S = D["starts"]
TOTAL = D["total"]
P = D["ph"]
ACC, INK, DIM, GOOD, BAD, PANEL = "#A78BFA", "#F3EFE6", "#9DAEC5", "#6FD3A6", "#E5735F", "#172239"

def text(x,y,s,size=48,color=INK,anchor="start",extra=""):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" text-anchor="{anchor}" {extra}>{html.escape(str(s))}</text>'
def rect(x,y,w,h,fill=PANEL,stroke="#34425D",id="",rx=14):
    return f'<rect {f"id={json.dumps(id)}" if id else ""} x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def line(x1,y1,x2,y2,color=DIM,w=4,extra=""):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}" {extra}/>'
def group(id,s): return f'<g id="{id}" class="{"state" if id != "D-sum" else "fixed"}">{s}</g>'
def title(a,b=""):
    return text(90,330,a,78)+ (text(90,390,b,36,DIM) if b else "")
def array(prefix,nums=(4,1,8,6),y=500):
    out=""
    start=100 if len(nums)==4 else 300
    for i,x in enumerate(nums):
        left=start+i*205
        out+=rect(left,y,180,145,id=f"{prefix}-c{i}")+text(left+90,y+102,x,85,INK,"middle")+text(left+90,y+205,i,40,DIM,"middle")
    out+=text(90,y+205,"index",30,DIM) if len(nums)==2 else text(85,y-35,"nums",34,DIM)
    return out
def target(y=440): return text(895,y,"target 14",43,ACC,"end")
def mapbox(prefix,rows,highlight=None,y=820):
    out=text(155,y-28,"SEEN VALUE",30,DIM)+text(785,y-28,"INDEX",30,DIM,"end")
    for k,(v,i) in enumerate(rows):
        yy=y+k*78
        out+=rect(135,yy,690,68,stroke=GOOD if v==highlight else "#34425D",id=f"{prefix}-row{k}",rx=10)
        out+=text(180,yy+49,v,43,GOOD if v==highlight else INK)+text(785,yy+49,i,43,GOOD if v==highlight else INK,"end")
        out+=line(300,yy+34,650,yy+34,"#52617D",2)+text(670,yy+48,"→",36,DIM)
    return out

scenes={}
scenes['A']=title("Two Sum", "Do we need every pair?")+target(455)+array('A',y=535)+rect(180,870,650,130,stroke=ACC)+text(505,955,"indices [?, ?]",63,INK,"middle")+text(505,1090,"i ≠ j",58,ACC,"middle")
scenes['B']=title("Try every pair", "Brute force · same example")+target()+array('B')
for k,(i,j,total) in enumerate([(0,1,5),(0,2,12),(0,3,10),(1,2,9),(1,3,7),(2,3,14)]):
    col=GOOD if total==14 else INK
    eq=text(505,845,f"CHECK {k+1} / 6",34,DIM,"middle")+text(505,960,f"{[4,1,8,6][i]} + {[4,1,8,6][j]} = {total}",86,col,"middle")
    eq+=text(505,1080,"[2, 3]" if total==14 else "≠ 14",58,col,"middle")
    scenes['B']+=group(f'B-pair{k}',eq)
scenes['C']=title("Correct. Too much work.","Repeated search grows quadratically")
scenes['C']+=array('C',y=455)
for i,j in [(0,1),(0,2),(0,3),(1,2),(1,3),(2,3)]:
    a,b=190+i*205,190+j*205
    scenes['C']+=f'<path d="M {a} 690 Q {(a+b)/2} {740+(j-i)*12} {b} 690" fill="none" stroke="{ACC}" stroke-width="4" opacity=".6"/>'
scenes['C']+=text(505,825,"n(n − 1) / 2",70,INK,"middle")+text(505,930,"n = 10,000",48,DIM,"middle")+text(505,1040,"49,995,000",96,BAD,"middle")+text(505,1100,"pair comparisons · worst case",34,DIM,"middle")
scenes['D']=title("Only one partner fits", "Change the question")
scenes['D']+=group('D-sum',text(505,620,"x + need = 14",84,INK,"middle"))
scenes['D']+=group('D-need',rect(115,720,780,150,stroke=ACC)+text(505,820,"need = 14 − x",79,ACC,"middle"))
scenes['D']+=group('D-question',text(505,1010,"Seen this value?",66,INK,"middle")+text(505,1080,"not: search every partner",37,DIM,"middle"))
scenes['E']=title("Remember the past", "Hash map: value → index")+array('E',y=455)
scenes['E']+=line(190,690,190,724,ACC,5,extra='marker-end="url(#arrow)"')+mapbox('E',[(4,0),(1,1),(8,2)],y=795)
scenes['E']+=text(505,1120,"LOOKUP, NOT RESCAN",40,ACC,"middle")
scenes['F']=title("One pass", "Check → then store")+target()+array('F',y=470)
for k,(x,need,rows) in enumerate([(4,10,[]),(1,13,[(4,0)]),(8,6,[(4,0),(1,1)])]):
    body=text(505,765,f"14 − {x} = {need}",58,ACC,"middle")
    body+=mapbox(f'F{k}',rows,y=855) if rows else rect(135,855,690,85)+text(480,913,"empty",40,DIM,"middle")
    body+=text(505,1110,f"{need} not seen → store {x}",39,INK,"middle")
    scenes['F']+=group(f'F-step{k}',body)
scenes['G']=title("Partner found", "Six looks for eight")+target()+array('G',y=470)
scenes['G']+=text(505,765,"14 − 6 = 8",58,ACC,"middle")+mapbox('G',[(4,0),(1,1),(8,2)],highlight=8,y=830)
scenes['G']+=group('G-answer',rect(180,1110,650,100,stroke=GOOD)+text(505,1182,"return [2, 3]",59,GOOD,"middle"))
scenes['H']=title("Check before storing", "The same element cannot pair with itself")+target()+array('H',[7,7],y=500)
scenes['H']+=group('H-wrong',text(505,850,"store → check",54,BAD,"middle")+text(505,965,"[0, 0]",88,BAD,"middle")+line(325,930,685,990,BAD,7)+text(505,1070,"same index twice",40,DIM,"middle"))
scenes['H']+=group('H-right',text(505,850,"check → store",54,GOOD,"middle")+text(505,970,"[0, 1]",88,GOOD,"middle")+text(505,1070,"previous elements only",40,DIM,"middle"))
scenes['I']=title("The trade-off", "Fewer searches. More memory.")
scenes['I']+=text(90,485,"TIME",35,DIM)+text(90,565,"O(n²) → O(n)",77,ACC)+text(90,620,"hash map: average time",35,DIM)
code_lines=(R/'solution.py').read_text(encoding='utf-8').splitlines()[5:11]
code_lines=[l[8:] if l.startswith('        ') else l for l in code_lines]
scenes['I']+=rect(80,685,865,385,fill="#101B2D")+rect(89,695,844,55,fill="#314065",stroke="#314065",id="I-highlight",rx=6)
for k,l in enumerate(code_lines): scenes['I']+=text(105,735+k*56,l,35,INK,extra='font-family="Code" xml:space="preserve"')
scenes['I']+=text(90,1160,"EXTRA SPACE  O(n)",48,INK)

caps=[]; buf=[]
for c in D['caps']:
    if buf and (len(buf)>=3 or len(' '.join(x['t'] for x in buf+[c]))>22 or buf[-1]['scene']!=c['scene']):
        caps.append(buf);buf=[]
    buf.append(c)
if buf:caps.append(buf)
caption_html=''
for i,chunk in enumerate(caps):
    spans=' '.join(f'<span id="w{i}-{j}">{html.escape(c["t"])}</span>' for j,c in enumerate(chunk))
    caption_html+=f'<div class="clip caption" id="cap{i}" data-track-index="2" data-track-kind="captions" data-start="{chunk[0]["s"]}" data-duration="{chunk[-1]["e"]-chunk[0]["s"]}">{spans}</div>\n'

parts=[]
for i,(sc,content) in enumerate(scenes.items()):
    end=S[list(scenes)[i+1]] if i+1<len(scenes) else TOTAL
    parts.append(f'<section id="scene-{sc}" class="clip" data-start="{S[sc]}" data-duration="{end-S[sc]:.3f}" data-track-index="1" data-track-kind="graphics"><div class="visual" id="v{sc}"><svg viewBox="0 0 1080 1920" width="1080" height="1920" role="img" aria-label="{sc} teaching diagram"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="{ACC}"/></marker></defs>{content}</svg></div></section>')

js="""
const R=window.REEL.hi, S=R.starts, P=R.ph;
const tl=gsap.timeline({paused:true});
const order=Object.keys(P);
order.forEach((s,i)=>{tl.set('#v'+s,{opacity:1},S[s]);if(i<order.length-1)tl.set('#v'+s,{opacity:0},S[order[i+1]]);});
tl.fromTo('#progress',{scaleX:0},{scaleX:1,duration:R.total,ease:'none'},0);
function reveal(id,t,d=.32){tl.fromTo(id,{opacity:0,y:12},{opacity:1,y:0,duration:d,ease:'power2.out'},t);}
function step(id,t,end){tl.set(id,{opacity:1},t);tl.set(id,{opacity:0},end);}
function cells(prefix,indices,t,col){indices.forEach(i=>tl.to('#'+prefix+'-c'+i,{attr:{stroke:col,fill:col==='#6FD3A6'?'#173B35':'#30264C'},duration:.22},t));}
// diagram: A
cells('A',[0],S.A+1.0,'#A78BFA');cells('A',[1],S.A+2.2,'#A78BFA');cells('A',[2],S.A+3.5,'#A78BFA');cells('A',[3],S.A+4.7,'#A78BFA');
// diagram: B
const pairs=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const b0=P.B[1].s, bend=P.B[2].s, bTimes=[b0,b0+1.0,b0+1.9,bend,bend+.65,bend+1.3];
pairs.forEach((p,k)=>{const t=bTimes[k],end=k<5?bTimes[k+1]:S.C;step('#B-pair'+k,t,end);tl.set('[id^="B-c"]',{attr:{stroke:'#34425D',fill:'#172239'}},t);cells('B',p,t,k===5?'#6FD3A6':'#A78BFA');});
// diagram: C
reveal('#vC svg > text:last-of-type',P.C[1].s);tl.fromTo('#vC path',{opacity:.1},{opacity:.65,stagger:.15,duration:.45},S.C+.4);
// diagram: D
reveal('#D-need',P.D[0].s+1.8);reveal('#D-question',P.D[1].s);
// diagram: E
['E-row0','E-row1','E-row2'].forEach((id,i)=>reveal('#'+id,P.E[0].s+.7+i*.55));
// diagram: F
const fTimes=[S.F,P.F[1].s,P.F[1].s+1.3];
fTimes.forEach((t,k)=>{step('#F-step'+k,t,k<2?fTimes[k+1]:S.G);tl.set('[id^="F-c"]',{attr:{stroke:'#34425D',fill:'#172239'}},t);cells('F',[k],t,'#A78BFA');});
// diagram: G
cells('G',[3],S.G+.2,'#A78BFA');cells('G',[2],P.G[0].s+1.3,'#6FD3A6');reveal('#G-answer',P.G[2].s);
// diagram: H
step('#H-wrong',P.H[1].s,P.H[2].s);step('#H-right',P.H[2].s,S.I);cells('H',[0],P.H[1].s,'#E5735F');cells('H',[0,1],P.H[2].s,'#6FD3A6');
// diagram: I
// Code highlight sweep adapted from the installed registry block to this exact accepted source.
tl.to('#I-highlight',{y:112,duration:.4,ease:'power2.inOut'},P.I[0].s+1.0);
tl.to('#I-highlight',{y:280,duration:.4,ease:'power2.inOut'},P.I[1].s);
window.__timelines=window.__timelines||{};window.__timelines.main=tl;
"""
for i,chunk in enumerate(caps):
    js+=f"tl.set('#cap{i}',{{opacity:1}},{chunk[0]['s']});tl.set('#cap{i}',{{opacity:0}},{chunk[-1]['e']+.06});\n"
    for j,c in enumerate(chunk):
        js+=f"tl.set('#w{i}-{j}',{{color:'{ACC}'}},{c['s']});\n"

html_out=f'''<!doctype html>
<html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>Blind 75 01 — Two Sum</title>
<script src="assets/gsap.min.js"></script><script src="data.js"></script>
<style>
@font-face{{font-family:Head;src:url('fonts/SpaceGrotesk.ttf');font-weight:300 700}}
@font-face{{font-family:Code;src:url('fonts/JetBrainsMono.ttf');font-weight:100 800}}
@font-face{{font-family:Hindi;src:url('fonts/NotoSansDevanagari.ttf')}}
*{{box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#0B1220}}
#root{{position:relative;width:1080px;height:1920px;background:#0B1220;color:{INK};font-family:Head,Hindi,sans-serif}}
.clip,.visual{{position:absolute;inset:0}}.visual,.state{{opacity:0}}svg{{font-family:Head,Hindi,sans-serif;font-weight:600}}
#series{{position:absolute;left:90px;top:178px;font:600 30px Head;letter-spacing:2px;color:{ACC};z-index:20}}
#handle{{position:absolute;right:140px;top:180px;font:500 28px Head;color:{DIM};z-index:20}}
#caption-lane{{position:absolute;left:75px;top:1248px;width:870px;height:145px;z-index:30}}
.caption{{position:absolute;left:0;top:0;width:870px;text-align:center;font-size:65px;font-weight:700;line-height:1.12;color:{INK};opacity:0}}
#progress-track{{position:absolute;left:90px;top:1445px;width:850px;height:5px;background:#25334D}}
#progress{{height:5px;width:850px;background:{ACC};transform-origin:left}}
</style></head><body>
<main id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
<div id="series">BLIND 75 · 01 / 75</div><div id="handle">@dsa.learnvora</div>
{''.join(parts)}
<div id="caption-lane" data-track-kind="captions">{caption_html}</div>
<div id="progress-track"><div id="progress"></div></div>
<audio class="clip" id="voice" data-track-index="3" data-track-kind="audio" src="audio/hi/voice.wav" data-start="0" data-duration="{TOTAL}"></audio>
<audio class="clip" id="bed" data-track-index="4" data-track-kind="audio" src="audio/hi/bed.wav" data-start="0" data-duration="{TOTAL}"></audio>
<audio class="clip" id="sfx" data-track-index="5" data-track-kind="audio" src="audio/hi/sfx.wav" data-start="0" data-duration="{TOTAL}"></audio>
</main><script>{js}</script></body></html>'''
(R/'index.html').write_text(html_out,encoding='utf-8')
(R/'SPEC.md').write_text(f'''GOAL: Explain why remembering seen values removes Two Sum's repeated partner search.
OUTPUT: 1080x1920, 30fps, {TOTAL}s. Actual accepted Python source and original [4,1,8,6] target 14 trace.
LOOK: Learnvora navy #0B1220, ivory #F3EFE6, violet #A78BFA. Space Grotesk 78px headings, 85px array values, 35px code. No gradients/glow.
MOTION: exact phrase times, 0.22s cell outlines, 0.32s object arrival, power2.out. Hard scene cuts.
SOUND: owner's established ElevenLabs voice at the saved owner_tempo 0.9; cached raw phrases. Bundled bed ducked under narration, contextual click/confirmation cues.
BANNED: decorative particles, glow, three marketing cards, invented runtimes, generic brand end card, code different from Accepted submission.
QA: every scene midpoint; pair order/count, complement lookups, separate duplicate indices, code and average-time qualification. Captions must remain readable on a phone.
''',encoding='utf-8')
(R/'visual_plan.md').write_text('''# Visual plan: Blind 75 01 — Two Sum
One input explains the baseline and optimized algorithm. Voice leads each state change.

| Scene | Spoken | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | Problem and target | Four indexed array cells show the input beside a target and two unknown output slots | target, indices | custom SVG |
| B | Brute force | Two cell outlines step through six unique pairs and the last sum matches fourteen | CHECK, indices | custom SVG and GSAP |
| C | Repeated work | All pair arcs fill the same array then the combination formula produces the real worst-case count | n, comparisons | custom SVG |
| D | Specific partner | The addition equation rearranges into the required complement and a lookup question | need | custom SVG and GSAP |
| E | Remember seen values | Previous array cells connect to a dictionary table mapping values to their original indices | VALUE, INDEX | custom SVG |
| F | First three iterations | Current array cell advances while missing complements appear and the remembered table grows | not seen, store | custom SVG and GSAP |
| G | Match and return | Six requests eight; the saved eight row and index two connect to current index three | return | custom SVG and GSAP |
| H | Check before store | Duplicate seven cells contrast invalid self-match with two distinct result indices | check, store | custom SVG and GSAP |
| I | Complexity and source | Exact accepted code shows a highlight moving from lookup to insertion with average time and extra space | TIME, SPACE | registry code-highlight adapted |
''',encoding='utf-8')
print(f'Composed {len(scenes)} scenes, {len(caps)} caption groups, {TOTAL}s using real voice timings.')
