# a010 re-approved but missing from the Calendar

**Problem:** a010 was posted with Post now, deleted from Instagram, rebuilt and approved again. It does not show in the Calendar's ready list.

**Cause (from the code, not yet seen in the live database):** `buildCalendar` (apps/api/src/calendar.ts) hides every item that has a `done` Post-now record (`postedByOffice`). The record is kept 14 days, so the old post of the first version hides the new, re-approved version. The publishing status for a010 says `published: false`, which fits: only the office's old post record blocks it.

**Fix:** a post only counts if it was made at/after the owner's latest approval of that item (`approved_at` = answer time of the final card). Files: calendar.ts, office.ts, calendar.test.mjs (new test; 24/24 pass, tsc clean).

**Needs:** Approve and merge, then Deploy (the Worker changed). After that a010 appears under ready.
**Not verified:** the live post record and the approval card (no tool reads the Worker database).
**Auditor:** PASS. Tests 24/24, tsc clean. One caveat I accept: if you approve a new version of a reel that is still live on Instagram (e.g. a rework approved after posting), it shows as ready again and could be posted twice. Same mechanism as this fix; Post is an explicit tap. Style nit (dense `approved_at` expression) left as is.
