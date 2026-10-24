# Visual plan: d006 Hash map: lookup O(1) kaise ho jaata hai

Idea in one line: a hash map turns a key into a slot number with a hash function and jumps straight to that slot, so on average a lookup does not scan the items (average O(1), not a guarantee); a list compares one by one.
The picture that explains it with the sound off: a school locker room (roll number leads straight to one locker), a list scan counter running to 1,000,000 against one dict jump, key -> HASH FUNCTION -> slot number -> one slot lit while the middle slots are skipped, a toy mod-8 slot row where two keys land in the same slot.

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes (at least six words) | On-screen labels (1-3 words each) | Built with |
|---|---|---|---|---|
| A | 10 lakh names, how is one found straight? | A NAMES panel with a crowd grid of name tiles; one far tile gets a gold ring and a drop marker pointing straight at it | 10 LAKH NAMES, FIND ONE?, NAMES, DIRECT | custom (tiles, ring) |
| B | Locker number comes from roll number; hash map does the same | A ROLL 6 card, an arrow down to eight numbered lockers in two rows; locker 6 turns green with a marker, the other lockers dim with a NOT ALL pill | ROLL 6, LOCKERS, NOT ALL, HASH MAP | custom (cards, tiles) |
| C | List compares 1000000 times; dict one lookup | Two panels: LIST with a pointer scanning name tiles and a counter climbing to 1,000,000; DICT with a key chip jumping once to a slot and counter 1 | LIST, COMPARISONS, DICT, 1 LOOKUP, REAL RUN | custom (pointer, counters) |
| D | Key, hash function, slot defined | Vertical flow: a KEY chip, a HASH FUNCTION box, a slot number, and a row of eight numbered SLOT tiles; each part lights on its spoken term | KEY, HASH FUNCTION, SLOT | custom (flow) |
| E | Three steps: hash, jump, pick up | Same flow with a key chip travelling into the box, a number 5 coming out, a marker jumping to slot 5 while slots 0-4 and 6-7 dim as SKIPPED, the item lifting out | 1 HASH, 2 JUMP, 3 PICK UP, SKIPPED | custom (travel, dim) |
| F | Toy example: key divided by 8, remainder is slot | An EXAMPLE pill, a big formula card KEY / 8 with REMAINDER = SLOT, and eight empty numbered slots appearing below; a TOY HASH not-Python stamp | EXAMPLE, KEY / 8, REMAINDER, TOY HASH | custom (card, slots) |
| G | 10 and 18 both slot 2, 3 and 27 both slot 3: collision | Eight slots; chips 10, 18, 3, 27 fly each to their slot; two chips stack in slot 2, two in slot 3 with red rings and a COLLISION stamp; an equation line changes per key | 10 / 8 = 2, 18 / 8 = 2, COLLISION, EXAMPLE | custom (flying chips) |
| H | So average O(1), not a guarantee; many collisions slow it | A chart: flat green line (hash map) against a rising red line (list) with AVERAGE O(1); below a slot with a pile of five chips and NOT GUARANTEED | STEPS, NAMES, AVERAGE O(1), NOT GUARANTEED | custom (lines, pile) |
| I | Key must be hashable; list gives TypeError; list can change | Code card with the real red TypeError line from our run; below a list key chip [1,2] pointing to slot 2 then turning [1,9] and the pointer moving to empty slot 5 with a red ?, slot 2 dim LOST | CODE, REAL OUTPUT, [1,2], [1,9], LOST | custom (code, chip) |
| J | Check: 20 lakh names, last, list comparisons? comment, follow | 20 LAKH NAMES card with a name row and red ? COMPARISONS; COMMENT card; FOLLOW pill presses | 20 LAKH NAMES, ? COMPARISONS, COMMENT KARO, + FOLLOW | recipe 11 |

Facts: Python design FAQ: dicts are resizable hash tables, O(1) retrieval assumes distinct hash values; mutable keys would change hash. Wikipedia Hash table: average lookup independent of size, worst case O(n). Counts 1,000,000 comparisons and TypeError line are from our run (qa/d006_run.txt). Mod 8 hash is a labelled toy.
