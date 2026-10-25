# Visual plan: d007 Hash collision: do key ek hi slot par aa jaayein toh

Idea in one line: a collision is two keys landing in the same slot; chaining keeps a small list per slot, open addressing probes to the next free slot, and when many keys pile into few slots a lookup gets slow (average O(1), worst O(n)).
The picture that explains it with the sound off: post boxes where two parcels hit one box, a cupboard of 8 slots, a key-to-slot flow with the mod-8 rule, chips stacking in slots, a row-per-slot chain table with a walk to 26, a chip hopping over FULL slots, a probing run with tries under each chip, a 1000-key pile bar against a spread strip, and an average-vs-worst pair.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | Interviewer: two names, one place, what do you do? | A POST BOXES panel with eight numbered boxes; chips 10 and 18 fly in and both land at box 2 which turns red | TWO NAMES, ONE SPOT?, POST BOXES, ONE BOX | custom (tiles, drop) |
| B | 8-slot cupboard 0 to 7; 10 and 18 both slot 2; collision; 2 ways | Eight numbered cupboard slots; 0 and 7 ring gold, chips 10 and 18 drop and stack under slot 2, slot 2 turns red with a COLLISION stamp, then a 2 WAYS pill | EXAMPLE, CUPBOARD, COLLISION, 2 WAYS | custom |
| C | Key, hash function, slot; rule key divided by 8, remainder | Vertical flow: KEY 10 chip, a HASH FUNCTION box that turns into KEY / 8 -> REST, a slot number 2, and eight slots with slot 2 lit | KEY, HASH FUNCTION, SLOT NO., EXAMPLE | custom (flow) |
| D | 10, 18, 26 slot 2; 3, 27 slot 3; 5 slot 5 | Eight slots; a division line per key; chips stack under their slots, slots 2 and 3 turn red with a SAME SLOT stamp, slot 5 stays green | EXAMPLE, SAME SLOT | custom (stacks) |
| F | Chaining: a list per slot; find 26 takes 3 comparisons | Table with one row per slot 0-7; chain nodes 10 -> 18 -> 26, 3 -> 27, 5 grow right; a FIND 26 marker and a ring walks three nodes while the counter reaches 3 | CHAINING, A LIST PER SLOT, REAL RUN, COMPARISONS | custom (rows, counter) |
| G | Open addressing: one per slot; full, go to next empty | Slot row with slots 2 and 3 red FULL; a NEW chip hops over them to slot 4 which turns green FREE | OPEN ADDRESSING, ONE PER SLOT, FULL, FREE, LINEAR PROBING | custom (hop) |
| H | 10 empty, 18 to slot 3 (2 tries), 26 to slot 4 (3 tries), rest shift | Slot row; chips drop and hop into slots 2, 3, 4 with TRIES numbers 1, 2, 3 under them, then three grey chips fill 5, 6, 7 with their tries | LINEAR PROBING, TRIES, EXAMPLE | custom (hops) |
| I | 1000 keys all multiples of 8: one slot, 1000 comparisons; spread: about 1 | Top: eight slots with a tall red pile bar in slot 0 and a counter to 1000 COMPARISONS; bottom: 40 thin slots each with one small green chip and ≈ 1 EACH | ALL MULTIPLES OF 8, COMPARISONS, SPREAD OUT, 1000 SLOTS | custom (bar, counter) |
| J | Average O(1), worst O(n), O(1) only if spread | Two cards: AVERAGE with 8 equal short green bars and O(1); WORST CASE with one tall red bar and O(n); the worst dims on the last line | AVERAGE, O(1), WORST CASE, O(n) | custom |
| K | Check: find 27 in the chaining table; comment; follow | A small chain table (2 -> 10, 18, 26; 3 -> 3, 27) with 27 ringed and a red "? comparisons" label; COMMENT card; FOLLOW pill presses | CHAINING TABLE, COMMENT KARO, + FOLLOW | custom + recipe |

Facts: Wikipedia Hash table (collision = same index for more than one key; separate chaining = list per index; open addressing probes for the next available slot; average lookup independent of size, worst case O(n)); Python design FAQ (O(1) assumes distinct hash values). Mod-8 keys, tries and the 1000-key counts are our toy run (EXAMPLE), qa/d007_run.txt.

FIX (reviewers): B slots show from the first frame; G the +1 hops sit under the row, FREE clear of the slot numbers; H bigger chips and tries plus RUN GROWS; I shows 8, 16, 24 each giving rest 0 and eight single-key slots for spread; J spread vs all-in-one bars; K full 8-row chain table to count along.
