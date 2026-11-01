"""Local Blind75 studio: exact browser-observed Accepted source, owner tempo .9.
Production adapter credentials/signatures remain separate. No LeetCode API calls.
"""
import hashlib, hmac, html, json, os, secrets, subprocess, sys, tempfile
from pathlib import Path

BASE=Path(__file__).resolve().parent
TEAM=BASE.parents[1]
ACC,INK,DIM,GOOD,BAD,PANEL='#A78BFA','#F3EFE6','#9DAEC5','#6FD3A6','#E5735F','#172239'

def text(x,y,s,size=48,color=INK,anchor='start',extra=''):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" text-anchor="{anchor}" {extra}>{html.escape(str(s))}</text>'
def rect(x,y,w,h,fill=PANEL,stroke='#34425D',id='',rx=14):
    return f'<rect id="{id}" x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def line(x1,y1,x2,y2,color=DIM,w=4):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}"/>'
def title(a,b=''):
    return text(90,330,a,70)+text(90,395,b,34,DIM)
def state(id,body):return f'<g class="state" id="{id}">{body}</g>'
def array(prefix,nums,y=490,label='nums',start=115,span=810):
    step=span/len(nums);w=step-20
    out=text(90,y-35,label,30,DIM)
    for i,n in enumerate(nums):
        x=start+i*step
        out+=rect(x,y,w,120,id=f'{prefix}-c{i}')+text(x+w/2,y+83,n,65 if len(str(n))<3 else 51,INK,'middle')+text(x+w/2,y+171,i,31,DIM,'middle')
    return out
def boxlabel(x,y,w,label,value,color=ACC):
    return rect(x,y,w,155,stroke=color)+text(x+w/2,y+52,label,32,color,'middle')+text(x+w/2,y+122,value,65,color,'middle')
def codebox(r,lo=5,hi=None,y=485,size=31):
    lines=(r/'solution.py').read_text(encoding='utf-8').splitlines()[lo:hi]
    lines=[l[8:] if l.startswith('        ') else l for l in lines]
    out=rect(80,y,865,54*len(lines)+45,fill='#101B2D')
    for i,l in enumerate(lines):out+=text(105,y+47+i*54,l,size,INK,extra='font-family="Code" xml:space="preserve"')
    return out

def accepted_code_panel(r,prefix,first,last,y=475,size=32,gap=46):
    """Render exact Accepted source lines with editor-style soft wrapping."""
    import textwrap
    source=(r/'solution.py').read_text(encoding='utf-8').splitlines()
    rows=[]
    for number in range(first,last+1):
        raw=source[number-1]
        value=raw[8:] if raw.startswith('        ') else raw
        indent=len(value)-len(value.lstrip())
        wrapped=textwrap.wrap(value,width=44,subsequent_indent=' '*(indent+2),
                              break_long_words=False,break_on_hyphens=False,
                              replace_whitespace=False,drop_whitespace=True) or ['']
        rows.append((number,wrapped))
    count=sum(len(v) for _,v in rows)
    height=35+count*gap
    assert y+height<=1220,(prefix,count,y+height)
    out=rect(80,y,885,height,fill='#101B2D')
    row=0
    for number,wrapped in rows:
        top=y+13+row*gap
        body=f'<rect class="code-highlight" x="88" y="{top}" width="870" height="{gap*len(wrapped)}" rx="5" fill="{ACC}" opacity="0"/>'
        for continuation,part in enumerate(wrapped):
            if continuation:
                mark=y+34+row*gap
                body+=f'<path d="M89 {mark-10} V{mark} H100 M96 {mark-4} L100 {mark} L96 {mark+4}" fill="none" stroke="{DIM}" stroke-width="2"/>'
            body+=text(105,y+42+row*gap,part,size,INK,extra='font-family="Code" xml:space="preserve"')
            row+=1
        out+=f'<g id="{prefix}-L{number}" data-source-line="{number}" data-code-panel="{prefix}">{body}</g>'
    return out

def audit_screen_code(r,require_complete=True):
    sys.path.insert(0,str(TEAM.parents[1]/'runner/scripts'))
    import coding_gate
    result=coding_gate.inspect_visible_code(r,require_complete=require_complete)
    (r/'qa-on-screen-code.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    return result

def prepare(rid,folder):
    here=BASE/rid;r=TEAM/'reels'/folder
    lesson=json.loads((here/'lesson.json').read_text(encoding='utf-8'))
    observed=json.loads((here/'acceptance.json').read_text(encoding='utf-8'))
    code=(here/'solution.py').read_text(encoding='utf-8');digest=hashlib.sha256(code.encode()).hexdigest()
    assert observed['status']=='Accepted' and observed['code_sha256']==digest
    assert observed['item']==rid and observed['slug']==lesson['slug'] and observed['account']=='dsalearnvora'
    assert (here/'leetcode-accepted.png').exists(), 'Save the actual browser proof screenshot first'
    if not r.exists():subprocess.run([sys.executable,'scripts/new_reel.py',folder,lesson['title'],'BLIND 75'],cwd=TEAM,check=True)
    keyfile=Path(tempfile.gettempdir())/f'learnvora-{rid}-local-pilot.key'
    if not keyfile.exists():keyfile.write_text(secrets.token_urlsafe(48),encoding='utf-8')
    secret=keyfile.read_text(encoding='utf-8')
    proof=dict(observed,v=1,kind='accepted',track='blind75',question_id=str(lesson['number']),challenge_date=None,language='python3',proof_scope='local_pilot',verification_method='browser_ui_observed')
    body=json.dumps(proof,ensure_ascii=False,separators=(',',':'))
    token=json.dumps(dict(body=body,sig=hmac.new(secret.encode(),body.encode(),hashlib.sha256).hexdigest()))
    item=dict(id=rid,track='blind75',position=int(rid[1:]),problem=dict(slug=lesson['slug'],question_id=str(lesson['number']),number=str(lesson['number']),title=lesson['title'],difficulty=lesson.get('difficulty','Medium'),url=lesson['sources'][0]),title=lesson['title'],format='problem',solution_code=code,accepted_proof=token,length_target_s=100,teaching=lesson['teaching'],sources=lesson['sources']+[proof['submission_url']],status='planned',qa_passed=False,proof_scope='local_pilot',note='Genuine browser-observed judge result, exact source. Local pilot proof; production adapter is separate.')
    spec=dict(tts='owner',voice='hi-IN-SwaraNeural',pace=1.26,audio='v2',owner_model='eleven_flash_v2_5',owner_tempo=.9,prime='सुनो, ये बहुत interesting है!',tone='calm',hook_type='direct_question',scenes=list(lesson['copy']),min={s:3 for s in lesson['copy']},tail={},copy={'hi':lesson['copy']},cues=lesson.get('cues',[['click','B',0,0],['err','C',1,0],['ok','E',2,0]]),solution_sha256=digest,teaching_scenes=lesson['teaching_scenes'],sources=item['sources'])
    if 'teaching_phrases' in lesson:spec['teaching_phrases']=lesson['teaching_phrases']
    spec['on_screen_code_contract']='complete_method_body'
    for name,value in [('coding.json',item),('spec.json',spec),('browser-verification.json',proof)]:
        (r/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
    (r/'solution.py').write_text(code,encoding='utf-8',newline='\n')
    for p in [r/'script.txt',TEAM/f'state/scripts/{rid}.txt']:p.write_text('\n\n'.join(lesson['copy'].values()),encoding='utf-8')
    sys.path.insert(0,str(TEAM.parents[1]/'runner/scripts'))
    import coding_gate
    ready,detail=coding_gate.check(r,rid,secret)
    assert ready,detail
    print(f'Prepared {rid}: genuine Accepted #{proof["submission_id"]}, {proof["total_testcases"]} tests; saved owner tempo 0.9.')

def record_ui_result(rid,submission_id,count,verified_date):
    """Record an already observed UI verdict; never contacts or simulates the judge."""
    p=BASE/rid;lesson=json.loads((p/'lesson.json').read_text(encoding='utf-8'))
    tests=json.loads((p/'local-verification.json').read_text(encoding='utf-8'))
    digest=hashlib.sha256((p/'solution.py').read_text(encoding='utf-8').encode()).hexdigest()
    assert digest==tests['code_sha256'] and (p/'leetcode-accepted.png').exists()
    observed=dict(item=rid,slug=lesson['slug'],code_sha256=digest,submission_id=submission_id,status='Accepted',account='dsalearnvora',total_testcases=int(count),submission_url=f'https://leetcode.com/problems/{lesson["slug"]}/submissions/{submission_id}/',verification_date=verified_date)
    (p/'acceptance.json').write_text(json.dumps(observed,indent=2),encoding='utf-8')
    print(f'Recorded the already observed UI verdict #{submission_id}; {count}/{count}.')

def voice(folder):
    env=os.environ.copy()
    for l in (TEAM.parents[2]/'ai-course/.env').read_text(encoding='utf-8').splitlines():
        if l.startswith('ELEVENLABS_API_KEY='):env['ELEVENLABS_API_KEY']=l.split('=',1)[1].strip().strip('"\'')
    subprocess.run([sys.executable,'-X','utf8','scripts/make_reel_audio.py','reels/'+folder],cwd=TEAM,env=env,check=True)

def verify(rid,folder):
    import re,shutil
    r=TEAM/'reels'/folder;mp4=TEAM/'reels'/f'{folder}_hi.mp4'
    meta=json.loads(subprocess.check_output([shutil.which('ffprobe'),'-v','error','-show_entries','stream=codec_name,codec_type,width,height,r_frame_rate','-show_entries','format=duration,size','-of','json',str(mp4)],text=True))
    v=next(s for s in meta['streams'] if s['codec_type']=='video');a=next(s for s in meta['streams'] if s['codec_type']=='audio')
    assert (v['width'],v['height'],v['codec_name'],a['codec_name'])==(1080,1920,'h264','aac')
    dur=float(meta['format']['duration']);expected=json.loads((r/'data.json').read_text(encoding='utf-8'))['hi']['total']
    assert 60<=dur<=120 and abs(dur-expected)<.1
    result=subprocess.run([shutil.which('ffmpeg'),'-hide_banner','-nostats','-i',str(mp4),'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True,check=True)
    (r/'qa-audio.log').write_text(result.stderr,encoding='utf-8')
    lufs=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',result.stderr)[-1]);peak=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS',result.stderr)[-1]);assert -17<=lufs<=-12 and peak<=-1,(lufs,peak)
    sys.path.insert(0,str(TEAM.parents[1]/'runner/scripts'));import coding_gate
    key=(Path(tempfile.gettempdir())/f'learnvora-{rid}-local-pilot.key').read_text(encoding='utf-8')
    ok,detail=coding_gate.check(r,rid,key);assert ok,detail
    ck=json.loads((r/'qa-check.json').read_text(encoding='utf-8-sig'));assert ck['ok'] and not ck['browserSkipped']
    caption=json.loads((r/'qa-caption.json').read_text(encoding='utf-8-sig'));assert not any(x['status']=='FAIL' for x in caption['checks'])
    code_review=audit_screen_code(r,require_complete=int(rid[1:])>=4)
    qa=dict(local_pilot_checks_passed=True,production_worker_gate_run=False,owner_approved=False,published=False,duration_s=dur,owner_tempo=.9,loudness_lufs=lufs,true_peak_dbtp_rounded=peak,video=v,accepted_gate=detail,on_screen_code=code_review,human_listening=False,mp4_sha256=hashlib.sha256(mp4.read_bytes()).hexdigest())
    (r/'qa-export-verification.json').write_text(json.dumps(qa,indent=2),encoding='utf-8')
    with (r/'REVIEW.md').open('a',encoding='utf-8') as f:f.write(f'\nFinal export measured: {dur}s, 1080x1920 H.264 30fps + AAC; {lufs} LUFS and rounded {peak} dBTP. Local pilot Accepted/length/media checks pass. Owner approval and production publication remain pending.\n')
    proof=json.loads((BASE/rid/'acceptance.json').read_text(encoding='utf-8'))
    p=BASE/'blind75-next10-progress.json';j=json.loads(p.read_text(encoding='utf-8'))
    j['completed']=list(dict.fromkeys(j['completed']+[rid]));j['remaining']=[x for x in j['requested'] if x not in j['completed']]
    j.update(current=j['remaining'][0] if j['remaining'] else None,status='building_one_by_one' if j['remaining'] else 'all_requested_local_reels_ready_for_owner_review',blocker=None)
    j['code_repair_required']=[x for x in j.get('code_repair_required',[]) if x!=rid]
    if j['code_repair_required']:
        j.update(current=j['code_repair_required'][0],status='repairing_all_missing_on_screen_code')
    j.setdefault('outputs',{})[rid]=dict(mp4=f'reels/{folder}_hi.mp4',duration_s=dur,submission_id=proof['submission_id'],testcases=f'{proof["total_testcases"]}/{proof["total_testcases"]}',owner_approved=False)
    p.write_text(json.dumps(j,indent=2),encoding='utf-8')
    (BASE/rid/'production-status.json').write_text(json.dumps(dict(id=rid,status='ready_for_owner_review_local_pilot',duration_s=dur,owner_tempo=.9,leetcode_accepted=True,submission_id=proof['submission_id'],published=False),indent=2),encoding='utf-8')
    print(f'VERIFIED {rid}: {dur}s; {lufs} LUFS, {peak} dBTP; exact Accepted code. {len(j["completed"])}/10 ready.')

def compose(rid,folder,scenes,motion,descriptions,visual_plan):
    r=TEAM/'reels'/folder
    d=json.loads((r/'data.json').read_text(encoding='utf-8'))['hi'];s=d['starts'];total=d['total']
    assert 60<=total<=120,total
    (r/'visual_plan.md').write_text(visual_plan,encoding='utf-8')
    caps=[];buf=[]
    for c in d['caps']:
        if buf and (len(buf)>=3 or len(' '.join(x['t'] for x in buf+[c]))>22 or buf[-1]['scene']!=c['scene']):caps.append(buf);buf=[]
        buf.append(c)
    if buf:caps.append(buf)
    caphtml='';parts=[]
    for i,ch in enumerate(caps):
        spans=' '.join(f'<span id="w{i}-{j}">{html.escape(c["t"])}</span>' for j,c in enumerate(ch))
        caphtml+=f'<div class="clip caption" id="cap{i}" data-track-index="2" data-track-kind="captions" data-start="{ch[0]["s"]}" data-duration="{ch[-1]["e"]-ch[0]["s"]}">{spans}</div>\n'
    for i,(key,body) in enumerate(scenes.items()):
        end=s[list(scenes)[i+1]] if i+1<len(scenes) else total
        parts.append(f'<section id="scene-{key}" class="clip" data-start="{s[key]}" data-duration="{end-s[key]:.3f}" data-track-index="1" data-track-kind="graphics"><div class="visual" id="v{key}"><svg viewBox="0 0 1080 1920" width="1080" height="1920" role="img" aria-label="{key} teaching diagram">{body}</svg></div></section>')
    js='''const R=window.REEL.hi,S=R.starts,P=R.ph;
const tl=gsap.timeline({paused:true}),order=Object.keys(P);
order.forEach((s,i)=>{tl.set('#v'+s,{opacity:1},S[s]);if(i<order.length-1)tl.set('#v'+s,{opacity:0},S[order[i+1]]);});
tl.fromTo('#progress',{scaleX:0},{scaleX:1,duration:R.total,ease:'none'},0);
function step(id,t,end){tl.set(id,{opacity:1},t);tl.set(id,{opacity:0},end);}
function cell(prefix,i,t,color='#A78BFA'){tl.to('#'+prefix+'-c'+i,{attr:{stroke:color,fill:color==='#6FD3A6'?'#173B35':'#30264C'},duration:.2},t);}
function reset(prefix,t){tl.set('[id^="'+prefix+'-c"]',{attr:{stroke:'#34425D',fill:'#172239'}},t);}
function reveal(id,t){tl.fromTo(id,{opacity:0,y:10},{opacity:1,y:0,duration:.3,ease:'power2.out'},t);}
'''+motion
    js+='\nwindow.__timelines=window.__timelines||{};window.__timelines.main=tl;\n'
    for i,ch in enumerate(caps):
        js+=f"tl.set('#cap{i}',{{opacity:1}},{ch[0]['s']});tl.set('#cap{i}',{{opacity:0}},{ch[-1]['e']+.03});\n"
        for j,c in enumerate(ch):js+=f"tl.set('#w{i}-{j}',{{color:'{ACC}'}},{c['s']});\n"
    lesson=json.loads((BASE/rid/'lesson.json').read_text(encoding='utf-8'))
    audio=''.join(f'<audio class="clip" id="{n}" data-track-index="{i+3}" data-track-kind="audio" src="audio/hi/{n}.wav" data-start="0" data-duration="{total}"></audio>' for i,n in enumerate(['voice','bed','sfx']))
    out=f'''<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>{html.escape(lesson['title'])}</title>
<script src="assets/gsap.min.js"></script><script src="data.js"></script><style>
@font-face{{font-family:Head;src:url('fonts/SpaceGrotesk.ttf');font-weight:300 700}}
@font-face{{font-family:Code;src:url('fonts/JetBrainsMono.ttf');font-weight:100 800}}
@font-face{{font-family:Hindi;src:url('fonts/NotoSansDevanagari.ttf')}}
*{{box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#0B1220}}
#root{{position:relative;width:1080px;height:1920px;background:#0B1220;color:{INK};font-family:Head,Hindi,sans-serif}}
.clip,.visual{{position:absolute;inset:0}}.visual,.state{{opacity:0}}svg{{font-family:Head,Hindi,sans-serif;font-weight:600}}
#series{{position:absolute;left:90px;top:178px;font:600 30px Head;letter-spacing:2px;color:{ACC};z-index:20}}
#handle{{position:absolute;right:140px;top:180px;font:500 28px Head;color:{DIM};z-index:20}}
#source{{position:absolute;left:90px;top:1403px;font:500 29px Head;color:{DIM};z-index:20}}
#caption-lane{{position:absolute;left:75px;top:1248px;width:870px;height:145px;z-index:30}}
.caption{{position:absolute;left:0;top:0;width:870px;text-align:center;font-size:65px;font-weight:700;line-height:1.12;color:{INK};opacity:0}}
#progress-track{{position:absolute;left:90px;top:1460px;width:850px;height:5px;background:#25334D}}
#progress{{height:5px;width:850px;background:{ACC};transform-origin:left}}
</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1080" data-height="1920">
<div id="series">BLIND 75 · {int(rid[1:]):02} / 75</div><div id="handle">@dsa.learnvora</div>
{''.join(parts)}<div id="caption-lane" data-track-kind="captions">{caphtml}</div><div id="source">Problem: LeetCode #{lesson['number']}</div><div id="progress-track"><div id="progress"></div></div>{audio}</main><script>{js}</script></body></html>'''
    (r/'index.html').write_text(out,encoding='utf-8')
    board=f'# Storyboard — Blind 75 {int(rid[1:]):02}: {lesson["title"]}\n\nOwner tempo 0.9; {total}s. Actual accepted source; no invented runtimes.\n\n| Scene | Seconds | Viewer learns |\n|---|---|---|\n'
    for i,key in enumerate(scenes):
        end=s[list(scenes)[i+1]] if i+1<len(scenes) else total
        board+=f'| {key} | {s[key]:.1f}–{end:.1f} | {descriptions[key]} |\n'
    (r/'STORYBOARD.md').write_text(board,encoding='utf-8')
    (r/'SPEC.md').write_text(f'GOAL: {lesson["teaching"]["optimization"]}\nOUTPUT: 1080x1920, 30fps, {total}s. Owner tempo 0.9, Flash v2.5.\nLOOK: navy #0B1220, ivory #F3EFE6, violet #A78BFA, green #6FD3A6, red #E5735F. 70px heading, 65px cells/captions, 31px code.\nMOTION: phrase-synced states; .2s outlines and .3s arrivals.\nSOUND: authorized owner voice; bundled ducked bed and contextual action cues.\nBANNED: glow, particles, invented runtimes, code different from Accepted, generic end card.\nQA: ordered six teaching beats, exact accepted code, concrete original dry run and boundary/trap, 60–120s.\nSOURCES: '+', '.join(lesson['sources'])+'\n',encoding='utf-8')
    print(f'Composed {rid}: {len(scenes)} scenes, {total}s, {len(caps)} caption groups.')

if __name__=='__main__':
    if sys.argv[1]=='prepare':prepare(sys.argv[2],sys.argv[3])
    elif sys.argv[1]=='voice':voice(sys.argv[2])
    elif sys.argv[1]=='verify':verify(sys.argv[2],sys.argv[3])
    elif sys.argv[1]=='record-ui-result':record_ui_result(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5])
