import json
import random
from pathlib import Path
from solution import Solution


def brute(prices):
    return max([0] + [prices[j] - prices[i] for i in range(len(prices)) for j in range(i + 1, len(prices))])


cases = [[8, 3, 6, 2, 7], [9, 1, 2], [5, 4, 3, 2], [0], [0, 0], [0, 10000], [10000, 0], [1, 2, 3, 4]]
rng = random.Random(75002)
for _ in range(5000):
    cases.append([rng.randrange(10001) for _ in range(rng.randrange(1, 25))])
for prices in cases:
    before = prices[:]
    assert Solution().maxProfit(prices) == brute(prices), prices
    assert prices == before
assert Solution().maxProfit([10000] * 99998 + [0, 10000]) == 10000
assert Solution().maxProfit([10000 - i // 10 for i in range(100000)]) == 0
example = [8, 3, 6, 2, 7]
low, best, trace = example[0], 0, []
for i, price in enumerate(example):
    candidate = price - low
    best = max(best, candidate)
    low = min(low, price)
    trace.append({"i": i, "price": price, "lowest": low, "candidate": candidate, "best": best})
result = {"local_tests_passed": len(cases) + 2, "example": example, "answer": 5, "trace": trace, "naive_pairs": 10, "maximum_n": 100000, "worst_case_pairs_at_max_n": 4999950000, "leetcode_accepted": False}
(Path(__file__).parent / "local-verification.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
print(f"Passed {len(cases)+2} cases, including two n=100000 cases. Example result 5. LeetCode verdict pending.")
