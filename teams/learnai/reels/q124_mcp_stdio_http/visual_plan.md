# Visual plan: q124 MCP server over stdio or HTTP

Idea in one line: the transport decides where an MCP server runs and who can reach it: stdio = a private subprocess on one machine; HTTP = one shared door that needs a guard.
The picture that explains it with the sound off: a machine frame holding app + server joined by a two-way pipe (stdio), against a server with one /mcp door and many clients, then the same door with three guards.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Anthropic made MCP; stdio or HTTP? | Hook text over two boxes stacked: a code-icon box and a globe-icon box with OR between; BY ANTHROPIC pill | STDIO, OR, HTTP | M.hook, M.box |
| B | Full question; one app one machine = stdio, many = HTTP | Pill INTERVIEW QUESTION; two rows: one app + one machine card arrows to STDIO, many users card arrows to HTTP; then 1-2-3 chips | 1 APP, MANY, STDIO, HTTP, 3 THINGS | lcard, M.arrow |
| C | MCP defined, transport defined, editor example needs 3 extra jobs with HTTP | AI app box and server box with arrow labelled TRANSPORT; then EXAMPLE editor box with files, three red chips HOST/ADDRESS/LOGIN land, counter 1 user = 3 jobs | AI APP, SERVER, TRANSPORT, HOST, ADDRESS, LOGIN | M.box, M.arrow, lcard |
| D | stdio: app starts server as subprocess, stdin/stdout, private | Big machine frame; app box; server box spawns below it; two arrows (stdin down, stdout up); lock + ONE CLIENT ONLY; NO HOSTING NO LOGIN | ONE MACHINE, STDIN, STDOUT, ONE CLIENT | custom frame, M.box, M.arrow, M.icon |
| E | HTTP: independent server, one endpoint, many clients, 50 agents | Server in cloud with one /mcp door; three client boxes arrow into the door; EXAMPLE pill, 50 AGENTS | SERVER, /mcp, CLIENT, 50 AGENTS | M.box, M.arrow |
| F | HTTP door open: Origin, localhost, auth | Door card; three guard cards land (globe ORIGIN, lock LOCALHOST, user AUTH); then red OPEN DOOR = ANYONE stamp | ORIGIN, LOCALHOST, AUTH | M.box, M.icon |
| G | Interview line | STDIO card and HTTP card; three guard chips land on validate / bind / authentication | PRIVATE, SHARED, ORIGIN, LOCALHOST, AUTH | M.box |
| H | Comment stdio or HTTP, follow | COMMENT card with STDIO / HTTP pills, FOLLOW button | STDIO, HTTP | glass, pill |
