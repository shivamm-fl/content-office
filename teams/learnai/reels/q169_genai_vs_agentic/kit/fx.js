/* small timeline helpers shared by the hand-built reels (seek-safe: no tl.call, no Math.random) */
window.FX = function (M) {
  const tl = M.tl, CAPS = window.REEL.hi.caps;
  const clean = (t) => t.replace(/[,।?:!"“”]+$/, "").replace(/\.$/, "").toLowerCase();
  const at = (sc, w, n) => { const m = CAPS.filter((c) => c.scene === sc && clean(c.t) === w.toLowerCase()); if (!m.length) throw new Error(`word ${w} not in ${sc}`); return (m[n || 0] || m[m.length - 1]).s; };
  const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const show = (el, t, o = {}) => tl.fromTo(el, { opacity: 0, scale: o.s ?? 1.2, y: o.y ?? 26 }, { opacity: 1, scale: 1, y: 0, duration: o.d ?? 0.32, ease: o.ease || "back.out(1.7)" }, t);
  const hide = (el, t, d) => tl.to(el, { opacity: 0, duration: d ?? 0.2, ease: "power1.in" }, t);
  const wipe = (el, t, d) => tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: d ?? 0.45, ease: "power2.out" }, t);
  const count = (el, from, to, t, dur, fmt) => { const o = { v: from }; q(el).textContent = fmt(from); tl.to(o, { v: to, duration: dur, ease: "power2.out", onUpdate: () => { q(el).textContent = fmt(o.v); } }, t); };
  return { tl, at, q, qa, show, hide, wipe, count };
};
