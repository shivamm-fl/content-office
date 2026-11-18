# Visual plan: d027 Container With Most Water

Idea in one line: nine vertical walls (1, 8, 6, 2, 5, 4, 8, 3, 7) carry the whole reel. A translucent water rectangle sits between the L and R tags (height = the shorter wall, width = the gap). The short wall greys out and its tag hops inward, so the viewer sees every discarded wall and the area each step.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | hook: why check all pairs, 36 vs 8 | the nine walls from frame 0, L and R tags land on the two ends with the widest water rectangle, a counter runs to 36 in red, then an 8 lands in green | PAIRS, CHECKS | bars, water, counter |
| B | problem, given heights, area = min x gap | walls light one by one as the heights are read, index numbers below, walls 1 and 8 tint green and a water rectangle of height 7 and width 7 fills between them | AREA = MIN × GAP, MIN 7, GAP 7, = 49 | bars, water, tint |
| C | brute force, every pair, 499,500 | four pairs flash as a rectangle jumping between walls with the pair and its area, then a counter climbs to 499,500, O(n²) and two red notes | n = 1000, PAIRS, NEW QUESTION, NOTHING LEARNED | bars, water, counter |
| D | insight: widest first, the short wall is a cap | widest rectangle with L and R, the short wall tints amber and a dashed cap line crosses at its height, R hops inward three times and the rectangle only gets narrower at the same height, then L hops past the short wall and a taller rectangle appears | WIDEST FIRST, SHORT WALL = CAP, GAP ↓ AREA ≤ NOW, MOVE SHORT SIDE | bars, water, tags, cap line |
| E | dry run, eight areas | the real heights with indices, L and R hop, each discarded wall greys out, the rectangle moves and a tile shows each area (8, 49, 18, 40, 16, 15, 4, 6), best tile turns to 49 | 8 STEPS, NOT 36 | bars, water, tags, swapF |
| F | the opposite rule never sees 49 | same walls, R hops left seven times while L stays on the 1, rectangle stays one unit tall (areas 8 down to 1), a dashed green 49 container over walls 1 to 8 appears and is labelled never seen | MOVE TALLER ✗, BEST 8, 49 NEVER SEEN, SHORT WALL DROPPED, GOOD PAIR LOST | bars, water, tags, ghost rect |
| G | the real code | twelve lines of the code at 36 px, lines light as spoken, stage chip INIT / AREA / MOVE / RETURN, state tiles l, r, best and the real result 49 | INIT, AREA, MOVE, RETURN | code() |
| H | n - 1 iterations, O(1) space | nine small tiles with L and R hopping eight times and a counter 0 to 8 beside them, n − 1, O(n), then l, r, best tiles and SPACE O(1) | ONE POINTER MOVES, MOVES, O(n), SPACE O(1) | tiles, tags, counter |
| I | interview line | the walls with L and R, the rectangle, L hops past the short wall, three numbered chips lit as spoken | WIDEST FIRST, MOVE SHORT SIDE, NARROWER: NOT BETTER | bars, water, tags |
| J | comment: heights 1, 1, 0 | comment box, three big walls 1, 1 and a flat 0, RESULT = ? and then the green rectangle between the two ones with ANSWER = 1 | RESULT = ?, ANSWER = 1 | custom bars, swap |
