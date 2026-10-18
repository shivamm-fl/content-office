"""Generate the bundled CLEAN-style audio assets (owner decision 2026-10-14, .claude/skills/clean-reel/SKILL.md): a seamless 32-bar lo-fi ambient synth bed
(Dm9 - Bbmaj7 - Fmaj7 - Cadd9, 84 BPM: pad, sub bass, swung hats, pluck arp with ping-pong delay, vinyl hiss) and the synthesized SFX set.
Everything is synthesized here (no samples, no licensed music), so rule 11 holds: the pipeline only ever uses these bundled files.
One-off tool, needs scipy:  <python with numpy soundfile scipy> scripts/gen_audio_assets.py [out_dir=reels/_template/assets]"""
import sys
from pathlib import Path
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve, sawtooth

SR = 44100
rng = np.random.default_rng(1234)


def bp(x, lo=None, hi=None, order=2):
    if lo and hi: sos = butter(order, [lo, hi], "bandpass", fs=SR, output="sos")
    elif lo: sos = butter(order, lo, "highpass", fs=SR, output="sos")
    else: sos = butter(order, hi, "lowpass", fs=SR, output="sos")
    return sosfilt(sos, x, axis=0)


def tt(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def sweep(f0, f1, d, kind="exp"):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d) if kind == "exp" else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def crush(x, bits=5): q = 2 ** bits; return np.round(x * q) / q
def norm(x, p=1.0): return x / (np.abs(x).max() + 1e-9) * p


# ---------------- SFX ----------------
def s_hit():
    t = tt(0.7); f = 45 + 120 * np.exp(-t / 0.03)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.3)
    nz = bp(noise(0.7), lo=2500) * np.exp(-t / 0.018) * 0.7
    blip = crush(np.sign(np.sin(2 * np.pi * 1700 * t)) * np.exp(-t / 0.02), 4) * 0.22
    zap = sweep(3200, 300, 0.7) * np.exp(-t / 0.05) * 0.35
    return np.tanh(1.6 * (sub + nz + blip + zap))
def s_whoosh():
    d = 0.6; t = tt(d); n = noise(d)
    lo, mid, hi = bp(n, 200, 700), bp(n, 700, 2500), bp(n, 2500, 8000)
    x = t / d; a, b, c = np.clip(1 - x * 2, 0, 1), np.clip(1 - abs(x - 0.55) * 2.5, 0, 1), np.clip((x - 0.4) * 2, 0, 1)
    env = np.clip(x / 0.7, 0, 1) ** 2 * np.clip((1 - x) / 0.3, 0, 1)
    return (lo * a + mid * b * 1.2 + hi * c * 0.8) * env * 2.2
def s_click():
    t = tt(0.06); return np.sin(2 * np.pi * 2400 * t) * np.exp(-t / 0.006) + 0.4 * np.sin(2 * np.pi * 1200 * t) * np.exp(-t / 0.012) + bp(noise(0.06), lo=4000) * np.exp(-t / 0.002) * 0.6
def s_tick():
    t = tt(0.04); return np.sin(2 * np.pi * 4200 * t) * np.exp(-t / 0.004) + 0.5 * np.sin(2 * np.pi * 2100 * t) * np.exp(-t / 0.006)
def s_pop():
    t = tt(0.15); f = 480 + 520 * np.clip(t / 0.03, 0, 1)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR); return (s + 0.3 * np.sin(2 * np.pi * np.cumsum(2 * f) / SR)) * np.exp(-t / 0.045)
def s_beep():
    t = tt(0.26); env = np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.09)
    return (np.sin(2 * np.pi * 880 * t + 0.3 * np.sin(2 * np.pi * 7 * t)) + 0.2 * np.sin(2 * np.pi * 1760 * t)) * env
def s_err():
    out = []
    for f in (330, 247):
        t = tt(0.13); x = bp(np.sign(np.sin(2 * np.pi * f * t)) * 0.6 + np.sin(2 * np.pi * f * t), hi=1800) * np.clip(t / 0.005, 0, 1) * np.clip((0.13 - t) / 0.02, 0, 1)
        out += [x, np.zeros(int(0.035 * SR))]
    return np.concatenate(out)
def bell(f, d=0.6, tau=0.18):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / 0.08) + 0.15 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.05)) * np.exp(-t / tau) * np.clip(t / 0.003, 0, 1)
def seq(parts, d):
    out = np.zeros(int(d * SR))
    for off, x in parts: i = int(off * SR); out[i:i + len(x)] += x[:len(out) - i]
    return out
def s_ok(): return seq([(0, bell(1046.5)), (0.075, bell(1568, 0.7, 0.22))], 0.8)
def s_save(): return seq([(0, bell(1046.5)), (0.06, bell(1318.5)), (0.12, bell(1568)), (0.18, bell(2093, 0.9, 0.35))], 1.1) + seq([(0.15, bp(noise(0.6), lo=7000) * np.exp(-tt(0.6) / 0.2) * 0.25)], 1.1)
def s_lock():
    t = tt(0.3); cl = lambda: bp(noise(0.01), 2500, 7000) * np.exp(-tt(0.01) / 0.002) * 2
    thunk = np.sin(2 * np.pi * np.cumsum(70 + 80 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.06)
    return seq([(0, cl()), (0.055, cl() * 0.8)], 0.3) + thunk
def s_flip():
    d = 0.28; t = tt(d); x = bp(noise(d), 900, 6500) * (1 + 0.6 * np.sin(2 * np.pi * 34 * t)); env = np.clip(t / 0.02, 0, 1) * np.exp(-t / 0.08)
    return x * env * 1.4
def s_slice():
    d = 0.35; t = tt(d); return bp(noise(d), lo=3000) * np.exp(-t / 0.05) * 0.8 + sweep(2600, 260, d) * np.exp(-t / 0.08) * 0.7
def s_bass():
    t = tt(1.0); f = 42 + 30 * np.exp(-t / 0.05); return np.tanh(2 * (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.exp(-t / 0.42) * np.clip(t / 0.004, 0, 1))
def s_thud():
    t = tt(0.45); return np.tanh(1.8 * (np.sin(2 * np.pi * np.cumsum(55 + 90 * np.exp(-t / 0.025)) / SR) * np.exp(-t / 0.13) + bp(noise(0.45), hi=900) * np.exp(-t / 0.02) * 0.8))
def s_glitch():
    r = np.random.default_rng(7); parts = []
    for k in range(6):
        d = 0.03; t = tt(d); f = r.uniform(180, 2400)
        x = crush(np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + r.standard_normal(len(t)) * 0.5, 3) * (r.uniform(0.3, 1))
        parts.append((k * 0.033, x * (k % 2 == 0)))
    return seq(parts, 0.22)
def s_scan():
    d = 0.8; t = tt(d); env = np.sin(np.pi * t / d) ** 2
    return (bp(noise(d), 1500, 6000) * 0.5 + sweep(900, 2600, d) * 0.25) * env
def s_rise():
    d = 1.2; t = tt(d); env = (t / d) ** 2 * np.clip((d - t) / 0.05, 0, 1)
    return (bp(noise(d), 400, 5000) * 0.5 + sawtooth(2 * np.pi * np.cumsum(200 * (6 ** (t / d))) / SR) * 0.15) * env
def s_warn():
    parts = []
    for k in range(4):
        f = 680 if k % 2 == 0 else 540; t = tt(0.12)
        parts.append((k * 0.13, sawtooth(2 * np.pi * f * t, 0.5) * np.clip(t / 0.005, 0, 1) * np.clip((0.12 - t) / 0.01, 0, 1)))
    return bp(seq(parts, 0.6), hi=3000)
def s_unlock():
    t = tt(0.4); cl = bp(noise(0.01), 2500, 7000) * np.exp(-tt(0.01) / 0.002) * 2
    return seq([(0, cl)], 0.4) + sweep(500, 1400, 0.4) * np.exp(-t / 0.1) * 0.6
def s_type():
    t = tt(0.03); return bp(noise(0.03), 1500, 6000) * np.exp(-t / 0.004) * 1.5

SFX = {k[2:]: v for k, v in globals().items() if k.startswith("s_")}
GAIN = {"hit": 0.85, "whoosh": 0.42, "click": 0.42, "tick": 0.3, "pop": 0.42, "beep": 0.32, "err": 0.42, "ok": 0.38, "save": 0.5, "lock": 0.55,
        "flip": 0.38, "slice": 0.45, "bass": 0.8, "thud": 0.65, "glitch": 0.35, "scan": 0.28, "rise": 0.3, "warn": 0.32, "unlock": 0.5, "type": 0.3}


# ---------------- music ----------------
def music(total, lifts):
    bpm = 84; beat = 60 / bpm; bar = 4 * beat
    n = int(total * SR) + SR
    L, R = np.zeros(n), np.zeros(n)
    m2f = lambda m: 440 * 2 ** ((m - 69) / 12)
    chords = [([50, 57, 60, 64, 65], 38), ([46, 53, 57, 62, 65], 34), ([53, 57, 60, 64, 67], 41), ([48, 55, 62, 64, 67], 36)]
    nb = int(np.ceil(total / bar)) + 1
    pad = np.zeros((n, 2)); arp = np.zeros((n, 2)); bass = np.zeros(n); drums = np.zeros(n)
    for b in range(nb):
        notes, root = chords[b % 4]; t0 = b * bar; d = bar + 1.4
        if int(t0 * SR) >= n - SR: break
        i0 = int(t0 * SR); t = tt(d); seg = slice(i0, min(n, i0 + len(t))); m = seg.stop - seg.start
        env = np.clip(t / 0.9, 0, 1) * np.clip((d - t) / 1.4, 0, 1)
        for k, mn in enumerate(notes):
            f = m2f(mn)
            for dc, pan in ((-9, 0.15), (0, 0.5), (9, 0.85)):
                ff = f * 2 ** (dc / 1200); v = sawtooth(2 * np.pi * ff * t + k * 1.3 + dc) * env * 0.05
                pad[seg, 0] += v[:m] * (1 - pan); pad[seg, 1] += v[:m] * pan
        # sub bass: beat 1 and the "and" of 3
        for off, ln in ((0, 2.2 * beat), (2.5 * beat, 1.3 * beat)):
            tb = tt(ln); fb = m2f(root); x = (np.sin(2 * np.pi * fb * tb) + 0.25 * np.sin(4 * np.pi * fb * tb)) * np.clip(tb / 0.01, 0, 1) * np.clip((ln - tb) / 0.12, 0, 1) * 0.55
            j = int((t0 + off) * SR); e = min(n, j + len(x))
            if e > j: bass[j:e] += x[:e - j]
        # pluck arp: 8ths over chord tones (2 octaves up)
        pat = [0, 2, 3, 4, 2, 3, 1, 4]
        for s in range(8):
            mn = notes[pat[s] % len(notes)] + 12; ta = tt(0.5); f = m2f(mn)
            x = (np.sin(2 * np.pi * f * ta) + 0.3 * sawtooth(2 * np.pi * f * ta, 0.5)) * np.exp(-ta / 0.16) * np.clip(ta / 0.004, 0, 1) * (0.11 if s % 2 == 0 else 0.07)
            j = int((t0 + s * beat / 2) * SR); pan = 0.3 if s % 2 else 0.7
            e = min(n, j + len(x))
            if e > j: arp[j:e, 0] += x[:e - j] * (1 - pan); arp[j:e, 1] += x[:e - j] * pan
        # drums
        def put(x, tpos, g):
            j = int(tpos * SR); e = min(n, j + len(x))
            if e > j: drums[j:e] += x[:e - j] * g
        tk = tt(0.4); kick = np.sin(2 * np.pi * np.cumsum(48 + 95 * np.exp(-tk / 0.03)) / SR) * np.exp(-tk / 0.2) + bp(noise(0.4), lo=3000) * np.exp(-tk / 0.003) * 0.3
        put(kick, t0, 0.8); put(kick, t0 + 2 * beat, 0.7)
        if b % 2: put(kick, t0 + 2.75 * beat, 0.45)
        ts = tt(0.3); snare = bp(noise(0.3), 1200, 5000) * np.exp(-ts / 0.07) * 0.8 + np.sin(2 * np.pi * 190 * ts) * np.exp(-ts / 0.05) * 0.5
        put(snare, t0 + beat, 0.35); put(snare, t0 + 3 * beat, 0.35)
        th = tt(0.06); hat = bp(noise(0.06), lo=7500) * np.exp(-th / 0.022)
        for s in range(8):
            sw = 0.06 * beat if s % 2 else 0
            put(hat, t0 + s * beat / 2 + sw, 0.28 if s % 2 else 0.18)
    pad = bp(pad, hi=1500)
    lfo = 0.55 + 0.45 * np.sin(2 * np.pi * np.arange(n) / SR / 14.0)
    pad += bp(pad, lo=900) * lfo[:, None] * 0.6
    drums = np.tanh(bp(drums, hi=9000) * 1.4)
    # vinyl: hiss + sparse crackle
    crack = np.zeros(n); idx = rng.integers(0, n, int(total * 9)); crack[idx] = rng.uniform(-1, 1, len(idx)) * 0.5
    vin = bp(crack, lo=1500) * 0.35 + bp(noise(n / SR), 2000, 9000) * 0.012
    # reverb send
    ir_t = tt(2.6); ir = np.stack([rng.standard_normal(len(ir_t)), rng.standard_normal(len(ir_t))], 1) * np.exp(-ir_t / 0.6)[:, None]; ir = bp(ir, hi=6000); ir /= np.abs(ir).sum(0) ** 0.5 * 18
    wet = np.stack([fftconvolve(pad[:, c] * 0.8 + arp[:, c], ir[:, c])[:n] for c in range(2)], 1)
    # arp ping-pong delay (3/8 beat)
    dl = int(0.75 * beat * SR); arpd = arp.copy(); arpd[dl:, 0] += arp[:-dl, 1] * 0.4; arpd[2 * dl:, 1] += arp[:-2 * dl, 0] * 0.25
    # lift: arp + pad brighter after lift cues
    lg = np.ones(n)
    for t0, db in lifts: lg[int(t0 * SR):] = 10 ** (db / 20)
    mix = pad * 0.9 + arpd * 0.75 * lg[:, None] + wet * 0.6 + (bass * 0.75 + drums * 0.55 + vin)[:, None]
    # sidechain pump from kicks (subtle)
    return mix[: int(total * SR)]



def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "reels" / "_template" / "assets")
    bar = 4 * 60 / 84; n_bars = 32; L = n_bars * bar   # 91 s: longer than any reel, so the loop point is never heard
    x = music(L + 2 * bar, [])                      # 2 extra bars carry the reverb/delay tails
    i0 = int(bar * SR); body = x[i0:i0 + int(L * SR)].copy(); tail = x[i0 + int(L * SR):]
    F = int(0.5 * SR); ramp = np.linspace(0, 1, F)[:, None]
    body[:F] = body[:F] * ramp + tail[:F] * (1 - ramp)   # crossfade the end into the start: seamless loop
    body = body / np.abs(body).max() * 0.7
    sf.write(out / "music.wav", body.astype(np.float32), SR, subtype="PCM_16")
    names = {"impact": "hit", "ding": "ok"}           # old file names the pipeline already uses
    for k, fn in SFX.items():
        y = fn(); y = y / (np.abs(y).max() + 1e-9) * 0.9
        for name in [k] + [a for a, b in names.items() if b == k]:
            sf.write(out / f"sfx_{name}.wav", np.stack([y, y], 1).astype(np.float32), SR, subtype="PCM_16")
    print("wrote", out, "music", round(L, 2), "s, sfx:", sorted(SFX))


if __name__ == "__main__":
    main()
