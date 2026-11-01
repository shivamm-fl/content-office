"""Independent pair-enumeration oracle; never a substitute for LeetCode Accepted."""
import random
from solution import Solution

solve = Solution().containsDuplicate
cases = [[5, 2, 9, 2], [5, 2, 9, 6], [1], [0, 0], [-10**9, 10**9], [-4, 0, 9, -4]]
rng = random.Random(75003)
cases += [[rng.randrange(-30, 31) for _ in range(rng.randrange(1, 28))] for _ in range(5000)]
for nums in cases:
    original = nums.copy()
    expected = any(nums[i] == nums[j] for i in range(len(nums)) for j in range(i + 1, len(nums)))
    assert solve(nums) == expected, (nums, expected)
    assert nums == original
for nums, expected in [(list(range(100000)), False), (list(range(99999)) + [1], True)]:
    assert solve(nums) == expected
print(f'{len(cases) + 2} local cases passed; actual LeetCode verification still required.')
