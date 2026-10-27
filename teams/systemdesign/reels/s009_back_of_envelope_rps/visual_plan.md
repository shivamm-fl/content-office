# Visual plan: s009 Back-of-envelope, users to requests per second

Idea in one line: users x requests per user / 86,400 gives the average requests per second; a peak factor gives the number a server is built for; x response time gives requests in flight.
The picture that explains it with the sound off: calculation cards that build in order (users, x requests, = per day, / 86,400, = average), a day-long bar chart whose evening bar grows to the peak, then a server panel filling with 140 request dots.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | interviewer asks peak RPS; step one total requests per day; what a request is | Four phone icons send arrows down into a SERVER box; a tally card shows ? REQUESTS / DAY; a doc icon marks one REQUEST (open feed) | SERVER, ? REQUESTS / DAY, REQUEST, OPEN FEED | M.box, M.icon, M.arrow, card |
| B | 10 lakh users x 20 requests = 2 crore a day | Three big stacked cards: user icon 10 LAKH USERS, x, doc icon 20 / USER with FEED, REFRESH, LIKE chips, =, green 2 CRORE / DAY | STEP 1, EXAMPLE, 10 LAKH USERS, 20 / USER, 2 CRORE / DAY | cards, M.pill |
| C | daily total is no server number; small server sits down, big wastes money; RPS | A grey 2 CRORE / DAY card gets a red cross; two panels: TOO SMALL server with crowd and warning, TOO BIG server with a coin; RPS stamp | WHY RPS?, TOO SMALL, TOO BIG, RPS = REQUESTS / SECOND | cards, panel, M.icon |
| D | divide by 86,400 seconds = 231 average | A day strip cut into 24 hour ticks labelled 1 DAY = 86,400 SEC; cards 2 CRORE / 86,400 = 231 RPS; a flat row of 24 equal green bars grows as the average | STEP 2, 86,400, 231 RPS, AVERAGE | cards, custom bars |
| E | requests not equal; evening rush; peak factor 3x; 231x3 = 700 | 24 hour bars start flat at the average line, the evening bars shoot up and night bars shrink, the peak bar turns gold with a x3 bracket; cards 231 x 3 = 700; stamp BUILD FOR PEAK | STEP 3, AVG 231, NIGHT, EVENING, x3, BUILD FOR PEAK | custom bars, cards |
| F | requests inside the server at once: 700 x 0.2 = 140 | A server panel; a clock card 0.2 SEC and a 700 / SEC card; cards 700 x 0.2 = 140; 140 cyan dots fill the panel | STEP 4, IN FLIGHT, 0.2 SEC, 700 / SEC, AT ONCE | panel, custom dots, cards |
| G | all an estimate; round numbers, open math; 700 or 7 lakh | An envelope icon with the scribbled sum; ESTIMATE stamp; a ruler with a green dot at 700 and a red dot at 7 LAKH, 1000X APART | ESTIMATE, ROUND, 700, 7 LAKH, 1000X APART | M.icon, custom ruler |
| H | remember the formula; one server or a hundred | Four stacked rows with icons: USERS, x REQ / USER, / 86,400 SEC, x PEAK FACTOR; below a 1 SERVER panel and a 100 SERVERS panel with a server grid | REMEMBER, USERS, REQ / USER, 86,400 SEC, PEAK FACTOR | cards, panel, M.icon |
| I | quiz: 1 crore users, 10 requests; comment; follow | Two cards (1 CRORE USERS, 10 REQ PER USER), stamp AVG RPS = ?, comment card with field, FOLLOW pill pressing | YOUR TURN, AVG RPS = ?, COMMENT KARO, FOLLOW | cards, panel, M.pill |
