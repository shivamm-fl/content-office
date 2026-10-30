# Visual plan: Day 11, single point of failure

Idea in one line: if one part has no backup, its failure stops everything; add a twin, but then check the switch itself.
The picture that explains it with the sound off: one fixed chain (USER, LOAD BALANCER, SERVER, DATABASE); a red box greys out the rest, then a twin appears and traffic reroutes, then the single balancer fails and gets its own twin.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | one server fell, app stopped | The four-box chain is on screen from frame 0; the server gets a red ring, the other boxes dim, an APP DOWN stamp lands | APP DOWN | custom: M.box chain, ring, cover |
| B | shop with one counter | A full shelf of green squares, three customers walking to a single counter box that turns red, NO SALE stamp | FULL SHELF, ONE COUNTER, NO SALE | custom shop picture, M.box, M.icon |
| C | request path | Boxes appear in order user, balancer, server, database while a gold dot travels down the arrows | SPLITS TRAFFIC | chain helper, arrow.travel |
| D | server down is the SPOF | Same chain; server turns red, DOWN becomes a gold SPOF stamp, a dashed empty NO BACKUP slot appears beside it | DOWN, APP DOWN, SPOF, NO BACKUP | chain helper, stamps |
| E | three steps | Three big numbered rows with icons: find, add, check | FIND SPOF, ADD COPY, CHECK COPY | custom panels |
| F | step 1: ask each part | A gold ring walks down the chain asking each part; the server dies, the rest dim, a stamp says YES = SPOF | IF IT DIES?, DIES, ALL STOP, YES = SPOF | chain helper, rings |
| G | step 2: add a copy, failover | A dashed slot beside SERVER 1 fills with SERVER 2; SERVER 1 goes red, the balancer arrow to it turns dashed red and a gold dot travels to SERVER 2 | REDUNDANCY, FAILOVER | M.box, M.arrow, travel |
| H | the arithmetic | Two year bars each with a 1% red sliver at different places, a BOTH DOWN bar that has almost no red, then 1% x 1% = 0.01%, then 99.99% over a year bar with 53 MIN | EXAMPLE, 99.99%, 53 MIN DOWN | custom bars, cards |
| I | must fail independently | Two servers each fed by one shared ONE SOCKET box; first one alone fails and the other stays up, then the socket goes red and both go red | ONE SOCKET, COUNTS AS 1 | M.box, M.arrow, rings |
| J | step 3: check the switch | Two servers behind one balancer; the balancer goes red and greys both servers, NEW SPOF; then it slides left and a twin balancer appears with crossing arrows | NEW SPOF, TWIN LB | M.box move, arrows |
| K | cost, then biggest loss first | One server with COST x1 becomes two servers with COST x2; then three parts with red loss bars and a gold ring on the longest, DOUBLE FIRST | COST x2, EXAMPLE, DOUBLE FIRST | custom bars |
| L | the SPOF moves | Chain with a gold SPOF tag at the server; it slides up to the balancer box which gets a red ring; ASK AGAIN stamp | SPOF, + BACKUP, ASK AGAIN | chain helper, tween |
| M | comment and follow | Three part boxes with WHICH IS ALONE? stamp, a comment card with three option pills, then a FOLLOW pill pressed | WHICH IS ALONE?, COMMENT KARO | panel, pills |

FIX notes: C starts with dashed empty slots for the four boxes; D adds a cross on the server and a red dashed arrow to the database; E shows a mini picture in each step (three servers one red + magnifier; server + green copy; balancer + green twin); H starts with the two year bars, 1% DOWN labels and ghost slivers on the BOTH AT ONCE bar; K ranks neutral PART A/B/C by loss; L adds a green ring on the server (backup) before the SPOF tag slides to the balancer.
