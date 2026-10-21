# Visual plan: q112 cosine similarity vs distance (rules: docs-notes/diagram-first-visuals.md)

Idea in one line: embeddings are arrows from the origin; cosine reads the angle between arrows (the topic), distance also counts how long the arrows are.
The picture that explains it with the sound off: one honest 2D plane drawn to scale from the real run (state/runs/q112_cosine_run.py): query and short refund note share an arrow, the 5x note is the same direction but 5x longer, the cricket note points a different way. Distance brackets show 5.66 vs 1.73 (cricket wins); angle arcs show 0 deg vs 90 deg (refund wins); squashing every arrow to length 1 makes both agree.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Refund search, cricket note on top | Frame 0: a search box "refund payment" over a ranked list, a cricket note at #1 flips to a red cross, the long refund note sits at #2 under "BY DISTANCE" | SEARCH, CRICKET NOTE, LONG REFUND NOTE, BY DISTANCE | custom glass rows |
| B | Interview question, then the answer | Two stacked boxes COSINE / DISTANCE with a big WHY? between them; they leave and the answer boxes DIRECTION (same topic) and LENGTH TOO (distance) land, then a TOPIC SAME stamp | INTERVIEW QUESTION, YOUR ANSWER, DIRECTION, LENGTH TOO | M.box, pills |
| C | Embedding = numbers = arrow; the counts; nearest wins | Chip "refund payment" turns into list 1 1 0 and into an arrow from the origin; a 4-row count table fills row by row while the arrows draw on the plane; the table leaves, the plane grows and distance brackets draw: 0, 5.66 (long, to scale) and 1.73 (cricket); stamp CRICKET WINS | VECTOR, EXAMPLE, QUERY, LONG x5, CRICKET, 0 / 5.66 / 1.73 | custom SVG plane |
| D | Cosine = angle; people pointing | Same plane: arcs for 0 deg (long/query) and 90 deg (cricket), a scoreboard 1.00 / 1.00 / 0.00 fills in; then two stick people at different distances point at one target ("same direction"); finally the extra length of the 5x arrow is bracketed | MEANING = DIRECTION, 1 = SAME WAY, 0 = DIFFERENT, NEAR, FAR | custom SVG |
| E | Normalize to length 1; OpenAI | The long arrow shrinks and the short ones grow to the unit arc; distances become 0, 0 and 1.41 (cricket bracket); an OpenAI card "LENGTH 1 ALREADY" and a SAME RANKING stamp | REMOVE LENGTH, LENGTH 1, 0, 0, 1.41, OPENAI | custom SVG with tweened arrow lengths |
| F | Boundary: popularity | Two arrows in one direction, short NICHE and long POPULAR, stamp KEEP LENGTH | BOUNDARY, NICHE, POPULAR | custom SVG |
| G | The answer to say | Two boxes COSINE = ANGLE = TOPIC and DISTANCE = ANGLE + LENGTH, rings step with the spoken words | INTERVIEW ANSWER, COSINE, DISTANCE | M.box + rings |
| H | Comment, follow | The 5x pair of arrows as the question, comment card HAAN / NAHI, handle, FOLLOW pill pressing | YOUR CALL, HAAN, NAHI, FOLLOW | M.pill, glass |
