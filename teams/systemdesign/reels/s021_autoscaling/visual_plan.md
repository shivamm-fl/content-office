# Visual plan: s021 autoscaling

Idea in one line: a metric (average CPU) is compared with a target; above it servers are added, below it they are removed, always between a minimum and a maximum.
The picture that explains it with the sound off: one fixed frame (users dots flow into a LOAD BALANCER, an AVG CPU meter with a dashed 50% target line, a pool of 12 slots where the first row of 4 is the minimum and the whole pool is the maximum). Server cards with a CPU bar slide in and out of the slots.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Sale night, traffic 10x, servers do not grow | Users send dots into the balancer, four server cards fill from cyan to red at 100 percent as the dots thicken | OVERLOAD | custom: frame, card, meter, rain |
| B | Autoscaling adds and removes servers; else app down or 10x servers all year | Three cards slide in and out, then all cards red with APP DOWN, then the whole pool full of cards with coins | APP DOWN, 10× SERVERS | custom: frame, card, coin icons |
| C | Metric, target, min and max | Ring round the CPU meter, dashed target line at 50 percent, ring round the first row for min and a dashed box round the pool for max | METRIC, TARGET, MIN 4, MAX 12 | custom: meter, targetLine, rowRing, poolBox |
| D | Above target scale-out, below scale-in | Meter climbs past the target line, three cards slide in and CPU settles, then the meter drops and the three cards leave | SCALE-OUT, SCALE-IN | custom: frame, card, meter |
| E | Example: 4 servers, 40 percent, target 50, sale 80 | Four cards fill to 40, target line appears, status chips MIN, MAX, NOW, then meter and bars jump to 80 | EXAMPLE, NOW 4, MIN 4, MAX 12 | custom: frame, meter, rain |
| F | Formula 4 x 80/50 = 6.4, round up to 7 | A formula panel builds chip by chip to 4 × 80 ÷ 50 = 6.4 → 7 above a pool where three new cards join | K8S FORMULA, ROUND UP, MAX 12, 7 < 12 | custom: chip, card |
| G | Sale over, back to minimum; bill follows usage not peak | Meter and cards fall, extra cards leave, then a step chart: green usage blocks versus a red dashed peak box with a cross | MIN 4, USAGE, PEAK | custom: frame, step chart |
| H | Catch 1: warm-up | A new card with a filling clock ring, ring around it NOT COUNTED, then a lock chip on scale-in | WARM-UP, NOT COUNTED, SCALE-IN LOCKED | custom: card, SVG ring |
| I | Catch 2: cooldown, 300 s | A CPU line spikes over the target, a scale-out marker, a shaded cooldown band where the second spike is IGNORED, a clock ring filling to 300 s | CPU OVER TIME, TARGET, SCALE-OUT, COOLDOWN, IGNORED, 300 s | custom: SVG paths, band, clock ring |
| J | Catch 3: running servers cost money, so max | Seven cards each get a coin, a BILL bar fills, a dashed box marks the cap | BILL, MAX 12 | custom: frame, coin, bar |
| K | Catch 4 (our own view): removed server loses its session; keep state in a store | Three servers with memory slots, a SESSION chip in C, C is crossed and the chip vanishes, then a SESSION STORE holds it | OUR OWN VIEW, SESSION LOST, SESSION STORE | custom: M.box, dead, stamp, panel |
| L | Recap, comment, follow | Four recap chips pop on their words, a comment card with CPU and REQUESTS pills, a FOLLOW pill | METRIC, TARGET, MIN · MAX, COOLDOWN, FOLLOW | custom: chip, panel, M.pill |
