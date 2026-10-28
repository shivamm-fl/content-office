# Visual plan: s010 Availability and the nines

Idea in one line: availability is uptime divided by total time; each extra nine cuts the yearly downtime by 10x; parts in a row multiply their availabilities, so the total is lower than any part.
The picture that explains it with the sound off: a year bar with a red sliver of downtime, then a ladder of cards (99%, 99.9%, 99.99%, 99.999%) with red downtime bars on one shared scale, each ten times shorter, then a three-box chain whose numbers multiply into a longer red bar.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | 99.9% means how long down per year; about 9 hours; on payment day | A green year bar with 12 month ticks; a red sliver lands on it; a dashed line drops to a phone PAYMENT card that gets a red cross | 1 YEAR, 9 HOURS, PAYMENT | custom bar, M.icon, panel |
| B | uptime vs availability, in percent | One bar split green (up) and red (down); green bracket UPTIME, gold bracket TOTAL TIME; cards UPTIME / TOTAL = AVAILABILITY % | UPTIME, TOTAL TIME, AVAILABILITY % | custom bar, cards |
| C | 365 x 24 = 8,760 hours | Three stacked cards with globe and clock icons: 365 DAYS, x, 24 HOURS, then green 8,760 HOURS | HOURS IN A YEAR, 365 DAYS, 24 HOURS, 8,760 HOURS | cards, M.icon |
| D | 0.1% of 8,760 = 8.76 hours | Cards 99.9% UP and 0.1% DOWN, then 8,760 H x 0.1% = 8.76 HOURS, and the year bar with the red sliver | 99.9% UP, 0.1% DOWN, 8.76 HOURS | cards, year bar |
| E | add a nine: 52.6 min, 5.26 min | Ladder rows with percent cards and red downtime bars on one shared scale; each new row's bar is far shorter; 99% slot is an empty dashed shell | SAME SCALE, 99.99%, 52.6 MIN | custom ladder |
| F | 99% = 3.65 days; each nine is 10x | The same ladder; the 99% row slots in at the top with a long red bar; a green ÷10 on each lower row; stamp | 3.65 DAYS, ÷ 10, EACH NINE = ÷ 10 | custom ladder, stamp |
| G | app is a chain: balancer, app server, database | Phone on top, three boxes with arrows between; all get a green ring; payment check | LOAD BALANCER, APP SERVER, DATABASE, ALL 3 NEEDED | M.box, M.arrow, M.icon |
| H | three parts of 99.9% multiply to 0.997 | Three box icons over three 0.999 cards joined by x, then = 0.997; EXAMPLE pill; MULTIPLY stamp | EXAMPLE, 0.999, 0.997, MULTIPLY | M.box, cards |
| I | 99.7% means 26 hours, about 3x one part | Card 99.7%, 0.3% DOWN, two red bars: 3 PARTS 26 H long against 1 PART 9 H short, stamp 3x more down | 99.7%, 26 H, 9 H, 3X MORE DOWN | cards, bars |
| J | works if failures independent and all needed; more parts, lower total | Two chips; six server icons join one by one on a line; a green bar shrinks and turns red with a warning | INDEPENDENT FAILURES, ALL NEEDED, AVAILABILITY | M.pill, M.icon, bar |
| K | remember: 365 x 24, percent down; ask parts and maintenance | Cards 365 x 24 and % DOWN, then an ASK pill over two question cards with server and gear icons | REMEMBER, ASK, HOW MANY PARTS?, MAINTENANCE? | cards, M.icon |
| L | quiz: 3 parts of 99.99%; comment; follow | Three boxes of 99.99% joined by x, stamp TOTAL = ?, comment card, FOLLOW pill pressing | YOUR TURN, TOTAL = ?, COMMENT KARO, FOLLOW | M.box, panel, M.pill |

## FIX (reviewers' notes)
A, D, E, F, H, L enlarged to fill the frame (taller bars, cards and boxes, ladder pitch 240 px). E and F show the 99% reference row dimmed from the start, so no empty slot. J draws six servers from the first frame, red crosses on single servers for independent failures, then a shrinking availability bar. K now shows three chained servers (HOW MANY PARTS?) and a year bar with a PLANNED and a CRASH sliver (COUNTED?) instead of text boxes. B bar labelled UP and DOWN.
