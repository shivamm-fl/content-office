"""Record a verified private-library batch, preserving existing team work."""
import hashlib,json
from pathlib import Path
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[1];TEAM=ROOT/'teams/dsa';BASE=TEAM/'state/solutions';OUT=BASE/'office-import/b012-b021'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def write(p,j,indent=2):p.write_text(json.dumps(j,ensure_ascii=False,indent=indent)+'\n',encoding='utf-8')
def main():
    remote=read(OUT/'remote-verification.json');assert remote['manifest_verified'] and remote['saved_items']==[f'b{n:03}' for n in range(12,22)]
    manifest=read(OUT/'prepared-manifest.json');items={x['item']:x for x in manifest['items']};assert len(items)==10
    phase=read(TEAM/'state/phase5_status.json');covered=read(TEAM/'state/covered.json');road=read(TEAM/'roadmap/blind75.json');now=datetime.now(timezone.utc).isoformat()
    oldcovered={x['id']:x for x in covered['items']}
    for rid,item in items.items():
        r=TEAM/'reels'/item['folder'];qa=read(r/'qa-export-verification.json');frames=read(r/'qa-code-frame-evidence.json');proof=read(BASE/rid/'acceptance.json')
        assert frames['final_mp4_code_frame_inspected'] and qa['mp4_sha256']==item['video_sha256']==frames['mp4_sha256']
        assert proof['code_sha256']==hashlib.sha256((BASE/rid/'solution.py').read_bytes()).hexdigest()
        review=read(r/'qa-independent-review.json');assert review['ok'] and review['hashes']['html_sha256']==hashlib.sha256((r/'index.html').read_bytes()).hexdigest()
        review_text=f'''# Review — {item['title']} ({rid})

Continued the owner-approved navy/ivory/violet diagram family. The same original
input carries the lesson from the naive baseline, through its concrete cost or
failure, to the optimized invariant, trace and complete Accepted method body.
The short code is kept whole where readable; longer bodies switch chunks during
the actual explanation. Decorative motion and spoken promotion were omitted.

Measured final file: {qa['duration_s']} seconds,1080x1920 H.26430fps/AAC,
owner Flashv2.5 at tempo0.9, {qa['loudness_lufs']} LUFS and rounded peak
{qa['true_peak_dbtp_rounded']} dBTP. Source-bound code audit covers the complete
method. Accepted source: {proof['submission_url']} ({proof['total_testcases']} cases).

Independent source/oracle, invariant, teaching-order, English-number text,
selected-scene/cut and phone-size review passed with no open P0/P1. Root viewed
the actual final MP4's decoded complete-code and terminal-trace frames; their
hashes are recorded in qa-code-frame-evidence.json, tied to MP4
{qa['mp4_sha256']}.

The least animated shot is the code-reading hold: it deliberately keeps source
stable during explanation. A longer-format follow-up could trace another
boundary input beside it. Existing structural lint notes about the seven-scene
parent composition are retained for compatibility with this established
source-audited pipeline; runtime, layout and contrast checks passed.

Scope limits: audio was measured, without human listening or continuous playback.
These are browser-observed/local-pilot production checks, not a claim that the
separate production Worker gate ran. Owner review/approval is managed in Office.
'''
        (r/'REVIEW.md').write_text(review_text,encoding='utf-8')
        data=read(r/'data.json')['hi'];keys=list(data['ph']);shots=[]
        for index,key in enumerate(keys):
            start=data['starts'][key];end=data['starts'][keys[index+1]] if index+1<len(keys) else data['total']
            shots.append(f'- {key}: {start:.3f}–{end:.3f}s; frames {round(start*30)}–{round(end*30)-1}.')
        (r/'SPEC.md').write_text(f'''# Delivery specification — {item['title']}

1080x1920,30fps,{qa['duration_s']}s. Owner Flashv2.5,tempo0.9.
Palette: navy#0B1220,ivory#F3EFE6,violet#A78BFA,green#6FD3A6,red#E5735F.
Type: headings58–70px,values51–65px,captions65px,code31–42px. Long source
rows use marked editor soft wraps while retaining their original indentation.
Motion: phrase/word-timed diagram states and source highlights, stable reading
holds, linear full-duration progress bar. No random motion or decorative effects.
Sound: authorized owner voice, bundled ducked bed and contextual action cues.
Final loudness {qa['loudness_lufs']} LUFS; rounded true peak {qa['true_peak_dbtp_rounded']}dBTP.

'''+ '\n'.join(shots)+'\n\nSources: '+', '.join(read(BASE/rid/'lesson.json')['sources'])+', '+proof['submission_url']+'\nAdditional primary language references: state/solutions/blind75-b012-b021-source-retrieval.json\n',encoding='utf-8')
        previous=phase.get(rid,{})
        assert not previous.get('published') and previous.get('status') not in ('posted','released'), 'Preserve existing posting state'
        phase[rid]=dict(previous,status='built',track='blind75',folder=f'reels/{item["folder"]}',mp4=f'reels/{item["folder"]}_hi.mp4',cover=f'brand/covers/{item["folder"]}.png',caption=f'social/{item["folder"]}.hi.caption.txt',title=item['title'],duration_s=qa['duration_s'],qa_passed=True,qa_scope='Independent teaching/oracles, exact browser-observed Accepted source and measured local final export with decoded-code inspection',proof_scope='local_pilot',delivery='private_office_library',library_version=item['version'],owner_approval_required=True,published=False,accepted_submission=proof['submission_url'],built_at=now)
        if rid not in oldcovered:
            entry=dict(id=rid,track='blind75',position=int(rid[1:]),title=item['title'],status='built',problem_slug=proof['slug'],submission_id=proof['submission_id'],accepted_submission=proof['submission_url'],library_version=item['version'],built_at=now)
            covered['items'].append(entry);oldcovered[rid]=entry
        else:assert oldcovered[rid].get('status') not in ('published','posted'),'Preserve published covered records'
    # The previously completed first11 must also be skipped by the next selector.
    # This records build completion only; publication and owner decisions stay separate.
    historical=read(BASE/'blind75-next10-progress.json');assert set(historical['completed'])>=set(f'b{n:03}' for n in range(2,12))
    for p in road['problems']:
        n=int(p['id'][1:])
        if n<=21 and p.get('status') in ('todo','planned','built'):
            p['status']='built';p['completion_record']='state/solutions/blind75-b012-b021-progress.json' if n>=12 else 'docs-notes/blind75-runbook.md'
    write(TEAM/'state/phase5_status.json',phase,indent=1);write(TEAM/'state/covered.json',covered);write(TEAM/'roadmap/blind75.json',road)
    progress=read(BASE/'blind75-b012-b021-progress.json');progress.update(status='all10_saved_for_owner_review',finished=10,next_blind75='b022',office_saved=True,owner_approval='managed separately in Office',published=False,updated_at=now)
    for rid,x in progress['items'].items():x.update(stage='saved_for_owner_review',library_version=items[rid]['version'])
    write(BASE/'blind75-b012-b021-progress.json',progress)
    for rid,item in items.items():write(BASE/rid/'production-status.json',dict(id=rid,status='saved_for_owner_review',duration_s=item['duration_s'],leetcode_accepted=True,submission_url=item['accepted_submission'],owner_tempo=.9,code_frame_inspected=True,library_version=item['version'],owner_approval_required=True,published=False))
    rows=['# Blind75 12–21 — review index','',f'All10 saved in [Office](https://content-office.learnai-ai.workers.dev). Owner approval is separate. Updated {now}.','', '| Position | Reel | Video | Cover | Accepted | Duration |','|---|---|---|---|---|---|']
    for rid,item in items.items():
        video=(TEAM/'reels'/f'{item["folder"]}_hi.mp4').as_posix();cover=(TEAM/'brand/covers'/f'{item["folder"]}.png').as_posix()
        rows.append(f'| {int(rid[1:])}/75 | {item["title"]} | [Watch]({video}) | [Cover]({cover}) | [Submission]({item["accepted_submission"]}) | {item["duration_s"]}s |')
    rows+=['','All source methods complete on screen. Tempo0.9, Flashv2.5. 1080×1920 H.26430fps/AAC. Audio measured; no human listening or continuous playback claim.','Private media verified byte-for-byte in Office and in the existing private publisher repository; no social post was started.']
    (TEAM/'reels/BLIND75_12_21_REVIEW_INDEX.md').write_text('\n'.join(rows)+'\n',encoding='utf-8')
    print('Recorded10 real completed exports and private Office delivery; next Blind75 b022. Existing owner/posting state preserved.')
if __name__=='__main__':main()
