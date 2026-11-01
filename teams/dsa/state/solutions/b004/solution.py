from typing import List


class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        answer = [1] * len(nums)
        prefix = 1
        for i, num in enumerate(nums):
            answer[i] = prefix
            prefix *= num
        suffix = 1
        for i in range(len(nums) - 1, -1, -1):
            answer[i] *= suffix
            suffix *= nums[i]
        return answer
