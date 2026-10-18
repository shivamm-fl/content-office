# PROPOSAL: rebalance the 150 days (for the owner to decide)

Status: proposal only. `roadmap/series-150.json` is NOT edited; the owner decides (CLAUDE.md: the roadmap is the owner's plan). Nothing is planned or built yet (`state/queue.json` and `state/covered.json` are empty, all 150 days are `todo`), so any day can still change. Date: 2026-10-18.

## Why
The roadmap has 116 problem days of 150 (77 percent), 5 pattern days and 3 recaps. The benchmark (`docs-notes/benchmark-2026-10-18.md`) found that the daily numbered problem walkthrough alone did not grow reach: the three accounts built on it sit at 0.08 to 0.48 times their followers in median reel views, while winners sold a stake, a surprise or a reusable idea. Limits: that is other accounts, a small sample, mostly face-led winners, and it says nothing about the right share of problem days. 63 percent is a judgement, not a measured optimum; our own skip and watch numbers should decide whether to go further (see "After approval").

## What stays
Same 150 days, same 14 phases, same day count in every phase, same phase order, `P1 Foundations` untouched. Every day keeps its number (Day N is `d` + N). Only 29 days change: all get a new `format`, 23 of them also a new `title` (the `level` field goes where a problem becomes a pattern or recap day). Pattern arc and recap arc are the ones in `docs-notes/series-style.md`.

## The rule
1. Each of P2 to P14 opens with a structure, concept or pattern day, and a pattern day follows early in the phase (P11's intervals pattern opens its second half).
2. Each of P2 to P14 ends with a recap (a map: which pattern for which signal).
3. Where several problems teach one idea, the first becomes the pattern day and the problem is its tiny example (named in the title).
4. A problem displaced by a recap or a pattern goes on the parked list, not deleted.

## Counts
| format | now | tier 1 | tiers 1+2 | tiers 1+2+3 (full) |
|---|---|---|---|---|
| problem | 116 | 115 | 106 | 95 |
| pattern | 5 | 11 | 10 | 21 |
| recap | 3 | 3 | 13 | 13 |
| concept | 13 | 8 | 8 | 8 |
| structure | 13 | 13 | 13 | 13 |
The owner can accept a tier on its own. Tier 1 costs nothing; tier 2 parks 9 problems; tier 3 parks 1 problem (the other 10 stay as the tiny example in a pattern day).

## Tier 1: relabel only (6 days, same titles)
Their titles already teach a technique and its signal; the pattern arc (problem it kills, signal, tiny example, template) fits them better than the concept or problem arc.
| day | now | proposed |
|---|---|---|
| 48 | problem (easy): Binary Search: the clean template | pattern, same title |
| 91 | concept: Backtracking: choose, explore, undo | pattern, same title |
| 110 | concept: BFS vs DFS: which one when | pattern, same title |
| 125 | concept: Dynamic programming: remember sub-answers | pattern, same title |
| 134 | concept: 0/1 Knapsack: the pattern | pattern, same title |
| 146 | concept: Greedy: when the local choice is enough | pattern, same title |

## Tier 2: a recap at the end of each phase (12 day numbers)
| day | now | proposed | displaced (parked) |
|---|---|---|---|
| 22 | problem: Merge Sorted Array | recap: Arrays and hashing: which tool for which signal | Merge Sorted Array |
| 29 | problem: Move Zeroes and Remove Duplicates | recap: Two pointers: which layout for which signal | Move Zeroes and Remove Duplicates |
| 37 | problem: Maximum Average Subarray (fixed window) | recap: Sliding window: fixed or variable, and how to tell | Maximum Average Subarray |
| 46 | problem: Implement Queue using Stacks | recap: Stacks and queues: which one for which signal | Implement Queue using Stacks |
| 55 | problem: Time Based Key-Value Store | recap: Binary search: which shape for which signal | Time Based Key-Value Store |
| 66 | problem: Merge k Sorted Lists (hard) | recap: Linked lists: the pointer moves and when to use each | Merge k Sorted Lists (fits the heap phase better) |
| 82 | problem: Serialize and Deserialize a Binary Tree (hard) | recap: Trees: DFS or BFS, and what to return | Serialize and Deserialize (long for one reel) |
| 89 | pattern: Top K: heap vs sort vs quickselect | problem (medium): Reorganize String | none (swap with day 90) |
| 90 | problem (medium): Reorganize String | recap: Top K: heap vs sort vs quickselect | none (swap with day 89) |
| 107 | problem: Insert Interval and Non-overlapping Intervals | problem (medium): Meeting Rooms II | Insert Interval and Non-overlapping Intervals (two problems in one reel) |
| 108 | problem: Meeting Rooms II | recap: Tries and intervals: which tool for which signal | none (moved up to day 107) |
| 124 | problem: Cheapest Flights Within K Stops | recap: Graphs: BFS, DFS, union-find or Dijkstra, which signal | Cheapest Flights Within K Stops |
P10 (day 100), P13 (day 145) and P14 (day 150) already end in a recap. A recap's "two examples" beat may use a displaced problem.

## Tier 3: more pattern days (11 days)
| day | now | proposed (pattern) | note |
|---|---|---|---|
| 15 | problem: Group Anagrams | Hash map: count it or group it (Group Anagrams) | example stays; Top K Frequent (16) follows |
| 41 | problem: Evaluate Reverse Polish Notation | Monotonic stack: the next-greater signal | parked: Evaluate Reverse Polish Notation; days 42 to 44 use the pattern |
| 52 | problem: Koko Eating Bananas | Binary search on the answer (Koko Eating Bananas) | example stays; Capacity to Ship (53) follows |
| 59 | problem: Linked List Cycle (Floyd) | Slow and fast pointers: cycles and middles (Floyd) | example stays; Middle (60) and Remove Nth (61) follow |
| 69 | problem: Maximum Depth of a Binary Tree | Tree DFS: ask the children, combine on the way up (Maximum Depth) | example stays; days 70 to 73 use it |
| 74 | problem: Level Order Traversal | Tree BFS: one level at a time (Level Order) | example stays; Right Side View (75) follows |
| 84 | problem: Kth Largest Element in a Stream | Heap: keep the best K (Kth Largest in a Stream) | example stays |
| 111 | problem: Number of Islands | Grid as a graph: flood fill with DFS or BFS (Number of Islands) | example stays; four grid problems follow (112, 114, 115, 116) |
| 127 | problem: House Robber | Take it or skip it: the 1D DP choice (House Robber) | example stays; House Robber II (128) follows |
| 132 | problem: Longest Common Subsequence | Two strings, one table: prefix DP (Longest Common Subsequence) | example stays; Edit Distance (133) follows |
| 137 | problem: Unique Paths | Grid DP: each cell from above and left (Unique Paths) | example stays; Minimum Path Sum (138) follows |

## Result per phase (full proposal)
| phase | opens with | pattern day(s) | ends with |
|---|---|---|---|
| P2 | pattern 11 | 11, 15 | recap 22 |
| P3 | pattern 23 | 23 | recap 29 |
| P4 | pattern 30 | 30 | recap 37 |
| P5 | structure 38 | 41 | recap 46 |
| P6 | concept 47 | 48, 52 | recap 55 |
| P7 | structure 56 | 59 | recap 66 |
| P8 | structure 67, concept 68 | 69, 74 | recap 82 |
| P9 | structure 83 | 84 | recap 90 |
| P10 | pattern 91 | 91 | recap 100 |
| P11 | structure 101 | 105 (intervals half) | recap 108 |
| P12 | structure 109 | 110, 111 | recap 124 |
| P13 | pattern 125 | 125, 127, 132, 134, 137 | recap 145 |
| P14 | pattern 146 | 146 | recap 150 |
P5, P7 and P11 open with a data-structure day (the right first step) and meet their pattern a few days in; P11's trie half has no pattern day of its own.

## Parked list (10 problems, nothing deleted)
Merge Sorted Array, Move Zeroes and Remove Duplicates, Maximum Average Subarray (fixed window), Implement Queue using Stacks, Time Based Key-Value Store, Merge k Sorted Lists, Serialize and Deserialize a Binary Tree, Insert Interval and Non-overlapping Intervals, Cheapest Flights Within K Stops, Evaluate Reverse Polish Notation. Options: bonus days after Day 150, a carousel companion, or swap one back in. The owner chooses.

## Owner decisions
1. Which tiers: none, 1, 1+2, or all three.
2. Where the 10 parked problems go (bonus days, carousels, dropped).
3. Phase order: no decision needed. P2 to P5 (arrays and hashing, two pointers, sliding window, stack) is the standard teaching order of the subject, which is why other courses share it. The owner confirmed on 2026-10-18 that this flow stays; rule 15 now says so explicitly.

## After approval
A strategist run edits `series-150.json` with exactly these day entries (status stays `todo`, `reels` stays empty) and updates `roadmap/README.md` counts if they are mentioned. Then log an experiment in `state/experiments.md`: after the first 3 weeks of reels, compare pattern and recap days against problem days on skip rate and watch time (our own numbers decide, not the benchmark).
