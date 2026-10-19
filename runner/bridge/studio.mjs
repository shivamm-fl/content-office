// Studio tools: the steps of a reel build that need the network, a browser or a key (voice, render, HyperFrames,
// cover, gate). The agent's own shell runs in Claude Code's sandbox (no network outside it, no secrets), so the
// bridge runs these steps for it, outside the sandbox, with the team's scripts as they were when the job started:
// a script, skill or template the session changed is refused, so nothing the session wrote runs with a key.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ITEM_MEDIA = fileURLToPath(new URL("../scripts/item_media.py", import.meta.url));

const PROTECTED = ["scripts", ".claude/skills", "reels/_template", "reels/_kit", "brand/covers/_template", "brand/fonts"];
const HF = "hyperframes@0.8.149";
const SWARA = { tts: "edge", voice: "hi-IN-SwaraNeural", pace: 1.26 };
const OWNER_PRIME = "सुनो, ये बहुत interesting है!";

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "__pycache__" || name === "snapshots") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Fingerprint of the scripts, skills and templates the trusted steps run. */
export function fingerprint(teamDir) {
  const h = new Map();
  for (const top of PROTECTED) {
    for (const f of walk(join(teamDir, top))) h.set(relative(teamDir, f).split(sep).join("/"), createHash("sha256").update(readFileSync(f)).digest("hex"));
  }
  return h;
}

function changedSince(teamDir, before) {
  const now = fingerprint(teamDir);
  const changed = [];
  for (const [f, sum] of now) if (before.get(f) !== sum) changed.push(f);
  for (const f of before.keys()) if (!now.has(f)) changed.push(f);
  return changed;
}

/** A folder of this team the agent names: reels/<x>, brand/covers/<x>, brand/yt_thumbs/<x>. */
function teamFolder(teamDir, folder) {
  const rel = String(folder ?? "").replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
  if (!/^(reels|brand\/covers|brand\/yt_thumbs)\/[\w.-]+$/.test(rel) || /\/_(template|kit)$/.test(rel)) throw new Error(`not a reel, cover or thumbnail folder: ${folder}`);
  const abs = resolve(teamDir, rel);
  if (!abs.startsWith(resolve(teamDir) + sep)) throw new Error("outside the team folder");
  return { rel, abs };
}

function removeNodeModules(teamDir) {
  for (const top of ["reels", "brand"]) {
    const root = join(teamDir, top);
    if (!existsSync(root)) continue;
    const stack = [root];
    while (stack.length) {
      const d = stack.pop();
      for (const name of readdirSync(d)) {
        const p = join(d, name);
        if (!statSync(p).isDirectory()) continue;
        if (name === "node_modules") rmSync(p, { recursive: true, force: true });
        else stack.push(p);
      }
    }
  }
}

/** The environment for trusted steps: no Claude token, no GitHub tokens, a key only where a step needs it. */
function stepEnv(extra = {}) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (/TOKEN|SECRET|PASSWORD|KEY$|_KEY_|COOKIE|^ACTIONS_|^GITHUB_TOKEN$/i.test(k)) continue;
    env[k] = v;
  }
  return { ...env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1", ...extra };
}

function run(cmd, args, { cwd, env, timeoutMs = 20 * 60_000 }) {
  return new Promise((done) => {
    const win = process.platform === "win32";
    const c = spawn(cmd, args, { cwd, env, shell: win, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    const add = (d) => { out = (out + d.toString()).slice(-12000); };
    c.stdout.on("data", add);
    c.stderr.on("data", add);
    const timer = setTimeout(() => { c.kill("SIGKILL"); out += "\n[stopped: took too long]"; }, timeoutMs);
    c.on("close", (code) => { clearTimeout(timer); done({ code: code ?? 1, out }); });
    c.on("error", (e) => { clearTimeout(timer); done({ code: 1, out: String(e) }); });
  });
}

export const STUDIO_TOOLS = [
  {
    name: "make_voice",
    description: "Make the voice, the captions' word timings and the mix of a reel (scripts/make_reel_audio.py) from reels/<folder>/spec.json. Uses the owner's own voice (ElevenLabs, 'Shivam Trainer') by default and falls back to Swara (Edge TTS) when the owner's voice is not available or its monthly characters are used up. Run it again after you change the narration. Returns which voice was used and the length.",
    inputSchema: { type: "object", properties: { folder: { type: "string", description: "reels/<folder>" } }, required: ["folder"] },
  },
  {
    name: "render_video",
    description: "Render reels/<folder> to reels/<folder>_hi.mp4 with HyperFrames (about 10 minutes). Run it after make_voice and after the visuals pass lint_visuals and the HyperFrames check.",
    inputSchema: { type: "object", properties: { folder: { type: "string" } }, required: ["folder"] },
  },
  {
    name: "hyperframes",
    description: "Run the HyperFrames CLI in a reel, cover or thumbnail folder: command 'check' (validate the composition) or 'snapshot' with 'at' (comma-separated seconds, e.g. '1.5,6,12') to get PNG frames you can Read.",
    inputSchema: { type: "object", properties: { folder: { type: "string" }, command: { type: "string", enum: ["check", "snapshot"] }, at: { type: "string" } }, required: ["folder", "command"] },
  },
  {
    name: "render_cover",
    description: "Build and render the Instagram cover (scripts/render_cover.py): brand/covers/<folder>.png at 1080x1920 from the template. Give the reel folder name, the category pill and the headline with <em>key words</em>.",
    inputSchema: { type: "object", properties: { folder: { type: "string", description: "the reel folder name, e.g. q101_slug" }, pill: { type: "string" }, headline: { type: "string" } }, required: ["folder", "pill", "headline"] },
  },
  {
    name: "fetch_image",
    description: "Download a picture from the web into the reel: a company or product logo, a product image, a chart from a source page (team rule 11: credit the source on screen). Saved as <folder>/assets/<name>.<ext>. PNG, JPEG, WebP, GIF or SVG, at most 8 MB. Find the image URL first with WebSearch / WebFetch (the company's site, press kit, Wikimedia Commons).",
    inputSchema: { type: "object", properties: { url: { type: "string" }, folder: { type: "string", description: "reels/<folder> or brand/covers/<folder>" }, name: { type: "string", description: "file name without extension, e.g. onit-logo" } }, required: ["url", "folder", "name"] },
  },
  {
    name: "capture_page",
    description: "Take a real screenshot of a web page (a job post, a release note, a GitHub repo, an app page) with headless Chrome: <folder>/assets/<name>.png. Default 1080x1350 (portrait); give width/height for another size. Read the PNG afterwards to check it, and crop it with ffmpeg in your shell if needed. Blur private people's names, emails and faces before you use it (team rule 11).",
    inputSchema: { type: "object", properties: { url: { type: "string" }, folder: { type: "string" }, name: { type: "string" }, width: { type: "number" }, height: { type: "number" } }, required: ["url", "folder", "name"] },
  },
  {
    name: "studio_gate",
    description: "Run the automatic gate for the item (scripts/ci_verify_reel.py <id> --skip-review): files, video format, length, loudness, HyperFrames check, caption lint, cover, hook, visuals lint. Your work is done when it prints ok; the independent reviews run after your session.",
    inputSchema: { type: "object", properties: { item: { type: "string" } }, required: ["item"] },
  },
];

export function makeStudio({ teamDir, python, onProgress }) {
  const before = fingerprint(teamDir);
  const guard = () => {
    const changed = changedSince(teamDir, before);
    if (changed.length) throw new Error(`these protected files changed in this session, so the studio step will not run: ${changed.slice(0, 6).join(", ")}. Restore them (git checkout -- <file>) and try again; changes to scripts, skills and templates are proposals for the owner.`);
  };
  const py = (args, opts = {}) => run(python, ["-I", ...args], { cwd: teamDir, env: stepEnv(opts.env), timeoutMs: opts.timeoutMs });
  const text = (t, isError = false) => ({ content: [{ type: "text", text: t }], isError });

  async function ownerVoiceLeft(key) {
    try {
      const r = await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: { "xi-api-key": key } });
      if (!r.ok) return null;
      const s = await r.json();
      return Number(s.character_limit) - Number(s.character_count);
    } catch { return null; }
  }

  async function makeVoice(a) {
    const { rel, abs } = teamFolder(teamDir, a.folder);
    const specPath = join(abs, "spec.json");
    if (!existsSync(specPath)) return text(`${rel}/spec.json not found`, true);
    const spec = JSON.parse(readFileSync(specPath, "utf8"));
    const key = process.env.ELEVENLABS_API_KEY;
    const writeSpec = (s) => writeFileSync(specPath, `${JSON.stringify(s, null, 2)}\n`);
    let reason = "the owner's ElevenLabs key is not set up";
    if (key) {
      const owner = { ...spec, tts: "owner", prime: spec.prime || OWNER_PRIME };
      writeSpec(owner);
      onProgress("Checking the owner's voice credits");
      const dry = await py(["scripts/make_reel_audio.py", rel], { env: { ELEVENLABS_API_KEY: key, OWNER_VOICE_DRY: "1" }, timeoutMs: 120_000 });
      const need = Number(/(\d+) characters/.exec(dry.out)?.[1] ?? NaN);
      // every phrase is already in the cache (restored from the last delivery): nothing is bought, so the credits do not matter and
      // the voice is never swapped for Swara just because the account could not be read
      const cached = dry.code === 0 && need === 0;
      const left = cached ? null : await ownerVoiceLeft(key);
      if (cached || (dry.code === 0 && Number.isFinite(need) && left !== null && left >= need + 100)) {
        onProgress(cached ? "The owner's voice: every phrase is already recorded (0 characters)" : `Recording in the owner's voice (${need} characters, ${left} left this month)`);
        const r = await py(["scripts/make_reel_audio.py", rel], { env: { ELEVENLABS_API_KEY: key }, timeoutMs: 20 * 60_000 });
        if (r.code === 0) return text(`Voice: the owner's own voice (ElevenLabs), ${need} characters used${cached ? " (every phrase was already recorded)" : `, about ${left - need} left this month`}.\n${r.out.slice(-1500)}`);
        reason = `the owner's voice failed (${r.out.trim().split("\n").pop()?.slice(0, 200)})`;
      } else {
        reason = left === null ? "the ElevenLabs account could not be read" : `the owner's voice has ${left} characters left this month and this reel needs ${Number.isFinite(need) ? need : "more"}`;
      }
    }
    onProgress("Recording with Swara (Edge TTS)");
    const { prime, ...rest } = JSON.parse(readFileSync(specPath, "utf8"));
    void prime;
    writeSpec({ ...rest, ...SWARA });
    const r = await py(["scripts/make_reel_audio.py", rel], { timeoutMs: 15 * 60_000 });
    if (r.code !== 0) return text(`The voice failed with Swara too:\n${r.out.slice(-2500)}`, true);
    return text(`Voice: Swara (Edge TTS), because ${reason}.\n${r.out.slice(-1500)}`);
  }

  async function call(name, a) {
    guard();
    removeNodeModules(teamDir);
    if (name === "make_voice") return makeVoice(a);
    if (name === "render_video") {
      const { rel, abs } = teamFolder(teamDir, a.folder);
      if (!rel.startsWith("reels/")) return text("render_video takes a reels/<folder>", true);
      const name_ = abs.split(sep).pop();
      onProgress(`Rendering ${name_} (about 10 minutes)`);
      const r = await py(["scripts/render_reel.py", rel, `reels/${name_}`, "hi"], { timeoutMs: 40 * 60_000 });
      const mp4 = join(teamDir, "reels", `${name_}_hi.mp4`);
      if (r.code !== 0 || !existsSync(mp4)) return text(`Render failed:\n${r.out.slice(-3000)}`, true);
      // the stamp says which files this video was made from; the gate refuses a video whose files changed afterwards (runner/scripts/item_media.py)
      const st = await py([ITEM_MEDIA, "stamp", "--team-dir", teamDir, "--folder", rel], { timeoutMs: 120_000 });
      return text(`Rendered reels/${name_}_hi.mp4 (${(statSync(mp4).size / 1e6).toFixed(1)} MB).${st.code === 0 ? "" : `\n(the render stamp could not be written: ${st.out.slice(-300)})`}`);
    }
    if (name === "hyperframes") {
      const { rel, abs } = teamFolder(teamDir, a.folder);
      const args = a.command === "snapshot"
        ? ["--yes", HF, "snapshot", ".", "--at", String(a.at ?? "0").replace(/[^\d.,]/g, ""), "--no-end"]
        : ["--yes", HF, "check"];
      onProgress(`HyperFrames ${a.command} in ${rel}`);
      const r = await run("npx", args, { cwd: abs, env: stepEnv(), timeoutMs: 10 * 60_000 });
      const shots = a.command === "snapshot" && existsSync(join(abs, "snapshots"))
        ? readdirSync(join(abs, "snapshots")).filter((f) => f.endsWith(".png")).map((f) => `${rel}/snapshots/${f}`) : [];
      return text(`${r.out.slice(-3000)}${shots.length ? `\nFrames to Read: ${shots.join(", ")}` : ""}`, r.code !== 0);
    }
    if (name === "render_cover") {
      if (!/^[\w.-]+$/.test(String(a.folder))) return text("give the reel folder name only", true);
      onProgress(`Rendering the cover of ${a.folder}`);
      const r = await py(["scripts/render_cover.py", String(a.folder), String(a.pill), String(a.headline)], { timeoutMs: 10 * 60_000 });
      return text(r.out.slice(-2500) || "done", r.code !== 0);
    }
    if (name === "fetch_image" || name === "capture_page") {
      const { rel, abs } = teamFolder(teamDir, a.folder);
      const base = String(a.name ?? "").replace(/[^\w-]/g, "").slice(0, 60);
      if (!base) return text("give a file name, e.g. onit-logo", true);
      let url;
      try { url = new URL(String(a.url)); } catch { return text("not a valid URL", true); }
      if (url.protocol !== "https:" && url.protocol !== "http:") return text("only http(s) URLs", true);
      if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|\[)/.test(url.hostname)) return text("not a public address", true);
      mkdirSync(join(abs, "assets"), { recursive: true });
      if (name === "fetch_image") {
        onProgress(`Downloading ${url.hostname} image for ${rel}`);
        const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (content-office studio)" }, redirect: "follow", signal: AbortSignal.timeout(60_000) }).catch((e) => ({ ok: false, status: String(e) }));
        if (!r.ok) return text(`download failed (${r.status})`, true);
        const type = (r.headers.get("content-type") ?? "").split(";")[0].trim();
        const ext = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg" }[type];
        if (!ext) return text(`not an image (${type || "unknown type"}); find the direct image URL`, true);
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length > 8 * 1024 * 1024) return text("image larger than 8 MB", true);
        const out = join(abs, "assets", `${base}.${ext}`);
        writeFileSync(out, buf);
        return text(`Saved ${rel}/assets/${base}.${ext} (${(buf.length / 1024).toFixed(0)} KB, from ${url.hostname}). Credit "Source: ${url.hostname.replace(/^www\./, "")}" on screen.`);
      }
      const w = Math.min(2160, Math.max(320, Number(a.width) || 1080));
      const h = Math.min(3840, Math.max(320, Number(a.height) || 1350));
      const out = join(abs, "assets", `${base}.png`);
      onProgress(`Screenshot of ${url.hostname} for ${rel}`);
      let r = { code: 1, out: "" };
      for (const bin of ["google-chrome", "chromium", "chromium-browser"]) {
        r = await run(bin, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--mute-audio", `--window-size=${w},${h}`, `--screenshot=${out}`, "--virtual-time-budget=8000", url.href],
          { cwd: abs, env: stepEnv(), timeoutMs: 90_000 });
        if (r.code === 0 && existsSync(out)) break;
      }
      if (!existsSync(out)) return text(`screenshot failed:\n${r.out.slice(-1200)}`, true);
      return text(`Saved ${rel}/assets/${base}.png (${w}x${h}) from ${url.hostname}. Read it to check what it shows; credit "Source: ${url.hostname.replace(/^www\./, "")}" on screen.`);
    }
    if (name === "studio_gate") {
      if (!/^[a-z]\d{2,4}$/.test(String(a.item))) return text("bad item id", true);
      onProgress(`Running the gate for ${a.item}`);
      const r = await py(["scripts/ci_verify_reel.py", String(a.item), "--skip-review"], { timeoutMs: 10 * 60_000 });
      return text(r.out.slice(-4000), r.code !== 0);
    }
    return text(`unknown studio tool ${name}`, true);
  }

  return { call };
}
