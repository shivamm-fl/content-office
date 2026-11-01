# Blind75: future-run handoff

Owner instructions from2026-11-01, consolidated and verified2026-11-02. Newer owner corrections override older generic DSA defaults.

## Required production sequence

1. Solve the actual problem and independently test it. Compare with a brute-force oracle where useful; check legal boundaries, negatives, zeroes, duplicates, mutation and language-specific behavior.
2. Genuine LeetCode Accepted for the exact source is required BEFORE paid voice/studio. Save actual submission URL/id, passed-case count, source hash and real browser proof. Local tests are not Accepted. Changed source needs verification again. For owner-directed local checks use Browser Use, not native computer control; freshly check availability before reporting a blocker. No invented verdicts, CAPTCHA bypass or saved credentials.
3. Teach in order: problem/input/output → naive/brute force → concrete bottleneck/failure → optimization WITH WHY/invariant → chronological dry run on the same example → time AND extra-space complexity. Correct-but-slow is not incorrect; do not invent TLEs or benchmarks.
4. Actual Accepted Python code MUST be visible in the reel. A companion solution.py is insufficient. New reels show the complete method body in readable source-bound chunks, preserving indentation and marked editor soft wraps. Highlight the branch being explained. Keep diagrams for reasoning/state changes. Annotation must match the currently visible code branch.
5. Hard final duration60–120s. Owner Shivam Trainer, eleven_flash_v2_5, owner_tempo0.9. Never0.7; never stretch to two minutes. Fit the script before paid voice. Reuse unchanged cached narration; changed narration requires regenerated captions/timings/visuals/export.
6. Technical Hinglish. Introduce arrays with “Given array:”; speak values, signs, computed results, indices and counts in English (“minus four, six, seven”). For scalar inputs say “Given integers:”. Keep Hindi explanation natural and existing source-script/Roman-caption conventions.
7. Independent visual/teaching review checks invariant, trace, branches, edge cases, both complexities and readable code. Fix P0/P1; inspect regenerated shots. Check captions and overflow.
8. Inspect the actual final MP4:1080x1920 H.26430fps + AAC,60–120s, correct tempo and measured sound/peaks. Decode final code and important trace/negative-case frames; save evidence tied to the MP4 hash. HTML snapshots alone are insufficient. Never claim human listening or continuous playback unless actually done.

## Enforcement and reusable files

- `runner/scripts/coding_gate.py`: Accepted/exact-source/ordered teaching checks and visible-code source audit. New specs set `on_screen_code_contract: complete_method_body`. Explicit ordered `teaching_phrases` can separate beats within a scene; do not weaken sequencing to pass.
- `scripts/ci_verify_reel.py` and `runner/scripts/delivery.py`: require Accepted/teaching, visible Accepted code,60–120s and independent teaching review. Local code changes do not prove deployed runner enforcement.
- `state/solutions/studio_common.py`: local-pilot prepare/voice, source-bound code panels/audit and final verification. Local browser-observed proof is separate from production adapter credentials/proofs.
- Per-reel `qa-on-screen-code.json`, `qa-code-frame-evidence.json`, `qa-export-verification.json` where present and REVIEW.md record evidence/limits. CLI0.8.149 lacks snapshot --review; selected sheets were the documented substitute.

## Progress and corrections

- b001–b011 complete; requested next-ten batch b002–b011 is10/10. Read `state/solutions/blind75-next10-progress.json`, `state/solutions/code-repair-audit.json`, `reels/BLIND75_REVIEW_INDEX.md` and live Office before selecting the next item. Cross-check ordinary roadmap/queue/covered states rather than assuming every legacy record was reconciled.
- Missing-code b004,b006,b007,b008,b009 were all repaired; decoded final code frames inspected. No repair hold remains on b010/b011. Distinct corrected copies: reels/code-reviewed.
- b001 shows the core algorithm, excluding its unreachable fallback return. b002–b011 cover the complete method body. Do not claim full-body coverage for b001.
- Owner excluded b001–b004 from later pronunciation remakes. Preserve their narration. Newer explicit all-missing-code instruction authorized the code repairs.
- Blind75/POTD are independent of the150-day daily series. POTD keeps its actual challenge date even when late. Do not duplicate an existing completed reel.

## Covers and Office handoff

- Established1080x1920 cover: navy#0B1220, ivory#F3EFE6, violet#A78BFA, green correct values; large English problem headline, short useful hook, actual worked-example diagram, DSA pill, BLIND75 NN/75, Learnvora mark/handle and progress bar. See `scripts/render_blind75_covers.py` and `brand/covers/blind75-cover-manifest.json`. Batch builder is specific to11 existing items; adapt before future single-item use.
- All11 videos/covers/texts saved in live private Office storage. Calendar → Saved reels → Review & approve → Approve reel. Approved/Undo approval persist for the exact version/media/texts. Approved items appear in the normal Calendar Ready to post list with Post; Undo removes them. The owner separately confirms Post to transfer the exact private package to the publisher. Never approve on the owner's behalf; saving/approval does not publish/schedule.
- Versioned media/manifest use existing Cloudflare KV; uploads were read back/hash-verified. `tools/import_blind75_office.py` is specific to this11-reel batch, not a general daily importer. Preserve unrelated items and decisions; local paths are not live URLs.
- Approval records use the team's Durable Object. App changes are preserved in original workspace and `codex/blind75-office-import` worktree commits39b6b41/db9ef11. Deployed library/approval version69bc3462-67ef-4dae-a845-9eff05b5f083. This does NOT imply separate coding automation is deployed/configured.

## Persistence boundary

The runbook, prompts, coding checks and completed-batch records are included in the repository sync for future sessions and GitHub Actions. Confirm the current branch contains them before production. The separate production LeetCode adapter still requires its configured secrets/authorization and pilot; a git push does not enable it. Large rendered videos/audio stay out of git and remain in the private Office library. Do not reset/clean unrelated local work. `state/learnings.md` is tool-managed: no manual edits or fabricated record_learning call. Owner corrections are persisted in CLAUDE.md, prompts, this runbook and the freely editable playbook.
