"""Reproduce the reel's code verification without a judge or network."""
from pathlib import Path
import hashlib,json,random
from main import max_subarray

def brute(nums):
    return max(sum(nums[a:b]) for a in range(len(nums)) for b in range(a+1,len(nums)+1))

examples=[([-2,1,-3,4,-1,2,1,-5,4],6),([-5,-2,-8],-2),([-1,-2],-1),([1],1),([5,4,-1,7,8],23)]
for nums,expected in examples:
    assert max_subarray(nums)==expected
rng=random.Random(20261103)
for _ in range(5000):
    nums=[rng.randint(-20,20) for _ in range(rng.randint(1,20))]
    assert max_subarray(nums)==brute(nums),nums
report=dict(code_executed=True,random_cases=5000,random_seed=20261103,examples=[dict(input=a,actual=max_subarray(a),expected=b) for a,b in examples],code_sha256=hashlib.sha256(Path(__file__).with_name('main.py').read_bytes()).hexdigest(),accepted_claim=False)
Path(__file__).parents[1].joinpath('fact-verification.json').write_text(json.dumps(report,indent=2))
print('PASS: 5 examples and 5000 seeded random arrays; exact displayed Python source SHA recorded.')
