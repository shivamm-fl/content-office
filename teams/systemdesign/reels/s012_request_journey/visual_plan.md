# Visual plan: s012 Ek request ka safar (recap)

Idea in one line: one click is one journey of five stops on one vertical road; every stop costs waiting time, and a stop with no backup stops the whole road.
The picture that explains it with the sound off: a phone, eight numbered round-trip cells lighting up, then five stops (DNS book, TCP handshake arrows, TLS lock and key, load balancer fanning to servers, server building the page), a bar of waiting time per stop that adds up, one red stop with no backup, and a multiplication of five 99.9% cards.

| Scene | Spoken (short) | The picture | Labels | Built with |
|---|---|---|---|---|
| A | 8 round trips before the request | Phone on top, server at the bottom, eight dashed numbered cells that fill gold one by one, a red stamp saying the request is not sent yet | NOT SENT YET | box, custom cells |
| B | round trip = ask and reply | Browser and server boxes, a down arrow that carries a token and an up arrow that brings it back, MDN pill | ASK, REPLY, 1 ROUND TRIP | box, arrow.travel |
| C | food order, then the click | Four stacked cards (address pin, confirm call, order bag, rider bike), a clock beside each, and a red cross on the last | ADDRESS, ORDER, RIDER | box, icons |
| D | five stops | Five dashed numbered slots in a column, a big 5 | STOPS | custom slots |
| E | DNS | Browser box and a ghost server box, name chip travels into a phone book panel with three rows, the row lights, the IP chip comes back and the ghost server turns solid | DNS PHONE BOOK, EXAMPLE | panel, chips |
| F | TCP handshake | Sequence diagram: two lifelines, three diagonal arrows SYN, SYN-ACK, ACK numbered 1 to 3, lifelines turn green | SYN, SYN-ACK, ACK, CONNECTED | arrows, chips |
| G | TLS | Lock beside the wire, keys at both ends, a HELLO card that turns into scrambled text while an eye is crossed out, a row of eight cells (3 TCP grey, 5 TLS gold) | HTTPS, TCP 3, TLS 5 | custom |
| H | HTTP + load balancer | Browser, request chip, load balancer, three servers, a dashed red direct line crossed out, the request travels to one server | GET /page, LOAD BALANCER | box, arrows |
| I | server and the way back | Phone, balancer, server in a column, the page card is built beside the server, green arrows carry the answer up, a page card appears beside the phone | SAME ROAD BACK | box, page card |
| J | latency, SPOF | The five-stop route with a red wait bar beside each, the bars add into one long total, then the last stop is ringed red, NO BACKUP slot, others dim | LATENCY, ALL ADDS UP, SPOF, ROUTE STOPPED | route, custom bars |
| K | 0.999 to the power 5 | Five 99.9% cards in a row, ALL MUST WORK, 0.999^5, 99.5%, a one-year bar with a thin red sliver of true size | EXAMPLE, 1 YEAR, 44 HR DOWN | custom |
| L | every stop fine, route weak, add copies | Route with green rings, WEAK ROUTE, SPOF on the server row, the server row becomes three servers | WEAK ROUTE, SPOF | route |
| M | recall | Three rows: more stops, more wait, more breaks | MORE STOPS, MORE WAIT, MORE BREAKS | custom |
| N | comment and follow | Five question slots, COUNT YOUR STOPS, comment box with a typed 5, follow button | COMMENT KARO | panel |
