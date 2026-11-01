from typing import List


class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        best = 0
        while left < right:
            width = right - left
            area = min(height[left], height[right]) * width
            best = max(best, area)
            if height[left] <= height[right]:
                left += 1
            else:
                right -= 1
        return best
