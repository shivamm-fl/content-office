# Visual plan — Counting Bits

- A: Scalar6 points to output cells0,1,1,2,1,2,2 indexed0 to6
- B: Separate binary scans for3 and6 reveal shared11 prefix
- C: Arrow from binary110 back to already counted11
- D: Dependency graph i to i>>1 with the detached last-bit contribution
- E: Ascending recurrence fills each of seven cells without jumping ahead
- F: All Accepted method lines highlighted for allocation, recurrence and array return
- G: One dependency per cell; output storage explicitly distinguished from auxiliary scalars
