---
name: india-ai-viral
description: >-
  Make Instagram Reels for the Indian AI-skills audience in the format that is
  actually going viral there: a loud text hook box on frame 0, one verified
  claim or free resource, a short mistake-to-fix or check list, and a
  "comment KEYWORD" call to action that delivers a PDF resource. Use when the
  owner asks for "viral", "hook wala", "resource wala", "comment automation"
  or "divyam waisa" reels, for experimental or miscellaneous reels outside the
  course / interview / generic tracks, or for the PDF that goes with them.
---

# india-ai-viral

The style the owner chose on 2026-10-13 after looking at Instagram themselves. It is NOT comedy, NOT a meme, NOT a tip-card without context. It is "AI skill + a hook that makes you stop + something real you can take away".

## What the research showed (read-only look at Instagram + web, 2026-10-13; no handles stored on purpose)
- A ~150K-follower Indian AI-skills creator: top reels 0.7M to 2.3M views. All are on-camera with a text hook in a black box at the top ("Cancel kardo ...", "Feels illegal to tell this", "Listen carefully", "10 random websites X / Hidden gems V").
- Their "FREE" reel: a 3-line check-mark claim box ("... in FREE V / Unlimited V / <big number> V"), 702K views, 14K likes, **53.7K comments**. Reason: the caption says comment to get the link/guide in DM. Comments are mostly one emoji or "link". The comment count is what pushes it.
- Collab posts (two accounts) and trending audio both help; we cannot add trending audio through the API and our rules allow only the bundled bed, so the format and hook have to carry it.
- Instagram "AI comedy India" search is mostly AI-generated cute-character skits with regional-language comment bait, and Hindi on-camera ChatGPT skits. We cannot make those faceless; the owner rejected comedy for this channel.
- Owner rejections to avoid repeating: light or yellow background, comedy/meme skits, generic tip cards with no context, a hook with no stakes, series numbers on covers of one-off content, claims nobody verified.

## The format (every reel)
1. **Frame 0 hook box**: dark glass box, gold border, 2-3 centred lines (48-52 px), each line ends with a drawn mark (alert triangle / green check / red cross). It stays for the whole reel. The first spoken line says the same thing in <= 8 words.
2. **One idea, 4-6 rows**, one row per spoken phrase, revealed in step with the voice: <= 3-word title + one proof or fix line. Mistake to fix rows (red cross badge, green fix line) work best; "free thing + what it includes" works second.
3. **Proof line on screen**: `Source: <domain> (Mon YYYY)` whenever a number, price, date or "free" appears.
4. **CTA in the last 3-4 s**: a card "FOLLOW + COMMENT KARO" with the keyword in a gold pill and what they get ("PDF seedha DM mein"). The spoken line says "Pehle follow karo, phir comment karo: KEYWORD" and the caption repeats it with `@ig.learnai`. Instagram refuses the bot a follow check (2026-10-13), so this line is the only place we ask for the follow. One keyword per reel (FREE, ROADMAP, PROMPT, AGENTS).
5. 20-25 s total (the gate wants 20-45 s), voice `@fast` after the hook, pace 1.25, dark kit theme (`reels/_kit/motion.*`: navy + gold). Never a light or yellow background.
6. **Cover**: gold pill = CATEGORY ONLY (no series number: "FREE AI COURSE", "AI SKILL", "AI CAREER"), headline <= 8 English words, key words gold, Bit robot. Build with `scripts/render_cover.py`.
7. **Resource PDF** (what the comment delivers): see below.

## Hooks that work here (score them: `python3 .claude/skills/ig-reel/hookscore.py --hook "..."`, ship at 70+, never under 50)
| Archetype | Example (Roman Hinglish) | Needs |
|---|---|---|
| Warning + number | "Never write prompts like this. Ye 5 mistakes AI ka jawab bekaar karti hain." (78) | the 5 must be real, each with a fix |
| Free + proof | "AI Agents seekhna hai? Course free hai!" (~70) | primary page says free, and what exactly |
| Skills list | "AI Engineer banna hai? Ye 6 skills." | our own roadmap phases |
| Interview | "AI interview mein ye 3 sawal pakka aate hain" | verified answers |
The scorer is English-calibrated: it rewards stake words (never, mistake, free, wrong, stop, only, still, waste, secret), a number or name in the first words, and second person. Use real stakes; do not stuff words just to score. A topic statement ("Prompt ke ye 5 techniques") scores ~30 and fails the hook.

## Truth rules (hard-learned, repo rule 1 applies in full)
- Every number, date, price, "free", "all", "only" comes from a primary page you fetched in THIS session. Quote exactly.
- **Status beats README**: x04 first claimed "Gemini CLI free, 1,000 requests/day" from the README. Google's own blog (19 May 2026) and the docs banner say Gemini CLI stopped serving free users on 18 June 2026 (Antigravity CLI replaced it). Always check announcements, banners and dates, not only the product page. Prices and quotas change: say "limits change" and do not print a number the vendor does not publish.
- Our framing is ours: "5 mistakes" is LearnAI's framing of Anthropic's 5 techniques. Attribute only what the source says ("Har fix Anthropic ke docs se") and say the framing is ours in the caption.
- Do not promise what the PDF does not hold (the pack has 8 questions: say 8, not 50).
- Free-access "hacks" that break a provider's terms (shared keys, scrapers, cracked plans) are never used.

## The resource PDF
Dark LearnAI theme, A4, built from HTML with headless Chrome (`scripts/resource_pdf.py` + `scripts/build_resources.py`). Cover + 3-7 pages: what it is, the facts with numbered sources, steps / templates / checklist, a sources page with URLs and the date read, and "unofficial guide, not affiliated" when it names a product. Roman Hinglish, one idea. Every claim in the PDF passes the same truth rules as the reel.

## Comment to DM (live and tested 2026-10-13)
`automation/dm-bot` (Cloudflare Worker, README inside): keyword comment -> ONE private reply that carries the link as an "Open link" button. Meta refuses our app both the follow lookup and any follow-up message, so there is no follow check and no second step; the reel and caption must ask for the follow. Resource flow is automatic: write `resources/src/<material id>.html`, map it in `automation/dm-bot/src/materials.json` (keyword + reel); when the reel is posted `post.yml` registers it and `deploy-dm-bot` builds the PDF and hosts it on the Worker. Manual fallback: `scripts/dm_bot_register.py`. A reel with a comment CTA may only be published when the bot is deployed, tested with a second account, and the material is registered and active.

## Research refresh (monthly, light)
Owner authorised read-only use of the logged-in built-in browser for this niche (2026-10-13). Search keywords or tags, open a creator's Reels tab (view counts are on the tiles), open 3-5 reels for likes, comments, caption and CTA. Record patterns and numbers only, never handles, comments or usernames in the repo (repo rule 16). Never like, follow, comment, DM or scroll fast; about 30 page loads per session; stop if Instagram shows any warning. Web search is the fallback.

## Build recipe
1. Fetch the primary pages. Write down the exact claims.
2. Hook options, score them, pick one >= 70 where honest.
3. `python scripts/new_reel.py xNN_slug "Title" "LEARNAI"` (x-ids are outside the queue; no series number anywhere).
4. `spec.json`: one scene, phrases = hook, source line, one phrase per row, CTA question, "Pehle follow karo, phir comment karo: KEYWORD" (the bot cannot check the follow, so the reel must ask for it). `pace 1.25`, `total` >= 20.
5. `index.html` from `snippets/reel-helpers.js` (hookbox, pop, type, cta) on the motion kit. No hard-coded seconds: use `P("A", k)`.
6. `hyperframes@0.8.149 check`, snapshots at 6 times, read the contact sheet, render (`scripts/render_job.py`), normalise to -14.5 LUFS.
7. Cover, caption (line 1 = hook, one ask, <= 5 hashtags, Roman Hinglish), `social/<folder>.youtube.txt` with Sources, `visual_plan.md` (>= 6 words per scene row).
8. Gate: temp entry in `state/phase5_status.json` (folder, mp4, cover, caption, hook_formula, track), `python scripts/ci_verify_reel.py <id> --skip-review`, then restore the file. The independent visual and fact reviews run in CI.
9. PDF, then show the owner mp4 + cover + PDF. Do not post or commit unasked.
