import hashlib,json,math,random
from pathlib import Path
from solution import Solution
solve=Solution().maxProduct
cases=[[-2,3,-4],[-2,0,-3],[-2],[-1,-2,-3],[0],[1],[2],[-1,-1,0],[-5,-4,-3,0,1]]
rng=random.Random(75006)
cases += [[rng.randint(-5,5) for _ in range(rng.randint(1,12))] for _ in range(5000)]
for a in cases:
    expected=max(math.prod(a[i:j]) for i in range(len(a)) for j in range(i+1,len(a)+1))
    original=a.copy();assert solve(a)==expected,(a,expected,solve(a));assert a==original
for a,want in [([1]*20000,1),([-1]*20000,1),([0]*20000,0)]:assert solve(a)==want
p=Path(__file__).resolve().parent
r=dict(local_tests_passed=len(cases)+3,leetcode_accepted=False,studio_started=False,code_sha256=hashlib.sha256((p/'solution.py').read_text(encoding='utf-8').encode()).hexdigest(),example=[-2,3,-4],answer=24,high=[-2,3,24],low=[-2,-6,-12],best=[-2,3,24],zero_example=[-2,0,-3],zero_answer=0)
(p/'local-verification.json').write_text(json.dumps(r,indent=2),encoding='utf-8');print(f'{len(cases)+3} oracle and boundary cases passed; actual LeetCode verification required.')
