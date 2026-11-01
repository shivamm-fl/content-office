"""Original local verification. This is not a LeetCode Accepted receipt."""
import json
import random
from pathlib import Path
from solution import Solution


def brute(nums, target):
    pairs = []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                pairs.append([i, j])
    return pairs


def validate(nums, target):
    before = nums[:]
    answer = Solution().twoSum(nums, target)
    expected = brute(nums, target)
    assert nums == before, "input was modified"
    assert len(answer) == 2 and answer[0] != answer[1]
    assert nums[answer[0]] + nums[answer[1]] == target
    assert sorted(answer) in expected


def main():
    fixed = [([4, 1, 8, 6], 14), ([7, 7], 14), ([-8, 3, -2, 9], 1), ([0, 0], 0), ([10**9, -10**9], 0), ([1, 2, 3, 4, 10], 14)]
    for nums, target in fixed:
        validate(nums, target)
    rng = random.Random(75001)
    unique = 0
    for _ in range(10000):
        nums = [rng.randint(-50, 50) for _ in range(rng.randint(2, 20))]
        i, j = rng.sample(range(len(nums)), 2)
        target = nums[i] + nums[j]
        if len(brute(nums, target)) == 1:
            validate(nums, target)
            unique += 1
    n = 10000
    large = [0] * (n - 2) + [4, 10]
    assert Solution().twoSum(large, 14) == [9998, 9999]
    nums, target = [4, 1, 8, 6], 14
    trace, seen, pair_checks = [], {}, []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            pair_checks.append({"indices": [i, j], "sum": nums[i] + nums[j], "match": nums[i] + nums[j] == target})
    for i, x in enumerate(nums):
        need = target - x
        row = {"i": i, "x": x, "need": need, "seen_before": dict(seen), "found": need in seen}
        trace.append(row)
        if need in seen:
            row["answer"] = [seen[need], i]
            break
        seen[x] = i
    result = {"verification": "local tests only; LeetCode Accepted pending", "fixed_cases": len(fixed), "seeded_unique_solution_cases": unique, "max_constraint_case": "passed n=10000", "example": {"nums": nums, "target": target, "answer": [2, 3], "brute_checks": pair_checks, "optimized_trace": trace}, "n10000_pair_count": n * (n - 1) // 2, "sources": ["https://leetcode.com/problems/two-sum/"]}
    (Path(__file__).parent / "local-verification.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Passed {len(fixed)} fixed + {unique} seeded unique-solution cases + maximum n=10000. Example: brute force 6 pairs, hash map 4 iterations. n=10000 pair count: 49,995,000. LeetCode Accepted: pending.")


if __name__ == "__main__":
    main()
