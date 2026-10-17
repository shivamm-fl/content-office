"""Intro voice pipeline: per-scene Kokoro TTS -> voice.wav per language -> Whisper word timing -> intro/data.js.
Run: .venv/bin/python scripts/make_intro_audio.py [en|hi ...]   (Windows: .venv/Scripts/python.exe)"""
import hashlib, json, os, re, shutil, subprocess, sys, urllib.request
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
INTRO = ROOT / "intro"
NPX = shutil.which("npx")
WHISPER = shutil.which("whisper-cli") or shutil.which("whisper-cpp")
MODEL = ROOT / ".models" / "ggml-small.bin"
PY = ROOT / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
# TTS provider: "elevenlabs" (needs ELEVENLABS_API_KEY in env or ai-course/.env) or "kokoro" (free, local, robotic).
def _dotenv():
    f = ROOT / ".env"
    if f.exists():
        for line in f.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1); os.environ.setdefault(k.strip(), v.strip().strip('"'))
_dotenv()
# English stays on Kokoro (user is happy with it); Hindi uses ElevenLabs when a key is present. Override: TTS_PROVIDER_EN / TTS_PROVIDER_HI.
def provider(lang):
    return os.environ.get(f"TTS_PROVIDER_{lang.upper()}") or ("elevenlabs" if lang == "hi" and os.environ.get("ELEVENLABS_API_KEY") else "kokoro")
EL_VOICE = {"en": os.environ.get("ELEVENLABS_VOICE_EN", "pNInz6obpgDQGcFmaJgB"),   # Adam (default; any voice works with multilingual_v2)
            "hi": os.environ.get("ELEVENLABS_VOICE_HI", "EXAVITQu4vr4xnSDxMaL")}   # Sarah (premade: free plan can not use library voices via API)
EL_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")
SR, FPS, TOTAL = 24000, 30, 30.0
# scene id, start, slot end (voice must fit inside), voice offset
SCENES = [("A", 0.0, 3.0), ("B", 3.0, 8.0), ("C", 8.0, 16.0), ("D", 16.0, 24.0), ("E", 24.0, 30.0)]
VOICE = {"en": ("af_heart", None, 0.95), "hi": ("hf_alpha", "hi", 1.0)}
# token syntax: display or display{spoken}. spoken defaults to display.
COPY = {
 "en": {
  "A": "AI is everywhere. Do you actually understand it?",
  "B": "Most courses are boring theory. Or copy-paste code you never understand.",
  "C": "Here, it's different. Theory, plus hands-on code. Every concept, built live, in under five minutes.",
  "D": "Watch. A few lines of Python, and the model figures out what \"it\" means.",
  "E": "I'm building the AI Engineer Roadmap. Learn AI by building it. Follow, and start today.",
 },
 "hi": {
  "A": "AI{ए आई} हर जगह है। क्या समझते हैं?",
  "B": "ज़्यादातर{ज्यादातर} कोर्स बोरिंग theory{थ्योरी} हैं, या copy-paste{कॉपी पेस्ट} code{कोड}।",
  "C": "यहाँ बात अलग है। Theory{थ्योरी} के साथ hands-on{हैंड्स ऑन} code{कोड}। हर concept{कॉन्सेप्ट}, पाँच मिनट से कम में, live{लाइव}।",
  "D": "देखिए। बस कुछ लाइन का Python{पाइथन} code{कोड}, और model{मॉडल} समझ जाता है कि \"it\"{इट} का मतलब क्या है।",
  "E": "हम बना रहे हैं AI{ए आई} Engineer{इंजीनियर} Roadmap{रोडमैप}। Learn{लर्न} AI{ए आई} by{बाय} building{बिल्डिंग} it{इट}। Follow{फॉलो} कीजिए।",
 },
}
TOK = re.compile(r"(\S+?)\{([^}]*)\}(\S*)|(\S+)")

def tokens(s):
    out = []
    for m in TOK.finditer(s):
        d, sp = (m.group(1) + m.group(3), m.group(2) + m.group(3)) if m.group(1) else (m.group(4), m.group(4))
        out.append((d, sp))
    return out

def eleven(text, lang, dest):
    key = os.environ["ELEVENLABS_API_KEY"]
    body = json.dumps({"text": text, "model_id": EL_MODEL, "voice_settings": {"stability": float(os.environ.get("ELEVENLABS_STABILITY", "0.5")), "similarity_boost": 0.75, "style": float(os.environ.get("ELEVENLABS_STYLE", "0.1")), "use_speaker_boost": False, "speed": float(os.environ.get("ELEVENLABS_SPEED", "1.1"))}}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{EL_VOICE[lang]}?output_format=mp3_44100_128", data=body,
                                 headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    mp3 = dest.with_suffix(".mp3"); mp3.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "1", str(dest)], check=True); mp3.unlink()

def tts(text, lang, out):
    voice, hlang, speed = VOICE[lang]
    key = hashlib.md5(f"{provider(lang)}|{os.environ.get("ELEVENLABS_SPEED")}|{EL_VOICE[lang] if provider(lang)=='elevenlabs' else voice}|{EL_MODEL}|{hlang}|{speed}|{text}".encode()).hexdigest()[:10]
    cache = out.with_suffix(f".{key}.wav")
    if not cache.exists() and provider(lang) == "elevenlabs": eleven(text, lang, cache)
    if not cache.exists():
        txt = out.with_suffix(".txt"); txt.write_text(text, encoding="utf-8")
        cmd = [NPX, "hyperframes", "tts", str(txt), "--voice", voice, "--speed", str(speed), "--output", str(cache)]
        if hlang: cmd += ["--lang", hlang]
        subprocess.run(cmd, check=True, env={**os.environ, "HYPERFRAMES_PYTHON": str(PY)}, stdout=subprocess.DEVNULL)
    shutil.copy(cache, out)
    return sf.read(out, dtype="float32")

def whisper_words(wav, lang):
    tmp = wav.with_suffix(".16k.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-ar", "16000", "-ac", "1", str(tmp)], check=True)
    base = wav.with_suffix(".w")
    subprocess.run([WHISPER, "-m", str(MODEL), "-l", lang, "-ml", "1", "-sow", "-oj", "-of", str(base), "-f", str(tmp)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # whisper -ml 1 can split a multi-byte Devanagari char across tokens -> rejoin at byte level, decode per word
    d = json.loads(Path(str(base) + ".json").read_bytes().decode("latin-1"))
    words = []
    for t in d["transcription"]:
        raw = t["text"].encode("latin-1")
        if not raw.strip() or raw.strip().startswith(b"["): continue
        s0, e0 = t["offsets"]["from"] / 1000, t["offsets"]["to"] / 1000
        if raw.startswith(b" ") or not words: words.append([raw.strip(), s0, e0])
        else: words[-1][0] += raw; words[-1][2] = e0
    words = [[w.decode("utf-8", "ignore"), s0, e0] for w, s0, e0 in words if w.decode("utf-8", "ignore").strip()]
    tmp.unlink(); Path(str(base) + ".json").unlink()
    return words

def map_chunks(toks, words, dur):
    """Assign each display token a [start,end] using Whisper word boundaries (real timings)."""
    n, m = len(words), len(toks)
    starts = [w[1] for w in words]; ends = [w[2] for w in words]
    speech_end = min(dur, ends[-1])
    if n == m: b = starts + [speech_end]
    else:  # time-proportional over the speech span (pause bonus after punctuation), snapped to nearby real Whisper word starts
        weights = np.array([max(1, len(sp.replace(" ", ""))) + (4 if re.search(r"[.,?!।]$", sp) else 0) for _, sp in toks], float)
        cum = np.concatenate([[0], np.cumsum(weights)]) / weights.sum()
        t0 = starts[0]; b = [t0 + f * (speech_end - t0) for f in cum]
        for i in range(1, m):
            near = min(starts, key=lambda x: abs(x - b[i]))
            if abs(near - b[i]) < 0.18 and near > b[i - 1] + 0.08: b[i] = near
            if b[i] <= b[i - 1]: b[i] = b[i - 1] + 0.1
    b[-1] = max(b[-1], b[-2] + 0.15) if len(b) > 1 else b[-1]
    return [(toks[i][0], round(b[i], 3), round(b[i + 1], 3)) for i in range(m)]

def build(lang):
    d = INTRO / "audio" / lang; d.mkdir(parents=True, exist_ok=True)
    voice = np.zeros(int(TOTAL * SR), "float32"); caps = []; report = []
    for sid, start, end in SCENES:
        toks = tokens(COPY[lang][sid])
        # ElevenLabs reads Hinglish natively (Latin words fine); Kokoro needs phonetic Devanagari.
        spoken = " ".join((d if provider(lang) == "elevenlabs" else sp) for d, sp in toks)
        wav = d / f"s{sid}.wav"
        y, sr = tts(spoken, lang, wav); assert sr == SR
        y = y / max(1e-6, np.abs(y).max()) * 0.9
        # trim leading silence so the voice hits at scene start (+0.05)
        lead = int(np.argmax(np.abs(y) > 0.02)); y = y[max(0, lead - int(0.03 * SR)):]
        dur = len(y) / SR; off = start + 0.05
        if off + dur > end + 0.02: print(f"!! {lang} scene {sid}: voice {dur:.2f}s > slot {end-start-0.05:.2f}s -> REWORD"); 
        i0 = int(off * SR); voice[i0:i0 + len(y)] += y[:len(voice) - i0]
        sf.write(wav, y, SR)
        words = whisper_words(wav, "hi" if lang == "hi" else "en")
        for w, s, e in map_chunks(toks, words, dur):
            caps.append({"t": w, "s": round(off + s, 3), "e": round(off + e, 3), "scene": sid})
        report.append((sid, round(dur, 2), round(end - start - 0.05, 2), len(words), len(toks)))
    sf.write(d / "voice.wav", voice, SR)
    # mouth envelope @30fps from RMS
    hop = SR // FPS; n = int(TOTAL * FPS)
    rms = np.array([np.sqrt(np.mean(voice[i*hop:(i+1)*hop] ** 2)) for i in range(n)])
    env = np.clip(rms / (np.percentile(rms[rms > 0.01], 90) if (rms > 0.01).any() else 1), 0, 1)
    env = np.convolve(env, [0.25, 0.5, 0.25], "same")
    print(lang, "scene(dur, slot, whisperWords, displayTokens):", report)
    return caps, [round(float(v), 2) for v in env]

if __name__ == "__main__":
    langs = sys.argv[1:] or ["en", "hi"]
    print("TTS providers:", {l: provider(l) for l in langs})
    if "elevenlabs" in [provider(l) for l in langs] and not os.environ.get("ELEVENLABS_API_KEY"): sys.exit("Set ELEVENLABS_API_KEY (env or ai-course/.env)")
    data = {"caps": {}, "mouth": {}}
    p = INTRO / "data.json"
    if p.exists(): data = json.loads(p.read_text(encoding="utf-8"))
    for l in langs: data["caps"][l], data["mouth"][l] = build(l)
    data["code"] = (INTRO / "code" / "demo_short.py").read_text(encoding="utf-8")  # on-screen code == executed file
    data["out"] = (INTRO / "code" / "demo_short.out.txt").read_text(encoding="utf-8")  # real output
    p.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    (INTRO / "data.js").write_text("window.INTRO_DATA=" + json.dumps(data, ensure_ascii=False) + ";", encoding="utf-8")
