import hashlib,json,random
from pathlib import Path
from solution import Solution
here=Path(__file__).resolve().parent
solve=Solution().search;cases=0
for n in range(1,36):
    values=list(range(-n,n,2))
    for p in range(n):
        a=values[p:]+values[:p]
        for target in values+[-10000,10000,values[0]+1]:
            expected=a.index(target) if target in a else -1
            assert solve(a,target)==expected,(a,target)
            cases+=1
rng=random.Random(75333)
for _ in range(4000):
    n=rng.randint(1,150);values=sorted(rng.sample(range(-10000,10001),n));p=rng.randrange(n)
    a=values[p:]+values[:p];target=rng.choice(a) if rng.random()<.6 else rng.randint(-10000,10000)
    before=a[:];assert solve(a,target)==(a.index(target) if target in a else -1);assert a==before;cases+=1
values=list(range(-5000,5000,2))
for p in [0,1,2499,4999]:
    a=values[p:]+values[:p]
    for target in [a[0],a[-1],a[2500],-10000,9999]:
        assert solve(a,target)==(a.index(target) if target in a else -1);cases+=1
assert solve([6,8,2,4,5],8)==1 and solve([6,8,2,4,5],7)==-1
out=dict(local_tests_passed=cases,leetcode_accepted=False,studio_started=False,code_sha256=hashlib.sha256((here/'solution.py').read_bytes()).hexdigest(),example=[6,8,2,4,5],target=8,answer=1,missing_target=7,missing_answer=-1,oracle='independent list membership/index, all rotations through n=35, seeded present/absent targets, max n=5000')
(here/'local-verification.json').write_text(json.dumps(out,indent=2),encoding='utf-8');print(f'{cases} local cases passed. No LeetCode Accepted claim.')
