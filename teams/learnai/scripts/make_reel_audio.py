"""Reel voice+timeline pipeline. Copy uses pause markers: `|` = 0.3s, `||` = 0.6s, `|||` = 1.0s (think-time).
Each phrase is voiced separately and joined with REAL silence (exact pauses), scene starts follow real voice lengths,
per-phrase start times (`ph`) are emitted so visuals sync to the phrase being said.

TTS engines (spec.json "tts"):
  "edge"       (DEFAULT, free, no account) Microsoft Edge neural voice, Hindi. Phrase may start with a tone tag: `@hook`, `@emph`, `@slow`, `@q`,
               `@soft`, `@fast`, `@calm` (default). Edge returns exact WORD timings -> captions are timed from them (no whisper).
               Token syntax `display{spoken}`: display text is what the caption shows, spoken is what the voice reads (e.g. `token{टोकन}`).
               Unbraced words are spoken as written, so Roman English in a Hinglish line is read as English.
  "elevenlabs" legacy (reels 1-2 only, paid plan needed for more). "kokoro" legacy English.
  "owner"      OPT-IN ONLY: the owner's own cloned voice on ElevenLabs. Use it only when the owner asks ("meri voice use karo") and gives the key
               (ELEVENLABS_API_KEY in env or ai-course/.env, never committed); otherwise every reel stays on Edge. Recipe the owner approved
               (.claude/skills/owner-voice/SKILL.md): voice "Shivam Trainer", eleven_multilingual_v2, NO voice_settings, one request per phrase with
               previous_text/next_text, spec "prime" = an unspoken lead-in for the first phrase, exact word timings and trimming from the character alignment.
               OWNER_VOICE_DRY=1 prints the characters to generate and stops (credits are limited: ask the owner before a big run).
spec.json: scenes, min, tail, total (optional), cues (sfx), caption_mode ("scene" = legacy whisper), voice, tone.
"audio": "v2" = the CLEAN sound (owner decision 2026-10-14, .claude/skills/clean-reel/SKILL.md): the bundled lo-fi bed sits ~15 dB under the voice and ducks -4 dB
while it speaks (no pumping compressor), cue "dip" drops the music for 0.15 s, synthesized SFX at calibrated gains, and voice+bed+sfx normalised together to
-14 LUFS (true peak <= -1 dB). Specs without "audio" keep the old sidechain mix, so older reels re-render exactly as before.
Run: .venv/bin/python scripts/make_reel_audio.py reels/epNNN_rM [hi]"""
import asyncio, hashlib, json, math, os, re, subprocess, sys, time
from pathlib import Path
import numpy as np, soundfile as sf
sys.path.insert(0, str(Path(__file__).resolve().parent))
import make_intro_audio as M   # tts(), whisper_words(), map_chunks(), tokens(), provider()
import hinglish_roman as HR   # Roman Hinglish captions (the voice still reads the Devanagari)
import edge_tts_hosts as EH   # Edge TTS: the new host api.msedgeservices.com first, the legacy host as fallback (the legacy one answers 403 since 2026-10-10)
SR, FPS, SCENE_GAP, END_PAD = M.SR, 30, 0.5, 1.3
ROOT_DIR = Path(__file__).resolve().parent.parent
PAUSE = {"|": 0.3, "||": 0.6, "|||": 1.0}
# tone presets -> (rate, pitch, volume) for the whole phrase (Edge only accepts plain text + these three knobs)
TONES = {"calm": ("-5%", "+0Hz", "+0%"), "hook": ("-2%", "+4Hz", "+6%"), "emph": ("-14%", "+2Hz", "+8%"), "slow": ("-18%", "+0Hz", "+0%"),
         "q": ("-6%", "+3Hz", "+0%"), "soft": ("-10%", "-2Hz", "-3%"), "fast": ("+6%", "+0Hz", "+0%")}
proj = Path(sys.argv[1]); spec = json.loads((proj / "spec.json").read_text(encoding="utf-8"))
PACE = float(spec.get("pace", 1.0))   # speed multiplier on every tone rate (1.0 = old slow reels r03-r09, 1.2 = 2026-10-07 target, ~2.7 spoken words/s); only reels whose spec has "pace" change
SC = spec["scenes"]; MIN = spec["min"]; langs = sys.argv[2:] or list(spec["copy"].keys())
SIL = set(spec.get("silent", []))   # scenes without any voice (footage / intro): they last their "min" seconds and have no copy
ENGINE = spec.get("tts", "edge")

def trim(y, pad=0.04):
    a = np.abs(y) > 0.015; i, j = int(np.argmax(a)), len(a) - int(np.argmax(a[::-1]))
    s = max(0, i - int(pad * SR)); return y[s:j + int(pad * SR)], s / SR

def phrase_caps(toks, wav, lang, dur):
    """whisper-based token times (legacy engines); always inside [0, dur]."""
    try:
        words = M.whisper_words(wav, lang)
        ok = words and len(words) <= 2 * len(toks) + 2 and words[-1][2] <= dur + 0.35
    except Exception: ok = False
    if ok: return M.map_chunks(toks, words, dur)
    w = np.array([max(1, len(sp)) for _, sp in toks], float); b = np.concatenate([[0], np.cumsum(w)]) / w.sum() * dur
    return [(toks[i][0], b[i], b[i + 1]) for i in range(len(toks))]

# ---------------- Edge TTS ----------------
async def _edge(text, voice, rate, pitch, vol):
    return await EH.synth(text, voice, rate, pitch, vol)   # (mp3 bytes, [(word, start, duration)])

def edge_phrase(spoken, tone, base):
    """-> (float32 wav @24k, word boundaries [(text,start,dur)]). Cached on disk by text+tone+voice."""
    rate, pitch, vol = TONES[tone]; voice = spec.get("voice", "hi-IN-SwaraNeural")
    if PACE != 1.0: rate = "%+d%%" % round(((1 + int(rate.rstrip("%")) / 100) * PACE - 1) * 100)   # e.g. calm -5% at pace 1.2 -> +14%
    key = hashlib.md5(f"{voice}|{rate}|{pitch}|{vol}|{spoken}".encode()).hexdigest()[:10]
    wav = base.with_suffix(f".edge.{key}.wav"); js = base.with_suffix(f".edge.{key}.json")
    if not (wav.exists() and js.exists()):
        for attempt in range(4):
            try: audio, words = asyncio.run(_edge(spoken, voice, rate, pitch, vol)); break
            except Exception as e:
                if attempt == 3: raise
                time.sleep(2 + attempt * 2)
        mp3 = wav.with_suffix(".mp3"); mp3.write_bytes(audio)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "1", str(wav)], check=True); mp3.unlink()
        js.write_text(json.dumps(words), encoding="utf-8")
    y, _ = sf.read(wav, dtype="float32"); return y, json.loads(js.read_text(encoding="utf-8"))


# ---------------- ElevenLabs with timestamps (spec "tts": "elevenlabs_ts"): expressive voice, exact word times from the character alignment, no whisper ----------------
EL_TAGS = {"hook": "[excited] ", "emph": "[dramatic] ", "slow": "[serious] ", "q": "[curious] ", "soft": "[softly] "}   # eleven_v3 audio tags per tone preset (calm/fast: none)
def eleven_phrase(spoken, tone, base):
    """-> (float32 wav @24k, [(word, start, dur)]) from ElevenLabs /with-timestamps. Cached on disk; needs ELEVENLABS_API_KEY (env or .env)."""
    import base64, urllib.request, urllib.error
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key and (ROOT_ENV := Path(__file__).resolve().parent.parent / ".env").exists():
        for ln in ROOT_ENV.read_text(encoding="utf-8").splitlines():
            if ln.startswith("ELEVENLABS_API_KEY="): key = ln.split("=", 1)[1].strip().strip("'\"")
    if not key: sys.exit("ELEVENLABS_API_KEY missing (env or .env)")
    voice = spec.get("el_voice", "pNInz6obpgDQGcFmaJgB"); model = spec.get("el_model", "eleven_v3"); stab = float(spec.get("el_stability", 0.0)); tempo = float(spec.get("el_tempo", 1.0))
    tag = EL_TAGS.get(tone, "") if model == "eleven_v3" else ""
    h = hashlib.md5(f"{voice}|{model}|{stab}|{tag}|{spoken}".encode()).hexdigest()[:10]   # tempo is NOT in the key: the paid audio is cached raw, tempo is applied after
    raw = base.with_suffix(f".el.{h}.raw.wav"); js = base.with_suffix(f".el.{h}.json")
    if not (raw.exists() and js.exists()):
        vs = {"stability": stab} if model == "eleven_v3" else {"stability": stab, "similarity_boost": 0.75, "style": float(spec.get("el_style", 0.6)), "use_speaker_boost": True}
        body = json.dumps({"text": tag + spoken, "model_id": model, "voice_settings": vs}).encode()
        req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps", data=body, headers={"xi-api-key": key, "content-type": "application/json"})
        for attempt in range(4):
            try: r = json.load(urllib.request.urlopen(req, timeout=180)); break
            except urllib.error.HTTPError as e:
                if attempt == 3 or e.code in (401, 402, 403): sys.exit(f"ElevenLabs HTTP {e.code}: {e.read()[:300]}")
                time.sleep(2 + attempt * 2)
        mp3 = raw.with_suffix(".mp3"); mp3.write_bytes(base64.b64decode(r["audio_base64"]))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "1", str(raw)], check=True); mp3.unlink()
        al = r["alignment"]; ch, cs, ce = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
        words, cur, ws, we = [], "", None, None
        for c, a_, b_ in list(zip(ch, cs, ce)) + [(" ", 0, 0)]:
            if c.isspace():
                if cur and not (cur.startswith("[") and cur.endswith("]")): words.append((cur, ws, we - ws))
                cur, ws = "", None
            else:
                if ws is None: ws = a_
                cur += c; we = b_
        js.write_text(json.dumps(words), encoding="utf-8")
    words = [(w, st / tempo, du / tempo) for w, st, du in json.loads(js.read_text(encoding="utf-8"))]
    if tempo == 1.0: y, _ = sf.read(raw, dtype="float32"); return y, words
    wav = raw.with_suffix(".tmp.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-filter:a", f"atempo={tempo}", "-ar", str(SR), "-ac", "1", str(wav)], check=True)
    y, _ = sf.read(wav, dtype="float32"); wav.unlink(); return y, words

def edge_caps(toks, words, lead):
    """display tokens -> (text,start,end) from Edge word boundaries (exact), phrase-local, minus trimmed lead."""
    ks = [max(1, len(sp.split())) for _, sp in toks]; n = len(words); tot = sum(ks)
    if n == 0: return []
    cum = np.concatenate([[0], np.cumsum(ks)])
    idx = [int(round(c / tot * n)) for c in cum] if tot != n else [int(c) for c in cum]
    out = []
    for i, (disp, _) in enumerate(toks):
        a, b = idx[i], max(idx[i] + 1, idx[i + 1]); a = min(a, n - 1); b = min(b, n)
        s = words[a][1]; e = words[b - 1][1] + words[b - 1][2]
        out.append((disp, max(0.0, s - lead), max(0.0, e - lead)))
    return out

def clean_mix(voice, sfx, music, d, TOTAL, dips):
    """audio v2: bed ~15 dB under the voice, -4 dB duck while speaking, 0.15 s dips, everything normalised to -14 LUFS. Writes voice.wav, bed.wav, sfx.wav."""
    R44 = 44100; n = int(TOTAL * R44)
    v = np.interp(np.arange(n) / R44, np.arange(len(voice)) / SR, voice).astype("float32")
    mus, _ = sf.read(music, dtype="float32"); mus = mus if mus.ndim == 2 else np.stack([mus, mus], 1)
    bed = np.tile(mus, (int(np.ceil(n / len(mus))), 1))[:n]
    rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-9)
    vr = rms(v[np.abs(v) > 0.02]) if np.any(np.abs(v) > 0.02) else 0.1
    bed *= vr / rms(bed) * 10 ** (-15 / 20)
    hop = int(0.01 * R44); fr = n // hop; r = np.sqrt(np.mean(v[: fr * hop].reshape(fr, hop) ** 2, 1)); on = (r > 0.02).astype(float)
    g = np.zeros(fr); up, dn = np.exp(-1 / 3), np.exp(-1 / 35)   # ~30 ms attack, ~350 ms release
    for i in range(fr): g[i] = on[i] if i == 0 else on[i] + (g[i - 1] - on[i]) * (up if on[i] > g[i - 1] else dn)
    duck = 10 ** (-4 / 20 * np.interp(np.arange(n), np.arange(fr) * hop, g))
    for t in dips:
        i0, i1, rp = int(t * R44), int((t + 0.15) * R44), int(0.015 * R44)
        duck[i0:i1] *= 0.06; duck[max(0, i0 - rp):i0] *= np.linspace(1, 0.06, min(rp, i0)); duck[i1:i1 + rp] *= np.linspace(0.06, 1, len(duck[i1:i1 + rp]))
    bed *= duck[:, None]
    fi, fo = int(0.4 * R44), int(0.6 * R44); bed[:fi] *= np.linspace(0, 1, fi)[:, None]; bed[-fo:] *= np.linspace(1, 0, fo)[:, None]
    sfx = sfx[:n] * (vr / 0.25 * 0.55)
    mix = v[:, None] + bed + sfx[:, None]
    tmp = d / "_mix_measure.wav"; sf.write(tmp, mix, R44)
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(tmp), "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    tmp.unlink(); lufs = float(json.loads(re.findall(r"\{[^{}]*\}", out)[-1])["input_i"])
    k = min(10 ** ((-14 - lufs) / 20), 0.89 / (np.abs(mix).max() + 1e-9))
    sf.write(d / "voice.wav", voice * k, SR); sf.write(d / "bed.wav", (bed * k).astype("float32"), R44); sf.write(d / "sfx.wav", (sfx * k).astype("float32"), R44)
    print(f"audio v2: voice {20 * np.log10(vr):.1f} dBFS rms, mix {lufs:.1f} LUFS -> x{k:.2f} (-14 LUFS)")

# ---------------- owner's ElevenLabs voice (opt-in) ----------------
OWNER_VOICE, OWNER_MODEL = "KgBloOsGmp6r57GIimqQ", "eleven_multilingual_v2"   # "Shivam Trainer"
def owner_text(toks):
    """Hindi in Devanagari, English in Latin (what makes the clone pronounce both): take the Latin form of a braced token (JSON{जेसन} -> JSON, 30{thirty} -> thirty)."""
    return " ".join(sp if re.search(r"[A-Za-z]", sp) else (d if re.search(r"[A-Za-z]", d) else sp) for d, sp in toks)
def owner_key(text, prev, nxt): return hashlib.md5(json.dumps([OWNER_VOICE, OWNER_MODEL, text, prev, nxt], ensure_ascii=False).encode()).hexdigest()[:12]
def owner_phrase(text, prev, nxt, cache_dir):
    """-> (float32 wav @SR trimmed by the alignment, [(word, start, dur)] untrimmed, trim offset)."""
    import base64, urllib.request
    k = owner_key(text, prev, nxt); mp3, js = cache_dir / f"el_{k}.mp3", cache_dir / f"el_{k}.json"
    if not (mp3.exists() and js.exists()):
        key = os.environ.get("ELEVENLABS_API_KEY") or next((l.split("=", 1)[1].strip() for l in (ROOT_DIR / ".env").read_text(encoding="utf-8").splitlines() if l.startswith("ELEVENLABS_API_KEY=")), None)
        if not key: sys.exit("owner voice: set ELEVENLABS_API_KEY (env or ai-course/.env); without it use the Edge default")
        body = {"text": text, "model_id": OWNER_MODEL}
        if prev: body["previous_text"] = prev
        if nxt: body["next_text"] = nxt
        req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{OWNER_VOICE}/with-timestamps?output_format=mp3_44100_128", data=json.dumps(body).encode(),
                                     headers={"xi-api-key": key, "Content-Type": "application/json"})
        r = json.loads(urllib.request.urlopen(req, timeout=120).read()); mp3.write_bytes(base64.b64decode(r["audio_base64"])); js.write_text(json.dumps(r["alignment"], ensure_ascii=False), encoding="utf-8")
    al = json.loads(js.read_text(encoding="utf-8")); words, cur = [], None
    for ch, a, b in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace(): cur = None; continue
        if cur is None: cur = [ch, a, b]; words.append(cur)
        else: cur[0] += ch; cur[2] = b
    words = [(w, a, b - a) for w, a, b in words if re.search(r"\w", w)]
    wav = mp3.with_suffix(".wav")
    if not wav.exists(): subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "1", str(wav)], check=True)
    y, _ = sf.read(wav, dtype="float32"); a = max(0.0, words[0][1] - 0.05); b = min(len(y) / SR, words[-1][1] + words[-1][2] + 0.18)
    return y[int(a * SR):int(b * SR)], words, a

def build(lang):
    os.environ["ELEVENLABS_SPEED"] = str(spec.get("speed", {}).get(lang, "1.0"))
    if ENGINE in ("elevenlabs", "kokoro"): os.environ[f"TTS_PROVIDER_{lang.upper()}"] = ENGINE
    edge = ENGINE in ("edge", "elevenlabs_ts"); owner = ENGINE == "owner"
    d = proj / "audio" / lang; d.mkdir(parents=True, exist_ok=True); scenes = {}; starts = {}; t = 0.0
    if owner:   # every phrase of the reel in order, for previous_text / next_text and the credit count
        flat = [owner_text(M.tokens(re.sub(r"^@\w+\s+", "", ph, flags=re.S))) for sid2 in SC if sid2 not in SIL for ph in re.split(r"\s*\|{1,3}\s*", spec["copy"][lang][sid2])]
        ctx = [(flat[j - 1] if j else spec.get("prime"), flat[j + 1] if j + 1 < len(flat) else None) for j in range(len(flat))]
        todo = [j for j in range(len(flat)) if not (d / f"el_{owner_key(flat[j], *ctx[j])}.mp3").exists()]
        print(f"owner voice: {len(flat)} phrases, {len(todo)} to generate, {sum(len(flat[j]) for j in todo)} characters")
        if os.environ.get("OWNER_VOICE_DRY"): sys.exit(0)
        fi = 0
    for sid in SC:
        if sid in SIL: scenes[sid] = (np.zeros(0, "float32"), [], []); starts[sid] = t; t += MIN[sid]; continue
        parts = re.split(r"\s*(\|{1,3})\s*", spec["copy"][lang][sid]); phrases = [(parts[i], PAUSE[parts[i + 1]] if i + 1 < len(parts) else 0.0) for i in range(0, len(parts), 2)]
        pieces, rel, cur, pw = [], [], 0.0, []
        for k, (txt, gap) in enumerate(phrases):
            pcaps = None
            if edge:
                m = re.match(r"@(\w+)\s+(.*)", txt, re.S); tone, body = (m.group(1), m.group(2)) if m else (spec.get("tone", "calm"), txt)
                toks = M.tokens(body); spoken = " ".join(sp for _, sp in toks)
                # Hinglish: unbraced words are spoken as written, so Roman English is read as English. A {spoken} covers only the word in front of it:
                # "machine learning{मशीन लर्निंग}" is spoken "machine मशीन लर्निंग" (said twice), so a brace with 2+ spoken words after an unbraced English word is flagged.
                dbl = [f"{toks[i-1][0]} {toks[i][0]}{{{toks[i][1]}}}" for i in range(1, len(toks))
                       if toks[i][0] != toks[i][1] and len(toks[i][1].split()) > 1 and toks[i-1][0] == toks[i-1][1] and re.search(r"[A-Za-z]", toks[i-1][1])]
                if dbl:
                    msg = f"scene {sid} phrase {k}: a brace repeats the English word before it: {dbl}. Give each word its own brace (machine{{मशीन}} learning{{लर्निंग}}) or leave the English words unbraced."
                    if "pace" in spec: sys.exit("ERROR " + msg)
                    print("WARNING " + msg)
                y, words = (eleven_phrase if ENGINE == "elevenlabs_ts" else edge_phrase)(spoken, tone, d / f"s{sid}_{k}.wav")
                y = y / max(1e-6, np.abs(y).max()) * 0.9; y, lead = trim(y); pcaps = edge_caps(toks, words, lead); txt = body
            elif owner:
                m = re.match(r"@(\w+)\s+(.*)", txt, re.S); body = m.group(2) if m else txt; toks = M.tokens(body)
                y, words, lead = owner_phrase(flat[fi], *ctx[fi], d); fi += 1
                y = y / max(1e-6, np.abs(y).max()) * 0.9; pcaps = edge_caps(toks, words, lead); txt = body
            else:
                y, _ = M.tts(txt, lang, d / f"s{sid}_{k}.wav"); y, lead = trim(y / max(1e-6, np.abs(y).max()) * 0.9)
            pf = d / f"p{sid}_{k}.wav"; sf.write(pf, y, SR); pw.append((txt, pf, len(y) / SR, pcaps))
            rel.append((cur, cur + len(y) / SR)); pieces += [y, np.zeros(int(gap * SR), "float32")]; cur += len(y) / SR + gap
        y = np.concatenate(pieces); sf.write(d / f"s{sid}.wav", y, SR)
        scenes[sid] = (y, rel, pw); starts[sid] = t; t += max(MIN[sid], cur + 0.08 + SCENE_GAP + spec.get("tail", {}).get(sid, 0))
    last = SC[-1]; TOTAL = float(spec["total"]) if "total" in spec else math.ceil((starts[last] + 0.08 + len(scenes[last][0]) / SR + END_PAD) * 2) / 2
    voice = np.zeros(int(TOTAL * SR), "float32"); caps = []; ph = {}; vdur = {}
    for sid in SC:
        y, rel, pw = scenes[sid]; off = starts[sid] + 0.08; vdur[sid] = len(y) / SR
        end = starts[SC[SC.index(sid) + 1]] if sid != last else TOTAL
        if off + vdur[sid] > end + 0.02: print(f"!! {lang} {sid}: voice ends {off+vdur[sid]:.2f}s > scene end {end:.2f}s")
        i0 = int(off * SR); seg = y[:max(0, len(voice) - i0)]; voice[i0:i0 + len(seg)] += seg
        ph[sid] = [{"s": round(off + a, 3), "e": round(off + b, 3)} for a, b in rel]
        if spec.get("caption_mode") == "scene":   # legacy (reel 1): whisper on the whole scene audio
            full = " ".join(p[0] for p in pw)
            for w, s_, e_ in M.map_chunks(M.tokens(full), M.whisper_words(d / f"s{sid}.wav", lang), vdur[sid]):
                caps.append({"t": w, "s": round(off + s_, 3), "e": round(off + e_, 3), "scene": sid})
        else:
            for (txt, pf, pd, pcaps), (ra, rb) in zip(pw, rel):
                items = pcaps if pcaps is not None else phrase_caps(M.tokens(txt), pf, lang, pd)
                for w, s_, e_ in items:
                    caps.append({"t": w, "s": round(off + ra + max(0, s_), 3), "e": round(off + ra + min(pd, e_), 3), "scene": sid})
    starts["end"] = TOTAL; sf.write(d / "voice.wav", voice, SR)
    hop = SR // FPS; n = int(TOTAL * FPS); rms = np.array([np.sqrt(np.mean(voice[i*hop:(i+1)*hop] ** 2)) for i in range(n)])
    env = np.convolve(np.clip(rms / np.percentile(rms[rms > 0.01], 90), 0, 1), [0.25, 0.5, 0.25], "same")
    V2 = spec.get("audio") == "v2"
    cues = [(n_, (ph[sc][k]["s"] if sc else 0.0) + o) for n_, sc, k, o in spec["cues"]] + [("whoosh", starts[x] - 0.25) for x in SC[1:]]
    gain = {"impact": 0.5, "whoosh": 0.4, "pop": 0.55, "ding": 0.35, "click": 0.6, "thud": 0.55}
    if V2: gain = {"impact": 0.85, "hit": 0.85, "whoosh": 0.42, "click": 0.42, "tick": 0.3, "pop": 0.42, "beep": 0.32, "err": 0.42, "ok": 0.38, "ding": 0.38, "save": 0.5,
                   "lock": 0.55, "unlock": 0.5, "flip": 0.38, "slice": 0.45, "bass": 0.8, "thud": 0.65, "scan": 0.28, "rise": 0.3, "warn": 0.32, "type": 0.3}
    dips = [tt for name, tt in cues if name == "dip"]; cues = [(n_, tt) for n_, tt in cues if n_ != "dip"]
    A = proj / "assets"; sfx = np.zeros(int(TOTAL * 44100), "float32")
    for name, tt in cues:
        x, sr = sf.read(A / f"sfx_{name}.wav", dtype="float32"); x = x.mean(1) * gain[name]; i0 = max(0, int(tt * sr)); seg = x[:len(sfx) - i0]; sfx[i0:i0 + len(seg)] += seg
    if V2: clean_mix(voice, sfx, A / "music.wav", d, TOTAL, dips)
    else:
      sf.write(d / "sfx.wav", sfx, 44100)
      subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "3", "-i", str(A / "music.wav"), "-i", str(d / "voice.wav"), "-filter_complex",
        f"[0:a]volume=0.5,aresample=44100[m];[1:a]aresample=44100[v1];[m][v1]sidechaincompress=threshold=0.015:ratio=10:attack=15:release=450:makeup=1[d];"
        f"[d]afade=t=in:d=0.6,afade=t=out:st={TOTAL-1.2}:d=1.2,atrim=0:{TOTAL}[out]", "-map", "[out]", "-ac", "2", str(d / "bed.wav")], check=True)
    print(lang, ENGINE, "| total", TOTAL, "| scene voice", {k: round(x, 1) for k, x in vdur.items()}, "| starts", {k: round(x, 1) for k, x in starts.items()})
    if spec.get("caption_script", "roman") == "roman": caps = HR.romanize_caps(caps)   # captions show Roman Hinglish; `sp` keeps the Devanagari so M.W finds a word by either form
    return {"total": TOTAL, "starts": {k: round(x, 3) for k, x in starts.items()}, "caps": caps, "ph": ph, "mouth": [round(float(x), 2) for x in env]}

if __name__ == "__main__":
    p = proj / "data.json"; data = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
    for l in langs: data[l] = build(l)
    tf = proj / "trace.json"; data["trace"] = json.loads(tf.read_text(encoding="utf-8")) if tf.exists() else {}
    cf = proj / "code" / "main.py"
    if cf.exists(): data["code"] = cf.read_text(encoding="utf-8"); data["out"] = (proj / "code" / "output.txt").read_text(encoding="utf-8")
    p.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8"); (proj / "data.js").write_text("window.REEL=" + json.dumps(data, ensure_ascii=False) + ";", encoding="utf-8")
