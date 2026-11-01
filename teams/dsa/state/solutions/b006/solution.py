from typing import List


class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        high = low = best = nums[0]
        for i in range(1, len(nums)):
            num = nums[i]
            old_high, old_low = high, low
            high = max(num, old_high * num, old_low * num)
            low = min(num, old_high * num, old_low * num)
            best = max(best, high)
        return best
