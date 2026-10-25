# Visual plan: s007 REST vs gRPC

Idea in one line: one server calling another can use REST (readable text, anyone can plug in) or gRPC (shared contract, compact binary, streaming); who is calling decides.
The picture that explains it with the sound off: the same two boxes, ORDERS on top and PAYMENTS below with a wire between, in every scene; what travels on the wire changes (a text card vs a block of dots), then outside callers slide to the REST lane and own services to the gRPC lane.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with (helper names or custom) |
|---|---|---|---|---|
| A | servers talk, Orders calls Payments, REST or gRPC, who calls | Orders and Payments boxes with a dashed wire; a CALL card slides down the wire; a user icon with WHO? appears and two pills REST and gRPC sit on the sides | WHO?, REST, gRPC | M.box, M.arrow, custom card |
| B | REST: plain HTTP, readable text, resource | Same two boxes; HTTP stamp on the wire turns into a card of text lines, a user icon reads it with a tick; a /payments stamp lands under Payments | HTTP, READABLE TEXT, /payments | M.box, custom card, stamp |
| C | EXAMPLE GET payments/42, JSON reply, letter anyone can read | A GET /payments/42 card slides down to Payments, a JSON status card comes back up; PLAIN LETTER stamp; browser, tool and partner icons each get a tick | GET /payments/42, JSON TEXT, PLAIN LETTER | custom cards, M.icon |
| D | gRPC: shared .proto contract, functions and data shape | A big contract sheet sits on the wire between the servers; a function row (rpc GetPayment) and a data row (id, status) fill in | .proto, FUNCTION, DATA, ONE SHARED FILE | custom sheet |
| E | EXAMPLE GetPayment(42), compact binary reply | GetPayment(42) card slides down, a small block of dots (binary) comes back; two bars below, JSON longer than BINARY | GetPayment(42), BINARY, JSON | custom cards, bars |
| F | two offices, printed form and shorthand, no guide no reading | Office A and Office B with small FORM cards flying between; a guide book beside each; an outsider icon with a form gets a red cross | SHORTHAND, GUIDE, OUTSIDER | M.box, M.icon, cards |
| G | streaming: pieces one after another | One CALL goes down, then five numbered blocks flow up one after another | STREAM, ONE AFTER ANOTHER | custom cards |
| H | who is calling: outside callers REST, own services gRPC, streaming gRPC | Top panel with browser, mobile, partner icons and a REST stamp; bottom panel with two own servers, a short arrow and a gRPC stamp; a row of blocks streams | OUTSIDE CALLERS, YOUR OWN SERVICES, REST, gRPC | panel, M.icon, M.box |
| I | browser needs gRPC-Web and proxy; public REST, inside gRPC | Browser to proxy to gRPC server chain; then it clears and shows outside globe to PUBLIC API with REST, and an INSIDE panel with two servers and gRPC | PROXY, gRPC-Web, PUBLIC API, INSIDE | M.box, M.arrow, panel |
| J | outside REST, own gRPC, comment, follow | Two rows, outside globe with REST stamp and server icon with gRPC stamp; a comment card for mobile app with REST and gRPC pills; follow pill | REST, gRPC, MOBILE APP? | panel, pills |
