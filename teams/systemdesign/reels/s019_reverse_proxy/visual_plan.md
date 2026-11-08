# Visual plan: s019 Reverse proxy vs load balancer

Idea in one line: a reverse proxy is the one front door in front of your servers; load balancing is just one of its jobs; the door is also a single point of failure.
The picture that explains it with the sound off: one fixed frame (clients on top, one door box in the middle, three servers below, dashed wires only through the door, never client to server). A request enters the door and leaves to one server; the response returns through the door. Job tags appear on the door; last the door gets a red cross, then a second door fills a dashed slot.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | interviewer: reverse proxy vs load balancer? | The fixed frame is on screen from frame 0, two gold and cyan dots run client to door to server; door gets a gold ring | REVERSE PROXY, LOAD BALANCER | frame(), req() |
| B | proxy is the whole front door, balancer one job | Same frame; gold ring and FRONT DOOR stamp on the door, then a small cyan LOAD BALANCER chip sits on the door's output side and the stamp becomes ONE JOB | FRONT DOOR, LOAD BALANCER, ONE JOB | frame(), ring, chip |
| C | hotel reception: guests never go to rooms | Same frame relabelled GUEST, RECEPTION (bell), ROOM (bed); a red dashed guest-to-room line gets a cross; a gold dot goes guest to desk to room and a green one returns | HOTEL, GUEST, RECEPTION, ROOM | frame(), dots, custom icons |
| D | proxy sits in front, backends are invisible | Real labels again; client dot goes to the door and the answer returns; the servers are covered by a dim layer with a crossed eye | HIDDEN | frame(), eyeoff icon |
| E | EXAMPLE: /app to group A, /static from cache | EXAMPLE pill; /app chip over client 1, a dot through the door to a server, a ring around the three servers labelled GROUP A; /static chip over client 3 goes to the door and a green dot returns from a CACHE chip, never reaching the servers | /app, /static, GROUP A, CACHE | frame(), chips, dots |
| F | step 1: request reaches the proxy | STEP 1 stamp; a gold dot from the client lands on the door, a cyan thought chip over the client says REAL SERVER? | STEP 1, REAL SERVER? | frame() |
| G | step 2: forward to one backend | STEP 2; ring on one server, a gold dot leaves the door to that server under a FORWARD chip | STEP 2, FORWARD | frame() |
| H | step 3: response goes back through the proxy | STEP 3; green hollow dot leaves the ringed server, passes the door and lands on the client under a RESPONSE chip | STEP 3, RESPONSE | frame() |
| I | the door can do many jobs | Door box on top, three stacked job cards: balance (balancer icon and three servers), TLS (lock, HTTPS chip then PLAIN chip), cache (doc beside a server crossed out) | BALANCE, TLS, CACHE | panels, icons |
| J | answer: balancing is the first of three jobs | A REVERSE PROXY panel holding three bars; LOAD BALANCER gets the gold ring, a green MOST COMMON stamp lands under it | LOAD BALANCER, TLS, CACHE, MOST COMMON | panel, chips |
| K | forward proxy is the opposite side | Two stacked rows CLIENT, PROXY, SERVER with arrows; in the forward row the crossed eye sits under the client, in the reverse row under the server | FORWARD PROXY, REVERSE PROXY | M.box, M.arrow |
| L | single point of failure, two copies | Clients, one proxy and servers; traffic flows, the proxy is covered and crossed, the SPOF stamp lands, a dashed plus slot fills with a green PROXY 2 and green wires | SPOF, PROXY 2 | custom frame |
| M | comment and follow | COMMENT card: ALL IN CACHE chip, BACKEND = ? stamp, grey server, comment field, then the FOLLOW pill presses | ALL IN CACHE, BACKEND = ? | panel, pill |
