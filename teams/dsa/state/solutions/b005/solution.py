from typing import List


class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        ending = best = nums[0]
        for i in range(1, len(nums)):
            num = nums[i]
            ending = max(num, ending + num)
            best = max(best, ending)
        return best
