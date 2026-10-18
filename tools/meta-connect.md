# meta-connect: put the Meta tokens into the private repo, on your own PC

Run by the owner only. No assistant sees a token: never paste tokens, the app secret or this tool's output into a chat.
It writes nothing to disk, prints no token, takes no token as an argument and refuses to run if its output goes to a file.
Use Windows Terminal or PowerShell (Git Bash cannot hide typing). Rehearsal with fake data: add `--dry-run`.

## Owner flow, one app "ai-course-poster", no App Secret, no Facebook password
Two kinds of token, one run: `node tools/meta-connect.mjs --ig-login --long-token --gh-user shivamm-fl`
(`--long-token` alone = Facebook Page tokens only; `--ig-login` alone = Instagram tokens only.)

A. Facebook Page tokens (`--long-token`, for the Facebook crosspost)
1. Graph API Explorer: Meta App = ai-course-poster, User or Page = User token, add `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`, Generate (Get) Access Token, select all three Pages and Instagram accounts. Copy it.
2. Access Token Debugger: paste it, Debug, **Extend Access Token**, copy the extended (about 60 days) token.
3. Run the command; paste the extended token at the hidden prompt; pick the Page number for AI, DSA, SYSTEMDESIGN.

B. Instagram posting tokens (`--ig-login`, one per Instagram account)
1. App dashboard: Instagram > API setup with Instagram business login > **Generate token** next to the account (add the account first if it is not listed), logged in as THAT Instagram account. Copy the token (dashboard tokens last 60 days).
2. The tool then asks "Instagram-Login token for AI / DSA / SYSTEMDESIGN" at hidden prompts and waits, so generate and paste one after the other. Enter skips a handle.
3. Check the table (handle, Instagram username, Instagram user id, account type) shows the right account on each row, then answer y.
Afterwards close the terminal and tell the assistant only "done".

## What it sets in `shivamm-fl/ai-course` (must be private; `--gh-user` uses that saved gh account for this run only, the active one is never switched)
Secrets: `META_PAGE_TOKEN_<X>` (A), `META_IG_TOKEN_<X>` (B), value through gh's stdin. Variables: `META_FB_PAGE_ID_<X>`, `META_IG_USER_ID_<X>` (B: `user_id` of the token's account, else the Page's linked Instagram id). X = AI, DSA, SYSTEMDESIGN. Then it lists the names with `present`.
Also: `--repo`, `--api-version v26.0` (graph.facebook.com), `--ig-api-version v25.0` (graph.instagram.com), `--port`, `--no-open`, `--paste`/OAuth with App ID and Secret. Errors print `Stopped:` and anything token-like as `[hidden]`.
Checks: `/debug_token` report for Facebook tokens (skipped, never fatal, if Meta refuses the owner's own token); a user token expiring within 7 days is refused; the same Instagram account on two handles is refused; a Page whose Instagram account differs from the token's account gives a warning.

## Sources (read 2026-10-18)
- Facebook: .../docs/facebook-login/guides/advanced/manual-flow, .../access-tokens/get-long-lived, .../instagram-api-with-facebook-login/get-started (`/me/accounts`, `instagram_business_account`), .../docs/graph-api/reference/debug_token/ ("an app access token or an app developer's user access token"), .../docs/video-api/guides/reels-publishing, .../docs/graph-api/guides/explorer
- Instagram Login (https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/): `get-started` (host `graph.instagram.com/v25.0`, `GET /me?fields=user_id,username`, answer `{data:[{user_id,username}]}`, `account_type`, Generate token, 60 days), `business-login` (long-lived 60 days), `content-publishing` (`instagram_business_basic`, `instagram_business_content_publish`, `<IG_ID>`)

## Not verifiable from the docs
- "Extend Access Token", "Add account", "Generate access tokens" and the tool URLs are in no fetched Meta doc (the docs say "Generate token"); trust the screen.
- Instagram token expiry cannot be read (no documented read-out; the refresh call would extend the token, so it is never called) and its permissions cannot be checked.
- That graph.instagram.com accepts v26.0 (default v25.0, from the doc examples); whether Facebook Page tokens work in an app set to Instagram Login (Meta says an app uses one login type; if step A fails, run `--ig-login` alone); that `user_id` equals the Page-linked Instagram id (the tool warns if not).
- Whether `/debug_token` accepts the owner's own token; the `http://localhost` OAuth redirect; `config_id` in the manual flow; the never-expiring `expires_at` value.

## Tests
`node --test tools/meta-connect.test.mjs`: mock Graph + Instagram server, stub gh (injected and a real fake executable): no secret in argv, stdout, stderr or files, tokens only on gh's stdin, in every mode.
