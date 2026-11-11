# Visual plan — Longest Increasing Subsequence

- A: Original six cells with indices0,2,4,5 selected to form length4
- B: Take/skip branch diagram showing exponential candidate choice
- C: Equal-length endings6 versus2 show which can accept a future3
- D: Sorted tail slots represent minimum possible ending for each length, not fixed chosen indices
- E: Six exact tail-array states, replacement keeps count and append grows count
- F: Source import and lower-bound branch; equal value uses replacement
- G: Remaining source returns length; tails summary warning and O(n log n),O(n)
