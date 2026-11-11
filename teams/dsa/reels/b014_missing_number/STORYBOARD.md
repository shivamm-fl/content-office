# Storyboard — Blind 75 14: Missing Number

Owner tempo 0.9; 94.5s. Actual accepted source; no invented runtimes.

| Scene | Seconds | Viewer learns |
|---|---|---|
| A | 0.0–11.1 | Input4,0,2,1 below complete range0 through4 with3 visibly absent |
| B | 11.1–20.3 | Candidate3 scans each cell and fails membership |
| C | 20.3–32.9 | Repeated candidate-to-array edges expose quadratic scans |
| D | 32.9–48.3 | Matched range and input values pair off; unpaired3 remains |
| E | 48.3–65.3 | Accumulator4 to0 to1 to1 to3 synchronized with index,value pairs |
| F | 65.3–81.4 | Complete Accepted source with length seed, enumerate and XOR highlights |
| G | 81.4–94.5 | Unmatched zero and n boundary diagrams; O(n) pass and scalar state |
