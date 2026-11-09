/* VIZ kit: animated DIAGRAMS on top of the motion kit.   const M = Mo.init({...}); Viz.install(M);   (viz.js is loaded after motion.js)
   THE RULE: a beat shows the IDEA as a picture (a map, a flow, numbers, a loop, a filling window, a chart), never the sentence being spoken.
   Text inside a diagram is a label of 1-3 words. If the viewer could learn the same thing from the captions alone, the picture is not doing its job.
   THIS KIT IS A SHORTCUT, NOT A MENU. Decide the picture from the concept first; use a template below when it fits, compose the building blocks
   (box, arrow, icon, plot, heat) when it nearly fits, and write raw HTML/SVG/GSAP for the beat when nothing fits. Custom code follows the same seek-safe recipe:
     - everything goes on the ONE paused timeline M.tl; set the start state with tl.set(el,{...},0) and animate with tl.to/fromTo(..., immediateRender:false)
     - no tl.call, no setTimeout/setInterval, no Math.random (use a seeded generator), no CSS transitions/animations, no <video>
     - numbers that count or objects that follow a path: tween a plain object {u:0} with onUpdate (see loop.spin and arrow.travel)
     - canvas 1080x1920; content in y 170-1300, x 60-1020; the caption lane y 1330-1600 stays empty; labels >= 36 px
   Every helper takes (host, options) where host is the scene div (A = M.$("#sA")), adds tweens, and returns a handle whose methods take the time t in seconds
   (use M.P(sc,k) / M.W(sc,"word") for t, never a guessed number).

   TEMPLATES
   M.map(host,{x,y,w,h,title,grid,pts:[{id,label,x:0..1,y:0..1,color,side:"r|l|t|b",r,size}]})   a 2D "meaning map" (embeddings, clusters, retrieval, similarity)
        m.enter(t) m.show(t,[ids],each) m.link(t,a,b,{label,color,dash,w,size}) m.ring(t,id,{r,color}) m.glow(t,[ids],color) m.dim(t,[ids],op) m.move(t,id,{x,y},dur) m.hide(t)
   M.vecs(host,{x,y,cell,labelW,rowH,gap,lsize,nsize,rows:[{label,nums:[..],color}]})            rows of numbers   v.show(t,each) v.col(t,colIndex,color) v.hide(t)
   M.flow(host,{x,y,w,h,dir:"v|h",nw,nh,gap,nodes:[{label,sub,color,icon}]})                       a pipeline   f.show(t,each) f.run(t,each) f.focus(t,i,color) f.hide(t)
   M.chips(host,{x,y,w,words,color,size,align})                                                     words/tokens as chips   c.show(t,each) c.hot(t,[i],color) c.dim(t,op) c.hide(t)
   M.search(host,{x,y,w,text,size})                                                                 a search/prompt bar   s.show(t) s.type(t,dur) s.hide(t)
   M.versus(host,{x,y,w,h,left:{title,color},right:{title,color}})                                  two panels   s.show(t) s.mark(t,"left|right","yes|no") s.L / s.R = inner boxes {x,y,w,h}
   M.loop(host,{cx,cy,r,nodes:[{label,color,w}]})                                                   a cycle   l.show(t,each) l.spin(t,laps,each) l.hide(t)
   M.stack(host,{x,y,w,h,title,forget,items:[{label,color,h}]})                                     a window that fills up   s.show(t) s.fill(t,each) s.overflow(t,n) s.hide(t)
   M.dist(host,{x,y,w,h,bars:[{label,p:0..1,color}]})                                               probability bars   d.show(t) d.set(t,[p..],dur) d.cut(t,k) d.mark(t,i,color) d.hide(t)
   M.code(host,{x,y,w,size,lines})                                                                  a code block   c.show(t,each) c.hl(t,i,color) c.hide(t)
   M.plot(host,{x,y,w,h,xlabel,ylabel,series:[{pts:[[x0..1,y0..1],..],color,label}]})               a line chart   p.show(t) p.draw(t,dur) p.dot(t,series,pointIdx,{label,color}) p.hide(t)
   M.heat(host,{x,y,cell,rows:[..],cols:[..],values:[[0..1]],color,lsize})                          a heat-map / attention grid   h.show(t,each) h.pick(t,r,c,color) h.row(t,r,color) h.hide(t)
   BUILDING BLOCKS (compose anything)
   M.box(host,{x,y,w,h,label,sub,icon,color,fill,size,subsize})    handle: show(t) hide(t) glow(t,color) unglow(t) move(t,{x,y},dur)  cx cy x y w h  edge("l|r|t|b") -> [x,y]
   M.arrow(host,{from:[x,y],to:[x,y],color,w,bend,dash,label,size})  handle: show(t,dur) hide(t) travel(t,dur,color)   (bend curves it)
   M.icon(host,kind,x,y,size,color)  handle: show(t) hide(t)   kinds: Object.keys(Viz.ICONS)
   M.fit(host,{x,y,w,h,maxScale,minScale,align:"center|top"})   call LAST in a scene: scales the finished scene up into the safe area and centres it (default y 170-1300; pass y/h to start below the hook text)
   M.pop(els,t,each) / M.out(els,t)   pop elements in / fade them out (your own elements)    M.ca(hex,alpha)  -> rgba() string (tween rgba, not 8-digit hex) */
window.Viz = (function () {
  const NS = "http://www.w3.org/2000/svg";
  const ICONS = {
    text: (c) => `<rect x="8" y="12" width="48" height="40" rx="8" fill="none" stroke="${c}" stroke-width="4"/><path d="M16 26h32M16 34h32M16 42h20" stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    model: (c) => `<g stroke="${c}" stroke-width="2.5" opacity=".75" fill="none"><path d="M14 18L32 12M14 18L32 32M14 46L32 32M14 46L32 52M32 12L50 32M32 32L50 32M32 52L50 32"/></g><g fill="${c}"><circle cx="14" cy="18" r="5.5"/><circle cx="14" cy="46" r="5.5"/><circle cx="32" cy="12" r="5.5"/><circle cx="32" cy="32" r="5.5"/><circle cx="32" cy="52" r="5.5"/><circle cx="50" cy="32" r="6.5"/></g>`,
    numbers: (c) => `<g fill="none" stroke="${c}" stroke-width="3.5"><rect x="4" y="22" width="16" height="20" rx="4"/><rect x="24" y="22" width="16" height="20" rx="4"/><rect x="44" y="22" width="16" height="20" rx="4"/></g><g fill="${c}"><rect x="8" y="30" width="8" height="4" rx="2"/><rect x="28" y="28" width="8" height="4" rx="2"/><rect x="48" y="32" width="8" height="4" rx="2"/></g>`,
    db: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"><ellipse cx="32" cy="16" rx="22" ry="8"/><path d="M10 16v32c0 4.4 9.8 8 22 8s22-3.6 22-8V16"/><path d="M10 32c0 4.4 9.8 8 22 8s22-3.6 22-8"/></g>`,
    doc: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M16 8h22l12 12v36H16z"/><path d="M38 8v12h12"/><path d="M24 32h20M24 40h20M24 48h12"/></g>`,
    star: (c) => `<polygon points="32,6 39,24 58,25 43,37 48,56 32,46 16,56 21,37 6,25 25,24" fill="${c}"/>`,
    search: (c) => `<g fill="none" stroke="${c}" stroke-linecap="round"><circle cx="28" cy="28" r="16" stroke-width="5"/><path d="M40 40L56 56" stroke-width="6"/></g>`,
    check: (c) => `<path d="M10 34l16 16L54 14" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
    cross: (c) => `<path d="M14 14L50 50M50 14L14 50" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`,
    bookmark: (c) => `<path d="M18 8h28v48L32 44 18 56z" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    user: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"><circle cx="32" cy="21" r="11"/><path d="M10 56c0-12 10-20 22-20s22 8 22 20"/></g>`,
    chat: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M8 12h48v30H30L16 55V42H8z"/><path d="M20 24h24M20 32h14"/></g>`,
    gear: (c) => `<g fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"><circle cx="32" cy="32" r="11"/><path d="M32 6v10M32 48v10M6 32h10M48 32h10M14 14l7 7M43 43l7 7M50 14l-7 7M21 43l-7 7"/></g>`,
    cloud: (c) => `<path d="M18 48h30a11 11 0 0 0 1-22 15 15 0 0 0-28-4 12 12 0 0 0-3 26z" fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round"/>`,
    clock: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"><circle cx="32" cy="32" r="24"/><path d="M32 18v15l10 7"/></g>`,
    bolt: (c) => `<polygon points="36,4 14,36 28,36 24,60 50,26 36,26" fill="${c}"/>`,
    lock: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"><rect x="12" y="28" width="40" height="28" rx="6"/><path d="M20 28V20a12 12 0 0 1 24 0v8"/></g><circle cx="32" cy="42" r="4" fill="${c}"/>`,
    image: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><rect x="6" y="10" width="52" height="44" rx="6"/><path d="M6 44l16-16 12 12 8-8 16 16"/></g><circle cx="44" cy="24" r="5" fill="${c}"/>`,
    code: (c) => `<path d="M22 16L6 32l16 16M42 16l16 16-16 16M37 10L27 54" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
    globe: (c) => `<g fill="none" stroke="${c}" stroke-width="4"><circle cx="32" cy="32" r="24"/><ellipse cx="32" cy="32" rx="10" ry="24"/><path d="M8 32h48M12 19h40M12 45h40"/></g>`,
    coin: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"><circle cx="32" cy="32" r="24"/><path d="M40 24c-2-3-5-4-8-4-5 0-8 2-8 6 0 9 16 3 16 12 0 4-3 6-8 6-3 0-6-1-8-4M32 15v5M32 44v5"/></g>`,
    warn: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"><path d="M32 8L58 54H6z"/><path d="M32 24v14"/></g><circle cx="32" cy="46" r="3.2" fill="${c}"/>`,
    mic: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"><rect x="23" y="6" width="18" height="30" rx="9"/><path d="M13 30a19 19 0 0 0 38 0M32 49v10M22 59h20"/></g>`,
    speaker: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"><path d="M8 24h12l16-12v40L20 40H8z"/><path d="M44 22a14 14 0 0 1 0 20M50 14a24 24 0 0 1 0 36"/></g>`,
    camera: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round"><path d="M6 20h12l4-8h20l4 8h12v34H6z"/><circle cx="32" cy="36" r="10"/></g>`,
    video: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round"><rect x="6" y="12" width="52" height="40" rx="8"/></g><polygon points="26,22 26,42 44,32" fill="${c}"/>`,
    book: (c) => `<path d="M8 12h20a4 4 0 0 1 4 4v38a4 4 0 0 0-4-4H8zM56 12H36a4 4 0 0 0-4 4v38a4 4 0 0 1 4-4h20z" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    eye: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round"><path d="M4 32C14 16 50 16 60 32 50 48 14 48 4 32z"/></g><circle cx="32" cy="32" r="8" fill="${c}"/>`,
    robot: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"><rect x="10" y="22" width="44" height="32" rx="9"/><path d="M32 22V10M4 36v8M60 36v8"/></g><circle cx="32" cy="8" r="3.5" fill="${c}"/><circle cx="23" cy="38" r="4.5" fill="${c}"/><circle cx="41" cy="38" r="4.5" fill="${c}"/>`,
    shield: (c) => `<path d="M32 6l20 8v16c0 14-9 22-20 28C21 52 12 44 12 30V14z" fill="none" stroke="${c}" stroke-width="4.5" stroke-linejoin="round"/>`,
    chip: (c) => `<g fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"><rect x="16" y="16" width="32" height="32" rx="5"/><path d="M26 6v10M38 6v10M26 48v10M38 48v10M6 26h10M6 38h10M48 26h10M48 38h10"/></g>`,
    arrow: (c) => `<path d="M8 32h42M34 14l18 18-18 18" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  const hex2 = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const ca = (h, a) => { if (/^rgba?\(/.test(h)) return h; const [r, g, b] = hex2(h); return `rgba(${r},${g},${b},${a})`; };

  function install(M) {
    const { tl, mk, ACC, CYAN, HOT, GOOD, VIOLET, TEXT, MUTED } = M;
    const css = (el, s) => { el.style.cssText += ";" + s; return el; };
    const svgLayer = (host) => { const s = document.createElementNS(NS, "svg"); s.setAttribute("class", "ln"); s.setAttribute("viewBox", "0 0 1080 1920"); host.appendChild(s); return s; };
    const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k])); if (parent) parent.appendChild(e); return e; };
    const iconEl = (host, kind, x, y, size, color) => { const w = mk("abs", host); css(w, `left:${x}px;top:${y}px;width:${size}px;height:${size}px`); w.innerHTML = `<svg viewBox="0 0 64 64" width="${size}" height="${size}" style="overflow:visible">${(ICONS[kind] || ICONS.star)(color)}</svg>`; return w; };
    const hide0 = (els, extra) => tl.set(els, Object.assign({ opacity: 0 }, extra || {}), 0);
    const pop = (els, t, each, o) => tl.to(els, Object.assign({ opacity: 1, scale: 1, duration: 0.38, ease: "power3.out", stagger: each || 0, immediateRender: false }, o || {}), t);
    const out = (els, t) => tl.to(els, { opacity: 0, duration: 0.25, ease: "power2.in", immediateRender: false }, t);
    const label = (host, text, x, y, w, size, color, extra) => { const l = mk("abs", host, text); css(l, `left:${x}px;top:${y}px;width:${w}px;text-align:center;font-family:var(--lat);font-weight:800;font-size:${size}px;color:${color || TEXT};white-space:nowrap;${extra || ""}`); return l; };
    M.pop = pop; M.out = out; M.ca = ca;

    // ---------- FIT (a finished scene fills the safe area) ----------
    // Call once, LAST in the scene's code. Measures everything you put in the scene (layout boxes, ignoring transforms and svg layers), scales it up (at most maxScale) to fit
    // the area and centres it ("top" keeps the top edge: use it with a rect that starts below the hook text). Pictures parked at the top with an empty gap below get big and centred.
    // Elements marked data-nofit are not measured: label wrappers, and the travelling dots of M.arrow, M.flow and M.loop, which sit at 0,0 until they move (before 2026-10-12 they stretched
    // the box to the corner and every scene was fitted about 0.7-0.9x too small).
    M.fit = (host, o) => {
      const R = Object.assign({ x: 60, y: 170, w: 960, h: 1130, maxScale: 1.45, minScale: 0.6, align: "center" }, o || {});
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      host.querySelectorAll(":scope > *:not(svg)").forEach((el) => {
        if (el.hasAttribute("data-nofit")) return;
        const l = el.offsetLeft, t = el.offsetTop, w = el.offsetWidth, h = el.offsetHeight;
        if (!w || !h || l < -40 || t < -40 || l + w > 1120 || t + h > 1960) return;   // off-canvas helpers (streaks)
        x0 = Math.min(x0, l); y0 = Math.min(y0, t); x1 = Math.max(x1, l + w); y1 = Math.max(y1, t + h);
      });
      if (x1 < x0) return;
      const bw = x1 - x0, bh = y1 - y0, sc = Math.max(R.minScale, Math.min(R.maxScale, R.w / bw, R.h / bh));
      const tx = R.x + (R.w - bw * sc) / 2 - x0 * sc, ty = (R.align === "top" ? R.y : R.y + (R.h - bh * sc) / 2) - y0 * sc;
      host.style.transformOrigin = "0 0"; host.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
    };

    // ---------- ICON ----------
    M.icon = (host, kind, x, y, size, color) => { const el = iconEl(host, kind, x, y, size, color || ACC); hide0(el, { scale: 0.4 }); return { el, show: (t) => pop(el, t), hide: (t) => out(el, t) }; };

    // ---------- MEANING MAP ----------
    M.map = (host, o) => {
      const frame = mk("glass", host);
      css(frame, `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-radius:40px;background-color:rgba(10,18,36,.88)` + (o.grid === false ? "" : `;background-image:linear-gradient(rgba(91,192,235,.10) 2px, transparent 2px),linear-gradient(90deg, rgba(91,192,235,.10) 2px, transparent 2px);background-size:90px 90px`));
      const parts = [frame];
      if (o.title) { const t = mk("lab", host, o.title); css(t, `left:${o.x}px;top:${o.y + 20}px;width:${o.w}px;font-size:30px`); parts.push(t); }
      hide0(parts, { scale: 0.92 });
      const svg = svgLayer(host), P = {}, extra = [];
      (o.pts || []).forEach((p) => {
        const px = o.x + p.x * o.w, py = o.y + p.y * o.h, col = p.color || ACC, r = p.r || 17, side = p.side || "r", size = p.size || 42;
        const dot = mk("abs", host); css(dot, `left:${px - r}px;top:${py - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${col}`);
        const lab = mk("abs", host, p.label || ""); lab.setAttribute("data-nofit", ""); const W = 420;
        const pos = { r: [px + r + 14, py - size * 0.62, "left", "0% 50%"], l: [px - r - 14 - W, py - size * 0.62, "right", "100% 50%"], t: [px - W / 2, py - r - size * 1.45, "center", "50% 100%"], b: [px - W / 2, py + r + 12, "center", "50% 0%"] }[side];
        css(lab, `left:${pos[0]}px;top:${pos[1]}px;width:${W}px;text-align:${pos[2]};transform-origin:${pos[3]};font-family:var(--lat);font-weight:800;font-size:${size}px;color:${TEXT};white-space:nowrap`);
        tl.set([dot, lab], { opacity: 0, scale: 0 }, 0);
        P[p.id] = { dot, lab, px, py, col, r };
      });
      return {
        pts: P,
        enter: (t) => tl.to(parts, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t),
        show: (t, ids, each) => (ids || Object.keys(P)).forEach((id, i) => pop([P[id].dot, P[id].lab], t + i * (each ?? 0.2))),
        link: (t, a, b, lo) => { lo = lo || {}; const A = P[a], B = P[b], col = lo.color || CYAN, L = Math.hypot(B.px - A.px, B.py - A.py);
          const ln = sv("line", { x1: A.px, y1: A.py, x2: B.px, y2: B.py, stroke: col, "stroke-width": lo.w || 7, "stroke-linecap": "round" }, svg); tl.set(ln, { opacity: 0 }, 0); tl.set(ln, { opacity: 1 }, t);
          if (lo.dash) { ln.setAttribute("stroke-dasharray", "16 14"); tl.fromTo(ln, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t); }
          else { ln.setAttribute("stroke-dasharray", L); tl.fromTo(ln, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, t); }
          const made = [ln];
          if (lo.label) { const wrap = mk("abs", host); wrap.setAttribute("data-nofit", ""); css(wrap, `left:${(A.px + B.px) / 2 - 170}px;top:${(A.py + B.py) / 2 - 36}px;width:340px;display:flex;justify-content:center`);
            const pill = document.createElement("div"); pill.textContent = lo.label; pill.style.cssText = `padding:8px 26px;border-radius:999px;background:${col};color:#06101F;font-family:var(--lat);font-weight:800;font-size:${lo.size || 38}px;white-space:nowrap`; wrap.appendChild(pill);
            tl.set(wrap, { opacity: 0, scale: 0.3 }, 0); tl.to(wrap, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, t + 0.3); made.push(wrap); extra.push(wrap); }
          extra.push(ln); return made; },
        ring: (t, id, ro) => M.ring(host, P[id].px, P[id].py, t, Object.assign({ r: 70, color: ACC, s: 2.2, d: 0.8 }, ro || {})),
        glow: (t, ids, color) => ids.forEach((id) => tl.to(P[id].dot, { backgroundColor: color || ACC, scale: 1.55, boxShadow: "none", duration: 0.3, ease: "power3.out", immediateRender: false }, t)),
        dim: (t, ids, op) => ids.forEach((id) => tl.to([P[id].dot, P[id].lab], { opacity: op ?? 0.22, duration: 0.3, immediateRender: false }, t)),
        move: (t, id, to, dur) => { const q = P[id]; tl.to([q.dot, q.lab], { x: o.x + to.x * o.w - q.px, y: o.y + to.y * o.h - q.py, duration: dur || 0.8, ease: "power3.inOut", immediateRender: false }, t); },
        hide: (t) => out([].concat(parts, extra, Object.values(P).flatMap((q) => [q.dot, q.lab])), t),
      };
    };

    // ---------- VECTORS (rows of numbers) ----------
    M.vecs = (host, o) => {
      const cell = o.cell || 150, lw = o.labelW || 210, rh = o.rowH || 110, gap = o.gap || 26, n = o.rows[0].nums.length, W = lw + n * cell + 30;
      const rows = o.rows.map((r, i) => {
        const row = mk("glass", host); css(row, `left:${o.x}px;top:${o.y + i * (rh + gap)}px;width:${W}px;height:${rh}px;border-radius:28px`);
        const lab = mk("abs", row, r.label); css(lab, `left:26px;top:0;height:${rh}px;width:${lw - 26}px;display:flex;align-items:center;font-family:var(--lat);font-weight:800;font-size:${o.lsize || 46}px;color:${r.color || ACC}`);
        const cells = r.nums.map((v, c) => { const d = mk("abs", row, (v >= 0 ? " " : "") + v.toFixed(2)); css(d, `left:${lw + c * cell}px;top:0;width:${cell}px;height:${rh}px;display:flex;align-items:center;justify-content:center;font-family:var(--code);font-weight:700;font-size:${o.nsize || 42}px;color:${TEXT};white-space:pre`); return d; });
        tl.set(row, { opacity: 0, y: 50 }, 0); tl.set(cells, { opacity: 0 }, 0);
        return { row, lab, cells };
      });
      const total = rows.length * (rh + gap) - gap, extra = [];
      return {
        rows, width: W, height: total,
        show: (t, each) => rows.forEach((r, i) => { const t0 = t + i * (each ?? 0.4); tl.to(r.row, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, t0); tl.to(r.cells, { opacity: 1, duration: 0.18, stagger: 0.07, immediateRender: false }, t0 + 0.2); }),
        col: (t, c, color) => { const b = mk("abs", host); css(b, `left:${o.x + lw + c * cell + 6}px;top:${o.y - 12}px;width:${cell - 12}px;height:${total + 24}px;border:5px solid ${color || CYAN};border-radius:22px`); tl.set(b, { opacity: 0, scaleY: 0.3 }, 0); tl.to(b, { opacity: 1, scaleY: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, t); extra.push(b); return b; },
        hide: (t) => out(rows.map((r) => r.row).concat(extra), t),
      };
    };

    // ---------- BOX (building block) ----------
    M.box = (host, o) => {
      const col = o.color || ACC, rad = o.radius ?? 30, card = mk("glass", host);
      css(card, `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-radius:${rad}px;border-color:${ca(col, 0.6)}` + (o.fill ? `;background:${ca(col, 0.2)}` : ""));
      const glowEl = mk("abs", host); css(glowEl, `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-radius:${rad}px;box-shadow:inset 0 0 0 3px ${col};pointer-events:none`);
      const inner = mk("abs", host); css(inner, `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center`);
      if (o.icon) { const isz = o.isize || Math.min(96, Math.round(o.h * (o.label ? 0.42 : 0.6))); const w = document.createElement("div"); w.style.cssText = `width:${isz}px;height:${isz}px;flex:none`; w.innerHTML = `<svg viewBox="0 0 64 64" width="${isz}" height="${isz}" style="overflow:visible">${(ICONS[o.icon] || ICONS.star)(col)}</svg>`; inner.appendChild(w); }
      if (o.label) { const l = document.createElement("div"); l.textContent = o.label; l.style.cssText = `font-family:var(--lat);font-weight:800;font-size:${o.size || 44}px;color:${TEXT};line-height:1.1;white-space:nowrap`; inner.appendChild(l); }
      if (o.sub) { const s = document.createElement("div"); s.textContent = o.sub; s.style.cssText = `font-family:var(--code);font-weight:700;font-size:${o.subsize || 28}px;color:${col};letter-spacing:.04em;white-space:nowrap`; inner.appendChild(s); }
      tl.set([card, inner], { opacity: 0, scale: 0.6 }, 0); tl.set(glowEl, { opacity: 0 }, 0);
      return {
        el: card, parts: [card, inner, glowEl], x: o.x, y: o.y, w: o.w, h: o.h, cx: o.x + o.w / 2, cy: o.y + o.h / 2,
        edge: (side) => ({ l: [o.x, o.y + o.h / 2], r: [o.x + o.w, o.y + o.h / 2], t: [o.x + o.w / 2, o.y], b: [o.x + o.w / 2, o.y + o.h] }[side || "r"]),
        show: (t, each) => pop([card, inner], t, each),
        hide: (t) => out([card, inner, glowEl], t),
        glow: (t, color) => { if (color) tl.set(glowEl, { boxShadow: "none" }, t); tl.to(glowEl, { opacity: 1, duration: 0.25, immediateRender: false }, t); },
        unglow: (t) => tl.to(glowEl, { opacity: 0, duration: 0.3, immediateRender: false }, t),
        move: (t, to, dur) => tl.to([card, inner, glowEl], { x: to.x - o.x, y: to.y - o.y, duration: dur || 0.7, ease: "power3.inOut", immediateRender: false }, t),
      };
    };

    // ---------- ARROW (building block) ----------
    M.arrow = (host, o) => {
      const col = o.color || CYAN, w = o.w || 8, [x1, y1] = o.from, [x2, y2] = o.to, bend = o.bend || 0;
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, mx = (x1 + x2) / 2 + nx * bend, my = (y1 + y2) / 2 + ny * bend;
      const tx = bend ? x2 - mx : dx, ty = bend ? y2 - my : dy, tn = Math.hypot(tx, ty) || 1, ux = tx / tn, uy = ty / tn, hl = Math.max(30, w * 3.6), hw = hl * 0.6;
      const bx = x2 - ux * hl, by = y2 - uy * hl;
      const d = bend ? `M${x1} ${y1} Q${mx} ${my} ${bx} ${by}` : `M${x1} ${y1} L${bx} ${by}`;
      const pos = (u) => bend ? [(1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * bx, (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * by] : [x1 + (bx - x1) * u, y1 + (by - y1) * u];
      let L = 0, prev = pos(0); for (let i = 1; i <= 24; i++) { const q = pos(i / 24); L += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
      const svg = svgLayer(host), g = sv("g", {}, svg); const path = sv("path", { d, fill: "none", stroke: col, "stroke-width": w, "stroke-linecap": "round", "stroke-dasharray": o.dash ? "18 14" : L }, g);
      const head = sv("polygon", { points: `${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`, fill: col }, g);
      const dot = mk("abs", host); dot.setAttribute("data-nofit", ""); css(dot, `left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#fff`);
      let pillWrap = null;
      if (o.label) { pillWrap = mk("abs", host); pillWrap.setAttribute("data-nofit", ""); const [lx, ly] = pos(0.5); css(pillWrap, `left:${lx - 200}px;top:${ly - 34}px;width:400px;display:flex;justify-content:center`); const pill = document.createElement("div"); pill.textContent = o.label; pill.style.cssText = `padding:6px 22px;border-radius:999px;background:${col};color:#06101F;font-family:var(--lat);font-weight:800;font-size:${o.size || 34}px;white-space:nowrap`; pillWrap.appendChild(pill); tl.set(pillWrap, { opacity: 0, scale: 0.3 }, 0); }
      tl.set(path, { opacity: 0 }, 0); tl.set(head, { opacity: 0 }, 0); tl.set(dot, { opacity: 0 }, 0);
      return {
        show: (t, dur) => { const D = dur ?? 0.45; tl.set(path, { opacity: 1 }, t);
          if (!o.dash) tl.fromTo(path, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: D, ease: "power2.out", immediateRender: false }, t); else tl.fromTo(path, { opacity: 0 }, { opacity: 1, duration: D, immediateRender: false }, t);
          tl.to(head, { opacity: 1, duration: 0.12, immediateRender: false }, t + D * 0.85);
          if (pillWrap) tl.to(pillWrap, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t + D * 0.6); },
        hide: (t) => out([path, head, dot].concat(pillWrap ? [pillWrap] : []), t),
        travel: (t, dur, color) => { const p = { u: 0 }, D = dur ?? 0.8; tl.set(dot, { opacity: 1, backgroundColor: color || "#fff" }, t);
          tl.fromTo(p, { u: 0 }, { u: 1, duration: D, ease: "power2.inOut", immediateRender: false, onUpdate: () => { const q = pos(p.u); dot.style.left = q[0] + "px"; dot.style.top = q[1] + "px"; } }, t);
          tl.to(dot, { opacity: 0, duration: 0.15, immediateRender: false }, t + D); },
      };
    };

    // ---------- FLOW (pipeline) ----------
    M.flow = (host, o) => {
      const n = o.nodes.length, dir = o.dir || "v", gap = o.gap || 96, svg = svgLayer(host);
      const nw = o.nw || (dir === "v" ? 640 : Math.floor((o.w - gap * (n - 1)) / n)), nh = o.nh || (dir === "v" ? Math.floor((o.h - gap * (n - 1)) / n) : 260);
      const pos = o.nodes.map((nd, i) => dir === "v" ? { x: o.x + (o.w - nw) / 2, y: o.y + i * (nh + gap) } : { x: o.x + i * (nw + gap), y: o.y + (o.h - nh) / 2 });
      const nodes = o.nodes.map((nd, i) => {
        const col = nd.color || ACC, p = pos[i], card = mk("glass", host); css(card, `left:${p.x}px;top:${p.y}px;width:${nw}px;height:${nh}px;border-radius:34px;border-color:${ca(col, 0.55)}`);
        const glowEl = mk("abs", host); css(glowEl, `left:${p.x}px;top:${p.y}px;width:${nw}px;height:${nh}px;border-radius:34px;box-shadow:inset 0 0 0 3px ${col};pointer-events:none`);
        const inner = mk("abs", host); const isz = Math.min(96, nh - 60);
        css(inner, `left:${p.x}px;top:${p.y}px;width:${nw}px;height:${nh}px;display:flex;flex-direction:${dir === "v" ? "row" : "column"};align-items:center;justify-content:center;gap:${dir === "v" ? 28 : 8}px`);
        if (nd.icon) { const w = document.createElement("div"); w.style.cssText = `width:${isz}px;height:${isz}px;flex:none`; w.innerHTML = `<svg viewBox="0 0 64 64" width="${isz}" height="${isz}" style="overflow:visible">${(ICONS[nd.icon] || ICONS.star)(col)}</svg>`; inner.appendChild(w); }
        const tx = document.createElement("div"); tx.style.cssText = `display:flex;flex-direction:column;align-items:${dir === "v" ? "flex-start" : "center"};justify-content:center`;
        const l = document.createElement("div"); l.textContent = nd.label; l.style.cssText = `font-family:var(--lat);font-weight:800;font-size:${nd.size || (dir === "v" ? 54 : 42)}px;color:${TEXT};line-height:1.1;white-space:nowrap`; tx.appendChild(l);
        if (nd.sub) { const s = document.createElement("div"); s.textContent = nd.sub; s.style.cssText = `font-family:var(--code);font-weight:700;font-size:${nd.subsize || 28}px;color:${col};margin-top:6px;letter-spacing:.04em;white-space:nowrap`; tx.appendChild(s); }
        inner.appendChild(tx);
        tl.set([card, inner], { opacity: 0, scale: 0.6 }, 0); tl.set(glowEl, { opacity: 0 }, 0);
        return { card, inner, glowEl, col, cx: p.x + nw / 2, cy: p.y + nh / 2 };
      });
      const arrows = []; for (let i = 0; i < n - 1; i++) {
        const a = pos[i], b = pos[i + 1], col = o.nodes[i + 1].color || ACC;
        const x1 = dir === "v" ? a.x + nw / 2 : a.x + nw + 10, y1 = dir === "v" ? a.y + nh + 10 : a.y + nh / 2, x2 = dir === "v" ? b.x + nw / 2 : b.x - 10, y2 = dir === "v" ? b.y - 10 : b.y + nh / 2, L = Math.hypot(x2 - x1, y2 - y1);
        const g = sv("g", {}, svg); const ln = sv("line", { x1, y1, x2, y2, stroke: col, "stroke-width": 8, "stroke-linecap": "round", "stroke-dasharray": L }, g);
        const ah = dir === "v" ? `M${x2 - 22} ${y2 - 26} L${x2} ${y2} L${x2 + 22} ${y2 - 26}` : `M${x2 - 26} ${y2 - 22} L${x2} ${y2} L${x2 - 26} ${y2 + 22}`; const head = sv("path", { d: ah, fill: "none", stroke: col, "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
        tl.set(ln, { strokeDashoffset: L }, 0); tl.set(head, { opacity: 0 }, 0); arrows.push({ ln, head, L });
      }
      const dot = mk("abs", host); dot.setAttribute("data-nofit", ""); css(dot, `left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:#fff`); tl.set(dot, { opacity: 0 }, 0);
      return {
        nodes, arrows,
        show: (t, each) => { const e = each ?? 0.5; nodes.forEach((nd, i) => { pop([nd.card, nd.inner], t + i * e); if (i < n - 1) { const a = arrows[i]; tl.to(a.ln, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, t + i * e + 0.3); tl.to(a.head, { opacity: 1, duration: 0.1, immediateRender: false }, t + i * e + 0.55); } }); },
        run: (t, each) => { const e = each ?? 0.7; tl.set(dot, { opacity: 1, left: nodes[0].cx, top: nodes[0].cy }, t);
          nodes.forEach((nd, i) => { if (i > 0) tl.to(dot, { left: nd.cx, top: nd.cy, duration: e, ease: "power2.inOut", immediateRender: false }, t + (i - 1) * e); tl.to(nd.glowEl, { opacity: 1, duration: 0.2, immediateRender: false }, t + i * e); tl.to(nd.glowEl, { opacity: 0, duration: 0.3, immediateRender: false }, t + i * e + e * 0.9); });
          tl.to(dot, { opacity: 0, duration: 0.2, immediateRender: false }, t + (n - 1) * e + 0.2); },
        focus: (t, i, color) => { if (color) tl.set(nodes[i].glowEl, { boxShadow: "none" }, t); tl.to(nodes[i].glowEl, { opacity: 1, duration: 0.3, immediateRender: false }, t); },
        hide: (t) => out(nodes.flatMap((nd) => [nd.card, nd.inner, nd.glowEl]).concat([svg]), t),
      };
    };

    // ---------- CHIPS (words / tokens) ----------
    M.chips = (host, o) => {
      const size = o.size || 46, col = o.color || CYAN, wrap = mk("abs", host);
      css(wrap, `left:${o.x}px;top:${o.y}px;width:${o.w || 900}px;display:flex;flex-wrap:wrap;gap:${o.gap || 24}px;justify-content:${o.align || "flex-start"}`);
      const chips = o.words.map((w) => { const c = document.createElement("div"); c.textContent = w; c.style.cssText = `padding:8px 24px;border-radius:18px;font-family:var(--lat);font-weight:800;font-size:${size}px;color:${TEXT};background:${ca(col, 0.14)};border:3px solid ${col};white-space:nowrap`; wrap.appendChild(c); return c; });
      tl.set(chips, { opacity: 0, scale: 0.5 }, 0);
      return {
        chips, show: (t, each) => pop(chips, t, each ?? 0.12),
        hot: (t, idx, color) => idx.forEach((i) => tl.to(chips[i], { backgroundColor: ca(color || ACC, 0.35), borderColor: color || ACC, scale: 1.06, duration: 0.3, ease: "power3.out", immediateRender: false }, t)),
        dim: (t, op) => tl.to(chips, { opacity: op ?? 0.3, duration: 0.3, immediateRender: false }, t),
        hide: (t) => out(chips, t),
      };
    };

    // ---------- SEARCH / PROMPT BAR ----------
    M.search = (host, o) => {
      const w = o.w || 900, h = 124, bar = mk("glass", host); css(bar, `left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px;border-radius:62px;border-color:rgba(91,192,235,.75)`);
      const ic = iconEl(host, o.icon || "search", o.x + 36, o.y + 30, 64, CYAN), txt = mk("abs", host); css(txt, `left:${o.x + 124}px;top:${o.y}px;height:${h}px;display:flex;align-items:center;font-family:var(--lat);font-weight:700;font-size:${o.size || 46}px;color:${TEXT};white-space:nowrap`);
      const chars = [...o.text].map((ch) => { const s = document.createElement("span"); s.textContent = ch === " " ? " " : ch; txt.appendChild(s); return s; });
      tl.set([bar, ic, txt], { opacity: 0 }, 0); tl.set(chars, { opacity: 0 }, 0);
      return {
        show: (t) => tl.to([bar, ic, txt], { opacity: 1, duration: 0.3, immediateRender: false }, t),
        type: (t, dur) => tl.to(chars, { opacity: 1, duration: 0.02, stagger: (dur || 1.2) / chars.length, immediateRender: false }, t),
        hide: (t) => out([bar, ic, txt], t),
      };
    };

    // ---------- VERSUS (two panels) ----------
    M.versus = (host, o) => {
      const gap = o.gap || 36, pw = (o.w - gap) / 2, mkP = (d, x) => { const card = mk("glass", host); css(card, `left:${x}px;top:${o.y}px;width:${pw}px;height:${o.h}px;border-color:${ca(d.color || ACC, 0.55)}`);
        const t = label(host, d.title, x, o.y + 26, pw, 40, d.color || ACC, "font-family:var(--code);letter-spacing:.1em");
        const mark = mk("abs", host); css(mark, `left:${x + pw / 2 - 48}px;top:${o.y + o.h - 130}px;width:96px;height:96px`); tl.set([card, t, mark], { opacity: 0, scale: 0.7 }, 0);
        return { card, t, mark, x, y: o.y + 90, w: pw, h: o.h - 240 }; };
      const L = mkP(o.left, o.x), R = mkP(o.right, o.x + pw + gap);
      return {
        L, R, show: (t) => { pop([L.card, L.t], t); pop([R.card, R.t], t + 0.2); },
        mark: (t, side, kind) => { const m = side === "left" ? L : R, yes = kind === "yes"; m.mark.innerHTML = `<svg viewBox="0 0 64 64" width="96" height="96">${ICONS[yes ? "check" : "cross"](yes ? GOOD : HOT)}</svg>`; pop([m.mark], t, 0, { ease: "power3.out" }); },
        hide: (t) => out([L.card, L.t, L.mark, R.card, R.t, R.mark], t),
      };
    };

    // ---------- LOOP ----------
    M.loop = (host, o) => {
      const n = o.nodes.length, r = o.r || 330, svg = svgLayer(host), ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const ring = sv("circle", { cx: o.cx, cy: o.cy, r, fill: "none", stroke: "rgba(143,160,184,.5)", "stroke-width": 8, "stroke-dasharray": "22 16" }, svg); tl.set(ring, { opacity: 0 }, 0);
      const nodes = o.nodes.map((nd, i) => { const x = o.cx + r * Math.cos(ang(i)), y = o.cy + r * Math.sin(ang(i)), col = nd.color || ACC, w = nd.w || 330, h = 116;
        const c = mk("glass", host); css(c, `left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;border-radius:58px;border-color:${col}`);
        const gl = mk("abs", host); css(gl, `left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;border-radius:58px;box-shadow:inset 0 0 0 3px ${col};pointer-events:none`);
        const l = mk("abs", host, nd.label); css(l, `left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;font-family:var(--lat);font-weight:800;font-size:${nd.size || 46}px;color:${col}`);
        tl.set([c, l], { opacity: 0, scale: 0.5 }, 0); tl.set(gl, { opacity: 0 }, 0); return { c, l, gl, x, y, col }; });
      const dot = mk("abs", host); dot.setAttribute("data-nofit", ""); css(dot, `left:0;top:0;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;background:#fff`); tl.set(dot, { opacity: 0 }, 0);
      return {
        nodes, show: (t, each) => { tl.to(ring, { opacity: 1, duration: 0.4, immediateRender: false }, t); nodes.forEach((nd, i) => pop([nd.c, nd.l], t + 0.15 + i * (each ?? 0.3))); },
        spin: (t, laps, each) => { const e = each ?? 0.8, p = { a: 0 }, total = (laps || 1) * n * e; tl.set(dot, { opacity: 1 }, t);
          tl.fromTo(p, { a: 0 }, { a: (laps || 1) * 2 * Math.PI, duration: total, ease: "none", immediateRender: false, onUpdate: () => { const a = ang(0) + p.a; dot.style.left = o.cx + r * Math.cos(a) + "px"; dot.style.top = o.cy + r * Math.sin(a) + "px"; } }, t);
          for (let k = 0; k < (laps || 1) * n; k++) { const nd = nodes[k % n]; tl.to(nd.gl, { opacity: 1, duration: 0.2, immediateRender: false }, t + k * e); tl.to(nd.gl, { opacity: 0, duration: 0.3, immediateRender: false }, t + k * e + 0.4); }
          tl.to(dot, { opacity: 0, duration: 0.2, immediateRender: false }, t + total); },
        hide: (t) => out(nodes.flatMap((nd) => [nd.c, nd.l, nd.gl]).concat([svg]), t),
      };
    };

    // ---------- STACK (context window) ----------
    M.stack = (host, o) => {
      const frame = mk("glass", host); css(frame, `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-radius:40px;border-color:rgba(91,192,235,.7)`);
      const cap = o.title ? label(host, o.title, o.x, o.y - 62, o.w, 36, CYAN, "font-family:var(--code);letter-spacing:.12em") : null;
      tl.set(cap ? [frame, cap] : [frame], { opacity: 0, scale: 0.9 }, 0);
      const items = []; let y = o.y + o.h - 24; o.items.forEach((it) => { const h = it.h || 90; y -= h; const b = mk("abs", host, it.label); css(b, `left:${o.x + 24}px;top:${y}px;width:${o.w - 48}px;height:${h - 12}px;border-radius:20px;background:${ca(it.color || ACC, 0.2)};border:3px solid ${it.color || ACC};display:flex;align-items:center;padding-left:28px;font-family:var(--lat);font-weight:800;font-size:${it.size || 40}px;color:${TEXT}`); items.push({ b, y }); });
      tl.set(items.map((i) => i.b), { opacity: 0, y: 160 }, 0);
      const cut = mk("abs", host, o.forget || "forgotten"); css(cut, `left:${o.x}px;top:${o.y + o.h + 14}px;width:${o.w}px;text-align:center;font-family:var(--lat);font-weight:800;font-size:40px;color:${HOT}`); tl.set(cut, { opacity: 0 }, 0);
      return {
        items, show: (t) => tl.to(cap ? [frame, cap] : [frame], { opacity: 1, scale: 1, duration: 0.4, immediateRender: false }, t),
        fill: (t, each) => items.forEach((it, i) => tl.to(it.b, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, t + i * (each ?? 0.4))),
        overflow: (t, n) => { for (let i = 0; i < n; i++) tl.to(items[i].b, { opacity: 0, y: 140, duration: 0.5, ease: "power2.in", immediateRender: false }, t + i * 0.12);
          tl.fromTo(cut, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.35, immediateRender: false }, t + 0.2); },
        hide: (t) => out([frame, cap, cut].filter(Boolean).concat(items.map((i) => i.b)), t),
      };
    };

    // ---------- DISTRIBUTION BARS ----------
    M.dist = (host, o) => {
      const n = o.bars.length, gap = o.gap || 26, bw = (o.w - gap * (n - 1)) / n, base = o.y + o.h, bars = [], labs = [];
      const axis = mk("abs", host); css(axis, `left:${o.x - 10}px;top:${base}px;width:${o.w + 20}px;height:6px;border-radius:3px;background:rgba(143,160,184,.6)`); tl.set(axis, { opacity: 0 }, 0);
      o.bars.forEach((b, i) => { const x = o.x + i * (bw + gap), col = b.color || ACC;
        const el = mk("abs", host); css(el, `left:${x}px;top:${o.y}px;width:${bw}px;height:${o.h}px;border-radius:18px 18px 0 0;background:${col};transform-origin:50% 100%`);
        const lb = mk("abs", host, b.label); css(lb, `left:${x - 20}px;top:${base + 18}px;width:${bw + 40}px;text-align:center;font-family:var(--lat);font-weight:800;font-size:${o.lsize || 38}px;color:${TEXT};white-space:nowrap`);
        tl.set(el, { scaleY: 0, opacity: 1 }, 0); tl.set(lb, { opacity: 0 }, 0); bars.push({ el, p: b.p, col }); labs.push(lb); });
      return {
        bars, show: (t) => { tl.to(axis, { opacity: 1, duration: 0.2, immediateRender: false }, t); bars.forEach((b, i) => { tl.to(b.el, { scaleY: b.p, duration: 0.7, ease: "power3.out", immediateRender: false }, t + 0.1 + i * 0.1); tl.to(labs[i], { opacity: 1, duration: 0.25, immediateRender: false }, t + 0.1 + i * 0.1); }); },
        set: (t, ps, dur) => bars.forEach((b, i) => tl.to(b.el, { scaleY: ps[i], duration: dur || 0.9, ease: "power3.inOut", immediateRender: false }, t)),
        cut: (t, k) => bars.forEach((b, i) => { if (i >= k) tl.to([b.el, labs[i]], { opacity: 0.18, duration: 0.4, immediateRender: false }, t); }),
        mark: (t, i, color) => tl.to(bars[i].el, { backgroundColor: color || HOT, boxShadow: "none", duration: 0.3, immediateRender: false }, t),
        hide: (t) => out([axis].concat(bars.map((b) => b.el), labs), t),
      };
    };

    // ---------- CODE BLOCK ----------
    M.code = (host, o) => {
      const size = o.size || 40, lh = Math.round(size * 1.65), W = o.w || 900, h = o.lines.length * lh + 64, card = mk("glass", host); css(card, `left:${o.x}px;top:${o.y}px;width:${W}px;height:${h}px;border-radius:30px;background:linear-gradient(160deg,#0B1226,#070C1B)`);
      const bars = [], lines = o.lines.map((l, i) => { const hl = mk("abs", host); css(hl, `left:${o.x + 14}px;top:${o.y + 32 + i * lh}px;width:${W - 28}px;height:${lh}px;border-radius:12px;background:rgba(167,139,250,0)`); bars.push(hl);
        const el = mk("abs", host, l); css(el, `left:${o.x + 40}px;top:${o.y + 32 + i * lh}px;height:${lh}px;display:flex;align-items:center;font-family:var(--code);font-weight:700;font-size:${size}px;color:${TEXT};white-space:pre`); return el; });
      tl.set(card, { opacity: 0, scale: 0.9 }, 0); tl.set(lines, { opacity: 0, x: -20 }, 0); tl.set(bars, { opacity: 0 }, 0);
      return {
        height: h, show: (t, each) => { tl.to(card, { opacity: 1, scale: 1, duration: 0.35, immediateRender: false }, t); tl.to(lines, { opacity: 1, x: 0, duration: 0.3, stagger: each ?? 0.25, immediateRender: false }, t + 0.2); },
        hl: (t, i, color) => { tl.set(bars[i], { backgroundColor: ca(color || ACC, 0.3) }, t); tl.to(bars[i], { opacity: 1, duration: 0.25, immediateRender: false }, t); },
        hide: (t) => out([card].concat(lines, bars), t),
      };
    };

    // ---------- PLOT (line chart) ----------
    M.plot = (host, o) => {
      const frame = mk("glass", host); css(frame, `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;border-radius:36px`);
      const svg = svgLayer(host), pad = { l: 90, r: 50, t: 60, b: 90 }, X0 = o.x + pad.l, X1 = o.x + o.w - pad.r, Y0 = o.y + o.h - pad.b, Y1 = o.y + pad.t;
      const px = (u) => X0 + u * (X1 - X0), py = (v) => Y0 - v * (Y0 - Y1);
      const grid = sv("g", {}, svg); for (let i = 0; i <= 4; i++) { sv("line", { x1: X0, x2: X1, y1: py(i / 4), y2: py(i / 4), stroke: "rgba(143,160,184,.22)", "stroke-width": 2 }, grid); }
      sv("line", { x1: X0, x2: X0, y1: Y1, y2: Y0, stroke: "rgba(243,239,230,.7)", "stroke-width": 4, "stroke-linecap": "round" }, grid); sv("line", { x1: X0, x2: X1, y1: Y0, y2: Y0, stroke: "rgba(243,239,230,.7)", "stroke-width": 4, "stroke-linecap": "round" }, grid);
      const lab = [];
      if (o.xlabel) lab.push(label(host, o.xlabel, o.x, o.y + o.h - 62, o.w, 34, MUTED, "font-family:var(--code);letter-spacing:.1em"));
      if (o.ylabel) { const yl = label(host, o.ylabel, o.x - o.h / 2 + 30, o.y + o.h / 2 - 20, o.h, 34, MUTED, "font-family:var(--code);letter-spacing:.1em;transform:rotate(-90deg)"); lab.push(yl); }
      const ser = o.series.map((s) => { const col = s.color || ACC, pts = s.pts.map(([u, v]) => [px(u), py(v)]); let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        const path = sv("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: col, "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": L }, svg); tl.set(path, { strokeDashoffset: L, opacity: 0 }, 0); return { path, L, pts, col, label: s.label }; });
      tl.set([frame].concat(lab), { opacity: 0, scale: 0.94 }, 0); tl.set(grid, { opacity: 0 }, 0);
      const extra = [];
      return {
        px, py,
        show: (t) => { tl.to([frame].concat(lab), { opacity: 1, scale: 1, duration: 0.4, immediateRender: false }, t); tl.to(grid, { opacity: 1, duration: 0.4, immediateRender: false }, t); },
        draw: (t, dur) => ser.forEach((s, i) => { tl.set(s.path, { opacity: 1 }, t + i * 0.2); tl.fromTo(s.path, { strokeDashoffset: s.L }, { strokeDashoffset: 0, duration: dur || 1.4, ease: "power2.inOut", immediateRender: false }, t + i * 0.2); }),
        dot: (t, si, pi, d) => { d = d || {}; const [x, y] = ser[si].pts[pi], col = d.color || ser[si].col; const dotEl = mk("abs", host); css(dotEl, `left:${x - 18}px;top:${y - 18}px;width:36px;height:36px;border-radius:50%;background:#fff`);
          tl.set(dotEl, { opacity: 0, scale: 0 }, 0); tl.to(dotEl, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t); extra.push(dotEl);
          if (d.label) { const w = mk("abs", host); w.setAttribute("data-nofit", ""); css(w, `left:${x - 200}px;top:${y - 100}px;width:400px;display:flex;justify-content:center`); const p = document.createElement("div"); p.textContent = d.label; p.style.cssText = `padding:6px 22px;border-radius:999px;background:${col};color:#06101F;font-family:var(--lat);font-weight:800;font-size:${d.size || 36}px;white-space:nowrap`; w.appendChild(p); tl.set(w, { opacity: 0, scale: 0.3 }, 0); tl.to(w, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t + 0.1); extra.push(w); } },
        hide: (t) => out([frame, svg].concat(lab, extra), t),
      };
    };

    // ---------- HEAT (grid of values) ----------
    M.heat = (host, o) => {
      const cell = o.cell || 120, lsz = o.lsize || 34, rl = o.rows || [], cl = o.cols || [], colr = o.color || CYAN, lw = o.labelW || 190, top = cl.length ? 70 : 0, extra = [];
      const nC = o.values[0].length, cells = [], labs = [];
      cl.forEach((c, j) => { const e = label(host, c, o.x + lw + j * cell - 20, o.y, cell + 40, lsz, MUTED, "font-family:var(--code)"); tl.set(e, { opacity: 0 }, 0); labs.push(e); });
      rl.forEach((r, i) => { const e = label(host, r, o.x, o.y + top + i * cell + cell / 2 - lsz * 0.6, lw - 14, lsz, MUTED, "font-family:var(--code);text-align:right"); tl.set(e, { opacity: 0 }, 0); labs.push(e); });
      o.values.forEach((row, i) => row.forEach((v, j) => { const d = mk("abs", host); css(d, `left:${o.x + lw + j * cell + 4}px;top:${o.y + top + i * cell + 4}px;width:${cell - 8}px;height:${cell - 8}px;border-radius:16px;background:${ca(colr, 0.1 + 0.9 * v)};${v > 0.55 ? `` : ""}`); tl.set(d, { opacity: 0, scale: 0.4 }, 0); cells.push(d); }));
      return {
        show: (t, each) => { tl.to(labs, { opacity: 1, duration: 0.3, immediateRender: false }, t); cells.forEach((d, k) => tl.to(d, { opacity: 1, scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, t + 0.1 + Math.floor(k / nC) * (each ?? 0.12) + (k % nC) * 0.02)); },
        pick: (t, r, c, color) => { const b = mk("abs", host); css(b, `left:${o.x + lw + c * cell - 2}px;top:${o.y + top + r * cell - 2}px;width:${cell + 4}px;height:${cell + 4}px;border-radius:18px;border:6px solid ${color || ACC}`); tl.set(b, { opacity: 0, scale: 1.4 }, 0); tl.to(b, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t); extra.push(b); },
        row: (t, r, color) => { const b = mk("abs", host); css(b, `left:${o.x + lw - 6}px;top:${o.y + top + r * cell - 4}px;width:${nC * cell + 12}px;height:${cell + 8}px;border-radius:20px;border:6px solid ${color || ACC}`); tl.set(b, { opacity: 0, scaleX: 0.6 }, 0); tl.to(b, { opacity: 1, scaleX: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, t); extra.push(b); },
        hide: (t) => out(cells.concat(labs, extra), t),
      };
    };
    return M;
  }
  return { install, ICONS };
})();
