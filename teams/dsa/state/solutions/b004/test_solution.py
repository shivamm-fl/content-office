import hashlib,json,math,random
from pathlib import Path
from solution import Solution
solve=Solution().productExceptSelf
cases=[[2,3,4,5],[2,0,4],[0,0],[0,5],[-1,1,0,-3,3],[-2,3,-4,1],[30,-30]]
rng=random.Random(75004)
cases += [[rng.randint(-3,3) for _ in range(rng.randint(2,10))] for _ in range(5000)]
for a in cases:
    expected=[math.prod(a[:i]+a[i+1:]) for i in range(len(a))]
    original=a.copy()
    assert solve(a)==expected,(a,expected,solve(a))
    assert a==original
for a,want in [([1]*100000,[1]*100000),([0]+[1]*99999,[1]+[0]*99999)]:assert solve(a)==want
p=Path(__file__).resolve().parent
r=dict(local_tests_passed=len(cases)+2,leetcode_accepted=False,studio_started=False,code_sha256=hashlib.sha256((p/'solution.py').read_text(encoding='utf-8').encode()).hexdigest(),example=[2,3,4,5],answer=[60,40,30,24],prefix=[1,2,6,24],suffix=[60,20,5,1],zero_example=[2,0,4],zero_answer=[0,8,0])
(p/'local-verification.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
print(f'{len(cases)+2} oracle and boundary cases passed; no LeetCode Accepted claim.')
