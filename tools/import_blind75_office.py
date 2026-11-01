"""Save the eleven verified reels in the Office's private review library.

Uses the administrator's existing Wrangler login. No social publishing, public
release, new secret, owner approval, or studio-run verdict is manufactured.
Default builds a manifest; --upload writes immutable files, verifies remote
bytes, then atomically updates the manifest while preserving unrelated items.
"""
import argparse, concurrent.futures, hashlib, json, os, subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent;TEAM=ROOT/'teams/dsa'
OUT=TEAM/'state/solutions/office-import';NS='99c28111858b4e5fbbeae1b6b663211a'
WRANGLER=ROOT/'apps/api/node_modules/wrangler/bin/wrangler.js'
def digest(data):return hashlib.sha256(data).hexdigest()
def command(*args,allow_missing=False):
    result=subprocess.run(['node',str(WRANGLER),'kv',*args,'--namespace-id',NS,'--remote'],cwd=ROOT/'apps/api',env=dict(os.environ,CI='true',NO_COLOR='1'),capture_output=True)
    if result.returncode:
        error=result.stderr.decode('utf-8',errors='replace')
        if allow_missing and '404: Not Found' in error:return b''
        raise RuntimeError(error[-500:])
    return result.stdout

def prepare():
    OUT.mkdir(parents=True,exist_ok=True);items=[];assets=[]
    for i in range(1,12):
        rid=f'b{i:03}';r=next(x for x in (TEAM/'reels').glob(f'{rid}_*') if x.is_dir())
        video=TEAM/'reels'/f'{r.name}_hi.mp4';cover=TEAM/'brand/covers'/f'{r.name}.png'
        codeproof=json.loads((r/'qa-code-frame-evidence.json').read_text())
        vh=digest(video.read_bytes());ch=digest(cover.read_bytes())
        assert codeproof['final_mp4_code_frame_inspected'] and codeproof['mp4_sha256']==vh,rid
        proof=json.loads((r/'browser-verification.json').read_text());assert proof['status']=='Accepted',rid
        caption=(TEAM/'social'/f'{r.name}.hi.caption.txt').read_text(encoding='utf-8-sig')
        youtube=(TEAM/'social'/f'{r.name}.youtube.txt').read_text(encoding='utf-8-sig')
        item=json.loads((r/'coding.json').read_text(encoding='utf-8'))
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(video)],text=True))
        assert 60<=duration<=120
        version=digest((vh+ch+caption+youtube).encode())[:16]
        items.append(dict(item=rid,title=item['problem']['title'],track='blind75',folder=r.name,version=version,duration_s=duration,caption=caption,youtube=youtube,video_sha256=vh,cover_sha256=ch,saved_at=datetime.now(timezone.utc).isoformat(),accepted_submission=proof['submission_url'],judge_cases=proof['total_testcases'],owner_approved=False,published=False,review_scope='Local export and Accepted-source checks; code frames inspected; sound measured, not human-listened.'))
        for kind,path,sha in [('video',video,vh),('cover',cover,ch)]:
            assert path.stat().st_size<25*1024*1024
            assets.append(dict(key=f'reel-library/dsa/{rid}/{version}/{"video.mp4" if kind=="video" else "cover.png"}',path=str(path),sha256=sha,item=rid,kind=kind))
    manifest=dict(v=1,team='dsa',items=items)
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'assets.json').write_text(json.dumps(assets,indent=2),encoding='utf-8')
    return manifest,assets

def upload(manifest,assets):
    old=command('key','get','reel-library/dsa/manifest.json',allow_missing=True)
    try:previous=json.loads(old)
    except (json.JSONDecodeError,UnicodeDecodeError):
        if old.strip() not in (b'',b'Value not found'):raise RuntimeError('Existing manifest could not be read; refusing to replace it')
        previous={'items':[]}
    own={x['item'] for x in manifest['items']}
    manifest['items']=[x for x in previous.get('items',[]) if x['item'] not in own]+manifest['items']
    def put(a):
        command('key','put',a['key'],'--path',a['path'])
        remote=command('key','get',a['key'])
        assert digest(remote)==a['sha256'],f'Remote bytes differ: {a["key"]}'
        print(f'Saved and verified {a["item"]} {a["kind"]}',flush=True)
        return dict(key=a['key'],sha256=a['sha256'],bytes=len(remote))
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:verified=list(pool.map(put,assets))
    p=OUT/'manifest.json';p.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    command('key','put','reel-library/dsa/manifest.json','--path',str(p))
    readback=command('key','get','reel-library/dsa/manifest.json')
    assert json.loads(readback)==manifest
    (OUT/'remote-verification.json').write_text(json.dumps(dict(team='dsa',saved_items=sorted(own),verified_assets=verified,manifest_verified=True,published=False),indent=2),encoding='utf-8')
    print('11 reels, 11 covers and their captions saved in private Office storage. Manifest verified. No publishing.')

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--upload',action='store_true');a=ap.parse_args()
    manifest,assets=prepare();print('Prepared11 verified videos and11 covers.',flush=True)
    if a.upload:upload(manifest,assets)
