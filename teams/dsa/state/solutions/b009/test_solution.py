import hashlib,itertools,json,random
from pathlib import Path
from solution import Solution
here=Path(__file__).resolve().parent;solve=Solution().threeSum;cases=0
def check(a,expected=None):
    global cases
    before=a[:]
    if expected is None:
        expected={tuple(sorted((a[i],a[j],a[k]))) for i,j,k in itertools.combinations(range(len(a)),3) if a[i]+a[j]+a[k]==0}
    out=solve(a);triples=[tuple(x) for x in out]
    assert len(triples)==len(set(triples)),('duplicate triplets',a,out)
    assert set(triples)==expected,(a,out,expected)
    assert a==before,'input must remain unchanged by sorted copy'
    cases+=1
for n in range(3,10):
    for values in itertools.combinations_with_replacement(range(-2,3),n):
        check(list(values))
rng=random.Random(75315)
for _ in range(3500):
    a=[rng.randint(-9,9) for _ in range(rng.randint(3,13))];check(a)
check([1,-2,2,0,1,-2])
check([0]*3000,{(0,0,0)})
check([-1]*1000+[0]*1000+[1]*1000,{(-1,0,1),(0,0,0)})
check([100000]*3000,set());check([-100000]*3000,set())
check([-100000,0,100000],{(-100000,0,100000)})
out=dict(local_tests_passed=cases,leetcode_accepted=False,studio_started=False,code_sha256=hashlib.sha256((here/'solution.py').read_bytes()).hexdigest(),example=[1,-2,2,0,1,-2],sorted_example=[-2,-2,0,1,1,2],answer=[[-2,0,2],[-2,1,1]],oracle='independent index-triple enumeration, exhaustive multisets, seeded arrays, constructed n=3000 boundaries; no duplicate outputs and no input mutation')
(here/'local-verification.json').write_text(json.dumps(out,indent=2),encoding='utf-8');print(f'{cases} local cases passed. No LeetCode Accepted claim.')
