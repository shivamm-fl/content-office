# meta-connect: put the Meta Page tokens into the private repo, on your own PC

Run by the owner only. No assistant sees a token: do not paste tokens, the app secret or this tool's output into a chat.
It writes nothing to disk, prints no token, takes no token as an argument and refuses to run if its output goes to a file.

## What it does
1. Checks gh: the repo (default `shivamm-fl/ai-course`) must be private. `--gh-user shivamm-fl` uses that saved gh account for this run only (it sets GH_TOKEN for the gh child processes; your active gh account is never switched).
2. Asks for the Meta App ID and App Secret (hidden). Then either one-time OAuth login in your browser (default) or `--paste` (hidden prompt for a user token from the Graph API Explorer). Swaps it for a long-lived user token.
3. `/debug_token` report: token type, expiry, scopes, missing scopes.
4. Lists your Pages (name, Page id, Instagram username, Instagram user id) and asks which number is AI, DSA, SYSTEMDESIGN.
5. Checks each Page token, sets secrets `META_PAGE_TOKEN_AI|DSA|SYSTEMDESIGN` (value through gh's stdin) and variables `META_IG_USER_ID_<X>`, `META_FB_PAGE_ID_<X>`, then lists the secret and variable names to prove they exist.

## How to run (Windows Terminal or PowerShell; Git Bash cannot hide typing)
    node tools/meta-connect.mjs --gh-user shivamm-fl
    node tools/meta-connect.mjs --paste --gh-user shivamm-fl     # if the OAuth redirect is refused
    node tools/meta-connect.mjs --dry-run                         # rehearsal: fake responses, no network, no gh calls
Options: `--repo owner/name`, `--port 8787`, `--api-version v26.0`, `--no-open`. Before the first run, add `http://localhost:8787/callback` to the app's Facebook Login "Valid OAuth redirect URIs" (use your `--port` if changed). If the app uses Facebook Login for Business, the tool asks for the configuration id (Enter to skip).

## What you see
Steps 1 to 6 with plain lines. A login link (it holds only the app id, a random state and the permission names). The page table. Prompts "Page number for AI". "Set these now? [y/N]". At the end every secret/variable name with `present`. If a Page has no linked Instagram account it says so and cannot be chosen. A failure prints `Stopped:` with the Meta code and subcode; anything that looks like a token is shown as `[hidden]`.
Afterwards close the terminal and tell the assistant only "done".

## Permissions requested
`instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `pages_manage_posts` (guide: company/meta-publishing-setup.md, sections A1 and A8).

## Sources (Meta docs read 2026-10-18 and GitHub CLI help)
- Login dialog, state, code exchange, `auth_type=rerequest`: https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
- Long-lived exchange (`grant_type=fb_exchange_token`), Page tokens from `/{user-id}/accounts`: https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived
- `/me/accounts` and `GET /{page-id}?fields=instagram_business_account`: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started
- `instagram_business_account` needs a User token: https://developers.facebook.com/docs/graph-api/reference/page/ ; IG User `id`, `username`: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user
- Permissions: .../instagram-api-with-facebook-login/content-publishing and https://developers.facebook.com/docs/video-api/guides/reels-publishing
- `/debug_token`: https://developers.facebook.com/docs/graph-api/reference/debug_token/ and .../facebook-login/access-tokens/debugging-and-error-handling; app token `app-id|app-secret`: .../facebook-login/guides/access-tokens
- `config_id`: https://developers.facebook.com/docs/facebook-login/facebook-login-for-business ; paging and expansion: .../graph-api/results, .../graph-api/guides/field-expansion ; version v26.0: .../graph-api/guides/versioning

## Not verifiable from the docs
- Whether Meta accepts the `http://localhost` redirect for your app type (the docs only say to register the URI). If not, use `--paste`.
- Manual-flow use of `config_id` (only the parameter name is shown); the tool then sends `response_type=code` and no `scope`.
- That `instagram_business_account{id,username}` expands on `/me/accounts` (the tool falls back to one call per Page).
- What `/debug_token` returns for a never-expiring token (the tool reads `expires_at` 0 or missing as "never") and the `type` value for Page tokens (only `USER` is shown in the docs).

## Tests
`node --test tools/meta-connect.test.mjs`: mock Graph API, stub gh (injected and as a real fake executable); proves no secret in argv, stdout, stderr or files and that tokens only reach gh's stdin.
