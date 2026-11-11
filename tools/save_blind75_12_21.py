"""Hash-checked private Office review handoff for b012-b021. No approval/posting."""
import argparse,concurrent.futures,hashlib,json,sys
from datetime import datetime,timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];TEAM=ROOT/'teams/dsa';BASE=TEAM/'state/solutions';OUT=BASE/'office-import/b012-b021'
sys.path.insert(0,str(ROOT/'tools'))
from import_blind75_office import command
def sha(data):return hashlib.sha256(data).hexdigest()
def prepare():
    OUT.mkdir(exist_ok=True,parents=True);items=[];assets=[]
    for n in range(12,22):
        rid=f'b{n:03}';lesson=json.loads((BASE/rid/'lesson.json').read_text(encoding='utf-8'));folder=lesson['folder'];r=TEAM/'reels'/folder
        video=TEAM/'reels'/f'{folder}_hi.mp4';cover=TEAM/'brand/covers'/f'{folder}.png';vh=sha(video.read_bytes());ch=sha(cover.read_bytes())
        evidence=json.loads((r/'qa-code-frame-evidence.json').read_text(encoding='utf-8'));qa=json.loads((r/'qa-export-verification.json').read_text(encoding='utf-8'));review=json.loads((r/'qa-independent-review.json').read_text(encoding='utf-8'))
        assert evidence['final_mp4_code_frame_inspected'] and evidence['mp4_sha256']==vh
        assert qa['mp4_sha256']==vh and qa['on_screen_code']['method_body_complete']
        assert review['ok'] and not review.get('open_p0_p1') and 60<=qa['duration_s']<=120
        proof=json.loads((BASE/rid/'acceptance.json').read_text(encoding='utf-8'));assert proof['status']=='Accepted' and proof['code_sha256']==sha((r/'solution.py').read_bytes())
        caption=(TEAM/'social'/f'{folder}.hi.caption.txt').read_text(encoding='utf-8-sig');youtube=(TEAM/'social'/f'{folder}.youtube.txt').read_text(encoding='utf-8-sig');version=sha((vh+ch+caption+youtube).encode())[:16]
        items.append(dict(item=rid,title=lesson['title'],track='blind75',folder=folder,version=version,duration_s=qa['duration_s'],caption=caption,youtube=youtube,video_sha256=vh,cover_sha256=ch,saved_at=datetime.now(timezone.utc).isoformat(),accepted_submission=proof['submission_url'],judge_cases=proof['total_testcases'],owner_approved=False,published=False,review_scope='Independent source/teaching/still review; decoded final MP4 code and trace frames inspected; sound measured, not human-listened.'))
        for kind,path,digest in [('video',video,vh),('cover',cover,ch)]:
            assert path.stat().st_size<25*1024*1024
            assets.append(dict(key=f'reel-library/dsa/{rid}/{version}/{"video.mp4" if kind=="video" else "cover.png"}',path=str(path),sha256=digest,item=rid,kind=kind))
    manifest=dict(v=1,team='dsa',items=items)
    (OUT/'prepared-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8');(OUT/'assets.json').write_text(json.dumps(assets,indent=2),encoding='utf-8')
    return manifest,assets
def upload(manifest,assets):
    private=json.loads((OUT/'private-publisher/verification.json').read_text(encoding='utf-8'))
    assert len(private['packages'])==10 and all(x['verified'] for x in private['packages'])
    old=command('key','get','reel-library/dsa/manifest.json');previous=json.loads(old);assert previous['team']=='dsa'
    (OUT/'previous-manifest.json').write_text(json.dumps(previous,ensure_ascii=False,indent=2),encoding='utf-8')
    own={x['item'] for x in manifest['items']}
    def put(a):
        command('key','put',a['key'],'--path',a['path']);remote=command('key','get',a['key']);assert sha(remote)==a['sha256']
        print(a['item'],a['kind'],'saved and remote hash verified',flush=True)
        return dict(key=a['key'],sha256=a['sha256'],bytes=len(remote))
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:verified=list(pool.map(put,assets))
    # Refetch immediately before the manifest write to preserve other teams' current saves.
    current=json.loads(command('key','get','reel-library/dsa/manifest.json'))
    manifest['items']=[x for x in current['items'] if x['item'] not in own]+manifest['items']
    p=OUT/'manifest.json';p.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8');command('key','put','reel-library/dsa/manifest.json','--path',str(p))
    assert json.loads(command('key','get','reel-library/dsa/manifest.json'))==manifest
    result=dict(team='dsa',saved_items=sorted(own),verified_assets=verified,manifest_verified=True,existing_items_preserved=[x['item'] for x in current['items'] if x['item'] not in own],owner_approvals_changed=False,published=False)
    (OUT/'remote-verification.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print('Saved10 reels,10 covers and captions for Office review. Existing items and owner approvals preserved.',flush=True)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--upload',action='store_true');a=p.parse_args();m,assets=prepare();print('Prepared10 verified review packages',flush=True)
    if a.upload:upload(m,assets)
