# Growth notes

One dated entry per planning day (two sentences). A fuller note every Sunday (IST): what worked in the insights, what to change, and one thing to test.

## 2026-10-18 (planner)
Planned Day 1 (d001, concept): the first reel of the series, hook type interviewer_asked (stopwatch_question) to test the carried-over LearnAI hypothesis on DSA; no own numbers exist yet, so the first two weeks are a baseline. Running example is 10 lakh sorted names, 1,000,000 checks vs about 20, run by the researcher.

## 2026-10-19 (planner)
Planned Day 2 (d002, concept, Big-O): hook type surprising_fact to rotate away from d001's interviewer_asked and test the two side by side; no own numbers yet. Running example: doubling the data adds one halving step (20 to 21) but doubles one-by-one steps, counts run by the researcher; the catch is that small inputs hide the difference.

## 2026-10-19 (growth analyst, hook check on d002 script, no numbers)
No own numbers exist yet (n=0 reels with insights), so this is a script read, not a result.
- d002 scene A opens as a question ("Data doubles, will search steps double too?", about 11 words), with the fact only in the second line. That is closer to d001's question opener than to a surprising_fact, so the side-by-side test would be muddy.
- Proposed fix: lead with the fact, e.g. "Data दोगुना करो, search में बस 1 step बढ़ता है।" (8 words), then go straight to the 10 lakh contacts example; drop "कभी हाँ, और कभी...".
- Keep d001 vs d002 as a hint only until both have numbers; keep rotating hook types.
- Owner decision: pending.

## 2026-10-20 (planner)
Planned Day 3 (d003, concept, space complexity and the time-space trade-off): hook type relatable_stake to rotate away from d001 interviewer_asked and d002 surprising_fact, so three types now run side by side; no own numbers yet. Running example: duplicate check among 10 lakh numbers, about 5 hundred billion pair steps with no extra memory vs 10 lakh steps with a set (about 4x a list's memory), counts run by the researcher; the Python-set O(1) claim is unverified (wiki.python.org 404) and is kept out as a fact.

## 2026-10-22 (planner)
Planned Day 4 (d004, structure, how arrays sit in memory): hook type direct_question, the one of the five types not yet tested, so four types now run side by side; no own numbers yet. Running example: 10 lakh ints, index to byte offset is i x size and a middle insert shifts 5 lakh elements, counts run by the strategist (researcher re-check pending); the Python-list-holds-references claim was not fetched and is kept out.

## 2026-10-23 (planner)
Planned Day 5 (d005, structure, strings as array-like and immutable): hook type relatable_stake with the untested formula wrong_way_first (company_specific has no fetched interview page), so the hook is the real error a beginner meets when changing a letter; no own numbers yet. Running example: s[0]='j' raises TypeError, and a copy-count model for building a string with + (1000 appends: 500500 copies vs 1000 for join), run by the researcher; Python-only claims are labelled, the dict-key reason and CPython += optimisation are kept out as unverified.

## 2026-10-24 (planner)
Planned Day 6 (d006, structure, hash map lookup): hook type surprising_fact with a plain payoff line (10 lakh names found without searching), the least used of the last five alongside interviewer_asked and direct_question; no own numbers yet. Running example: 10 lakh list scan 1000000 comparisons vs one dict lookup, run by the researcher; claim kept to average O(1) with collisions named, and the Python worst-case number and resize thresholds kept out as unverified.

## 2026-10-25 (planner)
Planned Day 7 (d007, structure, hash collisions with chaining vs open addressing): hook type interviewer_asked, the least used of the last six (only d001), as a plain question with no undefined term; no own numbers yet. Running example: toy key mod 8 table, 26 found in 3 comparisons by chaining, probing tries 1 to 4, and 1000 same-slot keys give a chain of 1000 vs average 1.0 when spread, run by the planner; claims kept to Wikipedia (average vs O(n) worst case) and the Python FAQ (O(1) assumes distinct hashes), CPython collision method kept out as unfetched.

## 2026-10-26 (planner)
Planned Day 8 (d008, problem, Two Sum): hook type direct_question, the least used of the seven built days (only d004; company_specific has no fetched interview page), as the problem itself in one plain question with no undefined term; no own numbers yet. Running example: [5, 1, 12, 3, 8] target 11, brute force 10 checks vs hash-map one pass 5 steps, and 49,995,000 pair checks vs 10,000 steps for 10,000 numbers, all run by the planner; the LeetCode page returned 403, so the problem is paraphrased from the doocs mirror (fetched) and the average O(1) claim from Wikipedia, with no company claim made.

## 2026-10-27 (planner)
Planned Day 9 (d009, problem, Contains Duplicate and Valid Anagram as one idea: remember what you have seen in a set or a count): hook type surprising_fact (plain payoff, standard problem name, no undefined term), the oldest of the last six alongside interviewer_asked; no own numbers yet. Running example: [4,7,1,9,7,3] found at step 5 vs 8 pair checks, 49,995,000 pairs vs 10,000 steps for 10,000 numbers, listen/silent counts equal and rat/car not, all run by the planner; claims from the doocs mirror, Python docs and Wikipedia (fetched); researcher and scriptwriter were not on the roster this run, so the planner fetched the sources and ran the code itself.

## 2026-10-30 (planner)
Planned Day 10 (d010, concept, recursion and the call stack): hook type relatable_stake (the real RecursionError with the standard term), the oldest of the last six alongside interviewer_asked; no own numbers yet, and d005 used the same stake idea so this is a concept-day comparison. Running example: fact(5) makes 6 calls at depth 6 and returns 120, a missing base case raises RecursionError, total(10000) fails where a loop gives 50005000, run by the planner on CPython 3.12.3; the default limit 1000 is not in the sys docs and is shown only as observed output. The researcher confirmed the facts afterwards (default limit 1000 comes from CPython source, not the sys docs; O(n) stack space has no fetched source); the growth analyst is not on the roster; the one thing worth testing is whether a hook that opens on a real error name holds viewers better than the plain payoff and question hooks on concept days (d001 to d003).
