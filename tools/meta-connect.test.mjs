// Tests for tools/meta-connect.mjs. Everything is fake: a mock Graph API on 127.0.0.1, a stub gh (injected runner and a
// real fake executable), fake tokens. No real network, no real account. Run: node --test tools/meta-connect.test.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { EventEmitter } from "node:events";
import { closeSync, mkdirSync, mkdtempSync, openSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import http from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { describeDebug, makeScrubber, parseArgs, run, SCOPES, ttyAsk } from "./meta-connect.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, "meta-connect.mjs");
const TOOLS_BEFORE = readdirSync(HERE).sort();

// ---------- fake secrets (obviously fake; every one of them must stay out of argv, stdout, stderr and files) ----------
const APP_ID = "123456789012345";
const APP_SECRET = "a1b2c3d4e5f60718293a4b5c6d7e8f90";
const CODE = "AQDfakeAuthCode0123456789abcdefXYZ";
const SHORT = "EAATESTshortTOKEN0123456789abcdefgh";
const LONG = "EAATESTlongTOKEN0123456789abcdefghij";
const GH_TOKEN = "ghp_TESTfakeGhTokenValue0123456789ab";
const PAGE_TOKEN = { 1111: "EAATESTpageAI0123456789abcdefghijkl", 2222: "EAATESTpageDSA0123456789abcdefghijk", 3333: "EAATESTpageSD0123456789abcdefghijkl", 4444: "EAATESTpageOTHER0123456789abcdefghi" };
const PAGE_TOKENS = Object.values(PAGE_TOKEN);
// Instagram-Login tokens (one per Instagram account) and the accounts they resolve to
const IG_TOKEN = { AI: "IGAATESTtokenAI0123456789abcdefghijk", DSA: "IGAATESTtokenDSA0123456789abcdefghij", SYSTEMDESIGN: "IGAATESTtokenSD0123456789abcdefghijk" };
const IG_ACCOUNTS = {
  [IG_TOKEN.AI]: { user_id: "17841400001", username: "learnvora_ai", account_type: "Business" },
  [IG_TOKEN.DSA]: { user_id: "17841400002", username: "learnvora_dsa", account_type: "Business" },
  [IG_TOKEN.SYSTEMDESIGN]: { user_id: "17841400003", username: "learnvora_sd", account_type: "Media_Creator" },
};
const ALL_SECRETS = [APP_SECRET, CODE, SHORT, LONG, GH_TOKEN, `${APP_ID}|${APP_SECRET}`, ...PAGE_TOKENS, ...Object.values(IG_TOKEN)];

function assertNoSecrets(text, label) {
  for (const s of ALL_SECRETS) assert.ok(!text.includes(s), `${label} contains a secret`);
  assert.ok(!/EAA[A-Za-z0-9]{8}/.test(text), `${label} contains a token-shaped string`);
  assert.ok(!/IG[A-Z]{2}[A-Za-z0-9]{8}/.test(text), `${label} contains an Instagram-token-shaped string`);
  assert.ok(!/ghp_[A-Za-z0-9]{8}/.test(text), `${label} contains a GitHub-token-shaped string`);
}

// ---------- mock Graph API ----------
const PAGES = [
  { id: "1111", name: "Learnvora AI", ig: { id: "17841400001", username: "learnvora_ai" } },
  { id: "2222", name: "Learnvora DSA", ig: { id: "17841400002", username: "learnvora_dsa" }, hideIgInList: true },
  { id: "3333", name: "Learnvora System Design", ig: { id: "17841400003", username: "learnvora_sd" } },
  { id: "4444", name: "Some other Page", ig: null },
];

function startGraph(o = {}) {
  const requests = [];
  const pages = o.pages ?? PAGES;
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    const q = Object.fromEntries(u.searchParams);
    requests.push({ path: u.pathname, q, headers: req.headers });
    const send = (status, body) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
    const fail = (message, code = 190) => send(400, { error: { message, type: "OAuthException", code, error_subcode: 460, fbtrace_id: "t" } });
    const leak = `client_secret=${APP_SECRET}&code=${CODE}&access_token=${LONG} ${SHORT} ${PAGE_TOKEN[1111]} ${APP_ID}|${APP_SECRET}`;
    if (u.pathname.startsWith("/v25.0/")) { // the Instagram host (graph.instagram.com): documented GET /me?fields=user_id,username
      const bad = (message) => send(400, { error: { message, type: "IGApiException", code: 190, fbtrace_id: "t" } });
      if (u.pathname !== "/v25.0/me" || q.fields !== "user_id,username,account_type") return bad("unexpected Instagram request");
      const acct = (o.igAccounts ?? IG_ACCOUNTS)[q.access_token];
      if (!acct) return bad(`Invalid OAuth access token ${q.access_token}; ${leak}`);
      return send(200, o.flatMe ? acct : { data: [acct] });
    }
    if (!u.pathname.startsWith("/v26.0/")) return fail("unknown version", 2500);
    const route = u.pathname.slice("/v26.0".length);
    if (route === "/oauth/access_token") {
      if (q.grant_type === "fb_exchange_token") {
        if (o.leakOn === "long") return fail(`bad exchange: ${leak}`);
        if (q.client_id !== APP_ID || q.client_secret !== APP_SECRET || q.fb_exchange_token !== (o.shortToken ?? SHORT)) return fail("bad long-lived exchange request");
        return send(200, { access_token: LONG, token_type: "bearer", expires_in: 5183944 });
      }
      if (o.leakOn === "code") return fail(`bad code: ${leak}`);
      if (q.client_id !== APP_ID || q.client_secret !== APP_SECRET || q.code !== CODE || !/^http:\/\/localhost:\d+\/callback$/.test(q.redirect_uri || "")) return fail("bad code exchange request");
      return send(200, { access_token: SHORT, token_type: "bearer", expires_in: 3600 });
    }
    if (route === "/me/accounts") {
      if (o.leakOn === "accounts") return fail(`bad accounts: ${leak}`);
      if (q.access_token !== LONG) return fail("accounts needs the long-lived user token");
      const start = Number(q.after || 0);
      const slice = pages.slice(start, start + 2);
      const body = {
        data: slice.map((p) => ({ id: p.id, name: p.name, access_token: PAGE_TOKEN[p.id], tasks: ["MANAGE", "CREATE_CONTENT"], ...(p.ig && !p.hideIgInList && { instagram_business_account: p.ig }) })),
      };
      if (start + 2 < pages.length) body.paging = { cursors: { before: "0", after: String(start + 2) }, next: `http://example.invalid/me/accounts?access_token=${LONG}&after=${start + 2}` };
      return send(200, body);
    }
    if (route === "/debug_token") {
      // Meta: "an app access token or an app developer's user access token". The mock plays an app Admin's own token.
      const appToken = q.access_token === `${APP_ID}|${APP_SECRET}`;
      const ownToken = q.access_token === LONG && !o.refuseUserDebug;
      if (!appToken && !ownToken) return fail(`(#100) debug_token needs an app token or a developer's user token: ${leak}`, 100);
      const now = Math.floor(Date.now() / 1000);
      if (q.input_token === LONG) return send(200, { data: { app_id: APP_ID, type: "USER", is_valid: true, expires_at: now + (o.userExpiresIn ?? 5184000), data_access_expires_at: now + 7776000, scopes: o.userScopes ?? SCOPES } });
      const page = Object.entries(PAGE_TOKEN).find(([, t]) => t === q.input_token);
      if (!page) return send(200, { data: { is_valid: false, error: { code: 190, subcode: 460, message: "invalid" } } });
      const bad = q.input_token === o.invalidPageToken;
      return send(200, { data: { app_id: APP_ID, type: "PAGE", is_valid: !bad, expires_at: o.pageExpiresAt ?? 0, scopes: SCOPES, ...(bad && { error: { code: 190, subcode: 460, message: "Session invalidated" } }) } });
    }
    const page = pages.find((p) => route === `/${p.id}`);
    if (page && q.access_token === LONG) return send(200, { id: page.id, ...(page.ig && { instagram_business_account: page.ig }) });
    return fail("unknown route", 100);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({
    base: `http://127.0.0.1:${server.address().port}`,
    requests,
    close: () => new Promise((r) => { server.close(r); server.closeAllConnections(); }),
  })));
}

// ---------- stub gh (injectable runner): records argv and stdin ----------
function stubGh(o = {}) {
  const calls = [];
  const store = { secret: new Set(), variable: new Set() };
  const runGh = async (args, { input = "", env = {} } = {}) => {
    calls.push({ args: [...args], input, ghToken: env.GH_TOKEN });
    const ok = (stdout = "") => ({ status: 0, stdout, stderr: "" });
    const [a, b] = args;
    if (a === "auth" && b === "token") return o.noSavedLogin ? { status: 1, stdout: "", stderr: "no account" } : ok(`${GH_TOKEN}\n`);
    if (a === "api") return ok("shivamm-fl\n");
    if (a === "repo" && b === "view") return ok(JSON.stringify({ visibility: o.visibility ?? "PRIVATE" }));
    if ((a === "secret" || a === "variable") && b === "set") {
      if (o.failSetWith) return { status: 1, stdout: "", stderr: `HTTP 403 while sending ${input} and ${o.failSetWith}` };
      store[a].add(args[2]);
      return ok();
    }
    if ((a === "secret" || a === "variable") && b === "list") return ok(JSON.stringify([...store[a]].filter((n) => !(o.dropFromList || []).includes(n)).map((name) => ({ name }))));
    return { status: 1, stdout: "", stderr: "stub: unexpected call" };
  };
  return { runGh, calls, store };
}

// ---------- the owner's browser (mock): opens the login link by calling the local callback ----------
function makeBrowser(queryFor = (state) => [`code=${CODE}&state=${state}`]) {
  const opened = [];
  const statuses = [];
  const openBrowser = (url) => {
    opened.push(url);
    const u = new URL(url);
    const redirect = u.searchParams.get("redirect_uri");
    const state = u.searchParams.get("state");
    (async () => {
      for (const q of queryFor(state)) statuses.push((await fetch(`${redirect}?${q}`)).status);
    })().catch((e) => statuses.push(String(e.message)));
  };
  return { openBrowser, opened, statuses };
}

function asker(o = {}) {
  const asked = [];
  const map = o.map ?? { AI: "1", DSA: "2", SYSTEMDESIGN: "3" };
  const ask = async (q, { hidden = false } = {}) => {
    asked.push({ q, hidden });
    const ig = q.match(/Instagram-Login token for (\w+)/);
    if (ig) { assert.ok(hidden, "Instagram-Login tokens are asked hidden"); return (o.ig ?? IG_TOKEN)[ig[1]] ?? ""; }
    if (/App ID/.test(q)) return APP_ID;
    if (/App Secret/.test(q)) return APP_SECRET;
    if (/User access token/.test(q)) return o.pasted ?? SHORT;
    if (/Long-lived user token/.test(q)) return o.longPasted ?? LONG;
    if (/configuration ID/.test(q)) return o.configId ?? "";
    const m = q.match(/Page number for (\w+)/);
    if (m) return map[m[1]] ?? "";
    if (/Set these now/.test(q)) return o.confirm ?? "y";
    throw new Error("unexpected prompt");
  };
  return { ask, asked };
}

const sink = () => ({ chunks: [], write(s) { this.chunks.push(String(s)); return true; }, get text() { return this.chunks.join(""); } });
const freePort = () => new Promise((res) => { const s = http.createServer().listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => res(p)); }); });

// One full run against the mock Graph API with the stub gh.
async function scenario({ graph: go, gh: gho, ask: aso, queries, timeout, extraArgs = [], deps = {}, noPort = false } = {}) {
  const graph = await startGraph(go);
  const gh = stubGh(gho);
  const browser = makeBrowser(queries);
  const ap = asker(aso);
  const stdout = sink();
  const stderr = sink();
  const port = await freePort();
  try {
    const code = await run([...(noPort ? [] : ["--port", String(port)]), ...extraArgs], {
      stdout, stderr, stdin: { isTTY: false }, outputIsFile: () => false, graphBase: graph.base, igBase: graph.base,
      runGh: gh.runGh, openBrowser: browser.openBrowser, ask: ap.ask, oauthTimeoutMs: timeout ?? 5000, ...deps,
    });
    return { code, out: stdout.text, err: stderr.text, port, graph: graph.requests, gh: gh.calls, store: gh.store, browser, asked: ap.asked };
  } finally { await graph.close(); }
}

const secretSets = (calls) => calls.filter((c) => c.args[0] === "secret" && c.args[1] === "set");
const varSets = (calls) => calls.filter((c) => c.args[0] === "variable" && c.args[1] === "set");

// ---------- the full OAuth flow ----------
test("OAuth flow: three Pages mapped, secrets only through stdin, nothing leaks", async () => {
  const r = await scenario({ extraArgs: ["--gh-user", "shivamm-fl"] });
  assert.equal(r.code, 0, r.err);
  // hidden prompts for the id and the secret
  assert.ok(r.asked.find((a) => /App ID/.test(a.q)).hidden);
  assert.ok(r.asked.find((a) => /App Secret/.test(a.q)).hidden);
  // the login link: documented dialog, state, scopes, redirect URI
  const url = new URL(r.browser.opened[0]);
  assert.equal(`${url.origin}${url.pathname}`, "https://www.facebook.com/v26.0/dialog/oauth");
  assert.equal(url.searchParams.get("client_id"), APP_ID);
  assert.equal(url.searchParams.get("redirect_uri"), `http://localhost:${r.port}/callback`);
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("scope"), SCOPES.join(","));
  assert.match(url.searchParams.get("state"), /^[0-9a-f]{32}$/);
  assert.deepEqual(r.browser.statuses, [200]);
  // Graph calls as documented: code -> short -> long -> accounts (paged) -> per-Page Instagram lookup -> debug_token
  const ex = r.graph.filter((x) => x.path === "/v26.0/oauth/access_token");
  assert.equal(ex.length, 2);
  assert.equal(ex[0].q.code, CODE);
  assert.equal(ex[1].q.grant_type, "fb_exchange_token");
  assert.equal(ex[1].q.fb_exchange_token, SHORT);
  const acc = r.graph.filter((x) => x.path === "/v26.0/me/accounts");
  assert.equal(acc.length, 2);
  assert.equal(acc[1].q.after, "2");
  assert.match(acc[0].q.fields, /instagram_business_account\{id,username\}/);
  assert.ok(r.graph.some((x) => x.path === "/v26.0/2222" && /instagram_business_account/.test(x.q.fields)));
  assert.ok(r.graph.every((x) => !x.headers.authorization));
  assert.ok(r.graph.every((x) => !/example\.invalid/.test(x.path)), "paging.next must never be followed");
  // the table: non-secret info only
  assert.match(r.out, /Learnvora AI\s+1111\s+@learnvora_ai\s+17841400001/);
  assert.match(r.out, /Some other Page\s+4444\s+\(none linked\)/);
  // gh: three secrets with the token on STDIN, six variables
  const ss = secretSets(r.gh);
  assert.deepEqual(ss.map((c) => c.args[2]), ["META_PAGE_TOKEN_AI", "META_PAGE_TOKEN_DSA", "META_PAGE_TOKEN_SYSTEMDESIGN"]);
  assert.deepEqual(ss.map((c) => c.input), [PAGE_TOKEN[1111], PAGE_TOKEN[2222], PAGE_TOKEN[3333]]);
  for (const c of ss) assert.deepEqual(c.args.slice(3), ["--repo", "shivamm-fl/ai-course", "--app", "actions"]);
  const vs = Object.fromEntries(varSets(r.gh).map((c) => [c.args[2], c.input]));
  assert.deepEqual(vs, {
    META_IG_USER_ID_AI: "17841400001", META_FB_PAGE_ID_AI: "1111",
    META_IG_USER_ID_DSA: "17841400002", META_FB_PAGE_ID_DSA: "2222",
    META_IG_USER_ID_SYSTEMDESIGN: "17841400003", META_FB_PAGE_ID_SYSTEMDESIGN: "3333",
  });
  // no secret in any argv; tokens only ever in the stdin of `gh secret set`
  const argv = JSON.stringify(r.gh.map((c) => c.args));
  assertNoSecrets(argv, "gh argv");
  for (const c of r.gh) {
    if (c.args[0] === "secret" && c.args[1] === "set") continue;
    assertNoSecrets(c.input, "gh stdin of a non-secret call");
  }
  // --gh-user: the token is read once, then only passed as GH_TOKEN to the children; the active account is never switched
  assert.deepEqual(r.gh[0].args, ["auth", "token", "--user", "shivamm-fl"]);
  assert.ok(r.gh.slice(1).every((c) => c.ghToken === GH_TOKEN));
  assert.ok(r.gh.every((c) => !(c.args[0] === "auth" && ["switch", "login", "refresh", "setup-git", "logout"].includes(c.args[1]))));
  // nothing secret printed
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
  // verification lists names only
  for (const n of ["META_PAGE_TOKEN_AI", "META_PAGE_TOKEN_DSA", "META_PAGE_TOKEN_SYSTEMDESIGN", "META_IG_USER_ID_AI", "META_FB_PAGE_ID_SYSTEMDESIGN"]) assert.match(r.out, new RegExp(`${n}\\s+present`));
  assert.ok(r.gh.some((c) => c.args[0] === "secret" && c.args[1] === "list" && c.args.includes("--json") && c.args.includes("name")));
  // debug_token report
  assert.match(r.out, /user token: type USER, valid true/);
  assert.match(r.out, /AI Page token: type PAGE, valid true/);
  assert.match(r.out, /expiry: never \(expires_at 0\), as expected for a Page token/);
  assert.match(r.out, /missing: none/);
});

test("the callback checks state: a wrong state is refused and never reaches the token exchange", async () => {
  const r = await scenario({ queries: (s) => [`code=${CODE}&state=wrong`, `code=${CODE}&state=${s}`] });
  assert.equal(r.code, 0, r.err);
  assert.deepEqual(r.browser.statuses, [400, 200]);
  assert.equal(r.graph.filter((x) => x.path === "/v26.0/oauth/access_token").length, 2);
});

test("only a wrong state: times out, no code exchange is ever sent", async () => {
  const r = await scenario({ queries: () => ["code=" + CODE + "&state=wrong"], timeout: 400 });
  assert.equal(r.code, 1);
  assert.match(r.err, /timed out/);
  assert.equal(r.graph.length, 0);
  assert.equal(secretSets(r.gh).length, 0);
  assertNoSecrets(r.out + r.err, "output");
});

test("a login the owner cancels is reported, nothing is set", async () => {
  const r = await scenario({ queries: (s) => [`error=access_denied&error_reason=user_denied&state=${s}`] });
  assert.equal(r.code, 1);
  assert.match(r.err, /not completed \(user_denied\)/);
  assert.equal(secretSets(r.gh).length, 0);
});

test("the callback server only answers localhost host names", async () => {
  const port = await freePort();
  const stdout = sink();
  const stderr = sink();
  const graph = await startGraph();
  const gh = stubGh();
  const p = run(["--port", String(port), "--no-open"], { stdout, stderr, stdin: { isTTY: false }, outputIsFile: () => false, graphBase: graph.base, runGh: gh.runGh, ask: asker().ask, oauthTimeoutMs: 1500 });
  for (let i = 0; i < 50 && !/Waiting for the login/.test(stdout.text); i++) await new Promise((r) => setTimeout(r, 40));
  const status = await new Promise((resolve) => {
    const req = http.request({ host: "127.0.0.1", port, path: "/callback?code=x&state=y", headers: { Host: "evil.example" } }, (res) => { res.resume(); resolve(res.statusCode); });
    req.end();
  });
  assert.equal(status, 400);
  assert.equal(await p, 1); // --no-open and nobody completes the login: times out
  assert.match(stdout.text, /Open this link in your own browser/);
  await graph.close();
});

test("--paste: no server, no browser, the pasted token is exchanged for a long-lived one", async () => {
  const pasted = "EAATESTpastedExplorerToken0123456789ab";
  const r = await scenario({ extraArgs: ["--paste"], ask: { pasted }, graph: { shortToken: pasted }, deps: { openBrowser: () => assert.fail("must not open a browser in --paste mode") } });
  assert.equal(r.code, 0, r.err);
  const pasteAsk = r.asked.find((a) => /User access token/.test(a.q));
  assert.ok(pasteAsk.hidden);
  assert.ok(!r.asked.some((a) => /configuration ID/.test(a.q)));
  const ex = r.graph.filter((x) => x.path === "/v26.0/oauth/access_token");
  assert.equal(ex.length, 1);
  assert.equal(ex[0].q.fb_exchange_token, pasted);
  assert.equal(secretSets(r.gh).length, 3);
  assert.ok(!(r.out + r.err + JSON.stringify(r.gh.map((c) => c.args))).includes(pasted));
});

test("Facebook Login for Business: an optional configuration id goes into the login link", async () => {
  const r = await scenario({ ask: { configId: "9876543210" } });
  assert.equal(r.code, 0, r.err);
  const url = new URL(r.browser.opened[0]);
  assert.equal(url.searchParams.get("config_id"), "9876543210");
  assert.equal(url.searchParams.get("scope"), null);
});

// ---------- --long-token: no App ID, no App Secret ----------
const noBrowser = () => assert.fail("--long-token must not open a browser or start a login");

test("--long-token: no App ID or Secret asked, no code or exchange request, Page tokens still go only to gh stdin", async () => {
  const r = await scenario({ extraArgs: ["--long-token", "--gh-user", "shivamm-fl"], deps: { openBrowser: noBrowser } });
  assert.equal(r.code, 0, r.err);
  // prompts: only the hidden long-lived token (and the non-secret choices); never the id, the secret, or a config id
  const tokenAsk = r.asked.find((a) => /Long-lived user token/.test(a.q));
  assert.ok(tokenAsk.hidden);
  assert.ok(!r.asked.some((a) => /App ID|App Secret|configuration ID|User access token/.test(a.q)));
  // Graph: no oauth/access_token at all, no client_id / client_secret / code anywhere, the app secret never in play
  assert.equal(r.graph.filter((x) => x.path === "/v26.0/oauth/access_token").length, 0);
  for (const x of r.graph) for (const k of ["client_id", "client_secret", "code", "fb_exchange_token", "redirect_uri"]) assert.equal(x.q[k], undefined, `${x.path} sent ${k}`);
  assert.ok(!JSON.stringify(r.graph).includes(APP_SECRET));
  // everything else unchanged: accounts (paged), per-Page Instagram lookup, debug_token with the user's own token
  const acc = r.graph.filter((x) => x.path === "/v26.0/me/accounts");
  assert.equal(acc.length, 2);
  assert.ok(acc.every((x) => x.q.access_token === LONG));
  assert.ok(r.graph.some((x) => x.path === "/v26.0/2222" && /instagram_business_account/.test(x.q.fields)));
  const dbg = r.graph.filter((x) => x.path === "/v26.0/debug_token");
  assert.equal(dbg.length, 4, "the user token and three Page tokens");
  assert.ok(dbg.every((x) => x.q.access_token === LONG), "the owner's own token is the caller");
  assert.match(r.out, /Learnvora AI\s+1111\s+@learnvora_ai\s+17841400001/);
  assert.match(r.out, /user token: type USER, valid true/);
  assert.match(r.out, /AI Page token: type PAGE, valid true/);
  // gh
  assert.deepEqual(secretSets(r.gh).map((c) => c.args[2]), ["META_PAGE_TOKEN_AI", "META_PAGE_TOKEN_DSA", "META_PAGE_TOKEN_SYSTEMDESIGN"]);
  assert.deepEqual(secretSets(r.gh).map((c) => c.input), [PAGE_TOKEN[1111], PAGE_TOKEN[2222], PAGE_TOKEN[3333]]);
  assert.equal(varSets(r.gh).length, 6);
  assertNoSecrets(JSON.stringify(r.gh.map((c) => c.args)), "gh argv");
  for (const c of r.gh) if (!(c.args[0] === "secret" && c.args[1] === "set")) assertNoSecrets(c.input, "gh stdin of a non-secret call");
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
  assert.match(r.out, /META_PAGE_TOKEN_SYSTEMDESIGN\s+present/);
});

test("--long-token: when Meta refuses /debug_token for the user's own token the report is skipped, never a failure", async () => {
  const r = await scenario({ extraArgs: ["--long-token"], graph: { refuseUserDebug: true }, deps: { openBrowser: noBrowser } });
  assert.equal(r.code, 0, r.err);
  assert.match(r.err, /debug report skipped \(no App Secret in this mode\)/);
  assert.match(r.err, /Extend Access Token/);
  assert.match(r.out, /AI: Page token check skipped/);
  assert.equal(r.graph.filter((x) => x.path === "/v26.0/debug_token").length, 1, "asked once, then not again for the Page tokens");
  assert.equal(secretSets(r.gh).length, 3);
  assert.match(r.err, /\[hidden\]/, "the error text Meta sent back echoed tokens and was masked");
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
});

test("--long-token: a short-lived token (the owner forgot Extend Access Token) is stopped before anything is set", async () => {
  const r = await scenario({ extraArgs: ["--long-token"], graph: { userExpiresIn: 3600 }, deps: { openBrowser: noBrowser } });
  assert.equal(r.code, 1);
  assert.match(r.err, /not long-lived\. Press Extend Access Token/);
  assert.equal(secretSets(r.gh).length + varSets(r.gh).length, 0);
  assertNoSecrets(r.out + r.err, "output");
});

test("--long-token: missing permissions are reported from the debug report", async () => {
  const r = await scenario({ extraArgs: ["--long-token"], graph: { userScopes: ["pages_show_list"] }, deps: { openBrowser: noBrowser } });
  assert.equal(r.code, 0, r.err);
  assert.match(r.err, /did not grant: instagram_basic, instagram_content_publish, pages_read_engagement, pages_manage_posts/);
});

test("--long-token: a Graph error that echoes tokens is masked, and a badly shaped paste is refused unseen", async () => {
  const r = await scenario({ extraArgs: ["--long-token"], graph: { leakOn: "accounts" }, deps: { openBrowser: noBrowser } });
  assert.equal(r.code, 1);
  assert.match(r.err, /\[hidden\]/);
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
  const bad = `${LONG} extra words`;
  const r2 = await scenario({ extraArgs: ["--long-token"], ask: { longPasted: bad }, deps: { openBrowser: noBrowser } });
  assert.equal(r2.code, 2);
  assert.match(r2.err, /the token does not look right \(not shown\)/);
  assert.equal(r2.graph.length, 0);
  assert.ok(!(r2.out + r2.err).includes(LONG));
});

// ---------- --ig-login: one Instagram-Login token per Instagram account ----------
const igRequests = (r) => r.graph.filter((x) => x.path.startsWith("/v25.0/"));
const fbRequests = (r) => r.graph.filter((x) => x.path.startsWith("/v26.0/"));

test("--ig-login alone: three hidden prompts, accounts resolved on the Instagram host, secrets only through stdin", async () => {
  const r = await scenario({ extraArgs: ["--ig-login", "--gh-user", "shivamm-fl"], deps: { openBrowser: noBrowser } });
  assert.equal(r.code, 0, r.err);
  const igAsks = r.asked.filter((a) => /Instagram-Login token for/.test(a.q));
  assert.deepEqual(igAsks.map((a) => a.q.match(/for (\w+)/)[1]), ["AI", "DSA", "SYSTEMDESIGN"]);
  assert.ok(igAsks.every((a) => a.hidden));
  assert.ok(!r.asked.some((a) => /App ID|App Secret|configuration ID|User access token|Long-lived/.test(a.q)), "Instagram only: no Facebook prompts");
  // the Instagram host only: documented GET /me?fields=user_id,username (+account_type) with the Instagram token
  assert.equal(fbRequests(r).length, 0, "no Facebook Graph call at all");
  const me = igRequests(r);
  assert.deepEqual(me.map((x) => x.q.access_token), [IG_TOKEN.AI, IG_TOKEN.DSA, IG_TOKEN.SYSTEMDESIGN]);
  assert.ok(me.every((x) => x.path === "/v25.0/me" && x.q.fields === "user_id,username,account_type" && !x.headers.authorization));
  // table: non-secret only
  assert.match(r.out, /AI\s+@learnvora_ai\s+17841400001\s+Business/);
  assert.match(r.out, /SYSTEMDESIGN\s+@learnvora_sd\s+17841400003\s+Media_Creator\s+not readable/);
  // gh: META_IG_TOKEN_<X> on stdin, META_IG_USER_ID_<X> from user_id
  const ss = secretSets(r.gh);
  assert.deepEqual(ss.map((c) => c.args[2]), ["META_IG_TOKEN_AI", "META_IG_TOKEN_DSA", "META_IG_TOKEN_SYSTEMDESIGN"]);
  assert.deepEqual(ss.map((c) => c.input), [IG_TOKEN.AI, IG_TOKEN.DSA, IG_TOKEN.SYSTEMDESIGN]);
  for (const c of ss) assert.deepEqual(c.args.slice(3), ["--repo", "shivamm-fl/ai-course", "--app", "actions"]);
  assert.deepEqual(Object.fromEntries(varSets(r.gh).map((c) => [c.args[2], c.input])), {
    META_IG_USER_ID_AI: "17841400001", META_IG_USER_ID_DSA: "17841400002", META_IG_USER_ID_SYSTEMDESIGN: "17841400003",
  });
  assertNoSecrets(JSON.stringify(r.gh.map((c) => c.args)), "gh argv");
  for (const c of r.gh) if (!(c.args[0] === "secret" && c.args[1] === "set")) assertNoSecrets(c.input, "gh stdin of a non-secret call");
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
  for (const n of ["META_IG_TOKEN_AI", "META_IG_TOKEN_DSA", "META_IG_TOKEN_SYSTEMDESIGN", "META_IG_USER_ID_DSA"]) assert.match(r.out, new RegExp(`${n}\\s+present`));
  assert.ok(!r.gh.some((c) => /META_PAGE_TOKEN|META_FB_PAGE_ID/.test(c.args.join(" "))), "no Page secrets in Instagram-only mode");
});

test("--ig-login with --long-token: both token kinds, each only to its own host, one META_IG_USER_ID per handle", async () => {
  const r = await scenario({ extraArgs: ["--ig-login", "--long-token", "--gh-user", "shivamm-fl"], deps: { openBrowser: noBrowser } });
  assert.equal(r.code, 0, r.err);
  // the Facebook tokens never reach the Instagram host and the Instagram tokens never reach the Facebook host
  const igText = JSON.stringify(igRequests(r).map((x) => x.q));
  const fbText = JSON.stringify(fbRequests(r).map((x) => ({ path: x.path, q: x.q })));
  for (const t of [LONG, SHORT, ...PAGE_TOKENS]) assert.ok(!igText.includes(t), "a Facebook token was sent to the Instagram host");
  for (const t of Object.values(IG_TOKEN)) assert.ok(!fbText.includes(t), "an Instagram token was sent to the Facebook host");
  assert.equal(igRequests(r).length, 3);
  assert.equal(fbRequests(r).filter((x) => x.path === "/v26.0/oauth/access_token").length, 0);
  // gh: both secrets per handle, the Instagram id variable once, the Page id variable once
  const ss = secretSets(r.gh);
  assert.deepEqual(ss.map((c) => c.args[2]), ["META_PAGE_TOKEN_AI", "META_IG_TOKEN_AI", "META_PAGE_TOKEN_DSA", "META_IG_TOKEN_DSA", "META_PAGE_TOKEN_SYSTEMDESIGN", "META_IG_TOKEN_SYSTEMDESIGN"]);
  assert.deepEqual(ss.map((c) => c.input), [PAGE_TOKEN[1111], IG_TOKEN.AI, PAGE_TOKEN[2222], IG_TOKEN.DSA, PAGE_TOKEN[3333], IG_TOKEN.SYSTEMDESIGN]);
  const vsCalls = varSets(r.gh).map((c) => c.args[2]);
  assert.equal(new Set(vsCalls).size, vsCalls.length, "no variable is set twice");
  assert.deepEqual(Object.fromEntries(varSets(r.gh).map((c) => [c.args[2], c.input])), {
    META_IG_USER_ID_AI: "17841400001", META_FB_PAGE_ID_AI: "1111", META_IG_USER_ID_DSA: "17841400002", META_FB_PAGE_ID_DSA: "2222",
    META_IG_USER_ID_SYSTEMDESIGN: "17841400003", META_FB_PAGE_ID_SYSTEMDESIGN: "3333",
  });
  assert.equal(r.err, "", "the Page's Instagram account equals the token's account: no warning");
  assertNoSecrets(JSON.stringify(r.gh.map((c) => c.args)), "gh argv");
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
  assert.match(r.out, /META_IG_TOKEN_SYSTEMDESIGN\s+present/);
  assert.match(r.out, /META_PAGE_TOKEN_SYSTEMDESIGN\s+present/);
});

test("--ig-login: Enter skips a handle", async () => {
  const r = await scenario({ extraArgs: ["--ig-login"], ask: { ig: { AI: IG_TOKEN.AI, DSA: "", SYSTEMDESIGN: IG_TOKEN.SYSTEMDESIGN } } });
  assert.equal(r.code, 0, r.err);
  assert.deepEqual(secretSets(r.gh).map((c) => c.args[2]), ["META_IG_TOKEN_AI", "META_IG_TOKEN_SYSTEMDESIGN"]);
  assert.equal(igRequests(r).length, 2);
  const none = await scenario({ extraArgs: ["--ig-login"], ask: { ig: { AI: "", DSA: "", SYSTEMDESIGN: "" } } });
  assert.equal(none.code, 2);
  assert.match(none.err, /no Instagram-Login token given/);
  assert.equal(secretSets(none.gh).length, 0);
});

test("--ig-login: the same Instagram account for two handles is refused", async () => {
  const r = await scenario({ extraArgs: ["--ig-login"], ask: { ig: { AI: IG_TOKEN.AI, DSA: IG_TOKEN.AI, SYSTEMDESIGN: "" } } });
  assert.equal(r.code, 2);
  assert.match(r.err, /AI and DSA gave the same Instagram account \(@learnvora_ai\)/);
  assert.equal(secretSets(r.gh).length + varSets(r.gh).length, 0);
  assertNoSecrets(r.out + r.err, "output");
});

test("--ig-login with --long-token: a Page whose Instagram account differs from the token's account raises a warning", async () => {
  const other = { ...IG_ACCOUNTS, [IG_TOKEN.AI]: { user_id: "17841499999", username: "someone_else", account_type: "Business" } };
  const r = await scenario({ extraArgs: ["--ig-login", "--long-token"], graph: { igAccounts: other } });
  assert.equal(r.code, 0, r.err);
  assert.match(r.err, /AI: the Instagram account linked to the Page \(@learnvora_ai, 17841400001\) is not the account of the Instagram-Login token \(@someone_else, 17841499999\)/);
  assert.equal(Object.fromEntries(varSets(r.gh).map((c) => [c.args[2], c.input])).META_IG_USER_ID_AI, "17841499999");
});

test("--ig-login: an Instagram API error that echoes tokens is masked and nothing is set", async () => {
  const r = await scenario({ extraArgs: ["--ig-login"], ask: { ig: { AI: "IGAATESTunknownToken0123456789abcdef", DSA: "", SYSTEMDESIGN: "" } } });
  assert.equal(r.code, 1);
  assert.match(r.err, /Instagram check failed for AI: Graph API error \(HTTP 400, code 190, IGApiException\)/);
  assert.match(r.err, /\[hidden\]/);
  assert.ok(!(r.out + r.err).includes("IGAATESTunknownToken"));
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
  assert.equal(secretSets(r.gh).length + varSets(r.gh).length, 0);
});

test("--ig-login: the flat /me answer is accepted too; a badly shaped paste is refused unseen", async () => {
  const r = await scenario({ extraArgs: ["--ig-login"], graph: { flatMe: true } });
  assert.equal(r.code, 0, r.err);
  assert.equal(secretSets(r.gh).length, 3);
  const bad = await scenario({ extraArgs: ["--ig-login"], ask: { ig: { AI: "IGAA short token", DSA: "", SYSTEMDESIGN: "" } } });
  assert.equal(bad.code, 2);
  assert.match(bad.err, /the Instagram-Login token for AI does not look right \(not shown\)/);
  assert.equal(bad.graph.length, 0);
  assert.ok(!(bad.out + bad.err).includes("short token"));
});

test("--ig-login: an Instagram-Login token that is not a usable account (no user_id) is refused", async () => {
  const r = await scenario({ extraArgs: ["--ig-login"], graph: { igAccounts: { [IG_TOKEN.AI]: { username: "x" } } }, ask: { ig: { AI: IG_TOKEN.AI, DSA: "", SYSTEMDESIGN: "" } } });
  assert.equal(r.code, 1);
  assert.match(r.err, /no usable user_id/);
  assert.equal(secretSets(r.gh).length, 0);
});

test("--no-open does not call the browser opener", async () => {
  const r = await scenario({ extraArgs: ["--no-open"], timeout: 300 });
  assert.equal(r.browser.opened.length, 0);
  assert.equal(r.code, 1);
});

// ---------- errors never carry a token ----------
for (const leakOn of ["code", "long", "accounts"]) {
  test(`Graph error that echoes secrets is masked (${leakOn})`, async () => {
    const r = await scenario({ graph: { leakOn } });
    assert.equal(r.code, 1);
    assert.match(r.err, /Graph API error \(HTTP 400, code 190, subcode 460/);
    assert.match(r.err, /\[hidden\]/);
    assertNoSecrets(r.out, "stdout");
    assertNoSecrets(r.err, "stderr");
    assert.equal(secretSets(r.gh).length, 0);
  });
}

test("a gh error that echoes the token is masked", async () => {
  const r = await scenario({ gh: { failSetWith: PAGE_TOKEN[1111] } });
  assert.equal(r.code, 1);
  assert.match(r.err, /gh could not set secret META_PAGE_TOKEN_AI/);
  assertNoSecrets(r.out, "stdout");
  assertNoSecrets(r.err, "stderr");
});

test("a repo that is not private is refused before anything is asked", async () => {
  const r = await scenario({ gh: { visibility: "PUBLIC" } });
  assert.equal(r.code, 1);
  assert.match(r.err, /is not private/);
  assert.equal(r.asked.length, 0);
  assert.equal(r.graph.length, 0);
});

test("--gh-user without a saved login stops early", async () => {
  const r = await scenario({ gh: { noSavedLogin: true }, extraArgs: ["--gh-user", "nobody"] });
  assert.equal(r.code, 1);
  assert.match(r.err, /no saved login for nobody/);
  assert.equal(r.asked.length, 0);
});

// ---------- debug_token ----------
test("debug_token: missing scopes are reported", async () => {
  const r = await scenario({ graph: { userScopes: ["instagram_basic", "pages_show_list"] } });
  assert.equal(r.code, 0, r.err);
  assert.match(r.err, /did not grant: instagram_content_publish, pages_read_engagement, pages_manage_posts/);
  assert.match(r.out, /missing: instagram_content_publish, pages_read_engagement, pages_manage_posts/);
});

test("debug_token: an invalid Page token is skipped, the others are stored", async () => {
  const r = await scenario({ graph: { invalidPageToken: PAGE_TOKEN[2222] } });
  assert.equal(r.code, 0, r.err);
  assert.deepEqual(secretSets(r.gh).map((c) => c.args[2]), ["META_PAGE_TOKEN_AI", "META_PAGE_TOKEN_SYSTEMDESIGN"]);
  assert.match(r.err, /DSA: the Page token is not valid, skipped/);
  assertNoSecrets(r.out + r.err, "output");
});

test("debug_token: a Page token with an expiry date raises a warning", () => {
  const d = describeDebug("AI Page token", { type: "PAGE", is_valid: true, expires_at: 1900000000, scopes: SCOPES }, { isPage: true });
  assert.ok(d.lines.some((l) => /WARNING/.test(l)));
  const u = describeDebug("user token", { type: "USER", is_valid: false, error: { code: 190, subcode: 463 }, scopes: [] });
  assert.equal(u.valid, false);
  assert.deepEqual(u.missing, SCOPES);
});

// ---------- the mapping prompt ----------
test("mapping: skipped handles, repeated Pages and bad numbers are handled", async () => {
  const answers = ["9", "4", "1", "1", "3", ""]; // AI: 9 bad, 4 no Instagram, 1 ok. DSA: 1 taken, 3 ok. SYSTEMDESIGN: skip
  const ask = async (q, o = {}) => {
    if (/App ID/.test(q)) return APP_ID;
    if (/App Secret/.test(q)) return APP_SECRET;
    if (/configuration ID/.test(q)) return "";
    if (/Page number/.test(q)) return answers.shift();
    if (/Set these now/.test(q)) return "y";
    throw new Error("unexpected prompt");
  };
  const r = await scenario({ deps: { ask } });
  assert.equal(r.code, 0, r.err);
  assert.deepEqual(secretSets(r.gh).map((c) => c.args[2]), ["META_PAGE_TOKEN_AI", "META_PAGE_TOKEN_DSA"]);
  assert.match(r.out, /pick a number from the table/);
  assert.match(r.out, /no linked Instagram account/);
  assert.match(r.out, /already used for another handle/);
});

test("not confirmed: nothing is set", async () => {
  const r = await scenario({ ask: { confirm: "n" } });
  assert.equal(r.code, 2);
  assert.equal(secretSets(r.gh).length + varSets(r.gh).length, 0);
});

test("no Page has an Instagram account: nothing to do", async () => {
  const r = await scenario({ graph: { pages: [{ id: "1111", name: "Lonely", ig: null }] } });
  assert.equal(r.code, 1);
  assert.match(r.err, /no Page has both/);
  assert.equal(secretSets(r.gh).length, 0);
});

test("verification fails loudly when a name is missing in the repo", async () => {
  const r = await scenario({ gh: { dropFromList: ["META_PAGE_TOKEN_DSA"] } });
  assert.equal(r.code, 1);
  assert.match(r.out, /META_PAGE_TOKEN_DSA\s+MISSING/);
});

// ---------- arguments: a token can never be an argument ----------
test("tokens as arguments are refused and never echoed", async () => {
  const bad = [
    ["--token", PAGE_TOKEN[1111]],
    [`--access-token=${LONG}`],
    ["--app-secret", APP_SECRET],
    [PAGE_TOKEN[2222]],
    ["--paste", `--user-token=${SHORT}`],
    [`--long-token=${LONG}`],
    ["--long-token", LONG],
    ["--paste", "--long-token"],
    [`--ig-login=${IG_TOKEN.AI}`],
    ["--ig-login", IG_TOKEN.AI],
    ["--ig-login", "--paste"],
    ["--ig-token", IG_TOKEN.AI],
    ["--ig-api-version", IG_TOKEN.AI],
    ["--repo", `${LONG}`],
    ["--gh-user", `${GH_TOKEN}`],
    ["--port", "abc"],
  ];
  for (const argv of bad) {
    const stdout = sink();
    const stderr = sink();
    const code = await run(argv, { stdout, stderr, outputIsFile: () => false });
    assert.equal(code, 2, argv.join(" ").slice(0, 20));
    assertNoSecrets(stdout.text + stderr.text, "usage error");
  }
  assert.throws(() => parseArgs(["--bogus"]), /unknown option/);
  assert.deepEqual(parseArgs(["--repo", "a/b", "--gh-user", "x-y", "--port", "9000", "--paste", "--dry-run", "--no-open", "--api-version", "v25.0"]),
    { paste: true, longToken: false, igLogin: false, dryRun: true, help: false, noOpen: true, repo: "a/b", ghUser: "x-y", port: 9000, apiVersion: "v25.0", igApiVersion: "v25.0" });
  assert.equal(parseArgs(["--long-token", "--gh-user", "shivamm-fl"]).longToken, true);
  assert.equal(parseArgs(["--ig-login", "--long-token", "--ig-api-version", "v26.0"]).igApiVersion, "v26.0");
  assert.equal(parseArgs(["--ig-login"]).igLogin, true);
});

// ---------- refuse to write to a file ----------
test("refuses when stdout is redirected to a file (real redirect, real process)", () => {
  const dir = mkdtempSync(join(tmpdir(), "mc-"));
  try {
    const file = join(dir, "out.txt");
    const fd = openSync(file, "w");
    const r = spawnSync(process.execPath, [SCRIPT, "--dry-run"], { stdio: ["ignore", fd, "pipe"], encoding: "utf8", timeout: 20000 });
    closeSync(fd);
    assert.equal(r.status, 2);
    assert.match(r.stderr, /Refusing to run/);
    assert.equal(statSync(file).size, 0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("refuses when the injected check says stdout is a file", async () => {
  const stderr = sink();
  const code = await run(["--dry-run"], { stdout: sink(), stderr, outputIsFile: () => true });
  assert.equal(code, 2);
  assert.match(stderr.text, /Refusing to run/);
});

// ---------- dry run ----------
// every combination of token kinds: Facebook default OAuth, --long-token, --ig-login alone, --ig-login with --long-token
const MODES = [
  { args: [], fb: true, ig: false },
  { args: ["--long-token"], fb: true, ig: false },
  { args: ["--ig-login"], fb: false, ig: true },
  { args: ["--ig-login", "--long-token"], fb: true, ig: true },
];

for (const { args: mode, fb, ig } of MODES) {
  const label = ["--dry-run", ...mode].join(" ");
  test(`${label} touches no network, no gh, no browser and still shows the whole flow`, async () => {
    const stdout = sink();
    const stderr = sink();
    const boom = () => { throw new Error("a real call was made in dry-run mode"); };
    const code = await run(["--dry-run", ...mode, "--gh-user", "shivamm-fl"], { stdout, stderr, stdin: { isTTY: false }, outputIsFile: () => false, fetch: boom, runGh: boom, openBrowser: boom, graphBase: "http://127.0.0.1:1", igBase: "http://127.0.0.1:1" });
    assert.equal(code, 0, stderr.text);
    assert.match(stdout.text, /DRY RUN/);
    if (fb) {
      assert.match(stdout.text, /Learnvora AI \(demo\)\s+110000000000001\s+@learnvora_ai_demo\s+17841400000000001/);
      assert.match(stdout.text, /META_PAGE_TOKEN_SYSTEMDESIGN\s+present/);
    }
    if (ig) {
      assert.match(stdout.text, /AI\s+@learnvora_ai_demo\s+17841400000000001\s+Business\s+not readable/);
      assert.match(stdout.text, /META_IG_TOKEN_SYSTEMDESIGN\s+present/);
      assert.match(stdout.text, /META_IG_USER_ID_DSA\s+present/);
    }
    assert.equal(/META_PAGE_TOKEN/.test(stdout.text), fb);
    assert.equal(/META_IG_TOKEN/.test(stdout.text), ig);
    assert.equal(/dialog\/oauth/.test(stdout.text), mode.length === 0, "only the default mode has a login link");
    assertNoSecrets(stdout.text + stderr.text, "dry-run output");
    assert.ok(!/EAADRYRUN|IGAADRYRUN|ghp_DRYRUN|0123456789abcdef0123456789abcdef/.test(stdout.text + stderr.text));
  });

  test(`${label} as a real process in empty directories writes no file anywhere`, () => {
    const cwd = mkdtempSync(join(tmpdir(), "mc-cwd-"));
    const tmp = mkdtempSync(join(tmpdir(), "mc-tmp-"));
    try {
      const r = spawnSync(process.execPath, [SCRIPT, "--dry-run", ...mode], { cwd, env: { ...process.env, TEMP: tmp, TMP: tmp, TMPDIR: tmp }, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", timeout: 20000 });
      assert.equal(r.status, 0, r.stderr);
      assert.match(r.stdout, /Done for AI, DSA, SYSTEMDESIGN \(dry run/);
      assertNoSecrets(r.stdout + r.stderr, "dry-run process output");
      assert.deepEqual(readdirSync(cwd), []);
      assert.deepEqual(readdirSync(tmp), []);
    } finally { rmSync(cwd, { recursive: true, force: true }); rmSync(tmp, { recursive: true, force: true }); }
  });
}

// ---------- the real spawn path: a fake gh executable ----------
const STUB_GH = `
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const dir = process.env.STUB_DIR;
const chunks = [];
for await (const c of process.stdin) chunks.push(c);
const input = Buffer.concat(chunks).toString("utf8");
const args = process.argv.slice(2);
const n = readdirSync(dir).filter((f) => f.startsWith("argv-")).length;
writeFileSync(join(dir, "argv-" + n + ".json"), JSON.stringify(args));
writeFileSync(join(dir, "stdin-" + n + ".txt"), input);
const gh = process.env.GH_TOKEN || "";
writeFileSync(join(dir, "env-" + n + ".json"), JSON.stringify({ ghTokenSha: gh ? createHash("sha256").update(gh).digest("hex") : null }));
const stateFile = join(dir, "state.json");
const state = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, "utf8")) : { secret: [], variable: [] };
const [a, b] = args;
if (a === "auth" && b === "token") process.stdout.write(process.env.STUB_GH_TOKEN + "\\n");
else if (a === "api") process.stdout.write("shivamm-fl\\n");
else if (a === "repo" && b === "view") process.stdout.write(JSON.stringify({ visibility: "PRIVATE" }));
else if ((a === "secret" || a === "variable") && b === "set") { state[a].push(args[2]); writeFileSync(stateFile, JSON.stringify(state)); }
else if ((a === "secret" || a === "variable") && b === "list") process.stdout.write(JSON.stringify(state[a].map((name) => ({ name }))));
else { process.stderr.write("stub: unexpected"); process.exit(1); }
`;

for (const { args: mode, fb, ig } of MODES) test(`fake gh executable (${mode.join(" ") || "default"}): argv has no secret, the token is only in the stdin of gh secret set, no file holds a token`, async () => {
  const dir = mkdtempSync(join(tmpdir(), "mc-gh-"));
  try {
    const stubPath = join(dir, "gh-stub.mjs");
    writeFileSync(stubPath, STUB_GH);
    const rec = join(dir, "rec");
    mkdirSync(rec);
    const r = await scenario({ extraArgs: [...mode, "--gh-user", "shivamm-fl"], deps: { runGh: undefined, ghCmd: [process.execPath, stubPath], env: { ...process.env, STUB_DIR: rec, STUB_GH_TOKEN: GH_TOKEN } } });
    assert.equal(r.code, 0, r.err);
    assertNoSecrets(r.out, "stdout");
    assertNoSecrets(r.err, "stderr");
    const files = readdirSync(rec);
    const argvFiles = files.filter((f) => f.startsWith("argv-"));
    const perHandle = fb && ig ? 4 : fb ? 3 : 2; // gh set calls per handle
    assert.ok(argvFiles.length >= 5 + 3 * perHandle, "gh was really spawned for every step");
    const ghSha = createHash("sha256").update(GH_TOKEN).digest("hex");
    let secretCalls = 0;
    for (const f of argvFiles) {
      const n = f.match(/argv-(\d+)/)[1];
      const args = JSON.parse(readFileSync(join(rec, f), "utf8"));
      const stdin = readFileSync(join(rec, `stdin-${n}.txt`), "utf8");
      const env = JSON.parse(readFileSync(join(rec, `env-${n}.json`), "utf8"));
      assertNoSecrets(JSON.stringify(args), "argv");
      assert.ok(!args.some((a) => a === "--body" || a === "-b"), "no value argument");
      if (args[0] === "secret" && args[1] === "set") {
        secretCalls++;
        const want = {
          META_PAGE_TOKEN_AI: PAGE_TOKEN[1111], META_PAGE_TOKEN_DSA: PAGE_TOKEN[2222], META_PAGE_TOKEN_SYSTEMDESIGN: PAGE_TOKEN[3333],
          META_IG_TOKEN_AI: IG_TOKEN.AI, META_IG_TOKEN_DSA: IG_TOKEN.DSA, META_IG_TOKEN_SYSTEMDESIGN: IG_TOKEN.SYSTEMDESIGN,
        }[args[2]];
        assert.equal(stdin, want, "exactly the token, on stdin, no newline");
      } else assertNoSecrets(stdin, "stdin of a non-secret call");
      if (!(args[0] === "auth" && args[1] === "token")) assert.equal(env.ghTokenSha, ghSha, "GH_TOKEN reaches the child through the environment");
    }
    assert.equal(secretCalls, (fb ? 3 : 0) + (ig ? 3 : 0));
    // no file anywhere holds a token except the stdin captures of `gh secret set` (the stub's own recording)
    for (const f of files) {
      if (!f.startsWith("stdin-")) assertNoSecrets(readFileSync(join(rec, f), "utf8"), f);
    }
    assert.ok(!files.some((f) => /^argv-/.test(f) && JSON.parse(readFileSync(join(rec, f), "utf8")).includes(GH_TOKEN)));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// ---------- hidden prompt ----------
function fakeTty() {
  const stdin = new EventEmitter();
  stdin.isTTY = true;
  stdin.raw = [];
  stdin.setRawMode = (v) => { stdin.raw.push(v); };
  stdin.setEncoding = () => {};
  stdin.resume = () => {};
  stdin.pause = () => {};
  return stdin;
}

test("hidden prompt: nothing typed is echoed, raw mode is restored, bracketed-paste markers and backspace work", async () => {
  const stdin = fakeTty();
  const stdout = sink();
  const p = ttyAsk(stdin, stdout)("Secret: ", { hidden: true });
  stdin.emit("data", "\u001b[200~EAAxyz");
  stdin.emit("data", "Q\u007f1\u001b[201~\r");
  assert.equal(await p, "EAAxyz1");
  assert.equal(stdout.text, "Secret: \n");
  assert.deepEqual(stdin.raw, [true, false]);
  assert.equal(stdin.listenerCount("data"), 0);
});

test("hidden prompt: Ctrl-C cancels, a non-terminal stdin is refused", async () => {
  const stdin = fakeTty();
  const stdout = sink();
  const p = ttyAsk(stdin, stdout)("Secret: ", { hidden: true });
  stdin.emit("data", "ab\u0003");
  await assert.rejects(p, /cancelled/);
  assert.deepEqual(stdin.raw, [true, false]);
  const notTty = fakeTty();
  notTty.isTTY = false;
  await assert.rejects(ttyAsk(notTty, stdout)("Secret: ", { hidden: true }), /interactive terminal/);
});

test("visible prompt: the terminal echoes, the tool does not touch raw mode", async () => {
  const stdin = fakeTty();
  const stdout = sink();
  const p = ttyAsk(stdin, stdout)("Page number: ");
  stdin.emit("data", "2\n");
  assert.equal(await p, "2");
  assert.deepEqual(stdin.raw, []);
});

// ---------- scrubber and source checks ----------
test("scrubber hides known secrets, token shapes and query secrets, but not ordinary words", () => {
  const { remember, scrub } = makeScrubber();
  remember("my-custom-secret-value");
  const s = scrub(`a my-custom-secret-value b EAAabcdefghijklmnopqrstuv c 123456789|abcdefghijklmnop d access_token=zzz&x=1 e client_secret=qq f error_code=100 g Valid OAuth Redirect URIs h \u001b[31mred`);
  assert.ok(!/my-custom|EAAabc|abcdefghijklmnop|zzz|=qq/.test(s));
  assert.match(s, /error_code=100/);
  assert.match(s, /OAuth Redirect URIs/);
  assert.ok(!s.includes("\u001b"));
  assert.match(scrub("Bearer abcdefghijklmnopqrstuvwxyz0123"), /\[hidden\]/);
});

test("source: never writes a file, never passes a value as a gh argument, imports only fstatSync from fs", () => {
  const src = readFileSync(SCRIPT, "utf8");
  assert.ok(!/writeFile|appendFile|createWriteStream|mkdtemp|copyFile|renameSync|openSync|\.writeSync/.test(src));
  assert.ok(!/["']--body["']|["']-b["']/.test(src));
  assert.deepEqual(src.match(/import \{[^}]*\} from "node:fs"/g), ['import { fstatSync } from "node:fs"']);
  assert.ok(!/process\.env\.[A-Z_]*(TOKEN|SECRET)/.test(src), "no token is read from the environment");
});

test("zz: the whole suite left tools/ as it was (no stray files)", () => {
  const added = readdirSync(HERE).filter((f) => !TOOLS_BEFORE.includes(f));
  assert.deepEqual(added, []);
});
