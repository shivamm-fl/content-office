/* MOTION kit, CLEAN style since 2026-10-14 (.claude/skills/clean-reel/SKILL.md): no glow, flicker, glitch, flash, shake or bounce; ring/burst/streaks/flash/shake/glitch are no-ops,
   wipe/glitchCut/zoomCut are a clean push. Captions: words appear as they are spoken; M.finish({kw:{word:"gold|cyan|hot|good|violet|#hex"}}) colours key words.
   (evergreen/news reels) Full-bleed 1080x1920 motion graphics on ONE paused GSAP timeline (seek-safe: no tl.call, no Math.random, no real-time).
   const M = Mo.init({ order:["A","B","C","D","E"], tag:"AI SAMJHO · HINDI" });   // after data.js; scenes are <div class="beat" id="sA">..</div> inside #cam
   M.hook(["Mistral Large 4", "5% ही चलता!"])        // FRAME-0 headline (pop, glitch, leaves after the first spoken phrase). returns the time it leaves.
   Time helpers: M.P(sc,k)/M.Ed(sc,k) = start/end of phrase k; M.W(sc,"word",nth) = start of a spoken caption token, by its Roman caption form or its Devanagari form (throws if missing; never hard-code seconds).
   Text:   M.slam(host,"text words",t,{x,y,w,size,gold:[i..],cyan:[..],hot:[..],lat:true,out:tEnd,exit:"zoom|up|cut",from:2.2,stag:.07})   kinetic words (scale/blur/3D slam)
           M.big(host,"1T",t,{x,y,w,size,color})   one mega glitch-in word/number;   M.count(host,52,t,{x,y,w,size,prefix,suffix,dec,dur,color})  count-up number
           M.pill(host,"text",t,{x,y,kind:"acc|out",size})   M.mark(host,{x,y,w},t,{h,color})  drawn underline/highlight
   Data:   const D = M.dots(host,{cols,rows,x,y,d,gap}); D.pop(t,{each}); D.light(t,[idx..],color,{each}); D.dim(t,[idx..])   dot/cell grids (params, tokens, experts...)
           M.bars(host,[{label,v:0..1,color,text}],t,{x,y,w,h,gap})   M.beam(host,[x1,y1],[x2,y2],t,{color,w,dur})  animated line + travelling light
   Layout: M.card(host,{x,y,w,h,gold,from:"rise|flip|pop"},t) glass card, children go inside it;  M.ticker(host,"TEXT · TEXT",t,{y,size,dur})
   Impact: M.burst(host,x,y,t,{n,r,color,dur})  particle burst + shockwave ring;  M.ring(host,x,y,t,{r,color,s,d});  M.streaks(host,t,{n,y0,y1,color})  horizontal speed lines sweeping across
   Camera/transitions: M.cam(t,{s,x,y,r,d}) camera move;  M.flash(t);  M.wipe(t);  M.glitchCut(t);  M.shake(t,amp);  M.zoomCut(t)   (cut beats between scenes with one of these)
   M.finish() LAST: captions + registers nothing (HTML must do window.__timelines["main"] = M.tl).  Safe area: content y 170-1300, captions lane y 1330-1600. */
window.Mo = (function () {
  const ACC = "#A78BFA", CYAN = "#5BC0EB", HOT = "#E8596B", GOOD = "#4CC38A", VIOLET = "#9A8CEB", TEXT = "#E8EDF6", MUTED = "#8592AD";
  const $ = (s) => document.querySelector(s);
  const mk = (cls, parent, txt) => { const d = document.createElement("div"); d.className = cls; if (txt !== undefined) d.textContent = txt; if (parent) parent.appendChild(d); return d; };
  const lcg = (seed) => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;   // deterministic "random"
  const NS = "http://www.w3.org/2000/svg";

  function init(opts) {
    const R = window.REEL, DL = R.hi, S = DL.starts, PH = DL.ph, TOT = DL.total, order = opts.order;
    document.documentElement.setAttribute("data-lang", "hi");
    $("#tagtxt").textContent = opts.tag || "AI SAMJHO · HINDI"; $("#handle").textContent = opts.handle || "@dsa.learnvora";
    const tl = gsap.timeline({ paused: true });
    const rnd = lcg(11);
    // ---------- ambient world: static in the clean style (only the progress bar moves) ----------
    tl.fromTo("#progfill", { scaleX: 0 }, { scaleX: 1, duration: TOT, ease: "none" }, 0);
    // ---------- beats: hard visibility windows (scene hard cuts; the transition helpers dress the cut) ----------
    order.forEach((sc, i) => { const el = "#s" + sc;
      if (i > 0) { tl.set(el, { opacity: 0 }, 0); tl.set(el, { opacity: 1 }, S[sc]); } else tl.set(el, { opacity: 1 }, 0);
      if (i < order.length - 1) tl.set(el, { opacity: 0 }, S[order[i + 1]]); });
    // overlays start hidden
    tl.set("#flash", { opacity: 0 }, 0); tl.set("#wipe", { x: 0 }, 0);
    const glbars = [...document.querySelectorAll(".gl")]; glbars.forEach((g, i) => { g.style.top = (260 + i * 250 + (i % 2) * 70) + "px"; g.style.background = i % 2 ? "#05D9E8" : "#FF2A6D"; tl.set(g, { opacity: 0 }, 0); });

    const M = { tl, S, PH, TOT, DL, order, $, mk, ACC, CYAN, HOT, GOOD, VIOLET, TEXT, MUTED,
      P: (sc, k) => PH[sc][k].s, Ed: (sc, k) => PH[sc][k].e,
      W: (sc, w, n) => { const clean = (t) => t.replace(/[,।?.:!"“”]/g, ""); const m = DL.caps.filter((c) => c.scene === sc && (clean(c.t) === w || (c.sp && clean(c.sp) === w)));
        if (!m.length) throw new Error(`Mo.W: word "${w}" not found in scene ${sc}`); return (m[n || 0] || m[0]).s; } };

    // ---------- frame-0 hook ----------
    M.hook = (lines, o) => { o = o || {}; const el = mk("hookline", $("#cam")); lines = Array.isArray(lines) ? lines : [lines];
      lines.forEach((l, i) => mk(i === lines.length - 1 && lines.length > 1 ? "g" : "w", el, l));
      el.style.fontSize = (o.size || 138) + "px"; if (o.top) el.style.top = o.top + "px";
      const until = o.until || Math.max(2.8, PH[order[0]][0].e + 0.3);
      tl.fromTo(el, { opacity: 1, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, 0);   // visible from frame 0, settles gently
      tl.to(el, { opacity: 0, y: -30, duration: 0.3, ease: "power2.in", immediateRender: false }, until);
      return until; };

    // ---------- text ----------
    M.slam = (host, text, t, o) => { o = o || {}; const el = mk("slam", host);
      el.style.cssText += `;left:${o.x ?? 40}px;top:${o.y ?? 400}px;width:${o.w ?? 1000}px;font-size:${o.size || 120}px;color:${o.color || TEXT};font-family:${o.lat ? "var(--lat)" : "var(--head)"}`;
      const gold = new Set(o.gold || []), cyan = new Set(o.cyan || []), hot = new Set(o.hot || []);
      const spans = text.split(" ").map((w, i) => mk("w" + (gold.has(i) ? " g" : cyan.has(i) ? " c" : hot.has(i) ? " h" : ""), el, w));
      tl.fromTo(spans, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: o.stag ?? 0.05 }, t);
      if (o.out != null) { const ex = o.exit || "zoom";
        if (ex === "cut") tl.set(el, { opacity: 0 }, o.out);
        else tl.to(el, ex === "up" ? { opacity: 0, y: -60, duration: 0.25, ease: "power2.in", immediateRender: false } : { opacity: 0, y: -30, duration: 0.25, ease: "power2.in", immediateRender: false }, o.out); }
      return el; };
    M.big = (host, text, t, o) => { o = o || {}; const el = mk("mega", host, text);
      el.style.cssText += `;left:${o.x ?? 40}px;top:${o.y ?? 420}px;width:${o.w ?? 1000}px;font-size:${o.size || 240}px;color:${o.color || TEXT}`;
      tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, t);
      if (o.out != null) tl.to(el, { opacity: 0, y: -30, duration: 0.25, ease: "power2.in", immediateRender: false }, o.out);
      return el; };
    M.count = (host, to, t, o) => { o = o || {}; const el = mk("mega", host); const dec = o.dec || 0, fmt = (v) => (o.prefix || "") + v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, dec ? "" : ",") + (o.suffix || "");
      el.style.cssText += `;left:${o.x ?? 40}px;top:${o.y ?? 420}px;width:${o.w ?? 1000}px;font-size:${o.size || 260}px;color:${o.color || ACC}`; el.textContent = fmt(o.from || 0);
      const p = { v: o.from || 0 };
      tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, t);
      tl.fromTo(p, { v: o.from || 0 }, { v: to, duration: o.dur || 1.2, ease: "power3.out", onUpdate: () => { el.textContent = fmt(p.v); } }, t);
      if (o.out != null) tl.to(el, { opacity: 0, y: -30, duration: 0.22, ease: "power2.in", immediateRender: false }, o.out);
      return el; };
    M.pill = (host, text, t, o) => { o = o || {}; const el = mk("pill " + (o.kind || "acc"), host, text);
      el.style.cssText += `;left:${o.x ?? 60}px;top:${o.y ?? 300}px;font-size:${o.size || 52}px;${o.w ? "width:" + o.w + "px;" : ""}`;
      tl.fromTo(el, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }, t);
      if (o.out != null) tl.to(el, { opacity: 0, scale: 0.8, duration: 0.2, immediateRender: false }, o.out); return el; };
    M.mark = (host, r, t, o) => { o = o || {}; const el = mk("abs", host); el.style.cssText += `;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${o.h || 14}px;background:${o.color || ACC};border-radius:8px;transform-origin:left center`;
      tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power3.out" }, t); return el; };

    // ---------- layout ----------
    M.card = (host, o, t) => { const el = mk("glass" + (o.gold ? " gold" : ""), host); el.style.cssText += `;left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;${o.css || ""}`;
      const f = o.from || "rise", fr = f === "flip" ? { opacity: 0, rotationY: 40, transformPerspective: 900 } : f === "pop" ? { opacity: 0, scale: 0.94 } : { opacity: 0, y: 40 };
      tl.fromTo(el, fr, { opacity: 1, rotationY: 0, rotationX: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }, t);
      if (o.out != null) tl.to(el, { opacity: 0, scale: 0.9, duration: 0.22, ease: "power2.in", immediateRender: false }, o.out); return el; };
    M.ticker = (host, text, t, o) => { o = o || {}; const el = mk("abs", host, (text + "   ").repeat(8)); el.style.cssText += `;left:0;top:${o.y ?? 1180}px;white-space:nowrap;font-family:var(--code);font-weight:800;font-size:${o.size || 70}px;color:rgba(167,139,250,.22);-webkit-text-stroke:2px rgba(167,139,250,.7);opacity:.9`;
      tl.fromTo(el, { x: 0 }, { x: -(o.dist || 1600), duration: o.dur || 6, ease: "none" }, t); return el; };

    // ---------- data viz ----------
    M.dots = (host, o) => { const wrap = mk("abs", host); wrap.style.cssText += `;left:${o.x}px;top:${o.y}px;width:${o.cols * (o.d + o.gap)}px;height:${o.rows * (o.d + o.gap)}px`;
      const cells = []; for (let r = 0; r < o.rows; r++) for (let c = 0; c < o.cols; c++) { const d = mk("cell", wrap); d.style.cssText += `;left:${c * (o.d + o.gap)}px;top:${r * (o.d + o.gap)}px;width:${o.d}px;height:${o.d}px`; cells.push(d); }
      tl.set(cells, { opacity: 0, scale: 0 }, 0);
      const pick = (idx) => idx.map((i) => cells[i]);
      return { el: wrap, cells,
        pop: (t, p) => tl.to(cells, { opacity: 1, scale: 1, duration: 0.25, ease: "power3.out", stagger: { each: (p && p.each) ?? 0.0012, grid: [o.cols, o.rows], from: (p && p.from) || "start" }, immediateRender: false }, t),
        light: (t, idx, color, p) => tl.to(pick(idx), { backgroundColor: color || ACC, scale: (p && p.scale) || 1.3, duration: 0.3, ease: "power3.out", stagger: (p && p.each) ?? 0.012, immediateRender: false }, t),
        dim: (t, idx, p) => tl.to(pick(idx), { opacity: (p && p.op) ?? 0.14, scale: 0.7, duration: 0.35, ease: "power2.out", stagger: (p && p.each) ?? 0.0006, immediateRender: false }, t) }; };
    M.bars = (host, rows, t, o) => { o = o || {}; const g = o.gap || 40, h = o.h || 74, out = []; rows.forEach((r, i) => { const row = mk("barrow", host); row.style.cssText += `;left:${o.x ?? 60}px;top:${(o.y ?? 400) + i * (h + g)}px;width:${o.w ?? 960}px;height:${h}px`;
        const lab = mk("abs", row, r.label); lab.style.cssText += `;left:0;top:0;height:${h}px;display:flex;align-items:center;font-weight:800;font-size:${o.lsize || 40}px;width:${o.lw || 300}px;white-space:nowrap`;
        const track = mk("bartrack", row); track.style.width = (o.w ?? 960) - (o.lw || 300) + "px"; const fill = mk("barfill", track); fill.style.width = "100%"; fill.style.background = r.color || ACC;
        const val = mk("abs", row, r.text || ""); val.style.cssText += `;right:24px;top:0;height:${h}px;display:flex;align-items:center;font-family:var(--lat);font-weight:800;font-size:${o.vsize || 40}px;color:#06101F`;
        tl.fromTo(row, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, t + i * 0.18);
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: r.v, duration: 0.8, ease: "expo.out" }, t + i * 0.18 + 0.1); out.push(row); }); return out; };
    M.beam = (host, a, b, t, o) => { o = o || {}; const svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "ln"); svg.setAttribute("viewBox", "0 0 1080 1920"); host.appendChild(svg);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), col = o.color || ACC;
      const path = document.createElementNS(NS, "line"); [["x1", a[0]], ["y1", a[1]], ["x2", b[0]], ["y2", b[1]], ["stroke", col], ["stroke-width", o.w || 6], ["stroke-linecap", "round"]].forEach(([k, v]) => path.setAttribute(k, v));
      path.style.strokeDasharray = L; svg.appendChild(path);
      const dot = document.createElementNS(NS, "circle"); [["r", (o.w || 6) * 2], ["fill", "#fff"], ["cx", a[0]], ["cy", a[1]]].forEach(([k, v]) => dot.setAttribute(k, v)); svg.appendChild(dot);
      tl.set(dot, { opacity: 0 }, 0);
      tl.fromTo(path, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: o.dur || 0.45, ease: "power2.out" }, t);
      const p = { u: 0 }; tl.set(dot, { opacity: 1 }, t); tl.fromTo(p, { u: 0 }, { u: 1, duration: o.dur || 0.45, ease: "power2.out", onUpdate: () => { dot.setAttribute("cx", a[0] + (b[0] - a[0]) * p.u); dot.setAttribute("cy", a[1] + (b[1] - a[1]) * p.u); } }, t);
      tl.to(dot, { opacity: 0, duration: 0.15, immediateRender: false }, t + (o.dur || 0.45));
      if (o.out != null) tl.to(svg, { opacity: 0, duration: 0.2, immediateRender: false }, o.out); return path; };

    // ---------- impact ----------
    M.ring = () => null; M.burst = () => {}; M.streaks = () => {};   // clean style: no sparkle effects

    // ---------- camera + transitions ----------
    M.cam = (t, o) => { o = o || {}; tl.to("#cam", { scale: o.s ?? 1, x: o.x ?? 0, y: o.y ?? 0, rotation: o.r ?? 0, duration: o.d ?? 0.8, ease: o.ease || "power3.inOut", immediateRender: false }, t);
      tl.to("#bg", { scale: 1 + ((o.s ?? 1) - 1) * 0.4, x: (o.x ?? 0) * 0.4, y: (o.y ?? 0) * 0.4, duration: o.d ?? 0.8, ease: o.ease || "power3.inOut", immediateRender: false }, t); };
    // clean style: no flash / glitch / shake; scene changes are a short push
    const push = (t) => tl.fromTo("#cam", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t);
    M.flash = () => {}; M.shake = () => {}; M.wipe = push; M.glitchCut = push; M.zoomCut = push;
    M.glitch = () => {};

    // ---------- captions (lane y 1330-1600) ----------
    M.finish = (fo) => { fo = fo || {}; const kw = {}; Object.entries(fo.kw || {}).forEach(([k, v]) => (kw[k.toLowerCase()] = v));
      const COL = { gold: ACC, acc: ACC, cyan: CYAN, hot: HOT, red: HOT, good: GOOD, green: GOOD, violet: VIOLET };
      const caps = DL.caps, capsEl = $("#caps");
      order.forEach((sc) => { const ws = caps.filter((c) => c.scene === sc); let cur = [], len = 0, groups = [];
        ws.forEach((w) => { cur.push(w); len += w.t.length + 1; if ((/[.?!।,:]$/.test(w.t) && w.e - cur[0].s >= 0.5) || cur.length >= 3 || len >= 18) { groups.push(cur); cur = []; len = 0; } });
        if (cur.length) groups.push(cur);
        groups.forEach((g, gi) => { const el = mk("capline"); capsEl.appendChild(el);
          const t0 = Math.max(0, g[0].s - 0.05), t1 = Math.max(g[0].s + 0.25, groups[gi + 1] ? groups[gi + 1][0].s - 0.06 : g[g.length - 1].e + 0.3);
          tl.set(el, { opacity: 0 }, 0); tl.set(el, { opacity: 1 }, t0); tl.set(el, { opacity: 0 }, t1);
          g.forEach((w) => { const txt = w.t.replace(/[,.:;।]+$/, ""), key = txt.toLowerCase().replace(/[^a-z0-9\-]/g, ""), c = kw[key];
            const s = document.createElement("span"); s.className = "cw"; s.textContent = c ? txt.toUpperCase() : txt; if (c) s.style.color = COL[c] || c; el.appendChild(s);
            tl.set(s, { opacity: 0 }, 0); tl.fromTo(s, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.18, ease: "power3.out", immediateRender: false }, Math.max(0, w.s - 0.05)); }); }); }); };
    return M;
  }
  return { init, ACC, CYAN, HOT, GOOD, VIOLET, TEXT, MUTED, mk, $ };
})();
