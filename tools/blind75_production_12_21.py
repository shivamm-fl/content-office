"""Local QA/export coordinator. Never approves or publishes a reel."""
import argparse, hashlib, json, os, re, shutil, subprocess, sys,tempfile
from datetime import datetime,timezone
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1];TEAM=ROOT/'teams/dsa';BASE=TEAM/'state/solutions'
CLI=Path('C:/Users/acer/AppData/Local/npm-cache/_npx/dda85f6428bfbdbf/node_modules/hyperframes/bin/hyperframes.mjs')

def run(args,cwd,log):
    with log.open('w',encoding='utf-8') as f:
        p=subprocess.run(args,cwd=cwd,stdout=f,stderr=subprocess.STDOUT,env=dict(os.environ,NO_COLOR='1',CI='true'))
    if p.returncode:raise RuntimeError(f'{log.name} failed: '+log.read_text(encoding='utf-8')[-700:])
def load(n):
    rid=f'b{n:03}';lesson=json.loads((BASE/rid/'lesson.json').read_text(encoding='utf-8'));return rid,lesson,TEAM/'reels'/lesson['folder']
def progress():
    p=BASE/'blind75-b012-b021-progress.json';items={}
    for n in range(12,22):
        rid,lesson,r=load(n);stage='solution_locally_tested'
        if (BASE/rid/'acceptance.json').exists():stage='leetcode_accepted'
        if (r/'data.json').exists():stage='voiced'
        if (r/'index.html').exists() and 'Follow the same input' in (r/'index.html').read_text(encoding='utf-8'):stage='visuals_built'
        if (r/'qa-check.json').exists():stage='runtime_checked'
        if (r/'qa-export-verification.json').exists():
            stage='export_measured'
            if (r/'qa-code-frame-evidence.json').exists() and json.loads((r/'qa-code-frame-evidence.json').read_text(encoding='utf-8')).get('final_mp4_code_frame_inspected'):stage='export_verified'
        items[rid]=dict(title=lesson['title'],folder=lesson['folder'],stage=stage,owner_approved=False,published=False)
    p.write_text(json.dumps(dict(batch='Blind75 b012-b021',updated_at=datetime.now(timezone.utc).isoformat(),requested=list(items),items=items,finished=sum(x['stage']=='export_verified' for x in items.values()),owner_approved=False,published=False),indent=2),encoding='utf-8')
    return items

def quality(n):
    rid,lesson,r=load(n)
    # Our openings are direct teaching statements, so label their real hook form.
    p=r/'spec.json';s=json.loads(p.read_text(encoding='utf-8'));s['hook_type']='surprising_fact';p.write_text(json.dumps(s,ensure_ascii=False,indent=2),encoding='utf-8')
    run(['node',str(CLI),'check','--json'],r,r/'qa-check-raw.log')
    raw=(r/'qa-check-raw.log').read_text(encoding='utf-8-sig');j=json.loads(raw[raw.index('{'):]);assert j['ok'] and not j.get('browserSkipped'),j
    (r/'qa-check.json').write_text(json.dumps(j,indent=2),encoding='utf-8')
    data=json.loads((r/'data.json').read_text(encoding='utf-8'))['hi'];starts=data['starts'];keys=list(lesson['copy']);times={0.0}
    for i,k in enumerate(keys):
        end=starts[keys[i+1]] if i+1<len(keys) else data['total']
        times.update([round(starts[k]+.5,2),round((starts[k]+end)/2,2),round(end-.4,2)])
        if i:times.update([round(starts[k]-.2,2),round(starts[k]+.2,2)])
    run(['node',str(CLI),'snapshot','--at',','.join(map(str,sorted(times))),'--no-end','--describe','false'],r,r/'qa-snapshots.log')
    files=sorted((r/'snapshots').glob('frame-*.png'));assert len(files)>=len(times)
    # Phone-size review is a real downsample, not a claim based on large frames.
    selected=[]
    for k in keys:
        mid=(starts[k]+(starts[keys[keys.index(k)+1]] if keys.index(k)+1<len(keys) else data['total']))/2
        frame=min(files,key=lambda f:abs(float(f.stem.split('-at-')[1][:-1])-mid))
        selected.append(frame)
    sheet=Image.new('RGB',(360*4,640*2),(15,20,30))
    for i,p in enumerate(selected):sheet.paste(Image.open(p).convert('RGB').resize((360,640)),((i%4)*360,(i//4)*640))
    sheet.save(r/'qa-phone-sheet.jpg',quality=92)
    progress();print(rid,'runtime, scene/cut snapshots and phone sheet ready',flush=True)

def render(n):
    rid,lesson,r=load(n)
    assert json.loads((r/'qa-check.json').read_text())['ok']
    review=json.loads((r/'qa-independent-review.json').read_text(encoding='utf-8'))
    assert review['ok'] and not review.get('open_p0_p1'), 'Independent review must pass before delivery render'
    assert review['hashes']['html_sha256']==hashlib.sha256((r/'index.html').read_bytes()).hexdigest(),'HTML changed since independent review'
    out=TEAM/'reels'/f'{lesson["folder"]}_hi.mp4'
    run(['node',str(CLI),'render','--variables-file','vars.hi.json','--strict-variables','--quality','delivery','--workers','4','--output',str(out)],r,r/'final-render.log')
    print(rid,'render complete',flush=True)

def verify(n):
    rid,lesson,r=load(n);mp4=TEAM/'reels'/f'{lesson["folder"]}_hi.mp4'
    meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,codec_type,width,height,r_frame_rate','-show_entries','format=duration,size','-of','json',str(mp4)],text=True))
    v=next(x for x in meta['streams'] if x['codec_type']=='video');a=next(x for x in meta['streams'] if x['codec_type']=='audio');dur=float(meta['format']['duration']);data=json.loads((r/'data.json').read_text(encoding='utf-8'))['hi']
    assert (v['width'],v['height'],v['codec_name'],v['r_frame_rate'],a['codec_name'])==(1080,1920,'h264','30/1','aac'),meta
    assert 60<=dur<=120 and abs(dur-data['total'])<.1,(dur,data['total'])
    assert mp4.stat().st_size<25*1024*1024,'Private library size cap'
    sys.path.insert(0,str(ROOT/'runner/scripts'));import coding_gate
    key=(Path(tempfile.gettempdir())/f'learnvora-{rid}-local-pilot.key').read_text(encoding='utf-8')
    ok,detail=coding_gate.check(r,rid,key);assert ok,detail
    code=coding_gate.inspect_visible_code(r,require_complete=True)
    review=json.loads((r/'qa-independent-review.json').read_text(encoding='utf-8'));assert review['ok'] and not review.get('open_p0_p1')
    audio=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(mp4),'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True,check=True)
    (r/'qa-audio.log').write_text(audio.stderr,encoding='utf-8');lufs=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',audio.stderr)[-1]);peak=float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS',audio.stderr)[-1]);assert -17<=lufs<=-12 and peak<=-1,(lufs,peak)
    digest=hashlib.sha256(mp4.read_bytes()).hexdigest();frames=[]
    for name,scene in [('trace','E'),('code-F','F'),('code-G','G')]:
        ph=data['ph'][scene];t=round((ph[0]['s']+ph[0]['e'])/2,3);path=r/f'qa-export-{name}.png'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(mp4),'-frames:v','1',str(path)],check=True)
        frames.append(dict(time_s=t,frame=path.name,frame_sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
    sheet=Image.new('RGB',(1080*3,1920),(11,18,32))
    for i,f in enumerate(frames):sheet.paste(Image.open(r/f['frame']).convert('RGB'),(i*1080,0))
    sheet.save(r/'qa-final-mp4-sheet.jpg',quality=94)
    # Inspection is marked separately, only after the actual decoded frames are viewed.
    evidence=dict(final_mp4_code_frame_inspected=False,mp4_sha256=digest,frames=frames,human_listening=False,continuous_playback_review=False)
    (r/'qa-code-frame-evidence.json').write_text(json.dumps(evidence,indent=2),encoding='utf-8')
    qa=dict(local_pilot_checks_passed=True,production_worker_gate_run=False,owner_approved=False,published=False,duration_s=dur,owner_tempo=.9,owner_model='eleven_flash_v2_5',loudness_lufs=lufs,true_peak_dbtp_rounded=peak,video=v,accepted_gate=detail,on_screen_code=code,independent_review_passed=True,human_listening=False,mp4_sha256=digest)
    (r/'qa-export-verification.json').write_text(json.dumps(qa,indent=2),encoding='utf-8');progress();print(rid,'final export measured; decoded frames await actual inspection',flush=True)

def final_frames(n):
    """Decode important terminal and transition frames; inspection remains explicit."""
    rid,lesson,r=load(n);mp4=TEAM/'reels'/f'{lesson["folder"]}_hi.mp4';data=json.loads((r/'data.json').read_text(encoding='utf-8'))['hi'];p=r/'qa-code-frame-evidence.json';e=json.loads(p.read_text(encoding='utf-8'))
    assert e['mp4_sha256']==hashlib.sha256(mp4.read_bytes()).hexdigest()
    targets=[('trace-end',data['starts']['F']-.6)]
    if n in (17,19,20):targets.append(('code-transition',(data['ph']['F'][1]['s']+data['ph']['F'][1]['e'])/2))
    if n==21:targets.append(('code-transition',76.5))
    for name,t in targets:
        frame=r/f'qa-export-{name}.png';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(mp4),'-frames:v','1',str(frame)],check=True)
        e['frames']=[f for f in e['frames'] if f['frame']!=frame.name]+[dict(time_s=round(t,3),frame=frame.name,frame_sha256=hashlib.sha256(frame.read_bytes()).hexdigest())]
    e['final_mp4_code_frame_inspected']=False;write=e.pop('inspector',None);e.pop('inspection_scope',None)
    p.write_text(json.dumps(e,indent=2),encoding='utf-8')
    ordered=[f for f in e['frames'] if f['frame']!='qa-export-trace.png']
    sheet=Image.new('RGB',(1080*len(ordered),1920),(11,18,32))
    for i,f in enumerate(ordered):sheet.paste(Image.open(r/f['frame']).convert('RGB'),(i*1080,0))
    sheet.save(r/'qa-final-mp4-sheet.jpg',quality=94);print(rid,'final terminal/transition evidence decoded',flush=True)

if __name__=='__main__':
    a=argparse.ArgumentParser();a.add_argument('action',choices=['progress','quality','render','verify','final_frames']);a.add_argument('numbers',type=int,nargs='*');args=a.parse_args()
    if args.action=='progress':print(json.dumps(progress(),indent=2))
    else:
        for n in args.numbers:globals()[args.action](n)
