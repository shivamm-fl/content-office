import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { makeStudio } from "./studio.mjs";

const PYTHON = process.platform === "win32" ? "python" : "python3";

/** A team folder whose make_reel_audio.py is a stub: the dry run reports `dry`, a real run prints "recorded". */
function team({ dry }) {
  const dir = mkdtempSync(join(tmpdir(), "studio-test-"));
  mkdirSync(join(dir, "scripts"), { recursive: true });
  mkdirSync(join(dir, "reels", "q101_x"), { recursive: true });
  writeFileSync(join(dir, "reels", "q101_x", "spec.json"), JSON.stringify({ tts: "owner", copy: { hi: { A: "namaste" } } }));
  writeFileSync(join(dir, "scripts", "make_reel_audio.py"),
    `import os\nprint(${JSON.stringify(dry)} if os.environ.get("OWNER_VOICE_DRY") else "recorded")\n`);
  return dir;
}

async function voice(dir) {
  const progress = [];
  const studio = makeStudio({ teamDir: dir, python: PYTHON, onProgress: (m) => progress.push(m) });
  const r = await studio.call("make_voice", { folder: "reels/q101_x" });
  return { text: r.content[0].text, isError: Boolean(r.isError), progress, spec: JSON.parse(readFileSync(join(dir, "reels", "q101_x", "spec.json"), "utf8")) };
}

test("every phrase already recorded: the owner's voice is used and never swapped for Swara, even when the account cannot be read", async () => {
  process.env.ELEVENLABS_API_KEY = "test-key-that-is-not-valid";
  const r = await voice(team({ dry: "owner voice: 12 phrases, 0 to generate, 0 characters" }));
  assert.equal(r.isError, false);
  assert.match(r.text, /the owner's own voice/);
  assert.match(r.text, /0 characters used \(every phrase was already recorded\)/);
  assert.equal(r.spec.tts, "owner");
  assert.ok(r.progress.some((m) => /already recorded \(0 characters\)/.test(m)));
});

test("new phrases and an account that cannot be read: Swara, as before", async () => {
  process.env.ELEVENLABS_API_KEY = "test-key-that-is-not-valid";
  const r = await voice(team({ dry: "owner voice: 12 phrases, 3 to generate, 410 characters" }));
  assert.match(r.text, /Voice: Swara \(Edge TTS\), because the ElevenLabs account could not be read/);
  assert.equal(r.spec.tts, "edge");
});
