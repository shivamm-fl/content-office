# Visual plan: s013 Scalability

Idea in one line: when load grows, the weakest part of one server fills first and sets the speed; the fix is to find it, grow it, and split the crowd.
The picture that explains it with the sound off: a server box with a few user dots that turns into a crowd, a meter where 10 percent busy becomes a bar 1000 times past the limit, a server with three bars (CPU, memory, disk) where one fills red first, then copies of the server sharing the crowd, and one shared database filling next.

| Scene | Spoken (short) | The picture | Labels | Built with |
|---|---|---|---|---|
| A | interviewer: 100 users fine, 10 lakh breaks | Server box on the right, 3 user dots with an arrow, dots multiply into a crowd of 24, server ringed red | 100 USERS, 10 LAKH, BREAKS | box, dots |
| B | chai stall, 5 friends vs 500 students | Stall box on top, 5 dots (green SMOOTH), then a grid of 60 dots and a red JAM ring | 5 FRIENDS, 500 STUDENTS, JAM | box, dot grid |
| C | scalability, load = requests | Stack of request chips grows from 3 to 9 beside a server that keeps a green check | SCALABILITY, LOAD, STILL OK | chips, box |
| D | EXAMPLE: 100/sec limit, 10 busy | A long meter (the 100/sec limit), 20 user dots, the meter fills 10 percent and turns green | EXAMPLE, LIMIT 100/SEC, 10% BUSY | meter |
| E | 10 lakh / 10 = 1 lakh/sec | Equation cards, a tiny limit bar and a bar 1000 times longer running off the screen with a break mark | 10 LAKH USERS, 1,00,000/SEC, LIMIT 100 | cards, bars |
| F | 1000x load, code not slow | Server box turns red with a cross, a CODE box with a green check, one red full bar | 1000X LOAD, CODE OK, ONE FULL | box, gauge |
| G | CPU, memory, disk | Server card with three bars that rise; CPU goes red and full first | CPU, MEMORY, DISK, WEAKEST | server card |
| H | bottleneck, stove | The same card with the CPU column ringed, then a chai stall card with a full red stove and half-empty cups and cashier, queue stuck | BOTTLENECK, STOVE, CUPS, CASHIER | server card |
| I | 3 steps | Three numbered slots fill with boxes | FIND IT, GROW IT, SPLIT | slots, box |
| J | step 1 find which fills first | Server card, a magnifier slides over three columns and the full CPU is ringed; growing disk changes nothing | STEP 1, + DISK, STILL JAMMED | server card |
| K | step 2 vertical or horizontal | Two panels: one server grows bigger; one server becomes three | STEP 2, VERTICAL, HORIZONTAL | icons |
| L | step 3 split the crowd | Crowd dots, a balancer, three servers; the first red bar drops to green on all three | STEP 3, BALANCER | box, gauge |
| M | catch: shared database | Four servers all arrow into one database that gets a red ring | NOT 2X FASTER, SHARED, NEXT BOTTLENECK | icons, box |
| N | scalability is not speed | FASTER APP crossed out, LOAD up arrow, three boxes CPU MEMORY DISK with plus | FASTER APP, LOAD, WHAT GROWS? | cards |
| O | comment + follow | Question stamp, three option chips, comment box with typed CPU, follow pill | FIRST TO FILL?, CPU, MEMORY, DISK | panel |
