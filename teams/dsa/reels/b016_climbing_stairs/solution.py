class Solution:
    def climbStairs(self, n: int) -> int:
        previous, current = 1, 1
        for _ in range(2, n + 1):
            previous, current = current, previous + current
        return current
