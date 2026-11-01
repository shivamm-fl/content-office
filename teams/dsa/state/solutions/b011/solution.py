class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        sign = 0x80000000
        while b:
            a, b = (a ^ b) & mask, ((a & b) << 1) & mask
        return a if a < sign else ~(a ^ mask)
