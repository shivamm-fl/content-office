from typing import List


class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        ways = [0] * (target + 1)
        ways[0] = 1
        for total in range(1, target + 1):
            for value in nums:
                if value <= total:
                    ways[total] += ways[total - value]
        return ways[target]
