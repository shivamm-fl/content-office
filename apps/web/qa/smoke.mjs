// Run against the locally built or dev-served web app. The browser owns all API and socket mocks.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { makeFixture, teams, threadData } from "./fixtures.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = resolve(here, "out");
mkdirSync(out, { recursive: true });
const base = process.env.OFFICE_QA_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
const failures = [];
const results = [];
const expect = (truth, label) => { results.push([label, Boolean(truth)]); if (!truth) failures.push(label); };
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function setup(page, scenario = "busy", opts = {}) {
  let team = "learnai";
  let fixture = makeFixture(team, scenario);
  let socket;
  let authenticated = !opts.loginRequired;
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => { if (e.type() === "error") errors.push(e.text()); });
  if (opts.webglOff) await page.addInitScript(() => {
    const old = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...rest) {
      if (type === "webgl" || type === "experimental-webgl" || type === "webgl2") return null;
      return old.call(this, type, ...rest);
    };
  });
  if (opts.lowPower) await page.addInitScript(() => Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, get: () => 2 }));
  await page.routeWebSocket("**/api/teams/*/ws", (ws) => {
    socket = ws;
    const slug = new URL(ws.url()).pathname.split("/")[3];
    team = slug;
    fixture = makeFixture(team, scenario);
    ws.send(JSON.stringify({ t: "state", state: fixture.state }));
    ws.onMessage((message) => { if (message === "ping") ws.send("pong"); });
  });
  await page.route("**/qa/placeholder.svg", (route) => route.fulfill({ path: resolve(here, "placeholder.svg"), contentType: "image/svg+xml" }));
  await page.route("**/qa/placeholder.mp4", (route) => route.fulfill({ path: resolve(here, "placeholder.mp4"), contentType: "video/mp4" }));
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path === "/api/me") return authenticated
      ? route.fulfill({ json: { owner: "Office QA", teams: teams.map(({ slug, name }) => ({ slug, name })) } })
      : route.fulfill({ status: 401, json: { error: "login required" } });
    if (path === "/api/login") { authenticated = true; return route.fulfill({ json: { ok: true } }); }
    const slug = path.split("/")[3];
    if (slug && slug !== team) { team = slug; fixture = makeFixture(team, scenario); }
    if (path.endsWith("/calendar")) return route.fulfill({ json: fixture.calendar });
    if (path.includes("/preview/")) return route.fulfill({ json: { item: "e033", title: "Indexing for real products", video_url: "/qa/placeholder.mp4", cover_url: "/qa/placeholder.svg", caption: "Indexing matters.", youtube: "Indexing matters", duration_s: 27, source: "office" } });
    if (/\/threads\/[^/]+$/.test(path)) return route.fulfill({ json: threadData(fixture.state, path.split("/").at(-1)) });
    if (path.endsWith("/day")) return route.fulfill({ json: { thread: { id: "day-new", agent: "producer", title: "Fresh work day", kind: "workday", created_at: Date.now(), updated_at: Date.now(), last_run: null, session_id: null, preview: null } } });
    if (path.endsWith("/sync")) return route.fulfill({ json: { thread: { id: "sync-new", agent: "producer", title: "Daily sync", kind: "sync", created_at: Date.now(), updated_at: Date.now(), last_run: null, session_id: null, preview: null } } });
    if (path.includes("/asks/") && request.method() === "POST") {
      const id = path.split("/").at(-1);
      const answer = request.postDataJSON();
      const ask = fixture.state.asks.find((a) => a.id === id);
      if (ask) {
        fixture.state.asks = fixture.state.asks.filter((a) => a.id !== id);
        socket?.send(JSON.stringify({ t: "state", state: fixture.state }));
      }
      return route.fulfill({ json: { ...ask, status: "answered", answer, answered_at: Date.now() } });
    }
    if (path.endsWith("/messages")) return route.fulfill({ json: { thread: fixture.state.threads[0] ?? threadData(fixture.state, "chat-new").thread, message: null } });
    if (path.endsWith("/posting") || path.endsWith("/publish")) return route.fulfill({ json: { id: "post-1", item: "e033", mode: "now", date: null, time: null, status: "handing_over", gh_url: null, error: null, created_at: Date.now(), updated_at: Date.now() } });
    if (path.includes("/tasks/")) return route.fulfill({ json: { ...fixture.state.tasks[0], thread_id: "chat-1" } });
    if (path.endsWith("/resume")) return route.fulfill({ json: { started: 1 } });
    if (path.includes("/runs/")) return route.fulfill({ json: fixture.state.runs[0] });
    return route.fulfill({ json: {} });
  });
  return { errors, closeSocket: () => socket?.close(), sendEvent: (event) => socket?.send(JSON.stringify(event)), state: () => fixture.state };
}

async function checkLayout(page, label) {
  const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth,
    office: Boolean(document.querySelector(".scene-viewport")), roster: document.querySelectorAll(".roster-person").length }));
  expect(size.scroll <= size.viewport + 1, `${label}: no horizontal overflow (${size.scroll}/${size.viewport})`);
  return size;
}

try {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, serviceWorkers: "block" });
  const page = await mobile.newPage();
  const mock = await setup(page);
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.locator(".roster-person").first().waitFor();
  await page.locator(".scene-viewport").waitFor();
  await pause(450);
  await page.screenshot({ path: resolve(out, "office-mobile.png"), fullPage: true });
  const layout = await checkLayout(page, "mobile");
  expect(layout.office, "mobile: 3D floor visible");
  expect(layout.roster === 9, "mobile: roster has nine agents");
  await page.locator(".scene-character").first().click({ timeout: 1500 });
  expect(await page.getByRole("dialog", { name: "Producer" }).isVisible(), "character opens agent sheet");
  await page.getByRole("button", { name: "Close agent profile" }).click();
  const beforeFocus = await page.locator(".scene-world").getAttribute("style");
  await page.locator(".room-hit").nth(1).click({ force: true });
  expect((await page.locator(".scene-world").getAttribute("style")) !== beforeFocus, "room tap focuses camera");
  await page.locator(".scene-room-list summary").click();
  expect(await page.locator(".scene-room-list button").count() === 7, "accessible room list exposes all rooms");
  await page.locator(".scene-room-list button").first().click();
  await page.locator(".scene-room-list summary").click();
  const beforeOrbit = await page.locator(".scene-world").getAttribute("style");
  const sceneBox = await page.locator(".scene-viewport").boundingBox();
  await page.mouse.move(sceneBox.x + 150, sceneBox.y + 170);
  await page.mouse.down();
  await page.mouse.move(sceneBox.x + 230, sceneBox.y + 210, { steps: 6 });
  await page.mouse.up();
  expect((await page.locator(".scene-world").getAttribute("style")) !== beforeOrbit, "drag orbits camera");
  await page.locator(".scene-viewport").hover();
  const beforeZoom = await page.locator(".scene-world").getAttribute("style");
  await page.mouse.wheel(0, -120);
  await pause(100);
  expect((await page.locator(".scene-world").getAttribute("style")) !== beforeZoom, "wheel zooms camera");
  await page.locator(".scene-reset").click();
  await page.getByRole("button", { name: "2D" }).click();
  await page.reload();
  await page.locator(".flat-floor").waitFor();
  expect(await page.getByRole("button", { name: "2D" }).getAttribute("aria-pressed") === "true", "view preference survives reload");
  await page.getByRole("button", { name: "3D" }).click();
  await page.locator(".scene-viewport").waitFor();
  await page.locator('.room-hit[aria-label^="Reception"]').click({ force: true });
  await page.waitForFunction(() => location.hash === "#/inbox");
  await page.getByText("Finished reel from the studio").waitFor();
  await page.screenshot({ path: resolve(out, "inbox-mobile.png"), fullPage: true });
  await page.getByRole("button", { name: "Approve", exact: true }).first().click();
  expect(mock.state().asks.length === 1, "approval posts answer and updates state");
  await page.getByText("Approved · the team can continue").waitFor();
  expect(await page.getByText("Approved · the team can continue").isVisible(), "approved moment celebrates after answer");
  await page.getByRole("button", { name: /Calendar/ }).last().click();
  await page.getByText("Indexing for real products").waitFor();
  await page.screenshot({ path: resolve(out, "calendar-mobile.png"), fullPage: true });
  await page.getByRole("button", { name: "Post", exact: true }).first().click();
  expect(await page.getByRole("dialog", { name: /Post/ }).isVisible(), "calendar Post opens sheet");
  await page.getByRole("dialog", { name: /Post/ }).getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByRole("button", { name: "Yes, pause it" }).click();
  expect(true, "calendar pause action sent");
  await page.getByRole("button", { name: /Office/ }).last().click();
  await page.getByRole("button", { name: /Questions for the Producer/ }).click();
  await page.getByText("The team is planning and building").waitFor();
  mock.sendEvent({ t: "delta", thread_id: "chat-1", run_id: "run-day", agent: "producer", parent: null, text: "Streaming QA response" });
  await page.getByText("Streaming QA response").waitFor();
  expect(true, "chat streaming delta renders");
  await page.screenshot({ path: resolve(out, "chat-mobile.png"), fullPage: true });
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByRole("button", { name: /Runs/ }).last().click();
  await page.getByText("Started", { exact: false }).first().waitFor();
  expect(true, "runs screen opens");
  expect(mock.errors.length === 0, `mobile: no console errors (${mock.errors.join(" | ")})`);
  await mobile.close();

  const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, serviceWorkers: "block" });
  const wide = await desktop.newPage();
  const wideMock = await setup(wide);
  await wide.goto(base, { waitUntil: "domcontentloaded" });
  await wide.locator(".scene-viewport").waitFor();
  await pause(300);
  await wide.screenshot({ path: resolve(out, "office-desktop.png"), fullPage: true });
  await checkLayout(wide, "desktop");
  await wide.getByRole("button", { name: /Learnvora DSA/ }).first().click();
  await wide.getByText("Learnvora DSA", { exact: true }).first().waitFor();
  expect(await wide.locator(".roster-person").count() === 9, "floor switching remounts nine agents");
  wideMock.closeSocket();
  await wide.getByText("RECONNECTING").waitFor({ timeout: 5000 });
  expect(true, "socket disconnect shows Reconnecting");
  await desktop.close();

  for (const scenario of ["empty", "limit", "fifteen"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    const p = await ctx.newPage();
    await setup(p, scenario);
    await p.goto(base, { waitUntil: "domcontentloaded" });
    await p.locator(".roster-person").first().waitFor();
    await checkLayout(p, scenario);
    if (scenario === "empty") {
      expect(await p.getByText("No conversations yet.").isVisible(), "empty office message");
      await p.getByRole("button", { name: /Start the day/ }).click();
      await p.waitForFunction(() => location.hash === "#/t/day-new");
      expect(new URL(p.url()).hash === "#/t/day-new", "Start the day navigates to returned thread");
      await p.getByRole("button", { name: "Back" }).click();
      await p.getByRole("button", { name: "Call daily sync" }).first().click();
      await p.waitForFunction(() => location.hash === "#/t/sync-new");
      expect(true, "daily sync navigates to returned thread");
    }
    if (scenario === "limit") expect(await p.getByText("Claude usage limit reached").isVisible(), "usage limit and resume visible");
    if (scenario === "fifteen") {
      expect(await p.locator(".roster-person").count() === 15, "fifteen-agent floor renders");
      await p.locator(".roster-wrap").scrollIntoViewIfNeeded();
      await p.screenshot({ path: resolve(out, "fifteen-roster.png") });
    }
    await ctx.close();
  }
  for (const [label, options, setupOpts] of [
    ["webgl-off", {}, { webglOff: true }],
    ["reduced-motion", { reducedMotion: "reduce" }, {}],
    ["low-power", {}, { lowPower: true }],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block", ...options });
    const p = await ctx.newPage();
    await setup(p, "busy", setupOpts);
    await p.goto(base, { waitUntil: "domcontentloaded" });
    await p.locator(".flat-floor").waitFor();
    expect(await p.getByRole("button", { name: "2D" }).getAttribute("aria-pressed") === "true", `${label}: 2D fallback`);
    await p.screenshot({ path: resolve(out, `${label}.png`), fullPage: true });
    await ctx.close();
  }
  const slow = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
  const slowPage = await slow.newPage();
  await setup(slowPage);
  const cdp = await slow.newCDPSession(slowPage);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await slowPage.goto(base, { waitUntil: "domcontentloaded" });
  await slowPage.locator(".roster-person").first().waitFor({ timeout: 15000 });
  expect(true, "4x CPU throttle reaches usable roster");
  await slow.close();
  const login = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
  const loginPage = await login.newPage();
  await setup(loginPage, "busy", { loginRequired: true });
  await loginPage.goto(base, { waitUntil: "domcontentloaded" });
  await loginPage.getByPlaceholder("Office key").fill("local QA key");
  await loginPage.screenshot({ path: resolve(out, "login-mobile.png") });
  await loginPage.getByRole("button", { name: "Sign in" }).click();
  await loginPage.locator(".roster-person").first().waitFor();
  expect(true, "login opens office after auth response");
  await login.close();
  const offline = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "allow" });
  const offlinePage = await offline.newPage();
  await offlinePage.goto(base, { waitUntil: "domcontentloaded" });
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offline.setOffline(true);
  await offlinePage.reload({ waitUntil: "domcontentloaded" });
  await offlinePage.getByRole("heading", { name: "Content Office" }).waitFor();
  expect(true, "PWA shell loads offline after precache");
  await offline.close();
} finally {
  await browser.close();
}
for (const [label, passed] of results) console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
if (failures.length) { console.error(`${failures.length} QA checks failed`); process.exitCode = 1; }
