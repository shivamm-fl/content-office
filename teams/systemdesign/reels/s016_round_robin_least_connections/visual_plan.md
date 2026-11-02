# Visual plan · 4 November 2026

| Scene | Spoken beat | Picture | Labels | Built with |
|---|---|---|---|---|
| A | Which server gets the request? | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | A:6 · B:1 · C:3, New request, Which policy? | Custom SVG and phrase-aligned GSAP |
| B | Equal healthy backends | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | Equal weights, A → B → C → A, Round robin | Custom SVG and phrase-aligned GSAP |
| C | Equal assignments | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | 6 assignments → 2 each, Not equal active load, Durations vary | Custom SVG and phrase-aligned GSAP |
| D | Round robin at this snapshot | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | Snapshot: 6 / 1 / 3, Next pointer: A, RR chooses A | Custom SVG and phrase-aligned GSAP |
| E | Least connections | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | Compare active counts, LC chooses B, B: 1 → 2 | Custom SVG and phrase-aligned GSAP |
| F | A useful proxy | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | Variable lifetimes, Connection count ≠ CPU, Measure actual latency | Custom SVG and phrase-aligned GSAP |
| G | Choose with the workload | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | Similar work → try RR, Variable work → evaluate LC, Load-test the choice | Custom SVG and phrase-aligned GSAP |
| H | Quick check | The same three backend servers retain explicit active connection counts; cursor selection and minimum-count selection show different new-request routes. | RR → A, LC → B, No speed guarantee | Custom SVG and phrase-aligned GSAP |
