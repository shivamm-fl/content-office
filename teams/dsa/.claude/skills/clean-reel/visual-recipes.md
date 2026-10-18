# Visual recipes: show the process with real objects (owner-approved 2026-10-15)

Why: the owner rated the interview reels' visuals far above our automated ones because every beat showed the actual thing — a support chat that answers wrong, the policy line that contradicts it, the database row still ACTIVE, the JSON with the missing comma — and the state changed on the spoken word. Our older builds drew labelled rectangles ("STEP 1", "MODEL", "OUTPUT"), which explain nothing on mute.

## Principles
1. **Draw the artifact, with realistic content.** A chat bubble with the bot's sentence, a policy card with `Refund window: 7 days`, a DB row `order #4521 · ACTIVE`, a code card with the bug. Invented values carry an EXAMPLE pill when they look like facts.
2. **One state change per spoken word.** ✓ flips to ✗ on "सात", ACTIVE turns red on "active", the caret lands on "comma". Never animate things nobody is talking about.
3. **Keep the proof object on screen** while the voice explains it; add the verdict next to it (a stamp), don't replace it with text.
4. **Contradiction = a visual flip,** not a sentence: green → red, ✓ → ✗, a bar that refills the other way.
5. **Mechanisms as named, ordered parts** (a pipeline, a state machine, a ranked list with a cutoff), each lighting on its word. A box earns its place only with an icon, a real label and a reason to change.
6. **Colour has one meaning each:** red wrong, green right, gold the brand/key value, cyan neutral system parts. Clean style: no glows, no flicker.
7. **Hook frame = an everyday object** (chat, app screen, ticket, receipt), readable on mute; the last 0.42 s repeat it so the reel loops.

## Helpers (paste once after `Viz.install(M)`)
Put `// diagram: <scene letter>` above each custom picture so `lint_visuals.py` counts it. Seek-safe rules of `docs-notes/diagram-first-visuals.md` apply.
```js
const { tl } = M; const at = (sc, w, n) => M.W(sc, w, n);
const panel = (host, x, y, w, h, col, label) => { const d = M.mk("glass", host); d.style.cssText += `;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-color:${M.ca(col, 0.45)}`;
  if (label) { const l = M.mk("lab", d, label); l.style.cssText += `;left:26px;top:20px;font-size:21px;color:${col};text-align:left`; } return d; };
const el = (host, css, html) => { const d = M.mk("abs", host); d.style.cssText += ";" + css; if (html != null) d.innerHTML = html; return d; };
const show = (d, t, from) => { tl.set(d, { opacity: 0 }, 0); tl.fromTo(d, from || { opacity: 0, y: 24 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t); return d; };
const stamp = (host, txt, x, y, col, t) => { const d = el(host, `left:${x}px;top:${y}px;padding:14px 30px;border:2.5px solid ${col};border-radius:12px;background:rgba(14,18,30,.95);font:700 48px var(--code);color:${col};white-space:nowrap;box-shadow:0 20px 50px rgba(0,0,0,.5)`, txt);
  gsap.set(d, { xPercent: -50 }); return show(d, t, { opacity: 0, scale: 1.08 }); };
```

## 1. Chat that answers wrong (hook stake, frame 0)
```js
const chat = panel(A, 150, 420, 780, 480, M.CYAN, "SUPPORT CHAT");
el(chat, "right:36px;top:110px;padding:22px 30px;border-radius:28px 28px 6px 28px;background:#26324A;font:600 42px var(--lat);white-space:nowrap", "refund kab milega?");
const dots = show(el(chat, `left:36px;top:250px;padding:22px 34px;border-radius:28px 28px 28px 6px;border:1.5px solid ${M.ca(M.CYAN, .6)};font:700 44px var(--lat);color:${M.CYAN}`, "• • •"), 0.3, { opacity: 0 });
tl.to(dots, { opacity: 0, duration: 0.1 }, at("A", "refund") - 0.12);
const bot = show(el(chat, `left:36px;top:250px;padding:22px 30px;border-radius:28px 28px 28px 6px;background:${M.ca(M.CYAN, .14)};border:1.5px solid ${M.ca(M.CYAN, .6)};font:600 44px var(--lat);white-space:nowrap`,
  'Refund <b style="color:#5BC0EB">30 din</b> mein milega <span class="ok" style="color:#4CC38A">✓</span><span class="no" style="color:#E8596B;margin-left:-.62em;opacity:0">✗</span>'), at("A", "refund") - 0.12);
// on the contradiction word:
const flip = at("A", "saat"); tl.set(bot.querySelector(".ok"), { opacity: 0 }, flip); tl.set(bot.querySelector(".no"), { opacity: 1 }, flip);
tl.to(bot, { borderColor: M.ca(M.HOT, .9), backgroundColor: M.ca(M.HOT, .12), duration: 0.2 }, flip);
```

## 2. The source of truth, one line highlighted
```js
const pol = show(panel(A, 210, 930, 660, 190, M.ACC, "POLICY.PDF"), at("A", "policy") - 0.1);
const hl = el(pol, `left:22px;top:74px;width:600px;height:70px;border-radius:8px;background:${M.ca(M.ACC, 0)}`);
el(pol, "left:36px;top:84px;font:700 46px var(--code);white-space:nowrap", 'Refund window: <span style="color:#A78BFA">7 days</span>');
tl.to(hl, { backgroundColor: M.ca(M.ACC, .2), duration: 0.25 }, at("A", "saat"));
```

## 3. A record that contradicts the claim
```js
const db = show(panel(B, 210, 930, 660, 190, M.CYAN, "DATABASE · ORDERS"), at("B", "database"));
el(db, "left:36px;top:84px;font:700 46px var(--code)", 'order #4521 · <span class="st">ACTIVE</span>');
tl.to(db.querySelector(".st"), { color: M.HOT, duration: 0.2 }, at("B", "active"));
stamp(B, "TASK NOT DONE", 540, 775, M.HOT, at("B", "nahi"));
```

## 4. The bug inside the output
```js
const out = panel(C, 150, 420, 780, 420, M.GOOD, "MODEL OUTPUT");
const lines = ["{", '  "name": "Asha"', '  "qty": 2', "}"].map((t, i) => el(out, `left:50px;top:${110 + i * 70}px;font:600 46px var(--code);white-space:pre`, t));
show(el(out, `left:452px;top:210px;font:800 58px var(--code);color:${M.HOT}`, "^"), at("C", "comma"), { opacity: 0, scale: 0.6 });
tl.to(lines[1], { color: "#FF8A9C", duration: 0.2 }, at("C", "comma"));
```

## 5. Numbered open loop (end of the hook)
```js
[0, 1, 2].forEach((k) => M.pill(A, `${k + 1} ?`, at("A", "teen") + k * 0.12, { x: 260 + k * 200, y: 1185, kind: "out", size: 34 }));
```

## 6. A metaphor drawn, not named (library shelf → 3 books picked)
```js
const shelf = panel(B, 80, 370, 920, 580, M.CYAN, "LIBRARY // VECTOR INDEX"); const spines = [];
[590, 760, 925].forEach((base) => { for (let x = 120, i = 0; x < 920; i++) { const w = 34 + (i * 7) % 26, h = 108 + (i * 13) % 44;
  spines.push(show(el(B, `left:${x}px;top:${base - h}px;width:${w}px;height:${h}px;border-radius:6px;border:2px solid ${M.ca(M.CYAN, .55)};background:${M.ca(M.CYAN, .12)}`), at("B", "library") + spines.length * 0.012)); x += w + 8; } });
[spines[4], spines[30], spines[44]].forEach((s, k) => tl.to(s, { backgroundColor: M.ca(M.CYAN, .85), borderColor: "#fff", duration: 0.15 }, at("B", "teen") + k * 0.13));
```

## 7. Cut through the middle of meaning (chunking)
Two cards that touch (`border-bottom-*-radius:0` / `border-top-*-radius:0`), the definition split across the seam (`Refund window: 7 days` | `from delivery date.`). On "chunking" a 6 px light line scales in along the seam (`scaleX 0 → 1`, `transform-origin: 0 50%`), then the cards move 40 px apart; on "aadha" the second card dims and a stamp `INCOMPLETE CONTEXT` lands on the seam.

## 8. Ranked list with a cutoff (the answer is below the line)
Six rows (`#1` … `#6`, a skeleton title, a score bar and `0.91 … 0.84`), rows 1–5 turn gold on "top five", a dashed red line with `TOP-K = 5 · CUTOFF` sits above row 6; on "sixth" row 6 turns green with an `ANSWER` pill and the camera pushes in on it (`M.cam(t, { s: 1.08 })`, restore before the next scene).

## 9. A gate before the sink
An invalid card slides toward a database icon; a striped boom barrier (`background: repeating-linear-gradient(90deg, #E8596B 0 50px, #fff 50px 100px)`, `transform-origin: 0 50%`, rotation −80° → 0° with `bounce.out`) closes in front of it, the card bounces back, stamp `DON'T WRITE TO DB`. For "allow only after validation": a lock icon turns into an unlock icon and the arrow to NEXT ACTION draws.

## 10. A state machine, not a list
PARSE → VALIDATE, then `OK ✓` to the right and a red `FAIL` that branches to RETRY and FALLBACK; RETRY has a dashed loop arrow back to PARSE with a `MAX 2` pill. Each node pops on its word; the branch lines draw on "failure".

## 11. Close: comment + follow (never a save line)
```js
const cc = panel(E, 120, 330, 840, 600, M.CYAN, "COMMENT KARO"); show(cc, M.P("E", 0));
[["1 · QUERY", "1"], ["2 · CHUNKS", "2"], ["3 · RANKING", "3"]].forEach(([lab, w], i) => M.pill(cc, lab, at("E", w), { x: 290, y: 240 + i * 80, kind: "out", size: 30 }));
show(el(cc, "left:40px;right:40px;bottom:36px;height:76px;border-radius:38px;border:1.5px solid rgba(150,175,215,.35);font:500 30px var(--code);color:#8592AD;display:flex;align-items:center;padding:0 30px", "Add a comment..."), M.P("E", 0) + 0.4, { opacity: 0 });
const fb = M.pill(E, "+  FOLLOW", at("E", "follow") - 0.4, { x: 400, y: 1035, kind: "acc", size: 36 });
tl.fromTo(fb, { scale: 1 }, { scale: 0.92, duration: 0.12, yoyo: true, repeat: 1, immediateRender: false }, at("E", "follow"));
```

## 12. Loop end
Build the hook's frame-0 layout in a function, call it for scene A and again in a last scene that starts at `M.TOT - 0.42`, so the final frame equals frame 0.

## Picking the picture
| The idea is about | Draw |
|---|---|
| a wrong answer / hallucination | 1 + 2 (claim vs source) + stamp |
| an action that "succeeded" but didn't | 1 + 3 (agent says done, record disagrees) |
| broken structured output | 4 (+ 9 to stop it) |
| retrieval / search quality | 6, 7, 8 |
| a production process / guardrails | 10, 9, a pipeline of named stages |
| a setting that does less than people think | a gauge or probability bars beside the output that still fails (temperature 0 → app crash) |
