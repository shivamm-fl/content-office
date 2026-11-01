import hashlib,itertools,json,random
from pathlib import Path
from solution import Solution
here=Path(__file__).resolve().parent;solve=Solution().maxArea;cases=0
def check(a,expected=None):
    global cases
    before=a[:]
    if expected is None:expected=max(min(a[i],a[j])*(j-i) for i in range(len(a)) for j in range(i+1,len(a)))
    assert solve(a)==expected,(a,expected,solve(a));assert a==before;cases+=1
for n in range(2,8):
    for values in itertools.product(range(4),repeat=n):check(list(values))
rng=random.Random(75311)
for _ in range(4000):check([rng.randint(0,10000) for _ in range(rng.randint(2,22))])
check([1,6,2,5,4],12)
check([3,3],3);check([0,0],0)
check([10000]*100000,999990000)
check([0]*100000,0)
check([10000]+[0]*99998+[10000],999990000)
out=dict(local_tests_passed=cases,leetcode_accepted=False,studio_started=False,code_sha256=hashlib.sha256((here/'solution.py').read_bytes()).hexdigest(),example=[1,6,2,5,4],answer=12,trace=[dict(left=0,right=4,area=4,best=4),dict(left=1,right=4,area=12,best=12),dict(left=1,right=3,area=10,best=12),dict(left=1,right=2,area=2,best=12)],oracle='independent all-pairs area enumeration, exhaustive height sequences, seeded arrays and constructed n=100000 boundaries; input preserved')
(here/'local-verification.json').write_text(json.dumps(out,indent=2),encoding='utf-8');print(f'{cases} local cases passed. No LeetCode Accepted claim.')
