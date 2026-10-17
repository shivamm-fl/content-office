/* Paste into the <script> of a motion-kit reel (reels/_kit/motion.js + template_motion.html), after:
     const M = Mo.init({ order: ["A"], tag: "LEARNAI" }); const { tl, P, Ed, mk } = M; const A = M.$("#sA");
   Helpers for the india-ai-viral format: black/navy hook box with marks, pop-in, typed text, comment CTA card.
   The kit's dark world stays (never override the background to light). Emoji do not render: marks are drawn SVG. */
const css = (el, s) => { el.style.cssText += ";" + s; return el; };
const inside = (host, s, txt) => css(mk("abs", host, txt), s);
const GLASS = "background:linear-gradient(160deg,rgba(24,38,70,.96),rgba(12,20,40,.96));";
const ICON = {
  check: '<svg viewBox="0 0 48 48" width="50" height="50"><circle cx="24" cy="24" r="22" fill="#1FA64A" stroke="#fff" stroke-width="3"/><path d="M13 25l8 8 14-17" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross: '<svg viewBox="0 0 48 48" width="50" height="50"><circle cx="24" cy="24" r="22" fill="#D90429" stroke="#fff" stroke-width="3"/><path d="M15 15l18 18M33 15L15 33" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>',
  siren: '<svg viewBox="0 0 48 48" width="50" height="50"><path d="M24 4L45 41H3Z" fill="#D90429" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M24 17v13" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="36" r="3" fill="#fff"/></svg>' };
// lines = [[text, "siren|check|cross"|null], ...]; <= 3 lines, each <= ~28 chars at 50 px. Visible from frame 0 for the whole reel.
function hookbox(lines, fs) {
  const el = css(mk("abs", M.$("#cam")), "left:50px;top:190px;width:980px;box-sizing:border-box;padding:24px 28px;" + GLASS + "border:3px solid rgba(242,181,68,.85);border-radius:30px;box-shadow:0 0 50px rgba(242,181,68,.3),0 24px 60px rgba(0,0,0,.5);z-index:6");
  lines.forEach(([t, ic]) => { const r = css(mk("abs", el), `position:relative;margin:6px 0;color:#F3EFE6;font-weight:800;font-size:${fs || 52}px;line-height:64px;display:flex;align-items:center;justify-content:center;gap:14px;white-space:nowrap`);
    r.appendChild(document.createTextNode(t)); if (ic) { const s = document.createElement("span"); s.innerHTML = ICON[ic]; s.style.cssText = "display:inline-block;line-height:0"; r.appendChild(s); } });
  tl.fromTo(el, { scale: 1.1, y: -30 }, { scale: 1, y: 0, duration: 0.4, ease: "back.out(2)" }, 0);
  return el;
}
// seek-safe pop-in at time t (use P("A", k) for t)
function pop(el, t, o) { tl.set(el, { opacity: 0 }, 0); tl.fromTo(el, { opacity: 0, scale: (o && o.s) || 0.5, y: (o && o.y) || 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(2.2)", immediateRender: false }, t); return el; }
// text typed character by character between t0 and t1
function type(el, text, t0, t1) { const p = { n: 0 }; tl.fromTo(p, { n: 0 }, { n: text.length, duration: Math.max(0.2, t1 - t0), ease: "none", onUpdate: () => { el.textContent = text.slice(0, Math.round(p.n)); } }, t0); }
// a mistake row: red cross badge + title + green fix line. i = row index, y0 = first row top (575 for a 3-line hook), t = reveal time
function mistakeRow(i, title, fix, col, t, y0) {
  const c = css(mk("abs", A), `left:50px;top:${(y0 || 575) + i * 106}px;width:980px;height:96px;box-sizing:border-box;${GLASS}border:3px solid ${col};border-radius:24px;box-shadow:0 0 28px ${col}55`);
  inside(c, "left:18px;top:16px;width:60px;height:60px;border-radius:50%;background:#FF5C6C;color:#fff;font-weight:800;font-size:38px;line-height:58px;text-align:center", "✕");
  inside(c, "left:100px;top:6px;font-weight:800;font-size:40px;line-height:46px;color:#F3EFE6;white-space:nowrap", title);
  inside(c, "left:100px;top:54px;font-family:var(--code);font-weight:700;font-size:25px;line-height:32px;color:#7BD389;white-space:nowrap", fix);
  return pop(c, t, { s: 0.6, y: 40 });
}
// the comment call-to-action card (y 1120-1290, above the caption lane): "FOLLOW + COMMENT KARO" + keyword pill. t = P("A", k) - 0.1 of the "Guide chahiye?" phrase
function cta(kw, sub, t, fs) {
  const c = css(mk("abs", A), "left:50px;top:1120px;width:980px;height:170px;box-sizing:border-box;" + GLASS + "border:3px solid rgba(242,181,68,.85);border-radius:30px;box-shadow:0 0 50px rgba(242,181,68,.3),0 24px 60px rgba(0,0,0,.5);display:flex;align-items:center;padding:0 30px;gap:22px");
  c.innerHTML = `<div style="font-weight:800;color:#F2B544;font-size:34px;line-height:46px;flex:1;white-space:nowrap">FOLLOW + COMMENT KARO<br><span style="color:#F3EFE6;font-size:32px">${sub}</span></div><div style="background:#F2B544;color:#0B1220;border-radius:999px;box-shadow:0 0 30px rgba(242,181,68,.6);padding:4px 36px;font-weight:800;font-size:${fs || 76}px;line-height:94px;font-family:var(--lat)">${kw}</div>`;
  pop(c, t, { y: 70 }); M.burst(A, 540, 1205, t + 0.15, { n: 20, r: 300, color: "#F2B544" });
}
