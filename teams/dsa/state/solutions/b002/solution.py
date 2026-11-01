from typing import List


class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        lowest = prices[0]
        best = 0
        for price in prices:
            best = max(best, price - lowest)
            lowest = min(lowest, price)
        return best
