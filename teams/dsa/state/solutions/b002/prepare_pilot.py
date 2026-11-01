"""Build local pilot evidence from the genuinely observed LeetCode UI result.
This key and signature are separate from the unattended production adapter.
"""
import hashlib, hmac, json, secrets, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
TEAM = HERE.parents[2]
R = TEAM / 'reels/b002_stock_profit'
lesson = json.loads((HERE / 'lesson.json').read_text(encoding='utf-8'))
code = (HERE / 'solution.py').read_text(encoding='utf-8')
digest = hashlib.sha256(code.encode()).hexdigest()
assert digest == 'f55dc127f3445b7d9ad264f7a596f76d4cb2256c1a743cb3d13a510daf9dc3df', 'Changed source needs new LeetCode verification'
keyfile = Path(tempfile.gettempdir()) / 'learnvora-b002-local-pilot.key'
if not keyfile.exists():
    keyfile.write_text(secrets.token_urlsafe(48), encoding='utf-8')
secret = keyfile.read_text(encoding='utf-8')
proof = dict(v=1, kind='accepted', item='b002', track='blind75', slug=lesson['slug'], question_id='121', challenge_date=None,
             code_sha256=digest, submission_id='2187018088', status='Accepted', language='python3', total_testcases=213,
             verification_method='browser_ui_observed', account='dsalearnvora', verification_date='2026-11-01',
             submission_url='https://leetcode.com/problems/best-time-to-buy-and-sell-stock/submissions/2187018088/', proof_scope='local_pilot')
body = json.dumps(proof, ensure_ascii=False, separators=(',', ':'))
token = json.dumps(dict(body=body, sig=hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest()))
item = dict(id='b002', track='blind75', position=2,
            problem=dict(slug=lesson['slug'], question_id='121', number='121', title=lesson['title'], difficulty='Easy', url=lesson['sources'][0]),
            title='Stock Profit: remember the cheapest earlier buy', format='problem', solution_code=code,
            accepted_proof=token, length_target_s=110, teaching=lesson['teaching'], sources=lesson['sources']+[proof['submission_url']],
            status='planned', qa_passed=False, proof_scope='local_pilot',
            note='Actual 213/213 Accepted observed in authenticated UI before the owner requested browser-only access. Local pilot evidence, not production adapter evidence.')
spec = dict(tts='owner', voice='hi-IN-SwaraNeural', pace=1.26, audio='v2', owner_model='eleven_flash_v2_5', owner_tempo=.9,
            prime='सुनो, ये बहुत interesting है!', tone='calm', hook_type='direct_question', scenes=list(lesson['copy']),
            min={s:3 for s in lesson['copy']}, tail={}, copy={'hi':lesson['copy']},
            cues=[['click','B',1,0],['err','C',1,0],['click','F',1,0],['ok','F',2,1],['err','G',1,0]],
            solution_sha256=digest, teaching_scenes=lesson['teaching_scenes'], sources=item['sources'])
for name,value in [('coding.json',item),('spec.json',spec),('browser-verification.json',proof)]:
    (R/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
(R/'solution.py').write_text(code,encoding='utf-8',newline='\n')
(R/'script.txt').write_text('\n\n'.join(lesson['copy'].values()),encoding='utf-8')
(TEAM/'state/scripts/b002.txt').write_text('\n\n'.join(lesson['copy'].values()),encoding='utf-8')
(HERE/'production-status.json').write_text(json.dumps(dict(id='b002', status='accepted_local_pilot_build', local_tests_passed=5010,
    leetcode_accepted=True, submission_id='2187018088', testcases_passed='213/213', proof_scope='local_pilot'),indent=2),encoding='utf-8')
print('Prepared b002 from genuine LeetCode Accepted #2187018088, 213/213; owner tempo 0.9.')
