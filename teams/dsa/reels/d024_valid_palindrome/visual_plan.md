# Visual plan: d024 Valid Palindrome

Idea in one line: the string "A man, a plan, a canal: Panama" is drawn as 30 character tiles in two rows and carries the reel. The naive compare fails on it, a cleaned copy adds a second 21-tile string (O(n) memory), and two pointers L and R walk in from both ends, skipping dimmed symbol tiles, with no second string.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | Labels | Built with |
|---|---|---|---|---|
| A | Panama gives a wrong False | the 30 tiles from frame 0, a s == s[::-1] chip, a red FALSE chip lands, a green SHOULD BE TRUE chip under it | FALSE, SHOULD BE TRUE | grid, chips |
| B | the problem: lowercase, skip symbols, same both ways | capitals A and P tint amber, symbol tiles fade out one by one, letters tint green, FRONT and BACK arrows tiles, SAME = TRUE | LOWERCASE, SKIP SYMBOLS | grid, tint, dim |
| C | naive s == s[::-1] | s and its reversed text in two full-width tiles, a comparison chip, FALSE, three red reasons chips (A vs a, comma, space) | A ≠ a, COMMA, SPACE | text tiles, chips |
| D | cleaned copy | symbol tiles fade, a second strip of 21 lowercase tiles builds under the grid, 21 CHARS, REVERSE: TRUE, a red bar for extra space with O(n) | NEW STRING, O(n) | grid, strip, bar |
| E | the idea: two pointers | L tag lands on the first tile and R on the last, ends tint amber and violet, five rule chips light as spoken | L NOT ALNUM: L+1, R NOT ALNUM: R-1, COMPARE LOWERCASE | grid, tags, chips |
| F | dry run on Panama | tags hop inward, matched pairs turn green, the space tile is skipped, remaining symbols dim, tags meet on the middle c, TRUE | a = a, SPACE: SKIP | grid, tags, swap tile |
| G | race a car mismatch | ten tiles, three pairs turn green as L and R close in, R skips the space, e and a turn red, e ≠ a and FALSE | e ≠ a, FALSE | row, tags, chips |
| H | the code | the accepted function, active line lit as spoken, l and r tiles and an action tile that changes with the branch | code | code(), swap |
| I | O(n) time, O(1) space | two fills grow in from both ends and never go back, TIME O(n), a NEW STRING tile fades out, l and r tiles, SPACE O(1) | NEVER BACK, TIME O(n), SPACE O(1) | fills, tiles |
| J | edge case, interview line | a space tile becomes EMPTY then TRUE, then four interview chips light as spoken | EMPTY, SAY IN INTERVIEW | tiles |
| K | comment, follow | race a car tiles, a new c tile drops in at the end, RESULT = ? tile, comment box, follow pill presses | RESULT = ? | tiles, pill |
