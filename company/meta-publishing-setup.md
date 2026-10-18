# Meta publishing setup: Instagram + Facebook Reels for the three Learnvora handles

Written 2026-10-18 from Meta's own docs fetched in this session. No account was logged into, no token was created, nothing was changed.
This file holds no secrets and no ids: safe in the public repo.

How to read it:
- [A1] .. [A13] point to the source blocks in Appendix A. Each block starts with the exact URL(s) and lists the claims that URL supports.
- V = read on the official page this session. S = taken from a search-result summary of an official help page (the page body would not load in the fetch tool). U = could not verify (also collected in section 6).
- Meta moves its docs often (the old /docs/ paths now redirect to /documentation/ pages). If a menu name differs on screen, trust the screen and tell the assistant.

---

## 1. Summary and recommended path

1. One Meta app, type Business, left in Development mode, Standard Access only. No App Review and no Business Verification are needed because every account is the owner's own and he is the app Admin. [A6]
2. Recommended login: **Instagram API with Facebook Login** (plus the Pages API for Facebook). The Page is being linked anyway, Facebook Reels need Facebook Login, it can upload the video bytes straight from the runner (no public video URL), and the Page tokens do not expire. [A1] [A5] [A7]
3. Fallback: **Instagram API with Instagram Login**. No Page needed, but tokens last 60 days and must be refreshed, the video must sit at a public URL, and it cannot post Facebook Reels. An app uses one login type, not both. [A1] [A6] [A7]
4. Account type: **Business** for all three (Creator is also listed as supported; a personal account cannot publish through the API). Switching type or going back to personal is allowed at any time. [A2] [A9]
5. Reel flow: create container (`media_type=REELS`) -> poll `status_code` -> `media_publish`. Instagram reel video: 3 s to 15 min, up to 300 MB, H.264 or HEVC + AAC, 9:16 recommended. Caption 2200 chars, 30 hashtags, 20 mentions. [A3]
6. Facebook Page Reels are stricter: 3 to 90 s only, while our office reels run 20 to 120 s. Decide what happens above 90 s. [A8]
7. Tokens: three long-lived Page tokens (one per handle) stored only as GitHub Actions secrets of the private ai-course repo. The app secret never goes into any repo. [A7] [A12]
8. Limits are generous for our pace (3 handles, a few posts a day): 400 containers per 24 h and a documented cap of 50 or 100 API posts per 24 h per account (the docs disagree). Facebook: 30 per 24 h per Page. [A4] [A8]
9. ai-course must become multi-handle (per-handle ids and secrets, upload step, status polling, idempotency). The Worker in this repo only knows one publishing repo, for `learnai`. [section 5]
10. Not verifiable from docs: whether a development-mode app can publish publicly visible reels (implied, not stated), redirect handling of the video URL, and a few account-type details. Section 6.

### Why not simply Instagram Login?
It is fewer steps for Instagram alone (a "Generate token" button, no Page). We lose: Facebook Reels, byte upload, non-expiring tokens, the Audio API. If the Facebook route stalls, Instagram Login is the quick way to get Instagram posting first. [A1] [A5] [A7] [A13]

---

## 2. What only the owner can do

Everything here needs his logins, 2FA codes, legal acceptance or a secret on screen. An assistant must not do these steps, even in a browser session he already logged in (section 3 says why).

### Part A. Once, for the whole company
- [ ] A1. Turn on 2FA on the Facebook profile that will own the Pages. A Page can require it, and publishing fails if the Facebook user has not completed it. [A4] Keep recovery codes offline.
- [ ] A2. Register as a Meta developer at developers.facebook.com with that same Facebook login. You accept the Platform Terms, Meta sends a confirmation code to your phone and email, and you pick an occupation. [A6]
- [ ] A3. Create the app at https://developers.facebook.com/apps/creation/ . Enter an app name (for example "Learnvora Publisher") and a contact email. [A6]
  - Choose the Instagram use case ("Manage messaging and content on Instagram") and the Pages use case ("Manage everything on your Page"). [A6] [S: the Instagram use case name]
  - If it asks for a type, choose Business. [A7]
  - Use cases cannot be removed later, so do not add extra ones. [A6]
  - Business portfolio: choose "skip for now". Connecting one is required only for data you do not own or manage. [A6]
- [ ] A4. In the Instagram use case choose the **Facebook Login** setup ("API setup with Facebook login") and press "Add all required permissions". [S: button names]
  - Permissions we need: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `pages_manage_posts` (Facebook Reels). [A1] [A8]
  - Tell the assistant if the dashboard shows a different name.
- [ ] A5. Leave the app in **Development mode**. Do not switch it Live and do not submit for App Review. [A6]
- [ ] A6. Put the App ID and App Secret in your password manager. The secret is shown in the app's Basic settings (the usual place; not checked in the docs). Never paste it in a chat, a file or a repo. [A7]

### Part B. Once per handle (repeat for ai, dsa, systemdesign)
Order: Instagram account type, then Page, then link. Suggested Page names (your choice): "Learnvora AI", "Learnvora DSA", "Learnvora System Design".

- [ ] B1. In the Instagram app (log in, enter the 2FA code): Profile > Menu > Settings > Account type and tools. [A9]
  - If it says "Switch to professional account": tap it, choose a category (the category does not decide business or creator), choose **Business**, Next. [A9]
  - If it already is professional, check which type it shows. Business is recommended; Creator also works per the docs. [A2]
  - A private account becomes public when it turns professional; pending follow requests are accepted. [A9]
- [ ] B2. On Facebook, signed in as the owner profile: Pages > Create Page > Public Page > name and category > create. [A9]
- [ ] B3. Link Instagram to the Page. Two ways, either works:
  - From Facebook: switch into the Page > profile picture > Settings & privacy > Settings > Permissions > Linked accounts > Instagram > Connect account, then log into the Instagram account (2FA code). You need full access or task access on the Page. [A9]
  - In the new Pages experience the path is Manage > Professional dashboard > Linked accounts. [S: A9]
  - From the Instagram app: Edit profile > Page > Connect or create. [S: A9]
- [ ] B4. Check the link shows on both sides (Page settings > Linked accounts, and the Page name on the Instagram profile).
- [ ] B5. If Facebook asks the Page for Page Publishing Authorization (PPA) or 2FA, complete it. If the linked Page requires PPA, publishing fails until it is done; Meta says there is no way for an app to know in advance. [A4] [A5]
- [ ] B6. Keep the Page admin list to yourself. Once linked, anyone with access to either the Page or the Instagram account can manage both. [S: A9]
- [ ] B7. If the Instagram account sits in a Meta Business Suite / business portfolio, it can be in only one portfolio at a time. Do not move it unless asked. [S: A9]

### Part C. Tokens (once; owner alone at his own PC; do not screen-share or paste anywhere)
- [ ] C1. Open the Graph API Explorer. Pick the app, choose a User token, add the five permissions, press Generate Access Token. In the login dialog select **all three Pages and all three Instagram accounts** (the dialog normally lets you pick which ones to allow; the debug tool shows per-Page grants, so check C5 lists all three). [A7] [A6]
- [ ] C2. Exchange it for a long-lived user token on your own computer, server-side style, using the app secret. The documented request is: `GET https://graph.facebook.com/{graph-api-version}/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}`. Never do this in a browser page or a public tool. [A7]
- [ ] C3. With the long-lived user token call `GET https://graph.facebook.com/{graph-api-version}/{app-scoped-user-id}/accounts?access_token={long-lived-user-token}`. It returns every Page you manage, each with its own Page `access_token`. [A7]
- [ ] C4. For each Page call `GET /{page-id}?fields=instagram_business_account`. The `instagram_business_account.id` is the Instagram user id used for publishing. [A7]
- [ ] C5. Check each Page token with Meta's token debug tool (`GET /debug_token`, or the web debugger): `is_valid` should be true and the expiry should say it does not expire. [A7] (The exact "never" wording is U.)
- [ ] C6. Save the three Page tokens as repository secrets of the private ai-course repo (names in section 4) using the GitHub web page: Settings > Secrets and variables > Actions > New repository secret. [A12] Then clear the clipboard and close the terminal. Do not keep the long-lived user token or the app secret in GitHub.
- [ ] C7. Write the three Instagram user ids and three Page ids (not secret) into ai-course's handle config, or tell the assistant to.

### Part D. First tests (owner taps the workflow; assistant reads the log)
- [ ] D1. Dry run: create the container, poll until `status_code` = `FINISHED`, stop before `media_publish`. The container simply expires after 24 h. [A3] [A4]
- [ ] D2. One real post on one handle, the owner choosing the reel. Meta documents deleting media (`DELETE /{ig_media_id}`, needs `instagram_manage_contents`), so add that permission only if you want a delete route. [A11]
- [ ] D3. Then the other two handles, then a Facebook Page reel.

---

## 3. What an assistant can safely prepare or automate

Rule: an assistant never sees a token, the app secret or a password. Anything printed on a page or terminal enters the conversation record, so token steps stay with the owner (Part C).

### Pure work, no account touched
- Write the publish script with a **dry-run mode** (container + status poll, no publish), a caption lint (2200 chars, 30 hashtags, 20 mentions) and a video pre-check. [A3]
- Offline video check with ffprobe against the reel spec: H.264 or HEVC, progressive, closed GOP, 4:2:0, 23 to 60 fps, width at most 1920, at most 25 Mbps, AAC 48 kHz at most, 3 s to 15 min, 300 MB at most, moov atom at the front (`-movflags +faststart`) and no edit lists. For the Facebook Page reel add: 3 to 90 s, 9:16, at least 540x960, fixed 24 to 60 fps, closed GOP of 2 to 5 s, AAC-LC stereo 128 kbps or more. [A3] [A8]
- Per-handle config file (Instagram user id, Page id, secret names). IDs are not secret.
- A read-only health check at the start of every post run: `GET /{ig-user-id}/content_publishing_limit` and a cheap profile read with the Page token. A failure with code 190 then points to an invalid token. [A4] [A7]
- A proposal for this repo (proposal branch, owner approves): let the Worker know the publishing repo of `dsa` and `systemdesign`, not only `learnai`. [section 5]
- This guide kept up to date, plus a one-page "token invalid, what now" runbook.

### In a browser session the owner already logged in (read and navigate only)
Allowed, because nothing secret is on those screens:
- Open the app dashboard and read the **App ID** (not the secret).
- Confirm the app mode says Development, the two use cases exist and the five permissions are added.
- Open each Page's Linked accounts screen and confirm the Instagram account shows as connected.
- Open the Instagram account-type screen and read which type it shows.
- Take screenshots of those screens for the owner.

Not allowed (owner only): typing passwords or 2FA codes; pressing Generate token / Add account / Connect account / Create Page / Switch account type; accepting any terms; opening the App Secret or any token field; Graph API Explorer; resetting the secret; anything in the shared Instagram session beyond reading the screens above.

---

## 4. Token and secrets plan

### What exists and how long it lives
- Short-lived user token (about 1 to 2 hours) -> long-lived user token (about 60 days, needs the app secret, server-side only) -> long-lived **Page token that has no expiration date** and is invalidated only under certain conditions. A Page token is unique to one Page + one admin + one app. [A7]
- The Instagram Login alternative: a dashboard-generated token is long-lived (60 days) and refreshable at least 24 h after issue and before expiry; one not refreshed within 60 days dies for good. [A7]
- Meta does not tell you when a token is invalidated. A password change or logout gives error 190 / subcode 460; revoking the app gives 458; expiry gives 463. [A7]

### What must stay secret
- **App Secret** (owner's password manager only). **Page tokens** (GitHub secrets). Any user token. [A7] [A12]
- Not secret: App ID, Instagram user ids, Page ids.

### Where it lives
- Private ai-course repo: Actions **repository secrets**, one per handle, suggested names (no values here):
  - `META_PAGE_TOKEN_AI`, `META_PAGE_TOKEN_DSA`, `META_PAGE_TOKEN_SYSTEMDESIGN`
  - Ids go in a config file or Actions variables: `IG_USER_ID_*`, `FB_PAGE_ID_*`.
- Never in content-office (public), the Worker, a PR, a log or a chat. The Worker only starts workflows; it needs no Meta token.
- GitHub facts: secrets are not passed to workflows triggered from forks; use `::add-mask::` for any derived secret value; avoid secrets on a command line; secrets cannot be read in `if:` conditions. [A12]

### In the workflow
- Give the workflow minimal `permissions:`, no fork or pull-request triggers, and pin third-party actions.
- Send the token in an `Authorization` header or the POST body, not in a URL that can reach a log (Meta's own resumable examples use `Authorization: OAuth` / `Bearer`). [A5]
- Never echo the full API response on failure without masking; error bodies can include request details.
- Fail the run (non-zero exit) on any Meta error so the office shows the failure; the Worker reads the run outcome. Print the Meta error code and subcode, never the token.

### Expiry, rotation and revocation
- Page tokens need no refresh, but Meta says permissions that go unused for 90 days require users to grant them again (generic permissions page; whether it hits Page tokens is U). Daily posting avoids a long idle gap; after a long pause run the health check first. [A6]
- If a token goes bad (190): the owner redoes Part C only (about 10 minutes) and replaces the three secrets. Keep this runbook next to the workflow.
- If a token leaks: change the Facebook password (invalidates it, 190/460) or remove the app from the profile's connected apps (458), then redo Part C. Admins can also reset the app secret (roles doc); what that does to existing tokens is U. [A7] [A6]
- Rotating a GitHub secret from a workflow needs a personal access token with `repo` scope and libsodium encryption; whether the built-in `GITHUB_TOKEN` can write secrets is not stated in the docs. Avoid auto-rotation: with Page tokens we do not need it. [A12]
- If we ever use the Instagram Login path, refreshing means rewriting a secret every month or keeping the token in a separate private store. That is the strongest reason to prefer Facebook Login. [A7] [A12]

---

## 5. What the private ai-course repo must support

Facts from this repo (read from `README.md`, `apps/api/src/github.ts`, `apps/api/src/office.ts`, `apps/api/src/calendar.ts`):
- The Post button dispatches `office-handover.yml` in the publishing repo with inputs `team`, `item`, `action`, `date`, `time`, `source`, `caption`, `youtube`. The caption is cut at 8000 characters.
- `publishRepo(env, team)` returns the publishing repo only for `learnai` (one `AI_COURSE_REPO` setting). For `dsa` and `systemdesign` the Calendar has no publisher yet.
- Slots allow only item prefixes of the learnai tracks (e, r, q); item ids must match `[a-z]\d{2,4}`. Post-now accepts any such id. Posting window is 07:00 to 21:00 IST; `posts_per_slot` defaults to 3.
- ai-course's `post-reel` already posts Instagram, then Facebook, then YouTube for learnai. The finished video is the release `office-<team>-<item>` of the public content-office repo.

### Must support for the two new handles
1. **Per-handle credentials and ids**: the secret and id for each handle chosen from the `team` input; never a shared token.
2. **Per-handle platform switches**: do DSA and System Design have a YouTube channel? Skip platforms a handle does not have, without failing the run.
3. **Worker change (this repo, proposal only)**: `publishRepo()` per team (same ai-course repo with `team`, or a separate repo), and the item-id / track rules for DSA and System Design reels.
4. **Instagram step**: container (`REELS`, `video_url` or resumable upload) -> poll `status_code` about once a minute, up to 5 minutes -> `media_publish` -> read `media_product_type` to confirm a reel. [A3] [A5]
5. **Facebook step**: Page reel in three calls (start, upload, finish with `video_state=PUBLISHED`), then poll `status`. [A8]
6. **Idempotency**: record container id, media id and state per (item, handle, platform) before moving on, so a re-run never double-posts when Instagram succeeded and Facebook or YouTube failed.
7. **Reel length rule**: Facebook Page reels are 3 to 90 s; the office produces 20 to 120 s. Choose: skip Facebook above 90 s, or trim, or post as a normal video. [A8]
8. **Caption lint**: 2200 chars, 30 hashtags, 20 mentions for Instagram; fail early with a clear message. [A3]
9. **Pre-flight**: `content_publishing_limit` and token check before creating any container. [A4]
10. **Serial posting per handle**: no parallel `media_publish` on one account.
11. **Error surfacing**: log Meta `code`, `error_subcode`, container `status`; no tokens; non-zero exit. [A4]
12. **API version pinned** in one constant, with a calendar reminder before its "Available Until" date. [A11]
13. Optional parameters kept off unless the owner asks: `share_to_feed`, `cover_url` / `thumb_offset`, `trial_params`, `is_ai_generated`, `collaborators`. [A3]

### Questions to ask about ai-course (I cannot see it)
- How does `post-reel` post to Instagram and Facebook today: Graph API, which login type, which token, where stored, how renewed? Is there already a Meta app we should reuse?
- Does `office-handover.yml` handle `team=dsa` / `systemdesign` (config, `post_schedule`, item ids) or is it learnai-only?
- Does `post-reel` fetch the video from the public release URL, or upload bytes? Which one does the Instagram step use?
- What does it do on partial failure (Instagram done, Facebook failed)? Is there a state file per item?
- Do the two new handles have YouTube channels and Facebook Pages? Same captions and hashtags rule as learnai?
- Where are slots and `post_schedule` stored per handle?
- Which workflow permissions and triggers does the repo use today?
- Are the reels over 90 s common? (decides the Facebook rule)

---

## 6. Unverified or uncertain points

Each is labelled; none is stated as fact elsewhere in this file.

1. **Development mode publishing for real.** Docs say Standard Access suits apps "used only by people who have roles on them" and that dev-mode apps can use Standard permissions from role users. No page says outright that such an app can publish publicly visible reels. Expected to work; confirm with the first real post. [A6]
2. **Resumable upload eligibility.** Docs say "only for apps that have implemented Facebook Login for Business". Unknown whether a token made in the Graph API Explorer counts. Fallback: `video_url`. [A5]
3. **Does Meta follow redirects when it fetches `video_url`?** Not stated. GitHub release download URLs redirect to another host. Test the dry run. Private-repo release assets need auth, so they cannot be fetched this way. [A5]
4. **Daily post cap: 100 or 50?** The guide says 100 per 24 h moving period; the `media_publish` and `content_publishing_limit` reference pages say 50. Read `config.quota_total` at run time. Whether reels count is not stated. [A4]
5. **Creator vs Business and the API.** Guide says "professional accounts"; `media_publish` reference says "Business IG User"; Instagram Login docs show `account_type` of `Business` or `Media_Creator`. Business is the safe choice; Creator very likely works. [A2]
6. **Music by account type.** I found no official page that says which account type gets licensed music in the app. Third-party blogs say Business accounts see the Sound Collection instead of trending music. Irrelevant for our reels (audio is baked into the file), and the API cannot attach licensed hits: the Audio API (Facebook Login only) returns audio "authorized for third party use". [A13]
7. **Page tokens and password change / other invalidation.** Docs say Page tokens expire only "under certain conditions" and do not list them for Pages. Plan for 190 and a redo of Part C. [A7]
8. **Does Instagram publishing cross-post to the Page?** I found no API field for sharing a published reel to Facebook; treat the Facebook reel as a second call. [A3] [A8]
9. **"Instagram Tester" role (Instagram Login path).** Only third-party guides describe it; Meta's app-roles page lists Admin, Developer, Tester, Analytics User and does not mention it. Add the account through the dashboard instead. [A6]
10. **Page-to-Instagram multiplicity.** Not stated whether one Page can link several Instagram accounts. Plan: one Page per handle. A Page may also need to be in the same business portfolio as the Instagram account if one is used. [S: A9]
11. **Business portfolio side effects.** If a Page or account ends up in a business portfolio and the user holds a Business Manager role on the Page, Meta says the token also needs `ads_management` or `ads_read`. [A1]
12. **PPA** (Page Publishing Authorization): Meta's docs say it can block publishing and cannot be detected in advance; I found no official how-to. Third-party guides say it is usually an identity check. [A4]
13. **Accounts Center changes.** A search summary mentions a 2026 change to the "Logging in with accounts" experience; the page I fetched did not show it. Not needed for the API. [A10]
14. **Webhooks and "login flow" prerequisites.** The publishing guide lists "a Meta login flow and a webhooks server" as prerequisites. For our own accounts we skip the login flow (Explorer token) and poll status instead (documented). Whether Meta enforces the prerequisite is U. [A3] [A5]
15. **Facebook Page reels**: maximum file size and description length are not documented; the publish table says `upload_phase` "complete" while every example uses `finish` (use `finish`). [A8]
16. **System-user tokens** for Instagram publishing: Meta pages fetched do not say they work for this. Not recommended without a test. [A7]
17. **Permissions page** says unused permissions are dropped after 90 days; whether this applies to Page tokens in dev mode is U. [A6]
18. **Meta Verified**: disconnecting a Page and account may cancel a Meta Verified subscription. We have none planned. [A9]
19. **`is_ai_generated`**: the parameter exists (since 2026-06-22). I could not verify when Meta requires the label for synthetic voice. The owner decides policy. [A11]
20. Exact dashboard button names are from search summaries (S) and may differ.

---

# Appendix A. Source blocks (all fetched 2026-10-18)

## A1. Two ways to publish
URLs:
- https://developers.facebook.com/docs/instagram-platform/overview
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/content-publishing
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing

V claims:
- Instagram Login: serves professional accounts "with a presence on Instagram only"; Facebook Page not required; host `graph.instagram.com`; no hashtag search, product tagging or Partnership Ads; native messaging API. Permissions for publishing: `instagram_business_basic`, `instagram_business_content_publish`. Token: Instagram User token.
- Facebook Login: accounts linked to a Facebook Page; Page required; host `graph.facebook.com`. Permissions: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement` (plus `ads_management` and `ads_read` if the user has a Business Manager role on the Page). Token: Facebook Page access token. Login type: Facebook Login for Business.
- Both: "An Instagram professional account can be for a business or creator." Both support Advanced or Standard Access.
- Publishing: images, videos, reels and carousels.

## A2. Account types
URLs:
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media_publish.md

V claims:
- Instagram Login: `account_type` can be `Business` or `Media_Creator`; "This API setup does not require a Facebook Page" (docs/instagram-platform/instagram-api-with-instagram-login/).
- Facebook Login prerequisites: an Instagram Business or Creator account, a Facebook Page connected to it, and a Facebook developer who can perform Page tasks (MANAGE, CREATE_CONTENT, MODERATE or ADVERTISE).
- `media_publish` reference: "Publish an IG Container on an Instagram Business IG User"; the IG User object "Represents an Instagram Business Account or an Instagram Creator Account". Personal accounts are not supported by the publishing API (the guide says "professional accounts only").
- Ids: `GET /me/accounts` gives Pages; `GET /{page-id}?fields=instagram_business_account` gives the Instagram user id.

## A3. Reels: container, publish, specs
URLs:
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/content-publishing
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-container.md

V claims:
- `POST /<IG_ID>/media` with `media_type=REELS` and `video_url` makes a container; `POST /<IG_ID>/media_publish?creation_id=` publishes it; `GET /<IG_CONTAINER_ID>?fields=status_code` shows `IN_PROGRESS`, `FINISHED`, `PUBLISHED`, `ERROR`, `EXPIRED`. Poll about once per minute for at most 5 minutes. When `status_code` is `ERROR`, the container field `status` holds an error subcode. A published reel reports `media_type` VIDEO; read `media_product_type`.
- `share_to_feed`: true = Feed and Reels tabs, false = Reels only; neither guarantees the Reels tab.
- `cover_url`: public image; wins over `thumb_offset`. `thumb_offset`: milliseconds, default 0 (first frame).
- `caption`: maximum 2200 characters, 30 hashtags, 20 @mentions.
- Other reel fields: `audio_name` (renamed only once), `collaborators` (up to 3 usernames), `location_id`, `user_tags`, `trial_params` (needs `media_type=REELS`; `graduation_strategy` required: `MANUAL` or `SS_PERFORMANCE`; trial reels go only to non-followers), `is_ai_generated`.
- Reel video: MOV or MP4, moov atom at the front, no edit lists; HEVC or H.264, progressive, closed GOP, 4:2:0; 23 to 60 fps; width at most 1920; at most 25 Mbps VBR; audio AAC, 48 kHz max, mono or stereo, 128 kbps; duration 3 s to 15 min; file at most 300 MB; aspect 9:16 recommended, required range 0.01:1 to 10:1.
- Reel cover: JPEG, 8 MB max, sRGB, 9:16 recommended; other ratios are center-cropped (1:1 square in the feed).
- Uploads are asynchronous: a returned container id does not mean success.

## A4. Limits and errors
URLs:
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/content_publishing_limit.md
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media_publish.md
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/error-codes.md
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/content-publishing

V claims:
- Containers expire after 24 h; 400 containers per rolling 24 h per account.
- Posts per 24 h: the guide says 100 per moving period (carousel counts as one) enforced on `media_publish`, and also "50" in its carousel paragraph; the reference pages say 50 (`config.quota_total` "currently 50", `config.quota_duration` 86400 s). Use `GET /<IG_USER_ID>/content_publishing_limit` (`quota_usage`).
- If the linked Page requires PPA, the request fails until PPA is done; if the Page requires 2FA, the Facebook user must have completed it; US-ASCII-only URLs are strongly recommended.
- Error codes (code / subcode): 9 / 2207042 daily limit reached; 4 / 2207051 flagged as spam; 25 / 2207050 account restricted; 9004 / 2207052 media could not be fetched from the URI; -2 / 2207003 download took too long; 352 / 2207026 unsupported video format (use MOV or MP4); 1 / 2207057 thumbnail offset outside the video; 9007 / 2207027 media not ready, wait for FINISHED; -2 / 2207020 container expired; -1 / 2207053 unknown upload error (make a new container); -1 / 2207032 create-media failure, retry; 24 / 2207008 and 24 / 2207006 container not found or token problem.
- Resumable upload errors come back as `debug_info` with `retriable`, `type` (for example `ProcessingFailedError`) and `message`.

## A5. Video hosting and resumable upload
URLs:
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/content-publishing
- https://developers.facebook.com/documentation/instagram-platform/content-publishing/resumable-uploads.md

V claims:
- With `video_url` the media must be on a publicly accessible server when publishing is attempted, because Meta fetches it with cURL.
- Resumable upload: `upload_type=resumable`, then `POST https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>` with header `Authorization: OAuth <token>`, plus `offset` (usually 0) and `file_size` (bytes) for a local file, or `file_url` for a hosted file. Success: `"success": true`. Interrupted uploads resume from `video_status.uploading_phase.bytes_transferred`. The create request uses `Authorization: Bearer <token>`.
- It is "available only for apps that have implemented Facebook Login for Business". The page states no maximum file size.
- Webhooks and a Meta login flow are listed as prerequisites of the guide.

## A6. Access levels, review, verification, modes, roles
URLs:
- https://developers.facebook.com/docs/instagram-platform/app-review
- https://developers.facebook.com/documentation/development/graph-api/overview/access-levels.md
- https://developers.facebook.com/documentation/development/release/business-verification.md
- https://developers.facebook.com/docs/development/build-and-test/app-modes
- https://developers.facebook.com/docs/development/build-and-test/app-roles
- https://developers.facebook.com/documentation/development/register.md
- https://developers.facebook.com/documentation/development/create-an-app
- https://developers.facebook.com/docs/permissions
- https://developers.facebook.com/docs/instagram-platform/overview

V claims:
- App Review table: "My app is only for a business I own or manage" = Standard Access, App Review "Not required", for Instagram Login and Facebook Login. A Tech Provider serving several businesses needs review. "Your app can either use Facebook Login or Instagram Login but not both."
- Overview: "Standard Access is all your app needs" for your own accounts. Advanced Access "requires App Review and Business Verification".
- Access levels: Business apps get Standard Access automatically; permissions with Standard Access can be requested only from users with a role on the app.
- Business Verification: done in Business Manager by a business Admin; not needed for apps used only by people with a role on the app; the docs list no documents and no timeline here.
- App modes: new apps start in Development; in that mode only role users can use the app and Standard/Advanced permissions apply; Live mode: approved permissions only. Admins switch with the toolbar toggle.
- Roles: Administrator, Developer, Tester, Analytics User (Admin can reset the app secret). No Instagram Tester role is mentioned.
- Developer registration: Facebook login, accept terms, confirmation codes to phone and email, occupation.
- App creation at developers.facebook.com/apps/creation; use cases cannot be removed; business portfolio is optional unless the app accesses data you do not own or manage.
- Permissions page: App Review applies to apps that need data "you do not own or manage"; unused permissions need to be re-granted after 90 days.
- Pages use case "Manage everything on your Page": required by default `business_management`, `pages_show_list`, `public_profile` (https://developers.facebook.com/documentation/pages-api/create-an-app).

## A7. Tokens
URLs:
- https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived
- https://developers.facebook.com/docs/facebook-login/guides/access-tokens
- https://developers.facebook.com/docs/facebook-login/access-tokens/debugging-and-error-handling
- https://developers.facebook.com/docs/graph-api/reference/debug_token/
- https://developers.facebook.com/docs/graph-api/guides/explorer
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login
- https://developers.facebook.com/documentation/instagram-platform/reference/refresh_access_token.md
- https://developers.facebook.com/documentation/instagram-platform/reference/access_token.md
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started

V claims:
- Facebook Login: a long-lived user token lasts "about 60 days"; exchange from the server only; an expired token cannot be exchanged. A long-lived Page token (from `/{app-scoped-user-id}/accounts` with a long-lived user token, by someone with a role on the Page) "do[es] not have an expiration date and only expire[s] or [is] invalidated under certain conditions". Page tokens are "unique to each Page, admin, and app combination".
- Graph API Explorer: for apps where you hold a role; lets you choose permissions and get User or Page tokens.
- Invalid token signals: 190 / 460 (logout or password change), 458 (not authorized), 463 (expired). Meta does not notify you. `debug_token` needs an app access token or an app developer's user token and returns `is_valid`, `expires_at`, `data_access_expires_at`, `scopes`.
- Instagram Login: dashboard "Instagram > API setup with Instagram business login > Generate token" gives a token valid 60 days; code is valid 1 hour; long-lived exchange `GET https://graph.instagram.com/access_token` with `grant_type=ig_exchange_token` and the Instagram app secret, server-side only; refresh `GET https://graph.instagram.com/refresh_access_token` with `grant_type=ig_refresh_token`, token at least 24 h old, unexpired, `instagram_business_basic` granted, extends 60 days; not refreshed in 60 days = expired for good.
- App Access Token: server-to-server only, never in client code.
- System user tokens exist for Pages and ads (default never expire in Facebook Login for Business); nothing found on Instagram publishing with them.

## A8. Facebook Page Reels
URLs:
- https://developers.facebook.com/docs/video-api/guides/reels-publishing
- https://developers.facebook.com/documentation/video-api/guides/publishing

V claims:
- Needs a Page token from a user who can perform the `CREATE_CONTENT` task; permissions `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`. Reels go to Pages only.
- Flow: `POST /{page-id}/video_reels` with `upload_phase=start` -> upload to `rupload.facebook.com/video-upload/{video-id}` (headers `Authorization: OAuth`, `offset`, `file_size`, or `file_url`) -> `POST /{page-id}/video_reels` with `video_id`, `upload_phase=finish`, `video_state` (`DRAFT`, `SCHEDULED`, `PUBLISHED`), optional `description`, `title`. Status: `GET /{video-id}?fields=status`.
- Video: mp4, 9:16, 1080x1920 recommended, minimum 540x960, 24 to 60 fps fixed, duration 3 to 90 s, closed GOP 2 to 5 s, H.264/H.265, AAC-LC stereo 48 kHz, 128 kbps or more.
- Hosted file: http/https only, no login-protected URLs, host must allow user agent `facebookexternalhit/1.1`, Meta CDN URLs rejected.
- Limit: 30 API-published posts per 24 h per Page. Errors: 1363040 aspect ratio, 1363127 resolution, 1363128 duration, 1363129 frame rate.
- Not documented: maximum file size, description length.

## A9. Professional accounts and linking (help pages)
URLs:
- https://www.facebook.com/help/instagram/502981923235522 (set up professional account)
- https://www.facebook.com/help/instagram/1717693135113805 (switch back to personal)
- https://www.facebook.com/help/instagram/138925576505882 and https://www.facebook.com/help/instagram/1158274571010880 (about professional / creator accounts)
- https://www.facebook.com/help/1148909221857370 (connect Instagram to a Page)
- https://www.facebook.com/help/104002523024878 (create a Page)
- S (search summaries of): https://www.facebook.com/business/help/898752960195806, https://help.instagram.com/570895513091465, https://www.facebook.com/business/help/620548115562686, https://en-gb.facebook.com/business/help/205428387437406

V claims:
- Switch to professional: Settings > Account type and tools > Switch to professional account > category > Creator or Business. The category does not decide the type. Connecting a Page there is optional. A private account becomes public.
- Business: "retailers, local businesses, brands, organisations and service providers". Creator: "public figures, content producers, artists and influencers". Both get the professional dashboard, ads, insights, contact button, secondary inbox; you can change type any time.
- Switch back: Account type and tools > Account type > Switch account type > Switch to personal account. You lose some Meta business tools like Meta Business Suite and Ads Manager, lose ad access, a connected Page is disconnected; a public account keeps dashboard and insights.
- With a Page linked, Instagram posts can be shared to Facebook only through that Page.
- Connect from the Page: Settings & privacy > Settings > Permissions > Linked accounts > Instagram > Connect account; needs Facebook access or task access to the Page; a personal Instagram account is prompted to become professional; disconnecting may cancel a Meta Verified subscription.
- Create a Page: Pages > Create Page > Public Page > name and category.
- S claims: new Pages experience path (Manage > Professional dashboard > Linked accounts); from the Instagram app (Edit profile > Page); anyone with access to the Page or the account can manage both; one business portfolio at a time per Instagram account; Page admin needed on mobile.

## A10. Accounts Center
URLs:
- https://www.facebook.com/help/1026219344754266
- https://www.facebook.com/help/213446087365127
- https://www.facebook.com/help/2808345489420767

V claims:
- Accounts Center manages "connected experiences like logging in across your accounts" for Facebook, Instagram, WhatsApp and Meta accounts; you need at least two accounts; only one Facebook account per Accounts Center.
- Adding accounts to Accounts Center lets you share Instagram posts to Facebook; automatic sharing is set there. The pages do not say whether Pages can be added.
- Meaning for us: the Page link (A9) is a separate step from Accounts Center, nothing in Accounts Center is needed for the API, and once a Page is linked Instagram-to-Facebook sharing goes only through that Page (so the old share-to-personal-profile setting stops applying to that handle).

## A11. Recent changes and deprecations
URLs:
- https://developers.facebook.com/docs/instagram-platform/changelog
- https://developers.facebook.com/docs/graph-api/changelog/
- https://developers.facebook.com/docs/graph-api/guides/versioning

V claims:
- 2026-06-22: `is_ai_generated` added to media creation (AI info label), both login types. 2026-06-01: Audio API (Facebook Login). 2026-04-22: Partnership Ads label parameters, collaborative media. 2026-02-06: `enable_fb_login` OAuth parameter. 2025-12-03: Trial Reels via `trial_params`; `DELETE /{ig_media_id}` (needs `instagram_manage_contents`).
- Earlier: Instagram Login without a Page since 2024-07-23; Basic Display API deprecated 2024-12-04; old `business_*` scopes stopped 2025-01-27; media insight metrics `impressions` and `plays` deprecated 2025-04-21. No 2026 entry announces a deprecation of publishing.
- Graph API: latest v26.0 (2026-07-29); v25.0 available until 2028-07-29; each version is usable for at least two years; always send the version in the path.

## A12. GitHub secrets
URLs:
- https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- https://docs.github.com/en/rest/actions/secrets

V claims:
- Repository secrets: Settings > Secrets and variables > Actions > New repository secret (or `gh secret set NAME`). Secrets are not passed to workflows triggered from forks (except `GITHUB_TOKEN`). Mask derived values with `::add-mask::`. Avoid secrets on command lines. Secrets cannot be used directly in `if:`. OIDC is suggested where supported.
- Writing a secret by API (`PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}`) needs a classic token with `repo` scope and a libsodium-encrypted value. Whether `GITHUB_TOKEN` can do it is not stated.

## A13. Audio and music
URLs:
- https://developers.facebook.com/documentation/instagram-platform/content-publishing/audio-api.md
- https://www.facebook.com/help/instagram/329208821595430

V claims:
- Audio API: Facebook Login only ("not supported on the Instagram API with Instagram Login"); Business or Creator account connected to a Page; `audio_configuration` with `audio_id`; returns audio authorized for third-party use, possibly different from the app's library; no preview.
- Help page on reel audio: licensed audio and original audio exist; it does not describe account-type differences. Audio can be muted if rights change; the post stays viewable.
