# Storyboard — Blind 75 19: Longest Common Subsequence

Owner tempo 0.9; 101.5s. Actual accepted source; no invented runtimes.

| Scene | Seconds | Viewer learns |
|---|---|---|
| A | 0.0–12.8 | Strings axby and aby aligned with a,b,y links crossing a skipped x only |
| B | 12.8–27.1 | Take/skip tree for4 letters produces16 candidate subsets |
| C | 27.1–38.4 | Prefix pair state grid prevents repeated recursive pair work |
| D | 38.4–56.3 | Grid diagonal-plus-one for match, upper/left maximum for mismatch |
| E | 56.3–69.0 | Four exact DP rows reveal1,1,1 then1,1,1 then1,2,2 then1,2,3 |
| F | 69.0–84.1 | First exact source chunk shows table and nested prefix loops |
| G | 84.1–101.5 | Remaining equal/mismatch/return code with full-table memory accounting |
