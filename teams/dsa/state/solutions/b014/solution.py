from typing import List


class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        missing = len(nums)
        for index, value in enumerate(nums):
            missing ^= index ^ value
        return missing
