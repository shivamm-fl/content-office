# Storyboard — Blind 75 13: Counting Bits

Owner tempo 0.9; 90.5s. Actual accepted source; no invented runtimes.

| Scene | Seconds | Viewer learns |
|---|---|---|
| A | 0.0–11.3 | Scalar6 points to output cells0,1,1,2,1,2,2 indexed0 to6 |
| B | 11.3–20.3 | Separate binary scans for3 and6 reveal shared11 prefix |
| C | 20.3–31.8 | Arrow from binary110 back to already counted11 |
| D | 31.8–46.3 | Dependency graph i to i>>1 with the detached last-bit contribution |
| E | 46.3–58.9 | Ascending recurrence fills each of seven cells without jumping ahead |
| F | 58.9–74.3 | All Accepted method lines highlighted for allocation, recurrence and array return |
| G | 74.3–90.5 | One dependency per cell; output storage explicitly distinguished from auxiliary scalars |
