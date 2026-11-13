# Blind 75 and LeetCode POTD

Owner-authorized on 2026-11-01. Every lesson is 60–120 seconds and teaches, in order: problem, brute force, its bottleneck/failure, optimization with reasoning, dry run, and time/extra-space complexity. The existing 150-day series is independent.

On-screen code correction, owner 2026-11-01: actual Accepted Python code must appear in every reel, in readable chunks synchronized with the explanation. Companion solution files do not count as visible code. Repair all missing-code exports (b004, b006, b007, b008, b009); the owner explicitly requested all repairs. Keep diagrams for reasoning/dry runs and verify both actual rendered code frames and coverage against the accepted source. All five repairs are now complete, and b010/b011 are completed too. See docs-notes/blind75-runbook.md and the current progress/audit files.

Voice correction, 2026-11-01 (narration recipe v4 since 2026-11-13): never change the voice tempo; new lessons are voiced on eleven_v4 in one take (`docs-notes/narration-recipe-v4.md`), lessons voiced before keep `owner_tempo: 0.9`. Do not slow the voice to stretch the runtime. A complete 78-second explanation is within the requested range. Script length follows the established voice pace; any timing change requires regenerated captions, scene timings and a fresh video export.

Number narration correction, owner 2026-11-01: for current b005 and future coding reels, explicitly introduce an input with **Given array:** and read values and negative signs in English, e.g. "Given array: minus three, four, minus one, two, minus six, three." Read calculated values and numeric counts in English too; the explanation remains technical Hinglish. This overrides the older Hindi-number narration rule for these reels. The owner explicitly said not to remake earlier reels; b001–b004 stay unchanged. Preserve actual tested inputs, saved voice tempo 0.9, regenerated captions and visual timings.

## Tracks and automation

- blind75: b001–b075; roadmap/blind75.json contains exactly 75 unique original linked problems, in source group order. Historical Premium flags are not entitlement checks. Intake fills current difficulty, numeric ids and constraints.
- potd: p0001 onward, deterministic UTC challenge-date offset from 2026-11-01 (p0001). Date is stored separately; max 9999 days matches the existing item id contract. Repeated requests for the same day have the same identity.
- Worker cron: 00:10 UTC / 05:40 IST. It launches one coding workday per challenge date, POTD before Blind 75. Two owner controls in the Calendar pause either track. This does not schedule social posting or change the owner's 150-day workday.
- Today's identity comes from LeetCode's response, never from guessing its URL. See https://leetcode.com/discuss/post/655704/september-leetcoding-challenge-and-the-time-travel-ticket/ .

## Deployment prerequisites (not present in git)

LeetCode terms explicitly restrict scraping: https://leetcode.com/terms/ . This integration has no supported public API guarantee. Enable it only with an access arrangement that permits the intended automated fetching/submitting. The code refuses network access unless LEETCODE_AUTOMATION_AUTHORIZED=true. Authentication/challenge/changed-schema failures stop the item. It never attempts access-control or CAPTCHA bypass. Do not use challenge submissions for rewards/streak claims; the purpose is solution verification for teaching.

GitHub Actions secrets: LEETCODE_AUTOMATION_AUTHORIZED (true only after access is cleared), LEETCODE_SESSION_COOKIE (the LEETCODE_SESSION value), LEETCODE_CSRF_TOKEN, CODING_PROOF_SECRET (random >=32 characters). Set the same CODING_PROOF_SECRET as a Worker secret. The bridge retains credentials and scrubs them from the agent environment. Credentials must never be pasted into chat, checked into this public repo, put in scripts or sent to an external proxy.

Worker variable DSA_CODING_AUTOMATION defaults to false. After authorized access and a real end-to-end pilot succeed, set it to true and deploy. Until configured the Calendar states setup is needed. Cron stays quiet while disabled. Owner API GET/POST /api/teams/dsa/coding reads/sets {potd,blind75}; the global configuration gate remains separate.

Live pilot still required: two Blind 75 problems plus today's POTD must produce authentic Accepted receipts and 60–120s reviewed reels. Offline tests use synthetic responses and cannot establish live LeetCode compatibility. No actual submissions happen during automated tests.

## Accepted evidence and production contract

leetcode_problem and leetcode_judge are trusted office tools exposed only to the DSA floor. The solver runs its original code/tests in its isolated shell. The trusted bridge NEVER executes that code; it only sends the exact text to the authorized LeetCode judge.

The intake token binds item, track, question id/slug and UTC challenge date. The judge polls the submission then reads its actual submitted code and question back. Only status Accepted with the exact Python code hash yields an HMAC-signed accepted_proof. A signed submission checkpoint in state/judge/<id>.json allows polling after a timeout/restart. The Durable Object counts a maximum of three submissions per item across agent restarts. State only contains signed metadata, never cookies or raw statements.

request_build verifies the signature and exact code both in the bridge and Worker. Before paid voice/render and at final delivery, runner/scripts/coding_gate.py checks the same evidence. Delivery refuses reports missing the new checks. Every coding reel folder contains:

- coding.json: the complete accepted queue item, including teaching (six specific strings).
- solution.py: exact accepted Python source; keep LF line endings.
- spec.json: solution_sha256 from accepted_proof and teaching_scenes mapping each of problem, brute_force, bottleneck, optimization, dry_run, complexity to nonempty ordered scene lists. Each beat has distinct ordered narrated scenes, or explicit ordered non-overlapping teaching_phrases within its declared scenes.
- visual_plan.md: repeated-work baseline and optimized dry run on the same actual example. Animated state diagrams lead; code excerpts must come from solution.py, never a rewritten implementation.

A changed solution needs another verified submission. A code-only receipt is insufficient to establish teaching quality: independent fact/visual reviewers must check the invariant, naive bottleneck, actual trace, both complexities and displayed excerpts against solution.py. Avoid bogus runtime percentiles, false TLE assertions and invented measurements. The final actual MP4 duration is hard-gated to 60–120 seconds.

New reels must show complete method-body source coverage in readable chunks; use the original full solution as a text companion too. Never copy a LeetCode editorial or another creator's explanation. A blocked hard problem remains blocked rather than becoming a rushed or misleading lesson.

## Recovery and scope

HTTP login/challenge/schema issues: blocked, then reconnect/update the authorized integration. Pending submission: resume its signed checkpoint with the same code. Three real/attempted submissions exhausted: stop and inspect; no automatic counter reset. Past-date POTD stays explicitly dated. Blind 75/POTD overlap shares reasoning/code where correct but requires item-bound evidence and a distinct teaching angle before a second reel.

The publishing service companion implementation maps b/p ownership to dsa and the correct track labels. It is tested in a clean checkout and included as integrations/ai-course-dsa-coding.patch (see integrations/README.md); apply/release it before enabling automatic production. Calendar draft production, owner approval and publisher routing must all be checked in the live pilot. Never route an unknown b/p item to LearnAI.

Validation: `pnpm test`, `pnpm test:coding`, `pnpm typecheck`, `pnpm build`, and `python teams/dsa/scripts/validate_queue.py`. For local Worker integration, run a fresh isolated Wrangler config with fake credentials, DISPATCH_MODE=manual, DSA_CODING_AUTOMATION=true, OWNER_KEY=offline-smoke-key, DEV_RUNNER_KEY=offline-runner and the offline proof secret from the tests, then `node tools/test-coding-local.mjs http://127.0.0.1:<port>`. This checks real local Durable Object storage, owner authorization, track switches, duplicate cron delivery, persistent attempt limits and forged-proof refusal without starting GitHub or LeetCode jobs.
