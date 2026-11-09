# Visual plan: s020 stateless servers

Idea in one line: a server that keeps your cart in its own memory ties you to it; keep the cart in a shared store and any server can serve you.
The picture that explains it with the sound off: one fixed frame (USER, LOAD BALANCER, three servers each with a dashed memory slot, a SESSION STORE below). A cart chip sits in Server A's slot, the next request lands on B and finds EMPTY, A is crossed out and the cart vanishes. Then the cart moves into the store (key ID, value cart) and every server reads it.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | Why should a server not remember you? | User, balancer and three servers with memory slots; a request goes to A and a cart appears in its memory slot | REMEMBER?, × 2 | custom: frame(), cartChip, M.box, dot |
| B | Bank clerk reads your file each time | Customer, three clerks with empty memory slots (cross on clerk 1), a FILE panel below; request goes to a clerk, file opens and returns, then another clerk takes the next request | BANK, CLERK A/B/C, YOUR FILE | custom: frame(nolb), panel, dot, ring |
| C | Stateless server, state = cart | One big server box with MEMORY: EMPTY; a request passes in and out and nothing stays; STATE chip points to a CART chip | STATELESS SERVER, MEMORY: EMPTY, STATE, CART | custom: M.box, dashed slot, dot, cartChip |
| D | EXAMPLE: 2 items, request to A | Frame again; a cart chip next to the user, a request dot travels through the balancer to A, and the cart lands in A's memory slot | EXAMPLE, × 2 | custom: frame, reqTo, ring, cartChip |
| E | Next request goes to B, cart empty, A dies | Frame; cart in A; OPEN CART request goes to B whose slot shows EMPTY in red; A is covered and crossed, cart disappears | OPEN CART, EMPTY, CART LOST | custom: frame, dead, stamp |
| F | Cart moves into the shared session store (Redis), key = session ID | Frame with a SESSION STORE panel; the cart chip flies from A's slot into the panel; KEY chip (ID 7f3a) and VALUE chip (cart) show with an arrow | REDIS, KEY, VALUE, ID 7f3a | custom: frame(store), fly, chip |
| G | Session ID, cookie, three steps | Same frame with store; step 1 login creates ID in the server and sends it back to the user as a COOKIE; step 2 an ID chip rides with the request to Server C; step 3 C fetches the cart from the store and puts it back | STEP 1/2/3, ID 7f3a, COOKIE | custom: mchip, dot, cartChip, fly |
| H | Same example again | Frame with store; request goes to B, B reads the ID, the cart chip arrives in B from the store; A is crossed and a NEW SERVER stamp then NOTHING LOST | NEW SERVER, NOTHING LOST | custom: frame(store), dead, stamp |
| I | Remembering ties you to one server | Two stacked panels: REMEMBERS has one thick arrow user to A with B and C dimmed; FORGETS has three arrows to all servers | REMEMBERS, FORGETS | custom: panel, M.box, M.arrow |
| J | Sticky session, catch | Frame; thick arrows always to A with COOKIE and IP_HASH chips; A crossed, SESSIONS LOST stamp; two bars show B heavily loaded and C light | STICKY, COOKIE, IP_HASH, SESSIONS LOST, UNEVEN | custom: frame, dead, bars |
| K | Keep state outside; comment and follow | Three light servers feed a SESSION STORE holding the cart; comment card with two answer pills, comment field and FOLLOW pill | SESSION STORE, COMMENT KARO, FOLLOW | custom: M.box, panel, M.pill |
