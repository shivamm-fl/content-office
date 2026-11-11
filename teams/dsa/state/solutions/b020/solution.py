from typing import List


class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        reachable = [False] * (len(s) + 1)
        reachable[0] = True
        for end in range(1, len(s) + 1):
            for word in wordDict:
                start = end - len(word)
                if start >= 0 and reachable[start] and s.startswith(word, start, end):
                    reachable[end] = True
                    break
        return reachable[-1]
