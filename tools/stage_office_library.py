"""Stage hash-verified Office media in the existing PRIVATE publishing repo.
This never updates publishing state, starts a workflow, approves or posts.
Input is a trusted local Office import manifest; authentication stays in gh's keyring.
"""
import argparse, concurrent.futures, hashlib, json, os, shutil, subprocess, tempfile
from pathlib import Path

def run(args,env,check=True):
    r=subprocess.run(args,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace')
    if check and r.returncode:raise RuntimeError((r.stderr or r.stdout)[-400:])
    return r
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--manifest',required=True);ap.add_argument('--team-root',required=True);ap.add_argument('--repo',default='shivamm-fl/ai-course');ap.add_argument('--account',default='shivamm-fl');ap.add_argument('--out',required=True);a=ap.parse_args()
    token=subprocess.check_output(['gh','auth','token','--user',a.account],text=True).strip();env=dict(os.environ,GH_TOKEN=token)
    repo=json.loads(run(['gh','api',f'repos/{a.repo}'],env).stdout)
    assert repo['private'] and repo['permissions']['push'],'Private publisher write access required'
    manifest=json.loads(Path(a.manifest).read_text(encoding='utf-8'));root=Path(a.team_root);output=Path(a.out);output.mkdir(parents=True,exist_ok=True)
    def stage(item):
        folder=item['folder'];video=root/'reels'/f'{folder}_hi.mp4';cover=root/'brand/covers'/f'{folder}.png'
        assert digest(video)==item['video_sha256'] and digest(cover)==item['cover_sha256']
        version=item['version'];rid=item['item'];team=manifest['team'];tag=f'library-{team}-{rid}-{version}'
        p=output/rid;p.mkdir(exist_ok=True)
        entry=dict(folder=f'reels/{folder}',mp4=f'reels/{folder}_hi.mp4',cover=f'brand/covers/{folder}.png',caption=f'social/{folder}.hi.caption.txt',title=item['title'],track=item['track'],duration_s=item['duration_s'])
        package=dict(team=team,item=rid,version=version,folder=folder,entry=entry,caption=item['caption'],youtube=item['youtube'],video_sha256=item['video_sha256'],cover_sha256=item['cover_sha256'])
        packagefile=p/'manifest.json';packagefile.write_text(json.dumps(package,ensure_ascii=False,indent=2),encoding='utf-8')
        exists=run(['gh','release','view',tag,'--repo',a.repo],env,check=False).returncode==0
        if not exists:run(['gh','release','create',tag,'--repo',a.repo,'--latest=false','--title',f'Private Office review {rid} {version}','--notes','Private staged files only. Not approved, scheduled or published.'],env)
        run(['gh','release','upload',tag,str(video),str(cover),str(packagefile),'--repo',a.repo,'--clobber'],env)
        with tempfile.TemporaryDirectory(prefix='verify-private-library-') as temp:
            run(['gh','release','download',tag,'--repo',a.repo,'-D',temp],env)
            t=Path(temp);assert digest(t/video.name)==item['video_sha256'] and digest(t/cover.name)==item['cover_sha256'];assert json.loads((t/'manifest.json').read_text(encoding='utf-8'))==package
        print(f'{rid}: private package staged and readback verified',flush=True)
        return dict(item=rid,version=version,private_repo=a.repo,tag=tag,verified=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(stage,manifest['items']))
    (output/'verification.json').write_text(json.dumps(dict(packages=results,workflows_started=0,social_posts=0),indent=2),encoding='utf-8')
if __name__=='__main__':main()
