# Storyboard — Blind 75 17: Coin Change

Owner tempo 0.9; 101.0s. Actual accepted source; no invented runtimes.

| Scene | Seconds | Viewer learns |
|---|---|---|
| A | 0.0–10.7 | Coins1,3,4 and amount6 show two3 coins forming the optimal answer |
| B | 10.7–24.2 | Recursive remaining6 branches to5,3,2 with repeated smaller amounts |
| C | 24.2–35.6 | Greedy4+1+1 marked3 coins;3+3 marked2 coins |
| D | 35.6–54.7 | DP predecessor arrows total-minus-coin to total, selecting minimum candidate |
| E | 54.7–69.6 | Chronological dp0 throughdp6 then three candidate comparisons at6 |
| F | 69.6–85.8 | First source chunk shows sentinel, zero base, nested loops and candidate transition |
| G | 85.8–101.0 | Remaining exact source returns minus one for sentinel; A by M operations, A-state storage |
