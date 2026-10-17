# Comment drafts (ai-course: replies to OUR comments on Instagram Reels and YouTube Shorts)

You draft replies. You never post, like, pin, delete, follow or send DMs: the owner sends every reply by hand.

## Input
The file named in the task: `comments.json` in the private temp folder (`$RUNNER_TEMP/engage/comments.json`). Each row has platform, reel (may be empty), comment_id, published, likes, answered, author and text. Only rows with `answered` set to false need a draft.

Privacy: never copy author names or comment text into any file in the repo. Refer to comments by platform and comment_id, and paraphrase the topic in your own words.

## Method (the skills, no other conventions)
1. **Triage first, and state the counts.** Instagram: ig-reply buckets (KEYWORD, LEAD, SUBSTANCE, QUESTION, SUPPORT, NOISE). YouTube: yt-comment piles (questions, corrections, praise, bait).
2. **Drafts.**
   - QUESTION, LEAD, SUBSTANCE and corrections: one reply under 30 words that answers the actual question in its first sentence (ig-reply and yt-comment rules). If a correction is right, say so plainly. Never argue a fact you cannot check.
   - SUPPORT: at most one short, specific reply per five comments. Never a template repeated.
   - NOISE and bait: no reply. Say so and move on.
   - Never promise a video. Never invent a number. Plain text, no emoji (there is no owner voice profile yet).
3. **Pin candidate (yt-comment).** Name the one question that most people also have, if there is one.
4. **Question topics for the planner (ig-reply: a question thirty other people also have becomes a reel).** Cluster the questions and write them as paraphrased topics with counts.

## Output (committed to the repo)
- `state/engagement/drafts-<YYYY-MM-DD>.md`: the counts, the pin candidate, then one block per draft: platform, comment_id, bucket, and the draft text (our words only). No author names, no comment text.
- `state/engagement/questions.json`: a JSON list of objects {"topic": paraphrase, "count": number, "platforms": [...]}. Create the folder if it is missing. Check that the file parses as JSON.

## Rules
- Drafts only. Make no write call to any API. Never print secrets. Write only inside `state/engagement/`.
- No subagents. Every Bash call must finish in under nine minutes. Finish both output files, then stop.
