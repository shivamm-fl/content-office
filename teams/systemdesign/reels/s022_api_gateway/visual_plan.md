# Visual plan: s022 API gateway

Idea in one line: an API gateway is the single front door in front of many services; it routes, combines several calls into one answer and does shared checks once; the price is one more hop and a single point of failure.
The picture with the sound off: one fixed frame (phone on the left, a tall gateway card in the middle, five service tiles in a column on the right). Without the gateway the phone draws five red wires; with it, one wire in and five out; answers fold back into one.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | gateway makes 5 calls into 1 | Full frame on screen from frame 0: five gold dots fan out of the gateway to the services, one gold dot goes phone to gateway | 5 CALLS → 1 | tile(), dot(), M.arrow |
| B | app has 20 services, home screen needs 5 | EXAMPLE pill, phone, a grid of 20 small server tiles, a red question chip on the phone; the grid fades and five named tiles appear one per spoken service | EXAMPLE, 20 SERVICES, PROFILE, ORDERS, OFFERS, CART, REVIEWS | tile(), chip |
| C | five addresses, five logins, 500 ms | Phone with five messy dashed red wires to the tiles, a lock on each tile, five dots go one after another while a time strip of five boxes fills red, 100 MS chip, 500 MS stamp | 100 MS, 500 MS | direct(), dots, strip |
| D | gateway = reception desk, one entry point | Red wires vanish, the gateway card slides in with one wire in and five out; it turns into a DESK with a bell, a VISITOR chip and a dot walk to one service ring, then back to GATEWAY | VISITOR, DESK, GATEWAY, ENTRY POINT | tile(), ring, dot |
| E | job 1: routing | Chip /orders over the phone, dot to the gateway, ring on the gateway, dot goes only to the ORDERS tile; a ROUTES list card appears, phone chip becomes NO CHANGE | /orders, ROUTES, NO CHANGE | tile(), panel, chip |
| F | job 2: combine calls | HOME chip, one dot in, five dots out to all services, five hollow green dots back, one green hollow dot to the phone, then 5 CALLS vs 1 CALL chips | HOME, 5 CALLS, 1 CALL | dots, chips |
| G | job 3: auth and throttle once at the gate | Phone on top, a big gateway panel with AUTH (lock) and THROTTLE (gauge) rows, a dot passes, two green checks, CHECKED ONCE stamp; a grid of 20 small locks (x20) fades and the panel gets a gold ring | AUTH, THROTTLE, CHECKED ONCE, x20 | panel, tile, grid |
| H | reverse proxy vs gateway | Two panels: reverse proxy door fans to three same servers (FORWARD, SPLIT LOAD); gateway card with four chips ROUTE, WHO, HOW OFTEN, MERGE | REVERSE PROXY, API GATEWAY | panel, tile, chips |
| I | the catch: extra hop, single point, copies | Phone, gateway, services stacked; a +1 HOP chip; the gateway gets covered and crossed (ALL CALLS DEAD); a dashed plus slot fills with GATEWAY 2 and a balancer card appears on top with wires to both | +1 HOP, ALL CALLS DEAD, GATEWAY 2, BALANCER | tile(), arrows |
| J | comment and follow | Phone, three screen chips HOME CART SEARCH each with a ? stamp, comment field, FOLLOW pill pressing | HOME, CART, SEARCH | tile, pill |
