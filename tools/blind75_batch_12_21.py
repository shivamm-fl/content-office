"""Original solutions and reproducible independent tests for Blind75 b012-b021.
No LeetCode transport, credentials, approvals or publishing.
"""
import hashlib, itertools, json, random, runpy
from collections import deque
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'teams/dsa/state/solutions'
SOURCES={
'b012': '''class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count
''',
'b013': '''from typing import List


class Solution:
    def countBits(self, n: int) -> List[int]:
        counts = [0] * (n + 1)
        for value in range(1, n + 1):
            counts[value] = counts[value >> 1] + (value & 1)
        return counts
''',
'b014': '''from typing import List


class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        missing = len(nums)
        for index, value in enumerate(nums):
            missing ^= index ^ value
        return missing
''',
'b015': '''class Solution:
    def reverseBits(self, n: int) -> int:
        reversed_bits = 0
        for _ in range(32):
            reversed_bits = (reversed_bits << 1) | (n & 1)
            n >>= 1
        return reversed_bits
''',
'b016': '''class Solution:
    def climbStairs(self, n: int) -> int:
        previous, current = 1, 1
        for _ in range(2, n + 1):
            previous, current = current, previous + current
        return current
''',
'b017': '''from typing import List


class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for total in range(1, amount + 1):
            for coin in coins:
                if coin <= total:
                    dp[total] = min(dp[total], dp[total - coin] + 1)
        return dp[amount] if dp[amount] <= amount else -1
''',
'b018': '''from bisect import bisect_left
from typing import List


class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for value in nums:
            position = bisect_left(tails, value)
            if position == len(tails):
                tails.append(value)
            else:
                tails[position] = value
        return len(tails)
''',
'b019': '''class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        rows, cols = len(text1), len(text2)
        dp = [[0] * (cols + 1) for _ in range(rows + 1)]
        for row in range(1, rows + 1):
            for col in range(1, cols + 1):
                if text1[row - 1] == text2[col - 1]:
                    dp[row][col] = 1 + dp[row - 1][col - 1]
                else:
                    dp[row][col] = max(dp[row - 1][col], dp[row][col - 1])
        return dp[rows][cols]
''',
'b020': '''from typing import List


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
''',
'b021': '''from typing import List


class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        ways = [0] * (target + 1)
        ways[0] = 1
        for total in range(1, target + 1):
            for value in nums:
                if value <= total:
                    ways[total] += ways[total - value]
        return ways[target]
''',
}

def tests(rid, cls):
    rng=random.Random(12112026); count=0
    def check(actual,expected):
        nonlocal count
        assert actual == expected,(rid,actual,expected)
        count+=1
    s=cls()
    if rid=='b012':
        for n in list(range(1,10000))+[1<<i for i in range(31)]+[2**31-1]+[rng.randrange(1,2**31) for _ in range(2000)]:
            check(s.hammingWeight(n),bin(n).count('1'))
    elif rid=='b013':
        for n in list(range(200))+[100000]+[rng.randrange(10001) for _ in range(100)]:
            check(s.countBits(n),[bin(i).count('1') for i in range(n+1)])
    elif rid=='b014':
        for n in range(1,30):
            for missing in range(n+1):
                a=[i for i in range(n+1) if i!=missing];rng.shuffle(a);before=a[:]
                check(s.missingNumber(a),missing);check(a,before)
        for missing in [0,5000,10000]:
            a=[i for i in range(10001) if i!=missing];rng.shuffle(a)
            check(s.missingNumber(a),missing)
    elif rid=='b015':
        values=[0,2,43261596,2147483644]+[1<<i for i in range(1,31)]+[rng.randrange(2**30)*2 for _ in range(5000)]
        for n in values:check(s.reverseBits(n),int(f'{n:032b}'[::-1],2))
    elif rid=='b016':
        def brute(n):return 1 if n<=1 else brute(n-1)+brute(n-2)
        for n in range(1,21):check(s.climbStairs(n),brute(n))
        for n in range(1,46):
            import math
            check(s.climbStairs(n),sum(math.comb(n-twos,twos) for twos in range(n//2+1)))
    elif rid=='b017':
        def bfs(coins,amount):
            q=deque([(0,0)]);seen={0}
            while q:
                value,depth=q.popleft()
                if value==amount:return depth
                for coin in coins:
                    nxt=value+coin
                    if nxt<=amount and nxt not in seen:seen.add(nxt);q.append((nxt,depth+1))
            return -1
        for k in range(1,5):
            for coins in itertools.combinations(range(1,9),k):
                for a in range(21):check(s.coinChange(list(coins),a),bfs(coins,a))
        for coins,a,want in [([1],10000,10000),([2147483647],10000,-1),([1,3,4],6,2),([2],3,-1),([2],0,0)]:check(s.coinChange(coins,a),want)
    elif rid=='b018':
        def brute(nums):
            best=0
            for mask in range(1<<len(nums)):
                v=[x for i,x in enumerate(nums) if mask>>i&1]
                if all(a<b for a,b in zip(v,v[1:])):best=max(best,len(v))
            return best
        for _ in range(800):
            a=[rng.randrange(-5,6) for _ in range(rng.randrange(1,11))];before=a[:]
            check(s.lengthOfLIS(a),brute(a));check(a,before)
        for a,want in [([2,2,2],1),(list(range(2500)),2500),(list(range(2500,0,-1)),1),([-4,6,2,7,3,8],4)]:check(s.lengthOfLIS(a),want)
    elif rid=='b019':
        def brute(a,b):
            subs={''.join(x for i,x in enumerate(a) if mask>>i&1) for mask in range(1<<len(a))}
            best=0
            for sub in subs:
                it=iter(b)
                if all(any(c==x for c in it) for x in sub):best=max(best,len(sub))
            return best
        for _ in range(1000):
            a=''.join(rng.choices('abc',k=rng.randrange(1,9)));b=''.join(rng.choices('abc',k=rng.randrange(1,9)))
            check(s.longestCommonSubsequence(a,b),brute(a,b))
        check(s.longestCommonSubsequence('a'*1000,'a'*1000),1000)
        check(s.longestCommonSubsequence('a'*1000,'b'*1000),0)
    elif rid=='b020':
        def brute(text,words):
            if not text:return True
            return any(text.startswith(w) and brute(text[len(w):],words) for w in words)
        universe=['a','b','ab','ba','aa','bb','aba','bab']
        for _ in range(2000):
            text=''.join(rng.choices('ab',k=rng.randrange(1,12)));words=rng.sample(universe,rng.randrange(1,9))
            check(s.wordBreak(text,words),brute(text,words))
        for text,words,want in [('cars',['car','ca','rs'],True),('catsandog',['cats','dog','sand','and','cat'],False),('a'*299+'b',['a'*i for i in range(1,21)],False),('a'*300,['a'],True)]:check(s.wordBreak(text,words),want)
    elif rid=='b021':
        def brute(nums,target):
            if target==0:return 1
            return sum(brute(nums,target-x) for x in nums if x<=target)
        for k in range(1,5):
            for nums in itertools.combinations(range(1,8),k):
                for target in range(1,11):check(s.combinationSum4(list(nums),target),brute(nums,target))
        for nums,target,want in [([1,2],3,3),([2,4],7,0),([1000],1000,1),([1],1000,1),([999],1000,0)]:check(s.combinationSum4(nums,target),want)
    return count

def main():
    summary={}
    for rid,source in SOURCES.items():
        dest=BASE/rid;dest.mkdir(parents=True,exist_ok=True)
        path=dest/'solution.py'
        if path.exists():assert path.read_text(encoding='utf-8')==source,'Do not overwrite changed source'
        else:path.write_text(source,encoding='utf-8',newline='\n')
        ns={};exec(compile(source,str(path),'exec'),ns)
        count=tests(rid,ns['Solution'])
        report=dict(item=rid,local_tests_passed=count,code_sha256=hashlib.sha256(source.encode()).hexdigest(),leetcode_accepted=False,studio_started=False,seed=12112026)
        (dest/'local-verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        (dest/'test_solution.py').write_text('from pathlib import Path\nimport runpy\nns = runpy.run_path(str(Path(__file__).resolve().parents[5] / "tools/blind75_batch_12_21.py"))\nsolution = runpy.run_path(str(Path(__file__).with_name("solution.py")))\nprint(ns["tests"]("'+rid+'", solution["Solution"]))\n',encoding='utf-8')
        summary[rid]=count
    print(json.dumps(summary,indent=2))

if __name__=='__main__':main()
