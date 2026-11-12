# Visual plan: s023 token bucket

Idea in one line: a token bucket gives each client a bucket of tokens that refills at a steady rate; a request takes one token; an empty bucket means 429; so a client can burst up to the bucket size but never go above the refill rate over time.
The picture with the sound off: one fixed frame (client on top, a bucket card with ten round token slots in the middle, the server at the bottom, a tap at the top right that drops tokens). Requests are cyan dots flying down through the bucket; each one removes a token; a red dot bounces off an empty bucket with a 429 stamp.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | interviewer: limit per user? | Full frame from frame 0: client, a full bucket, server, tap; two request dots pass and take tokens, the tap refills one | BUCKET | FR() |
| B | a bucket per user, a request takes a token, empty = 429 | Tokens pop in, one dot takes one token, a burst empties the row, EMPTY chip, a red dot bounces off, 429 stamp | BUCKET, EMPTY, 429 | FR(), reject() |
| C | why limit: a script floods the server; 1 per second also blocks a real user | Buggy script rains dots on the server while a LOAD bar fills red, DOWN; then a striped gate "1 PER SEC": a user's five page calls arrive together, one passes, four get red crosses | BUGGY SCRIPT, LOAD, DOWN, 1 PER SEC, BLOCKED | dots, gate |
| D | tea stall coupon booklet | Same frame as a stall: customer, booklet of ten coupons, chai stall; a clock adds +1 / MIN; one tea cuts one coupon, a full booklet serves ten at once, then one per minute | BOOKLET, +1 / MIN | FR(coupon) |
| E | this is the token bucket: capacity, refill rate, overflow | Frame with the TOKEN BUCKET banner, a gold bracket CAPACITY under the card, the tap labelled REFILL RATE; a coin falls from the tap onto a full bucket and rolls off | TOKEN BUCKET, CAPACITY, REFILL RATE, OVERFLOW | FR(), spill |
| F | example: capacity 10, refill 1/s, 10 pass, the 11th gets 429 | EXAMPLE pill; ten dots empty the bucket, EMPTY, a red dot bounces, 429; one second later one token drops in and the next dot passes with a check | EXAMPLE, CAPACITY 10, REFILL 1 / SEC, EMPTY, 429 | FR() |
| G | one bucket gives two limits, 70 per minute | A tokens-left chart: steep gold drop (BURST) then a slow cyan climb (REFILL RATE); then a true-scale bar of 70 units: 10 gold + 60 cyan; two tiles BURST and SPEED LIMIT | EXAMPLE, BURST, REFILL RATE, 70 MAX, 1 MIN, SPEED LIMIT | SVG paths, bar |
| H | the three steps per request | Three stacked step cards: user key to bucket; clock adds tokens, capped at capacity (an extra coin bounces off with a cross); coin spent gives PASS or 429 | FIND BUCKET, ADD TOKENS, TAKE ONE, KEY, PASS, 429 | cards, mini rows |
| I | the catch: 5 servers, 5 buckets; share it | User and five servers each with its own bucket of 10, 50 REQUESTS, LIMIT BROKEN; the buckets fade, one SHARED BUCKET appears with wires from all five servers | THE CATCH, 50 REQUESTS, LIMIT BROKEN, SHARED BUCKET | tiles, arrows |
| J | comment burst size, follow | Bucket tile BURST?, three coin tiles 10 / 50 / 100, comment field, FOLLOW pill pressing | BURST?, 10, 50, 100 | tile, pill |
