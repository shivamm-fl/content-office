#!/usr/bin/env node
// meta-connect: the owner runs this on his own PC to connect the Meta (Facebook + Instagram) Page tokens to the
// private publishing repo, so that no assistant ever sees a token (company rule 4).
// 1. asks (hidden input) for the Meta App ID and App Secret, logs in once in the owner's browser (OAuth, local callback
//    on 127.0.0.1) or, with --paste, takes a user token pasted at a hidden prompt, and swaps it for a long-lived one;
//    with --long-token there is no App ID and no App Secret: an already long-lived user token is pasted (hidden) and used as is;
//    with --ig-login the Instagram-Login token of each handle's account is pasted (hidden), checked with
//    graph.instagram.com/me (user_id, username) and stored as META_IG_TOKEN_<X> (alone, or together with --long-token),
// 2. lists the Pages with their linked Instagram accounts (names and ids only) and asks which Page is for AI, DSA, SYSTEMDESIGN,
// 3. checks the tokens with /debug_token (type, expiry, scopes, missing scopes; the token itself is never shown),
// 4. sets META_PAGE_TOKEN_<X> (secret, through gh's stdin) and META_IG_USER_ID_<X>, META_FB_PAGE_ID_<X> (variables) in the
//    private repo, then lists the secret and variable NAMES to prove it worked.
// Nothing is written to disk. Tokens live in memory only, are never printed, never put on a command line, and are
// scrubbed from every message. Docs used: see tools/meta-connect.md. Tests: node --test tools/meta-connect.test.mjs
import { spawn } from "node:child_process";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { fstatSync } from "node:fs";
import http from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const GRAPH_VERSION = "v26.0";
export const GRAPH_BASE = "https://graph.facebook.com";
export const DIALOG_BASE = "https://www.facebook.com";
// Instagram API with Instagram Login: host graph.instagram.com, examples use v25.0 (get-started page).
export const IG_BASE = "https://graph.instagram.com";
export const IG_VERSION = "v25.0";
// Permissions of the publishing guide (company/meta-publishing-setup.md, A1 and A8).
export const SCOPES = ["instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement", "pages_manage_posts"];
export const HANDLES = ["AI", "DSA", "SYSTEMDESIGN"];
const DEFAULT_REPO = "shivamm-fl/ai-course";
const DEFAULT_PORT = 8787;

class UsageError extends Error {}
class Abort extends Error {}
class MetaError extends Error {}

const USAGE = `Usage: node tools/meta-connect.mjs [options]
  --long-token         no App ID, no App Secret: paste an already long-lived user token (Explorer, then
                       "Extend Access Token" in the Access Token Debugger) at a hidden prompt
  --ig-login           Instagram posting tokens (API setup with Instagram login): one hidden prompt per handle
                       (Enter skips it). Alone = Instagram only; with --long-token = Facebook Page tokens too
  --paste              no OAuth: paste a short-lived Explorer user token at a hidden prompt (needs App ID + Secret)
  --repo owner/name    repo that gets the secrets and variables (default ${DEFAULT_REPO}, must be private)
  --gh-user name       use that saved gh account for this run only (default: the active gh account)
  --port N             local callback port (default ${DEFAULT_PORT}; redirect URI http://localhost:N/callback)
  --api-version vNN.N  Graph API version of graph.facebook.com (default ${GRAPH_VERSION})
  --ig-api-version vNN.N  version of graph.instagram.com (default ${IG_VERSION})
  --no-open            do not try to open the browser
  --dry-run            fake Graph and gh responses, no network, no gh calls
  --help
Tokens are never accepted as arguments: the tool asks for them at a hidden prompt.`;

// ---------- arguments ----------
export function parseArgs(argv) {
  const o = { paste: false, longToken: false, igLogin: false, dryRun: false, help: false, noOpen: false, repo: DEFAULT_REPO, ghUser: "", port: DEFAULT_PORT, apiVersion: GRAPH_VERSION, igApiVersion: IG_VERSION };
  const SWITCHES = new Set(["--paste", "--long-token", "--ig-login", "--dry-run", "--no-open", "--help"]);
  for (let i = 0; i < argv.length; i++) {
    let a = argv[i];
    let inline;
    if (a.startsWith("--") && a.includes("=")) { inline = a.slice(a.indexOf("=") + 1); a = a.slice(0, a.indexOf("=")); }
    if (!/^--[a-z][a-z-]{0,24}$/.test(a)) throw new UsageError("unexpected argument (not shown). Tokens are never accepted on the command line.");
    if (!SWITCHES.has(a) && /token|secret|password|cookie|key|code/.test(a)) throw new UsageError("tokens and secrets are never accepted on the command line. Run without them: the tool asks at a hidden prompt.");
    if (SWITCHES.has(a) && inline !== undefined) throw new UsageError(`${a} takes no value (not shown). Tokens are never accepted on the command line.`);
    const value = () => {
      const v = inline ?? argv[++i];
      if (v === undefined) throw new UsageError(`${a} needs a value`);
      return v;
    };
    switch (a) {
      case "--paste": o.paste = true; break;
      case "--long-token": o.longToken = true; break;
      case "--ig-login": o.igLogin = true; break;
      case "--dry-run": o.dryRun = true; break;
      case "--no-open": o.noOpen = true; break;
      case "--help": o.help = true; break;
      case "--repo": o.repo = value(); if (!/^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/.test(o.repo)) throw new UsageError("--repo must look like owner/name"); break;
      case "--gh-user": o.ghUser = value(); if (!/^[A-Za-z0-9-]{1,39}$/.test(o.ghUser)) throw new UsageError("--gh-user must be a GitHub user name"); break;
      case "--port": { const p = Number(value()); if (!Number.isInteger(p) || p < 1 || p > 65535) throw new UsageError("--port must be 1 to 65535"); o.port = p; break; }
      case "--api-version": o.apiVersion = value(); if (!/^v\d{1,3}\.\d{1,2}$/.test(o.apiVersion)) throw new UsageError("--api-version must look like v26.0"); break;
      case "--ig-api-version": o.igApiVersion = value(); if (!/^v\d{1,3}\.\d{1,2}$/.test(o.igApiVersion)) throw new UsageError("--ig-api-version must look like v25.0"); break;
      default: throw new UsageError(`unknown option ${a}`);
    }
  }
  if (o.paste && o.longToken) throw new UsageError("use either --paste or --long-token, not both");
  if (o.paste && o.igLogin) throw new UsageError("--paste is a Facebook Login mode: with --ig-login use --long-token for the Facebook part, or nothing for Instagram only");
  return o;
}

// ---------- scrubbing: no token in any message ----------
const PATTERNS = [
  /EAA[A-Za-z0-9_-]{16,}/g, // Meta access tokens start with EAA
  /\b\d{6,20}\|[A-Za-z0-9_-]{16,}/g, // app access token: app-id|app-secret
  /\bIG[A-Za-z]{2,4}[A-Za-z0-9_-]{16,}/g, // Instagram-Login access tokens (IGAA..., IGQV...)
  /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/g, // GitHub tokens
  /\b(?:Bearer|OAuth)\s+[A-Za-z0-9._|-]{24,}/g,
];
const QUERY_SECRET = /((?:access_token|client_secret|fb_exchange_token|input_token|token|secret)=|(?<![A-Za-z_])code=)[^&\s"'<>]+/gi;

export function makeScrubber() {
  const known = new Set();
  const remember = (v) => { if (typeof v === "string" && v.length >= 8) known.add(v); return v; };
  const scrub = (text) => {
    let s = String(text ?? "");
    for (const k of [...known].sort((a, b) => b.length - a.length)) s = s.split(k).join("[hidden]");
    for (const re of PATTERNS) s = s.replace(re, "[hidden]");
    s = s.replace(QUERY_SECRET, "$1[hidden]");
    return s.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ""); // no control or escape characters from remote data
  };
  return { remember, scrub };
}

// ---------- prompts ----------
// Hidden prompt: raw mode, nothing echoed, nothing stored. Visible prompts use the terminal's own line editing.
export function ttyAsk(stdin, stdout) {
  return (question, { hidden = false } = {}) => new Promise((resolve, reject) => {
    if (!stdin.isTTY) return reject(new UsageError("this tool needs an interactive terminal (stdin is not one), so nothing can be typed hidden"));
    stdout.write(question);
    let buf = "";
    stdin.setEncoding("utf8");
    if (hidden) stdin.setRawMode(true);
    stdin.resume();
    const end = (fn, v) => {
      stdin.off("data", onData);
      if (hidden) { stdin.setRawMode(false); stdout.write("\n"); }
      stdin.pause();
      fn(v);
    };
    const onData = (chunk) => {
      for (const ch of chunk.replace(/\u001b\[20[01]~/g, "")) { // drop bracketed-paste markers
        if (ch === "\r" || ch === "\n") return end(resolve, buf.trim());
        if (ch === "\u0003") return end(reject, new Abort("cancelled"));
        if (ch === "\u007f" || ch === "\b") buf = buf.slice(0, -1);
        else if (ch >= " ") buf += ch;
      }
    };
    stdin.on("data", onData);
  });
}

const isFile = (fd) => { try { return fstatSync(fd).isFile(); } catch { return false; } };

function openBrowser(url) {
  if (!url.startsWith(`${DIALOG_BASE}/`)) return;
  try {
    const [cmd, args] = process.platform === "win32" ? ["rundll32", ["url.dll,FileProtocolHandler", url]]
      : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
    const c = spawn(cmd, args, { stdio: "ignore", detached: true, windowsHide: true });
    c.on("error", () => undefined);
    c.unref();
  } catch { /* the owner opens the printed URL himself */ }
}

// ---------- gh ----------
// Real runner: gh is started without a shell, the value goes through stdin only.
function spawnGh(ghCmd) {
  return (args, { input = "", env = process.env } = {}) => new Promise((resolve) => {
    let child;
    try {
      child = spawn(ghCmd[0], [...ghCmd.slice(1), ...args], { env, stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    } catch (e) { return resolve({ status: 127, stdout: "", stderr: String(e.message) }); }
    let so = "";
    let se = "";
    child.stdout.on("data", (d) => { so += d; });
    child.stderr.on("data", (d) => { se += d; });
    child.on("error", (e) => resolve({ status: 127, stdout: "", stderr: e.code === "ENOENT" ? "the gh command was not found (install the GitHub CLI)" : e.message }));
    child.on("close", (status) => resolve({ status: status ?? 1, stdout: so, stderr: se }));
    child.stdin.on("error", () => undefined);
    child.stdin.end(input);
  });
}

// ---------- Graph API ----------
async function graph(ctx, path, params = {}, base = ctx.graphBase, version = ctx.version) {
  const url = new URL(`${base}/${version}${path}`);
  for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, v);
  let res;
  let text;
  try {
    res = await ctx.fetch(url, { signal: AbortSignal.timeout(20000), headers: { Accept: "application/json" } });
    text = await res.text();
  } catch (e) {
    throw new MetaError(`network problem talking to the Graph API (${e?.cause?.code || e?.name || "error"})`);
  }
  let body = null;
  try { body = JSON.parse(text); } catch { /* handled below */ }
  if (!res.ok || body?.error) {
    const er = body?.error || {};
    const bits = [`HTTP ${res.status}`, er.code !== undefined && `code ${er.code}`, er.error_subcode !== undefined && `subcode ${er.error_subcode}`, er.type].filter(Boolean).join(", ");
    throw new MetaError(`Graph API error (${bits}): ${ctx.scrub(er.message || "no message").slice(0, 300)}`);
  }
  if (body === null || typeof body !== "object") throw new MetaError("the Graph API answered with something that is not JSON");
  return body;
}

async function exchangeCode(ctx, { appId, appSecret, redirectUri, code }) {
  const j = await graph(ctx, "/oauth/access_token", { client_id: appId, redirect_uri: redirectUri, client_secret: appSecret, code });
  if (!j.access_token) throw new MetaError("the code exchange returned no token");
  return ctx.remember(j.access_token);
}

async function exchangeLong(ctx, { appId, appSecret, shortToken }) {
  const j = await graph(ctx, "/oauth/access_token", { grant_type: "fb_exchange_token", client_id: appId, client_secret: appSecret, fb_exchange_token: shortToken });
  if (!j.access_token) throw new MetaError("the long-lived exchange returned no token");
  return { token: ctx.remember(j.access_token), days: j.expires_in ? Math.round(j.expires_in / 86400) : null };
}

// /me/accounts: the Pages the user manages, each with its own Page token; the linked Instagram account comes from
// instagram_business_account (a User token is required for that field), looked up per Page when the list omits it.
async function listPages(ctx, userToken) {
  const pages = [];
  let after;
  for (let n = 0; n < 20; n++) {
    const j = await graph(ctx, "/me/accounts", {
      fields: "id,name,access_token,tasks,instagram_business_account{id,username}", limit: "25", after, access_token: userToken,
    });
    for (const p of j.data || []) {
      if (!p?.id) continue;
      if (p.access_token) ctx.remember(p.access_token);
      pages.push({ id: String(p.id), name: String(p.name || "(no name)"), token: p.access_token || "", ig: p.instagram_business_account || null });
    }
    after = j.paging?.next ? j.paging?.cursors?.after : undefined;
    if (!after) break;
  }
  for (const p of pages) {
    if (p.ig?.id) continue;
    try {
      const j = await graph(ctx, `/${encodeURIComponent(p.id)}`, { fields: "instagram_business_account{id,username}", access_token: userToken });
      p.ig = j.instagram_business_account || null;
    } catch (e) { ctx.warn(`could not read the Instagram link of one Page: ${e.message}`); }
  }
  return pages;
}

// GET /debug_token needs "an app access token or an app developer's user access token" (reference page). With the app
// secret we use the app token app-id|app-secret; in --long-token mode there is no secret, so the owner's own user token
// (he is an Admin of the app) is tried, and the caller treats a refusal as "report skipped", never as a failure.
async function debugToken(ctx, { appId, appSecret, token, longToken, userToken }) {
  const j = await graph(ctx, "/debug_token", { input_token: token, access_token: longToken ? userToken : `${appId}|${appSecret}` });
  return j.data || {};
}

// Instagram API with Instagram Login: GET graph.instagram.com/vNN.N/me?fields=user_id,username,account_type with the
// Instagram User token. user_id is the Instagram professional account ID (the one publishing uses); id is app-scoped.
// The documented sample answers { data: [ { user_id, username } ] }; a flat object is accepted too.
async function instagramMe(ctx, token) {
  const j = await graph(ctx, "/me", { fields: "user_id,username,account_type", access_token: token }, ctx.igBase, ctx.igVersion);
  const d = Array.isArray(j.data) ? j.data[0] : j;
  if (!d?.user_id || !/^\d{5,25}$/.test(String(d.user_id))) throw new MetaError("the Instagram API returned no usable user_id for this token");
  return { userId: String(d.user_id), username: String(d.username || ""), accountType: String(d.account_type || "") };
}

const day = (sec) => new Date(sec * 1000).toISOString().slice(0, 10);

export function describeDebug(label, d, { isPage = false } = {}) {
  const lines = [];
  const scopes = Array.isArray(d.scopes) ? d.scopes : [];
  const missing = SCOPES.filter((s) => !scopes.includes(s));
  lines.push(`  ${label}: type ${d.type ?? "not reported"}, valid ${d.is_valid === undefined ? "not reported" : d.is_valid}`);
  if (d.is_valid === false && d.error) lines.push(`    invalid: code ${d.error.code ?? "?"}, subcode ${d.error.subcode ?? "?"}`);
  if (!d.expires_at) lines.push(`    expiry: ${d.expires_at === 0 ? "never (expires_at 0)" : "not reported"}${isPage ? ", as expected for a Page token" : ""}`);
  else lines.push(`    expiry: ${day(d.expires_at)}${isPage ? "  WARNING: a Page token from a long-lived user token should not expire" : ""}`);
  if (!isPage && d.data_access_expires_at) lines.push(`    data access until: ${day(d.data_access_expires_at)}`);
  lines.push(`    scopes: ${scopes.length ? scopes.join(", ") : "none reported"}`);
  lines.push(`    missing: ${missing.length ? missing.join(", ") : "none"}`);
  return { lines, missing, valid: d.is_valid !== false, expiresAt: d.expires_at || 0 };
}

// ---------- OAuth login in the owner's browser ----------
function dialogUrl(o) {
  const u = new URL(`${DIALOG_BASE}/${o.version}/dialog/oauth`);
  u.searchParams.set("client_id", o.appId);
  u.searchParams.set("redirect_uri", o.redirectUri);
  u.searchParams.set("state", o.state);
  u.searchParams.set("response_type", "code");
  if (o.configId) u.searchParams.set("config_id", o.configId); // Facebook Login for Business: the configuration holds the permissions
  else { u.searchParams.set("scope", SCOPES.join(",")); u.searchParams.set("auth_type", "rerequest"); }
  return u.toString();
}

const PAGE = (title, text) => `<!doctype html><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>${title}</title><body style="font:16px system-ui;margin:3em"><h2>${title}</h2><p>${text}</p></body>`;

function waitForCallback({ port, state, timeoutMs, onListening }) {
  return new Promise((resolve, reject) => {
    let done = false;
    let timer;
    const finish = (fn, v) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      server.close();
      server.closeAllConnections?.();
      fn(v);
    };
    const send = (res, status, html) => {
      res.writeHead(status, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", Connection: "close" });
      res.end(html);
    };
    const server = http.createServer((req, res) => {
      const actual = server.address().port;
      const host = String(req.headers.host || "");
      if (req.method !== "GET" || (host !== `localhost:${actual}` && host !== `127.0.0.1:${actual}`)) return send(res, 400, PAGE("Bad request", "Not the expected request."));
      const u = new URL(req.url, `http://127.0.0.1:${actual}`);
      if (u.pathname !== "/callback") return send(res, 404, PAGE("Not found", "Nothing here."));
      const got = Buffer.from(u.searchParams.get("state") || "");
      const want = Buffer.from(state);
      if (got.length !== want.length || !timingSafeEqual(got, want)) return send(res, 400, PAGE("State mismatch", "This request did not come from the login this tool started. Ignored."));
      if (u.searchParams.get("error")) {
        send(res, 200, PAGE("Login cancelled", "You can close this tab and go back to the terminal."));
        return finish(reject, new MetaError(`the Facebook login was not completed (${(u.searchParams.get("error_reason") || u.searchParams.get("error")).slice(0, 60)})`));
      }
      const code = u.searchParams.get("code");
      if (!code) return send(res, 400, PAGE("No code", "The login answer had no code."));
      send(res, 200, PAGE("Connected", "You can close this tab and go back to the terminal."));
      finish(resolve, code);
    });
    server.on("error", (e) => finish(reject, new UsageError(e.code === "EADDRINUSE" ? `port ${port} is already in use: pick another with --port (and register that redirect URI in the app)` : `local callback server failed (${e.code || "error"})`)));
    timer = setTimeout(() => finish(reject, new MetaError("timed out after 5 minutes waiting for the Facebook login")), timeoutMs);
    server.listen(port, "127.0.0.1", () => onListening(server.address().port));
  });
}

async function oauthLogin(ctx, o, { appId, appSecret, configId }) {
  const state = randomBytes(16).toString("hex");
  let redirectUri = "";
  const code = ctx.remember(await waitForCallback({
    port: o.port, state, timeoutMs: ctx.oauthTimeoutMs,
    onListening: (port) => {
      redirectUri = `http://localhost:${port}/callback`;
      const url = dialogUrl({ version: ctx.version, appId, redirectUri, state, configId });
      ctx.out(`Waiting for the login on 127.0.0.1:${port}. Redirect URI: ${redirectUri}`);
      ctx.out("It must be listed under Valid OAuth Redirect URIs of the app's Facebook Login settings.");
      ctx.out("Open this link in your own browser and log in as the owner profile (it contains no secret):\n");
      ctx.out(url + "\n");
      if (!o.noOpen) ctx.openBrowser(url);
    },
  }));
  ctx.out("Login answer received (state checked).");
  return exchangeCode(ctx, { appId, appSecret, redirectUri, code });
}

// ---------- steps ----------
function checkField(value, name, re) {
  if (!re.test(value)) throw new UsageError(`${name} does not look right (not shown); nothing was sent anywhere`);
  return value;
}

async function githubPreflight(ctx, o) {
  ctx.step(`GitHub: repo ${o.repo}${o.ghUser ? `, gh account ${o.ghUser}` : ", active gh account"}`);
  let env = ctx.env;
  if (o.ghUser) {
    const r = await ctx.runGh(["auth", "token", "--user", o.ghUser], { env });
    const tok = r.stdout.trim();
    if (r.status !== 0 || !tok) throw new MetaError(`gh has no saved login for ${o.ghUser} (run: gh auth login)`);
    ctx.remember(tok);
    env = { ...env, GH_TOKEN: tok }; // only for the child processes of this run; the global active account is untouched
  }
  const gh = async (args, input = "") => ctx.runGh(args, { input, env });
  const who = await gh(["api", "user", "--jq", ".login"]);
  if (who.status !== 0) throw new MetaError(`gh is not logged in or cannot reach GitHub: ${ctx.scrub(who.stderr).trim().slice(0, 200)}`);
  ctx.out(`  gh acts as: ${ctx.scrub(who.stdout).trim()}`);
  const v = await gh(["repo", "view", o.repo, "--json", "visibility"]);
  if (v.status !== 0) throw new MetaError(`this gh account cannot see ${o.repo} (try --gh-user with the account that owns it): ${ctx.scrub(v.stderr).trim().slice(0, 200)}`);
  let vis = "";
  try { vis = JSON.parse(v.stdout).visibility; } catch { /* handled below */ }
  if (vis !== "PRIVATE") throw new MetaError(`${o.repo} is not private (visibility: ${ctx.scrub(vis || "unknown")}). Tokens are only stored in a private repo.`);
  ctx.out("  repo is private: ok");
  return gh;
}

async function getUserToken(ctx, o) {
  ctx.step("Meta login (Facebook)");
  if (o.longToken) {
    ctx.out("Mode --long-token: no App ID and no App Secret are asked or used, no code or fb_exchange_token request is sent.");
    const userToken = ctx.remember(checkField(await ctx.ask("Long-lived user token from the Access Token Debugger (hidden): ", { hidden: true }), "the token", /^[A-Za-z0-9_-]{20,}$/));
    ctx.out("The pasted token is used as it is. Not shown, not saved.");
    return { appId: "", appSecret: "", userToken, longToken: true };
  }
  const appId = checkField(await ctx.ask("Meta App ID (hidden): ", { hidden: true }), "the App ID", /^\d{6,20}$/);
  const appSecret = ctx.remember(checkField(await ctx.ask("Meta App Secret (hidden): ", { hidden: true }), "the App Secret", /^[A-Za-z0-9]{16,64}$/));
  let short;
  if (o.paste) {
    short = ctx.remember(checkField(await ctx.ask("User access token from the Graph API Explorer (hidden): ", { hidden: true }), "the token", /^[A-Za-z0-9_-]{20,}$/));
  } else {
    const configId = (await ctx.ask("Facebook Login for Business configuration ID, only if the app needs one (Enter to skip): ")).trim();
    if (configId) checkField(configId, "the configuration ID", /^\d{6,30}$/);
    short = await oauthLogin(ctx, o, { appId, appSecret, configId });
  }
  const long = await exchangeLong(ctx, { appId, appSecret, shortToken: short });
  ctx.out(`Long-lived user token obtained${long.days ? ` (about ${long.days} days)` : ""}. Not shown, not saved.`);
  return { appId, appSecret, userToken: long.token };
}

async function userTokenCheck(ctx, c) {
  ctx.step("Token check (/debug_token)");
  let r;
  try {
    r = describeDebug("user token", await debugToken(ctx, { ...c, token: c.userToken }));
  } catch (e) {
    if (c.longToken) {
      c.skipDebug = true;
      ctx.warn(`  debug report skipped (no App Secret in this mode): ${e.message}`);
      ctx.warn("  Meta documents /debug_token only for an app token or an app developer's user token, so nothing was checked.");
      ctx.warn("  Make sure you pressed Extend Access Token: Page tokens made from a short-lived user token do not last.");
    } else ctx.warn(`  debug_token failed, continuing: ${e.message}`);
    return;
  }
  r.lines.forEach((l) => ctx.out(l));
  if (!r.valid) throw new MetaError("the user token is not valid");
  if (c.longToken && r.expiresAt && r.expiresAt - Date.now() / 1000 < 7 * 86400) {
    throw new MetaError(`this user token expires on ${day(r.expiresAt)}, so it is not long-lived. Press Extend Access Token in the Access Token Debugger and paste the extended token. Nothing was changed.`);
  }
  if (r.missing.length) ctx.warn(`  The login did not grant: ${r.missing.join(", ")}. Page tokens made from it may not publish. Run again and accept every permission.`);
}

function printTable(ctx, pages) {
  const cut = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}~` : s);
  const rows = pages.map((p, i) => [String(i + 1), cut(ctx.scrub(p.name), 36), ctx.scrub(p.id), p.ig?.username ? `@${cut(ctx.scrub(p.ig.username), 28)}` : "(none linked)", ctx.scrub(p.ig?.id || "-")]);
  const head = ["#", "Page name", "Page id", "Instagram", "Instagram user id"];
  const w = head.map((h, c) => Math.max(h.length, ...rows.map((r) => r[c].length)));
  const line = (r) => "  " + r.map((x, c) => x.padEnd(w[c])).join("  ").trimEnd();
  ctx.out(line(head));
  rows.forEach((r) => ctx.out(line(r)));
}

async function chooseMapping(ctx, pages) {
  ctx.step("Which Page is for which handle?");
  const usable = (p) => p.token && p.ig?.id;
  printTable(ctx, pages);
  if (!pages.some(usable)) throw new MetaError("no Page has both a Page token and a linked Instagram Business account. Link them (guide, Part B) and run again.");
  const mapping = {};
  const taken = new Set();
  for (const h of HANDLES) {
    for (;;) {
      const a = (await ctx.ask(`Page number for ${h} (Enter to skip): `, { def: String(HANDLES.indexOf(h) + 1) })).trim();
      if (!a) break;
      const n = Number(a);
      const p = Number.isInteger(n) ? pages[n - 1] : undefined;
      if (!p) { ctx.out(`  pick a number from the table`); continue; }
      if (!usable(p)) { ctx.out("  that Page has no linked Instagram account or no Page token"); continue; }
      if (taken.has(n)) { ctx.out("  that Page is already used for another handle"); continue; }
      taken.add(n);
      mapping[h] = p;
      break;
    }
  }
  if (!Object.keys(mapping).length) throw new UsageError("nothing chosen, nothing changed");
  return mapping;
}

async function setIn(ctx, gh, repo, kind, name, value) {
  const r = await gh([kind, "set", name, "--repo", repo, ...(kind === "secret" ? ["--app", "actions"] : [])], value); // value on stdin only
  if (r.status !== 0) throw new MetaError(`gh could not set ${kind} ${name}: ${ctx.scrub(r.stderr).trim().slice(0, 200)}`);
  ctx.expected.push([kind, name]);
  ctx.out(`  set ${kind} ${name}${kind === "secret" ? " (value not shown)" : ""}`);
}

// --ig-login: one Instagram-Login token per Instagram account (dashboard token, 60 days), resolved through the Instagram API.
async function collectInstagram(ctx, o) {
  ctx.step("Instagram-Login tokens (one per Instagram account)");
  const acc = {};
  if (o.dryRun) {
    ctx.out("  dry run: the hidden prompts are skipped, fake tokens and fake accounts");
    for (const h of HANDLES) {
      ctx.remember(FAKE_IG[h].token);
      acc[h] = { token: FAKE_IG[h].token, ...(await instagramMe(ctx, FAKE_IG[h].token)) };
    }
  } else {
    ctx.out("  For each handle generate the token in the app dashboard (Instagram > API setup with Instagram business login > Generate token),");
    ctx.out("  logged in as THAT Instagram account, and paste it at the hidden prompt. Enter skips a handle.");
    for (const h of HANDLES) {
      const t = ctx.remember((await ctx.ask(`Instagram-Login token for ${h} (hidden, Enter to skip): `, { hidden: true })).trim());
      if (!t) continue;
      checkField(t, `the Instagram-Login token for ${h}`, /^[A-Za-z0-9_.-]{20,}$/);
      try { acc[h] = { token: t, ...(await instagramMe(ctx, t)) }; } catch (e) { throw new MetaError(`Instagram check failed for ${h}: ${e.message}`); }
    }
  }
  const handles = Object.keys(acc);
  if (!handles.length) throw new UsageError("no Instagram-Login token given, nothing changed");
  const byId = new Map();
  for (const h of handles) {
    if (byId.has(acc[h].userId)) throw new UsageError(`${byId.get(acc[h].userId)} and ${h} gave the same Instagram account (@${ctx.scrub(acc[h].username)}). Each handle needs the token of its own account. Nothing was changed.`);
    byId.set(acc[h].userId, h);
  }
  const rows = handles.map((h) => [h, acc[h].username ? `@${ctx.scrub(acc[h].username)}` : "(no username)", ctx.scrub(acc[h].userId), ctx.scrub(acc[h].accountType) || "-", "not readable (dashboard tokens: 60 days)"]);
  const head = ["Handle", "Instagram", "Instagram user id", "Account type", "Token expiry"];
  const w = head.map((x, c) => Math.max(x.length, ...rows.map((r) => r[c].length)));
  const line = (r) => "  " + r.map((x, c) => x.padEnd(w[c])).join("  ").trimEnd();
  ctx.out(line(head));
  rows.forEach((r) => ctx.out(line(r)));
  ctx.out("  Check that every handle got the right account before you confirm.");
  return acc;
}

async function applyAndVerify(ctx, gh, o, c, mapping, ig) {
  ctx.step(c ? "Check the Page tokens and set everything in the repo" : "Set everything in the repo");
  const done = [];
  for (const h of HANDLES) {
    let p = mapping[h];
    const a = ig[h];
    if (!p && !a) continue;
    if (p && c.skipDebug) ctx.out(`  ${h}: Page token check skipped (debug report not available in this mode)`);
    else if (p) {
      try {
        const r = describeDebug(`${h} Page token`, await debugToken(ctx, { ...c, token: p.token }), { isPage: true });
        r.lines.forEach((l) => ctx.out(l));
        if (!r.valid) { ctx.warn(`  ${h}: the Page token is not valid, skipped`); p = null; }
        else if (r.missing.length) ctx.warn(`  ${h}: missing scopes ${r.missing.join(", ")} (stored anyway; publishing may fail)`);
      } catch (e) { ctx.warn(`  ${h}: debug_token failed, continuing: ${e.message}`); }
    }
    if (!p && !a) continue;
    if (p) await setIn(ctx, gh, o.repo, "secret", `META_PAGE_TOKEN_${h}`, p.token);
    if (a) await setIn(ctx, gh, o.repo, "secret", `META_IG_TOKEN_${h}`, a.token);
    await setIn(ctx, gh, o.repo, "variable", `META_IG_USER_ID_${h}`, a ? a.userId : p.ig.id);
    if (p) await setIn(ctx, gh, o.repo, "variable", `META_FB_PAGE_ID_${h}`, p.id);
    done.push(h);
  }
  ctx.step("Verify (names only)");
  const names = async (kind) => {
    const r = await gh([kind, "list", "--repo", o.repo, ...(kind === "secret" ? ["--app", "actions"] : []), "--json", "name"]);
    if (r.status !== 0) throw new MetaError(`gh could not list ${kind}s: ${ctx.scrub(r.stderr).trim().slice(0, 200)}`);
    try { return new Set(JSON.parse(r.stdout).map((x) => x.name)); } catch { throw new MetaError(`gh ${kind} list gave unreadable output`); }
  };
  const have = { secret: await names("secret"), variable: await names("variable") };
  let missing = 0;
  for (const [kind, name] of ctx.expected) {
    const ok = have[kind].has(name);
    if (!ok) missing++;
    ctx.out(`  ${kind.padEnd(8)} ${name.padEnd(30)} ${ok ? "present" : "MISSING"}`);
  }
  if (!done.length) throw new MetaError("nothing was set");
  if (missing) throw new MetaError(`${missing} name(s) are missing in ${o.repo}`);
  return done;
}

async function flow(ctx, o) {
  ctx.out(`Meta connect${o.dryRun ? " (DRY RUN: fake responses, no network, no gh calls)" : ""}`);
  const gh = await githubPreflight(ctx, o);
  const facebook = !o.igLogin || o.longToken; // --ig-login alone is Instagram only
  let c = null;
  let mapping = {};
  if (facebook) {
    if (o.dryRun) {
      c = dryCredentials(ctx, o);
      if (o.longToken) { ctx.step("Meta login (dry run, --long-token): skipped, fake long-lived user token"); ctx.out("  would ask for it at a hidden prompt; no App ID, no App Secret, no code or fb_exchange_token request"); }
      else { ctx.step("Meta login (dry run): skipped, fake app and fake tokens"); ctx.out("  would open: " + dialogUrl({ version: ctx.version, appId: c.appId, redirectUri: `http://localhost:${o.port}/callback`, state: "dry-run-state", configId: "" })); }
    } else c = await getUserToken(ctx, o);
    await userTokenCheck(ctx, c);
    const pages = await listPages(ctx, c.userToken);
    if (!pages.length) throw new MetaError("the login returned no Pages. Select the Pages in the login dialog (or in Business integrations) and run again.");
    mapping = await chooseMapping(ctx, pages);
  }
  const ig = o.igLogin ? await collectInstagram(ctx, o) : {};
  for (const h of HANDLES) {
    if (mapping[h] && ig[h] && mapping[h].ig.id !== ig[h].userId) {
      ctx.warn(`  ${h}: the Instagram account linked to the Page (@${ctx.scrub(mapping[h].ig.username || "?")}, ${ctx.scrub(mapping[h].ig.id)}) is not the account of the Instagram-Login token (@${ctx.scrub(ig[h].username)}, ${ctx.scrub(ig[h].userId)}). META_IG_USER_ID_${h} will be the token's account. Answer N below if that is wrong.`);
    }
  }
  ctx.out("\nWill set in " + o.repo + ":");
  for (const h of HANDLES) {
    if (!mapping[h] && !ig[h]) continue;
    const parts = [];
    if (mapping[h]) parts.push(`Page "${ctx.scrub(mapping[h].name)}" -> secret META_PAGE_TOKEN_${h}, variable META_FB_PAGE_ID_${h}`);
    if (ig[h]) parts.push(`Instagram @${ctx.scrub(ig[h].username)} -> secret META_IG_TOKEN_${h}`);
    ctx.out(`  ${h}: ${parts.join("; ")}; variable META_IG_USER_ID_${h}`);
  }
  if (!/^y/i.test((await ctx.ask("Set these now? [y/N]: ", { def: "y" })).trim())) throw new UsageError("not confirmed, nothing changed");
  const done = await applyAndVerify(ctx, gh, o, c, mapping, ig);
  ctx.out(`\nDone for ${done.join(", ")}${o.dryRun ? " (dry run, nothing was really set)" : ""}.`);
  ctx.out("No token or secret was saved anywhere. Close this terminal. Tell the assistant only that it is done.");
}

// ---------- dry run: fake Graph and fake gh ----------
const FAKE = { app: "100000000000000", secret: "0123456789abcdef0123456789abcdef", short: "EAADRYRUNSHORT0000000000000000", long: "EAADRYRUNLONG00000000000000000", gh: "ghp_DRYRUNFAKE0000000000000000000000" };
const FAKE_PAGES = [
  { id: "110000000000001", name: "Learnvora AI (demo)", ig: { id: "17841400000000001", username: "learnvora_ai_demo" } },
  { id: "110000000000002", name: "Learnvora DSA (demo)", ig: { id: "17841400000000002", username: "learnvora_dsa_demo" } },
  { id: "110000000000003", name: "Learnvora System Design (demo)", ig: { id: "17841400000000003", username: "learnvora_sd_demo" } },
  { id: "110000000000004", name: "Page without Instagram (demo)", ig: null },
].map((p, i) => ({ ...p, token: `EAADRYRUNPAGE${i + 1}0000000000000000` }));

const FAKE_IG = {
  AI: { token: "IGAADRYRUNAI00000000000000000000", userId: "17841400000000001", username: "learnvora_ai_demo" },
  DSA: { token: "IGAADRYRUNDSA0000000000000000000", userId: "17841400000000002", username: "learnvora_dsa_demo" },
  SYSTEMDESIGN: { token: "IGAADRYRUNSD000000000000000000000", userId: "17841400000000003", username: "learnvora_sd_demo" },
};

function dryCredentials(ctx, o) {
  ctx.remember(FAKE.secret); ctx.remember(FAKE.short); ctx.remember(FAKE.long);
  FAKE_PAGES.forEach((p) => ctx.remember(p.token));
  if (o.longToken) return { appId: "", appSecret: "", userToken: FAKE.long, longToken: true };
  return { appId: FAKE.app, appSecret: FAKE.secret, userToken: FAKE.long };
}

function fakeFetch() {
  const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
  return async (url) => {
    const u = new URL(String(url));
    const q = u.searchParams;
    const route = u.pathname.replace(/^\/v\d+\.\d+/, "");
    if (u.host === new URL(IG_BASE).host) { // Instagram API with Instagram Login (documented answer: { data: [ { user_id, username } ] })
      const who = Object.values(FAKE_IG).find((x) => x.token === q.get("access_token"));
      return route === "/me" && who ? json({ data: [{ user_id: who.userId, username: who.username, account_type: "Business" }] }) : json({ error: { message: "unknown fake Instagram request", code: 190 } }, 400);
    }
    if (route === "/oauth/access_token") return json({ access_token: q.get("fb_exchange_token") ? FAKE.long : FAKE.short, token_type: "bearer", expires_in: 5183944 });
    if (route === "/me/accounts") return json({ data: FAKE_PAGES.map((p) => ({ id: p.id, name: p.name, access_token: p.token, tasks: ["MANAGE", "CREATE_CONTENT"], ...(p.ig && { instagram_business_account: p.ig }) })) });
    if (route === "/debug_token") {
      const user = q.get("input_token") === FAKE.long;
      return json({ data: { app_id: FAKE.app, type: user ? "USER" : "PAGE", is_valid: true, expires_at: user ? Math.floor(Date.now() / 1000) + 60 * 86400 : 0, data_access_expires_at: Math.floor(Date.now() / 1000) + 90 * 86400, scopes: SCOPES } });
    }
    const page = FAKE_PAGES.find((p) => route === `/${p.id}`);
    return page ? json({ id: page.id, ...(page.ig && { instagram_business_account: page.ig }) }) : json({ error: { message: "unknown fake route", code: 100 } }, 404);
  };
}

function fakeGh() {
  const store = { secret: new Set(), variable: new Set() };
  return async (args) => {
    const ok = (stdout = "") => ({ status: 0, stdout, stderr: "" });
    const [a, b] = args;
    if (a === "auth" && b === "token") return ok(FAKE.gh + "\n");
    if (a === "api") return ok("dry-run-user\n");
    if (a === "repo" && b === "view") return ok(JSON.stringify({ visibility: "PRIVATE" }));
    if ((a === "secret" || a === "variable") && b === "set") { store[a].add(args[2]); return ok(); }
    if ((a === "secret" || a === "variable") && b === "list") return ok(JSON.stringify([...store[a]].map((name) => ({ name }))));
    return { status: 1, stdout: "", stderr: "dry run: unexpected gh call" };
  };
}

// ---------- entry ----------
export async function run(argv, deps = {}) {
  const stdout = deps.stdout ?? process.stdout;
  const stderr = deps.stderr ?? process.stderr;
  const stdin = deps.stdin ?? process.stdin;
  const { remember, scrub } = makeScrubber();
  let o;
  try { o = parseArgs(argv); } catch (e) { stderr.write(`${e.message}\n\n${USAGE}\n`); return 2; }
  if (o.help) { stdout.write(`${USAGE}\n`); return 0; }
  if ((deps.outputIsFile ?? (() => isFile(1) || isFile(2)))()) {
    // A file would keep what is printed (the login link, ids, error text). The refusal itself holds no secret.
    stderr.write("Refusing to run: stdout or stderr is redirected to a file. Run it in a normal terminal window.\n");
    return 2;
  }
  const dry = o.dryRun;
  let steps = 0;
  const ctx = {
    dry, remember, scrub,
    out: (s = "") => stdout.write(`${scrub(s)}\n`),
    warn: (s = "") => stderr.write(`${scrub(s)}\n`),
    step: (title) => stdout.write(`\nStep ${++steps}. ${scrub(title)}\n`),
    expected: [], // [kind, name] of everything set, verified by name at the end
    version: o.apiVersion,
    igVersion: o.igApiVersion,
    graphBase: dry ? GRAPH_BASE : (deps.graphBase ?? GRAPH_BASE),
    igBase: dry ? IG_BASE : (deps.igBase ?? IG_BASE),
    fetch: dry ? fakeFetch() : (deps.fetch ?? globalThis.fetch),
    runGh: dry ? fakeGh() : (deps.runGh ?? spawnGh(deps.ghCmd ?? ["gh"])),
    openBrowser: deps.openBrowser ?? openBrowser,
    env: deps.env ?? process.env,
    oauthTimeoutMs: deps.oauthTimeoutMs ?? 5 * 60 * 1000,
    ask: deps.ask ?? (dry && !stdin.isTTY ? async (_q, p = {}) => p.def ?? "" : ttyAsk(stdin, stdout)),
  };
  try {
    await flow(ctx, o);
    return 0;
  } catch (e) {
    if (e instanceof Abort) { stderr.write("\nCancelled. Nothing more was changed.\n"); return 130; }
    stderr.write(`\nStopped: ${scrub(e?.message || e)}\n`);
    return e instanceof UsageError ? 2 : 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.exitCode = await run(process.argv.slice(2));
}
