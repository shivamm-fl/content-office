# Visual plan: s017 Layer 4 vs Layer 7 Load Balancers

Idea in one line:
A layer 4 balancer sees only an envelope with IP:port on it; a layer 7 balancer opens it, reads /pay or /images, and sorts them into separate server groups. A courier sorter carries the idea.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | /pay and /images land on one server | Gold /pay card and cyan /images card both send arrows down into a single red server box | /pay, /images, ONE SERVER | custom cards, M.box, M.arrow |
| B | balancer cannot tell requests apart | Two request cards enter a balancer; three servers below, first marked PAY; a crossed-out eye appears and a /pay chip drops onto the wrong server, which turns red | LOAD BALANCER, PAY, PAYMENT ONLY | M.box, M.arrow, custom chips |
| C | layer 7 reads the URL path, layer 4 only IP and port | Two stacked balancer boxes: the layer 7 box with an eye and a /pay path chip, the layer 4 box with an IP:PORT chip and a red cross | LAYER 7, LAYER 4, IP : PORT | M.box, chips, ring |
| D | courier sorter reads only the city; layer 4 reads connection info | Parcel with DELHI goes into a sorter then a truck; then an envelope face with IP, PORT, PROTOCOL rows appears and a door icon explains port | DELHI, SORTER, DOOR NUMBER | custom parcel, envelope rows, M.box |
| E | one connection stays on one server, inside is not read | Sealed IP:PORT envelope goes through the layer 4 box to server 1 only; below, /pay and /images chips with a crossed eye | SAME SERVER, NOT READ | M.box, M.arrow, custom |
| F | second sorter opens the parcel; layer 7 reads the HTTP request | Parcel opens to a FRAGILE slip sent to its own counter; then an HTTP request card with PATH, HOST, HEADER rows lit one by one | FRAGILE, HTTP REQUEST, PATH, HOST, HEADER | custom parcel, request card, rings |
| G | rule: /pay to payments, /images to images (EXAMPLE) | Two request chips enter a layer 7 box; gold arrow to a PAYMENTS group of 2 servers, cyan arrow to an IMAGES group of 3; a /pay chip crossed out beside images | EXAMPLE, PAYMENTS, IMAGES | custom panels, M.box, M.arrow |
| H | HTTPS hides the path until decrypted | Request card with /pay is covered by a lock and blocks; arrow into layer 7 box; DECRYPT stamp, lock opens, the path is highlighted green | HTTPS, DECRYPT | custom card, icons, ring |
| I | trade-off: reads every request vs less work | Two panels: layer 7 with four coloured request cards each getting an eye; layer 4 with four identical IP:PORT cards and no eyes, marked LESS WORK | LAYER 7, LAYER 4, LESS WORK | custom panels, cards, icons |
| J | the rule: path or host is layer 7, just split is layer 4 | Two rows: PATH and HOST chips arrow to a LAYER 7 box; CONNECTIONS chip arrows to a LAYER 4 box | THE RULE, PATH, HOST | panels, chips, M.box |
| K | comment: layer 4 or layer 7 for host? | Comment panel with SPLIT BY HOST question, two option chips popping on their words, input bar, FOLLOW pill pressing | COMMENT, LAYER 4, LAYER 7 | panel, chips, M.pill |


FIX pass (2026-11-06): B, C, E, H, I, J, K redrawn bigger. C shows one request (IP:PORT face, /pay letter inside) that layer 7 reads inside and layer 4 cannot; D and F show their shapes from the first frame; I text raised above 34 px; J adds server-group dots (split groups vs one pool); K uses two big option boxes.
