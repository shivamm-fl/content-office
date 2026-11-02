def max_subarray(nums):
    current = best = nums[0]
    for i in range(1, len(nums)):
        x = nums[i]
        current = max(x, current + x)
        best = max(best, current)
    return best
