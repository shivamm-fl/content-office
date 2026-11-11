# Visual plan — Coin Change

- A: Coins1,3,4 and amount6 show two3 coins forming the optimal answer
- B: Recursive remaining6 branches to5,3,2 with repeated smaller amounts
- C: Greedy4+1+1 marked3 coins;3+3 marked2 coins
- D: DP predecessor arrows total-minus-coin to total, selecting minimum candidate
- E: Chronological dp0 throughdp6 then three candidate comparisons at6
- F: First source chunk shows sentinel, zero base, nested loops and candidate transition
- G: Remaining exact source returns minus one for sentinel; A by M operations, A-state storage
