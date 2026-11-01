import hashlib
import json
import random
from pathlib import Path
from solution import Solution

here = Path(__file__).resolve().parent
solve = Solution().findMin
cases = 0
for n in range(1, 61):
    values = list(range(-n, n, 2))
    for pivot in range(n):
        rotated = values[pivot:] + values[:pivot]
        before = rotated[:]
        assert solve(rotated) == min(rotated)
        assert rotated == before
        cases += 1
rng = random.Random(753153)
for _ in range(4000):
    n = rng.randint(1, 200)
    values = sorted(rng.sample(range(-5000, 5001), n))
    p = rng.randrange(n)
    nums = values[p:] + values[:p]
    assert solve(nums) == min(nums)
    cases += 1
values = list(range(-2500, 2500))
for p in [0, 1, 2499, 2500, 4999]:
    nums = values[p:] + values[:p]
    assert solve(nums) == -2500
    cases += 1
assert solve([7, 9, 1, 3, 5]) == 1
out = dict(local_tests_passed=cases, leetcode_accepted=False, studio_started=False,
           code_sha256=hashlib.sha256((here/'solution.py').read_bytes()).hexdigest(),
           example=[7, 9, 1, 3, 5], answer=1,
           trace=[dict(left=0,right=4,mid=2,mid_value=1,right_value=5,next_right=2),
                  dict(left=0,right=2,mid=1,mid_value=9,right_value=1,next_left=2)],
           oracle='independent linear min; all rotations through n=60, seeded unique arrays and max n=5000')
(here/'local-verification.json').write_text(json.dumps(out, indent=2), encoding='utf-8')
print(f'{cases} local cases passed. No LeetCode Accepted claim.')
