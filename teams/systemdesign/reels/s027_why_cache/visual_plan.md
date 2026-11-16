# Visual plan: s027, why a cache makes a system fast

Idea in one line: memory, disk and network are three distances from the CPU, and a cache is a nearby copy that turns a long trip into a short one.
The picture: one fixed ladder (actor on top, three places down a dashed spine, farther is lower) in A and B, a CPU / cache / far server frame in E and H, and true-scale bars in D and F.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | interviewer: why does a cache make it fast? | CPU tile on top, three places down a dashed spine, three gold dots travel down the spine and out to MEMORY, DISK, NETWORK, each trip longer | Why does a cache make it fast, CPU, MEMORY, DISK, NETWORK | custom ladder() |
| B | memory = masala dabba, disk = shop, network = other city, no mandi for salt | Same ladder with COOK on top and the three places renamed, an amber ring hops over them on their words, then a PINCH OF SALT chip and a dot toward the far tile gets a red cross | COOK, MEMORY · DABBA, DISK · SHOP, NETWORK · MANDI, PINCH OF SALT | custom ladder() |
| C | the five latencies from a 2012 list | Five rows (tile + amber number chip) filling on the spoken numbers, an amber ring hopping down the rows | ABOUT · 2012 LIST, MEMORY 100 ns, SSD 150 µs, SAME DATACENTER 500 µs, DISK SEEK 10 ms, ACROSS OCEAN 150 ms | custom rows |
| D | memory = 1 second, so SSD 25 min ... network 17 days | The same five rows, time chips and true-scale bars: three slivers, a small bar, then a bar filling the whole lane in red | OUR SCALE, 1 SEC, 25 MIN, 83 MIN, 28 HOURS, 17 DAYS | custom rows, bars |
| E | waiting far takes weeks, so keep a copy near (cache), hit, miss | CPU with a dashed CACHE slot beside it and a FAR SERVER far below; a gold dot crawls down the spine (WEEKS), a copy flies into the cache, a green dot hits the cache (HIT), a red one misses and walks the long spine | CPU, CACHE, FAR SERVER, WEEKS, COPY, HIT, MISS | custom |
| F | EXAMPLE: 1000 reads, no cache vs cache | Two true-scale bars: a full red bar of 1000 trips, then a gold sliver (1 trip) next to a long green bar (999 hits) with a copy chip | EXAMPLE, PRODUCT PAGE, 1000 READS, NO CACHE, 1000 TRIPS, WITH CACHE, 1 TRIP, COPY IN CACHE, 999 HITS | custom |
| G | cache is small, keep recent things | A grid of grey items (BIG STORE), a small CACHE with four slots, NO ROOM chip, recent items ringed gold and flying into the slots, ASKED AGAIN turns the cache border green | BIG STORE, SMALL CACHE, NO ROOM, RECENT, ASKED AGAIN | custom |
| H | interview answer: a copy near, long trip once | CPU, CACHE, FAR SERVER frame; three short green dots (MANY) CPU to cache, one long gold dot down the spine (ONCE) | INTERVIEW ANSWER, MANY, ONCE, COPY | custom |
| I | what do you read again and again? comment, follow | Three tiles (PROFILE, PRODUCT PAGE, IMAGES) each with an amber ?, a comment bar and a + FOLLOW pill pressing on follow | READ AGAIN & AGAIN?, Add a comment..., + FOLLOW | custom |
