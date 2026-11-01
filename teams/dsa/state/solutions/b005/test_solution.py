import hashlib,json,random
from pathlib import Path
from solution import Solution
solve=Solution().maxSubArray
cases=[[-3,4,-1,2,-6,3],[-5,-2,-7],[-1],[0],[1],[3,-2,5,-1],[0,0,0],[-10000]*5]
rng=random.Random(75005)
cases += [[rng.randint(-20,20) for _ in range(rng.randint(1,22))] for _ in range(5000)]
for a in cases:
    expected=max(sum(a[i:j]) for i in range(len(a)) for j in range(i+1,len(a)+1))
    original=a.copy();assert solve(a)==expected,(a,expected,solve(a));assert a==original
for a,want in [([10000]*100000,1000000000),([-10000]*100000,-10000)]:assert solve(a)==want
p=Path(__file__).resolve().parent
r=dict(local_tests_passed=len(cases)+2,leetcode_accepted=False,studio_started=False,code_sha256=hashlib.sha256((p/'solution.py').read_text(encoding='utf-8').encode()).hexdigest(),example=[-3,4,-1,2,-6,3],answer=5,ending=[-3,4,3,5,-1,3],best=[-3,4,4,5,5,5],all_negative=[-5,-2,-7],all_negative_answer=-2)
(p/'local-verification.json').write_text(json.dumps(r,indent=2),encoding='utf-8');print(f'{len(cases)+2} oracle and boundary cases passed; actual LeetCode verification still required.')
