/* Kit.init({order:["A","B",...], chip:"DSA · DAY 3"}) -> helpers; call K.finish() LAST (adds captions + mascot, registers the timeline).
   Scenes are <div class="scene" id="sA">..</div> in index.html. All content timings come from data.js (window.REEL.hi): starts S, phrase windows PH, word captions.
   HOOK (mandatory for every reel from 2026-10-07): K.hook(["AI को फ़र्क", "कैसे पता?"]) puts the viewer's question on screen as huge text from FRAME 0 (no fade-in delay),
   in sync with the spoken hook, <= 6 words, plain Hindi, NO series jargon. It leaves at `until` (default: end of the first voice phrase, >= 2.6 s) and returns that time:
   scene A's own visuals must not appear before it. */
window.Kit = (function () {
  const ACC = "#A78BFA", WHITE = "#F3EFE6", BAD = "#E5735F", GOOD = "#7BD389";
  const $ = (s) => document.querySelector(s);
  const mk = (cls, parent, txt) => { const d = document.createElement("div"); d.className = cls; if (txt !== undefined) d.textContent = txt; if (parent) parent.appendChild(d); return d; };
  function init(opts) {
    const R = window.REEL, DL = R.hi, S = DL.starts, PH = DL.ph, TOT = DL.total, order = opts.order;
    document.documentElement.setAttribute("data-lang", "hi");
    $("#chiptxt").textContent = opts.chip || "DSA";
    const tl = gsap.timeline({ paused: true });
    tl.fromTo("#grid", { y: 0 }, { y: -160, duration: TOT, ease: "none" }, 0);
    tl.fromTo("#orb1", { x: 0, y: 0 }, { x: 160, y: 260, duration: TOT, ease: "sine.inOut" }, 0);
    tl.fromTo("#orb2", { x: 0, y: 0 }, { x: -140, y: -300, duration: TOT, ease: "sine.inOut" }, 0);
    tl.fromTo("#progfill", { scaleX: 0 }, { scaleX: 1, duration: TOT, ease: "none" }, 0);
    tl.fromTo("#chipdot", { scale: 1 }, { scale: 1.6, duration: 0.5, ease: "sine.inOut", repeat: Math.floor(TOT / 0.5) - 2, yoyo: true }, 0);
    tl.set("#wipe", { x: -140 }, 0);
    order.forEach((sc, i) => {
      const t0 = S[sc], t1 = i < order.length - 1 ? S[order[i + 1]] : TOT, el = "#s" + sc;
      tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, t0);
      if (i < order.length - 1) { tl.to(el, { opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in" }, t1 - 0.22);
        tl.fromTo("#wipe", { x: -140 }, { x: 1220, duration: 0.42, ease: "power3.inOut", immediateRender: false }, t1 - 0.3); }
    });
    const K = { tl, S, PH, TOT, DL, ACC, WHITE, BAD, GOOD, $, mk, order,
      P: (sc, k) => PH[sc][k].s, Ed: (sc, k) => PH[sc][k].e,
      txt: (sel, s) => { $(sel).textContent = s; },
      hook: (lines, o) => { o = o || {}; const el = mk("hookline", $("#root")); lines = Array.isArray(lines) ? lines : [lines];
        lines.forEach((l, i) => { const sp = mk(i === lines.length - 1 && lines.length > 1 ? "g" : "w", el, l); sp.style.display = "block"; });
        if (o.size) el.style.fontSize = o.size + "px"; const until = o.until || Math.max(2.6, PH[order[0]][0].e + 0.25);
        tl.fromTo(el, { opacity: 1, scale: 0.94, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" }, 0);
        tl.to(el, { opacity: 0, y: -24, duration: 0.25, ease: "power2.in", immediateRender: false }, until); return until; },
      pop: (sel, t, d) => tl.fromTo(sel, { opacity: 0, y: 30, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: d || 0.3, ease: "back.out(1.8)" }, t),
      fade: (sel, t, d) => tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: d || 0.35 }, t),
      // opacity change in ~0 time so contrast audits never sample a half-visible accent chip
      show: (sel, t) => tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: 0.001 }, t),
      hide: (sel, t, d) => tl.to(sel, { opacity: 0, duration: d || 0.25, immediateRender: false }, t),
      /* legend: [["किताब","token"],...] appears row by row at times[] */
      legend: (parent, pairs) => { const L = mk("legend", parent); return pairs.map(([a, b]) => { const r = mk("row", L); mk("a", r, a); mk("eq", r, "="); mk("b", r, b); return r; }).concat([L]); },
      finish: () => {
        // captions: one line per group of <=3 short words; hard-hidden before the next line; kit rule: never overlap
        const caps = DL.caps, capsEl = $("#caps"), lines = [];
        order.forEach((sc) => { const ws = caps.filter((c) => c.scene === sc); let cur = [], len = 0, groups = [];
          ws.forEach((w) => { cur.push(w); len += w.t.length + 1; if ((/[.?!।,:]$/.test(w.t) && w.e - cur[0].s >= 0.5) || cur.length >= 3 || len >= 16) { groups.push(cur); cur = []; len = 0; } });
          if (cur.length) groups.push(cur);
          groups.forEach((g, gi) => { const el = mk("capline"); const spans = g.map((w) => { const s = document.createElement("span"); s.className = "cw"; s.textContent = w.t; el.appendChild(s); return s; });
            capsEl.appendChild(el); const nxt = groups[gi + 1] ? groups[gi + 1][0].s : g[g.length - 1].e + 0.15;
            lines.push({ el, spans, g, t0: g[0].s, t1: Math.max(g[0].s + 0.25, groups[gi + 1] ? nxt - 0.06 : g[g.length - 1].e + 0.15) }); }); });
        lines.forEach((cl) => {
          tl.fromTo(cl.el, { opacity: 0, y: 26, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power3.out" }, Math.max(0, cl.t0 - 0.04));
          cl.g.forEach((w, i) => { const sp = cl.spans[i];
            tl.fromTo(sp, { color: WHITE, scale: 1 }, { color: ACC, scale: 1.16, duration: 0.09, ease: "back.out(2)" }, w.s);
            tl.to(sp, { color: WHITE, scale: 1, duration: 0.12 }, Math.max(w.s + 0.1, w.e)); });
          tl.set(cl.el, { opacity: 0 }, cl.t1); });
        // mascot: float, blink, mouth follows the voice energy
        const env = DL.mouth;
        tl.fromTo("#bit", { y: 0 }, { y: -12, duration: 0.6, ease: "sine.inOut", repeat: Math.floor(TOT / 0.6) - 2, yoyo: true }, 0);
        for (let t = 1.7; t < TOT - 1; t += 2.4) tl.fromTo("#eyeL,#eyeR", { scaleY: 1 }, { scaleY: 0.08, transformOrigin: "50% 50%", duration: 0.07, repeat: 1, yoyo: true, immediateRender: false }, t);
        tl.fromTo("#mascot", { rotation: 0 }, { rotation: 4, duration: 0.7, ease: "sine.inOut", repeat: Math.floor(TOT / 0.7) - 2, yoyo: true }, 0);
        const px = { t: 0 };
        tl.to(px, { t: TOT, duration: TOT, ease: "none", onUpdate: () => { const i = Math.min(env.length - 1, Math.max(0, Math.round(px.t * 30)));
          gsap.set("#mouth", { scaleY: 0.18 + env[i] * 1.5, scaleX: 1 - env[i] * 0.15, svgOrigin: "150 180" }); } }, 0);
      } };
    return K;
  }
  return { init, ACC, WHITE, BAD, GOOD, mk, $ };
})();
