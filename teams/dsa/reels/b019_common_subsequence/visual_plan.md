# Visual plan — Longest Common Subsequence

- A: Strings axby and aby aligned with a,b,y links crossing a skipped x only
- B: Take/skip tree for4 letters produces16 candidate subsets
- C: Prefix pair state grid prevents repeated recursive pair work
- D: Grid diagonal-plus-one for match, upper/left maximum for mismatch
- E: Four exact DP rows reveal1,1,1 then1,1,1 then1,2,2 then1,2,3
- F: First exact source chunk shows table and nested prefix loops
- G: Remaining equal/mismatch/return code with full-table memory accounting
