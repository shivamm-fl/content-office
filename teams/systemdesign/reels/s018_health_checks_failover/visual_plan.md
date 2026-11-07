# Visual plan: s018 Health checks and failover

Idea in one line: a balancer pings every server on a timer; a server that stays silent twice is cut off, the others take over, and interval x threshold is how long requests still reach it.
The picture that explains it with the sound off: one fixed frame (BALANCER on top, four servers S1 to S4 below, dashed wires between) in scenes A and C to H and K. Only the thing on the wires changes: gold request dots, hollow cyan ping dots going down and hollow green answers coming back, red cross ticks under the silent server, a striped gate across its wire.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | dead server still gets requests | Frame at once; gold dots drop onto S1, S2, S4 and vanish while red dots pile up on the greyed S3 with a cross | S1 to S4 | custom frame(), kill(), dot() on M.box and M.arrow |
| B | dhaba manager asks cooks, then balancer | Manager box sends three "ready?" chips down to cooks; two answer with ticks, one stays silent, order slips stop at the silent cook with a cross; then the same frame as A with dots | MANAGER, COOK, S1 to S4 | M.box, chip, ico, frame() |
| C | health check test request | Frame; hollow cyan pings fly down to all four servers, green ticks appear on each and green answers fly back up | HEALTH CHECK | frame(), dot() hollow, ico check |
| D | example, 4 servers, 1 dead, 25 percent fail | Round-robin gold dots reach all four, S3 greys with a cross, an eye-off icon beside the balancer, next round the S3 dot turns red with a cross tick and a 25% stamp | EXAMPLE, 25% FAIL | frame(), kill(), dot(), tick() |
| E | step 1, ping every 30 s | Two ping rounds with answers, a clock icon at the balancer, chips for the default | STEP 1, AWS DEFAULT, EVERY 30 s | round(), ico clock, chip |
| F | step 2, two failures in a row | S3 greyed; ping goes to it and no answer comes: red cross tick 1, a cloud with GLITCH explains one miss, second round gives cross tick 2 and an UNHEALTHY stamp | STEP 2, GLITCH, UNHEALTHY | round(dead), tick(), ico cloud |
| G | step 3, stop sending, others take over | Striped red gate closes across the S3 wire, dots now flow only to S1, S2, S4 which get green rings; STEP 3 becomes FAILOVER | STEP 3, FAILOVER | gate(), toSrv(), glow |
| H | step 4, comes back after 5 good answers | Pings keep flying to S3, five green answer ticks fill one by one, the gate lifts, wire turns green and S3 gets a green ring | STEP 4 | dot(), tick(), gate fade |
| I | interval x threshold = about 60 s | Equation 30 s x 2 = about 60 s on top; below a timeline with a red bar growing from the dead server across 60 s, gold request dots on it, cross marks at 30 and 60 | INTERVAL, THRESHOLD, 30 s, 60 s | custom timeline with scaleX bar |
| J | 5 s interval, 6x checks, false positive | Two lanes on one true scale: 30 s lane with 2 ticks and a long red bar, 5 s lane with 12 ticks and a short bar; below, a slow-but-alive server gets a cross and a FALSE POSITIVE stamp | EVERY 30 s, EVERY 5 s, 6x CHECKS, FALSE POSITIVE | custom lanes, M.box |
| K | all unhealthy, fail open | All four servers grey out with gates, then the gates lift, the wires turn red dashed and gold dots go to every server | AWS, FAIL OPEN | frame(), kill(), gate() |
| L | rule: more checks catch faster | Seesaw: checks (hollow dots) heavy on the left means a short red dead-time block; swaps to few checks and a tall red block on the right | CHECKS, DEAD TIME, FAST CATCH, SLOW CATCH | custom beam rotation |
| M | your turn, comment | Comment panel with EVERY 10 s and 3 FAILURES chips, a DEAD FOR ? stamp, a crossed server, comment bar and follow pill | EXAMPLE, COMMENT, FOLLOW | panel, chip, stamp |
