# Visual plan: s008 Latency vs throughput

Idea in one line: latency is the wait for one request, throughput is how many get done per unit time; two numbers, and near the limit the line grows so latency climbs.
The picture that explains it with the sound off: a canteen counter with a queue; a clock shows the wait for one cup (latency), a tally shows cups per hour (throughput); a second counter doubles the tally while the clock stays; then more arrive than are served, the line grows and the last person's wait counts up.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | fast server still stuck, line does not clear, canteen | A counter box at the bottom with two rows of person icons queued above it; the rest of the crowd arrives on the words about many requests | THE LINE, CANTEEN, COUNTER | M.box, M.icon |
| B | one counter, tea takes 2 minutes, order to cup is latency | Counter with a person on the left and a cup on the right; a gold bar fills from ORDER to CUP while a clock card shows 2 MIN; LATENCY stamp lands | COUNTER, ORDER, CUP, 2 MIN, LATENCY | M.box, M.icon, custom bar |
| C | cups in one hour, 60 / 2 = 30 | Hour track of 30 segments fills one by one while 60 divided by 2 equals 30 appears; a tally card with cup shows 30 per hour; THROUGHPUT stamp | ONE HOUR, 60 MIN, 30 / HOUR, THROUGHPUT | custom segments, card |
| D | two different numbers | Two big stacked panels, LATENCY with clock and 2 MIN, THROUGHPUT with cup and 30 / HOUR, each filled on its word | LATENCY, THROUGHPUT, PER REQUEST, OR PER SECOND | panel, M.icon |
| E | second counter, latency same, throughput double | A second counter slides in beside the first; both get a 2 MIN clock chip, a SAME stamp, then two 30 tallies add up to 60 / HOUR and a 2X stamp | COUNTER 2, 2 MIN, 30, 60 / HOUR, 2X | M.box, cards, stamps |
| F | same in a server: counter = server, cup = request | Two mapping rows, counter to server, cup to request, then two lever panels: faster tea lowers latency (down triangle), more counters raise throughput (up triangle) | COUNTER, SERVER, CUP, REQUEST | M.box, M.arrow, panel |
| G | 40 arrive, 30 served, 10 pile up, last waits 20 min more | ARRIVE 40 and SERVED 30 panels, a LINE panel fills with 10 red people, a timer counts +0 to +20 MIN; a cyan chip says the cup is still 2 min | ARRIVE, SERVED, +10 WAITING, +20 MIN, CUP: STILL 2 MIN | panel, M.icon, counter tween |
| H | near the limit latency climbs, requests wait in line | A chart panel: latency vs load, flat then shooting up at a dashed red LIMIT line, drawn left to right; a row of request blocks queues below | LATENCY, LOAD, LIMIT, REQUESTS WAIT | custom SVG path |
| I | which number to fix: all replies late, or crowd stuck | Two stacked panels: users with red clocks = LATENCY, a crowd of 8 stuck people = THROUGHPUT | EVERY REPLY LATE, CROWD STUCK | panel, M.icon |
| J | quiz 2 ms and 500 per second, comment, follow | Server box with ONE REPLY 2 MS and EACH SECOND 500 MAX panels, stamp 2 MS = ?, comment card with the two options, follow pill | 2 MS, 500 MAX, COMMENT KARO, FOLLOW | panel, pills |
