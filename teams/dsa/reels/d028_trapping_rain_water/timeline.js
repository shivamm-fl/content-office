      // bar charts drawn from the real array (seek-safe: built once, animated by the timeline)
      const H = [4, 2, 0, 3, 2, 5], WAT = [0, 2, 4, 1, 2, 0];
      const el = (cls, host, css, txt) => { const d = document.createElement("div"); d.className = cls; Object.assign(d.style, css); if (txt !== undefined) d.textContent = txt; host.appendChild(d); return d; };
      const chart = (sel, arr, o = {}) => {
        const h = q(sel), U = o.u || 80, BW = o.bw || 120, GAP = o.gap || 30, base = o.base || 420, n = arr.length;
        const left0 = (1080 - (n * BW + (n - 1) * GAP)) / 2, x = (i) => left0 + i * (BW + GAP);
        const c = { U, BW, base, x, cx: (i) => x(i) + BW / 2, bars: [], water: [], lab: [], idx: [], h };
        el("floor", h, { left: (left0 - 20) + "px", width: (n * BW + (n - 1) * GAP + 40) + "px", top: base + "px" });
        arr.forEach((v, i) => {
          const wv = o.filled ? o.filled[i] : 0;
          c.water.push(el("wat", h, { left: x(i) + "px", width: BW + "px", top: (base - (v + wv) * U) + "px", height: (wv * U) + "px" }));
          c.bars.push(el("bar2", h, { left: x(i) + "px", width: BW + "px", top: (base - v * U) + "px", height: (v * U) + "px" }));
          c.lab.push(el("hv", h, { left: x(i) + "px", width: BW + "px", top: (base + 12) + "px" }, String(v)));
          if (o.idx) c.idx.push(el("ix", h, { left: x(i) + "px", width: BW + "px", top: (base + 64) + "px" }, "i=" + i));
        });
        return c;
      };
      const fill = (c, i, wv, t, d) => tl.to(c.water[i], { height: wv * c.U, top: c.base - (H[i] + wv) * c.U, duration: d ?? 0.5, ease: "power2.out" }, t);
      const ptr = (c, txt, i, color) => el("ptr", c.h, { left: (c.cx(i) - 38) + "px", top: (c.base + 108) + "px", background: color }, txt);
      const lvl = (c, i0, i1, v) => el("lvl", c.h, { left: c.x(i0) + "px", width: (c.x(i1) + c.BW - c.x(i0)) + "px", top: (c.base - v * c.U) + "px" });
      const hlBar = (c, i, t, color) => tl.to(c.bars[i], { backgroundColor: color, duration: 0.25 }, t);

      // A: frame 0 shows the filled picture and the question
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      chart("#a_ch", H, { u: 70, base: 400, filled: WAT });
      // B: the problem, the rain, the given array, the answer
      show("#b_t", at("B", "problem") - 0.1, { s: 1.08 });
      const b = chart("#b_ch", H, { idx: true });
      b.bars.forEach((d, i) => { tl.fromTo(d, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.4, ease: "power2.out" }, at("B", "bar") - 0.2 + i * 0.1); });
      WAT.forEach((w, i) => { if (w) fill(b, i, w, at("B", "paani") - 0.3 + i * 0.12, 0.9); });
      tl.set("#b_arr", { opacity: 0 }, 0); tl.to("#b_arr", { opacity: 1, duration: 0.2 }, at("B", "given") - 0.1);
      [["#b_v0", "four", 0], ["#b_v1", "two", 0], ["#b_v2", "zero", 0], ["#b_v3", "three", 0], ["#b_v4", "two", 1], ["#b_v5", "five", 0]].forEach(([s, w, n], i) => {
        tl.fromTo(s, { color: "#E8EDF6" }, { color: "#A78BFA", duration: 0.15 }, at("B", w, n) - 0.05);
        tl.to(b.bars[i], { borderColor: "#F2B544", duration: 0.12, yoyo: true, repeat: 1 }, at("B", w, n) - 0.05);
      });
      show("#b_ans", at("B", "answer") - 0.1, { s: 1.08 });
      // C: one bar: left max, right max, the smaller one sets the level; then the formula
      show("#c_t", at("C", "ek") - 0.1, { s: 1.05 });
      const c = chart("#c_ch", H, { idx: true });
      tl.to(c.bars[2], { borderColor: "#F2B544", duration: 0.2 }, at("C", "bar"));
      const cpt = el("ptr", c.h, { left: (c.cx(2) - 38) + "px", top: (c.base + 108) + "px", background: "#F2B544" }, "?");
      tl.set(cpt, { opacity: 0 }, 0); show(cpt, at("C", "bar") - 0.1, { s: 1.3 });
      hlBar(c, 0, at("C", "left") - 0.1, "#A78BFA");
      const lv4 = lvl(c, 0, 2, 4); tl.set(lv4, { opacity: 0 }, 0); tl.to(lv4, { opacity: 1, duration: 0.2 }, at("C", "left") + 0.3);
      tl.to(c.bars[5], { backgroundColor: "#5BC0EB", borderColor: "#5BC0EB", duration: 0.25 }, at("C", "right") - 0.1);
      const lv5 = lvl(c, 2, 5, 5); lv5.style.borderTopColor = "#5BC0EB"; tl.set(lv5, { opacity: 0 }, 0); tl.to(lv5, { opacity: 1, duration: 0.2 }, at("C", "right") + 0.3);
      fill(c, 2, 4, at("C", "chhoti") - 0.1, 0.8);
      hide("#c_t", at("C", "water") - 0.2); show("#c_f", at("C", "water") - 0.1, { s: 1.05 });
      show("#c_n", at("C", "index") - 0.1, { s: 1.05 });
      tl.to("#c_n .n2", { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }, at("C", "four", 1));
      // D: brute force scans both sides for every bar
      show("#d_t", at("D", "brute") - 0.1, { s: 1.15 });
      const d = chart("#d_ch", H, { u: 60, base: 380 });
      tl.to(d.bars[2], { borderColor: "#F2B544", duration: 0.2 }, at("D", "har"));
      const scan = el("wat", d.h, { left: d.x(0) + "px", width: d.BW + "px", top: (d.base - 320) + "px", height: "320px", background: "rgba(232,89,107,.22)" });
      tl.set(scan, { opacity: 0 }, 0); tl.to(scan, { opacity: 1, duration: 0.15 }, at("D", "donon") - 0.2);
      tl.to(scan, { left: d.x(5), duration: 1.6, ease: "none" }, at("D", "donon"));
      tl.to(scan, { left: d.x(0), duration: 1.2, ease: "none" }, at("D", "donon") + 1.6);
      tl.to(scan, { opacity: 0, duration: 0.2 }, at("D", "ten") - 0.1);
      show("#d_big", at("D", "ten") - 0.1, { s: 1.05 });
      show("#d_o", at("D", "o") - 0.1, { s: 1.3 });
      show("#d_bn", at("D", "bottleneck") - 0.1, { s: 1.05 });
      // E: two helper arrays: O(n) time, O(n) space
      show("#e_t", at("E", "do") - 0.1, { s: 1.08 });
      const LM = [4, 4, 4, 4, 4, 5], RM = [5, 5, 5, 5, 5, 5];
      const row = (sel, vals, color, t) => vals.forEach((v, i) => { const cl = el("cell", q(sel), { left: (160 + i * 130) + "px", top: "0px", borderColor: color }, String(v)); tl.set(cl, { opacity: 0 }, 0); show(cl, t + i * 0.1, { s: 0.9, y: 0 }); });
      show("#e_l", at("E", "left") - 0.15, { s: 1 }); row("#e_lr", LM, "#A78BFA", at("E", "left"));
      show("#e_r", at("E", "right") - 0.15, { s: 1 }); row("#e_rr", RM, "#5BC0EB", at("E", "right"));
      show("#e_time", at("E", "time") - 0.1, { s: 1.08 });
      show("#e_space", at("E", "extra") - 0.1, { s: 1.08 });
      // F: only the smaller side matters: L at 4, R at 5, so the left water is set by left max
      show("#f_t", at("F", "formula") - 0.1, { s: 1.08 });
      const f = chart("#f_ch", H, { idx: true });
      const fl = ptr(f, "L", 0, "#A78BFA"), fr = ptr(f, "R", 5, "#5BC0EB");
      tl.set([fl, fr], { opacity: 0 }, 0); show(fl, at("F", "left") - 0.1, { s: 1.3 }); show(fr, at("F", "right") - 0.1, { s: 1.3 });
      hlBar(f, 0, at("F", "four") - 0.1, "#A78BFA");
      tl.to(f.bars[5], { backgroundColor: "#5BC0EB", borderColor: "#5BC0EB", duration: 0.25 }, at("F", "five") - 0.1);
      [1, 2, 3, 4].forEach((i) => tl.to(f.bars[i], { borderColor: "#F2B544", duration: 0.2 }, at("F", "left", 2) + (i - 1) * 0.12));
      show("#f_rm", at("F", "five", 1) - 0.4, { s: 1.08 });
      show("#f_lm", at("F", "abhi") - 0.3, { s: 1.08 });
      const flv = lvl(f, 1, 4, 4); tl.set(flv, { opacity: 0 }, 0); tl.to(flv, { opacity: 1, duration: 0.25 }, at("F", "tay") - 0.4);
      ["#f_lm", "#f_rm"].forEach((s) => hide(s, at("F", "isliye") - 0.15));
      tl.set("#f_rule", { opacity: 0 }, 0); show("#f_rule", at("F", "isliye"), { s: 1.04 });
      // G: dry run: only L moves, water adds up to 9, R never moves
      show("#g_t", at("G", "dry") - 0.1, { s: 1.1 });
      const g = chart("#g_ch", H, { idx: true });
      const gl = ptr(g, "L", 0, "#A78BFA"), gr = ptr(g, "R", 5, "#5BC0EB");
      const lv = lvl(g, 0, 4, 4); tl.set(lv, { opacity: 0 }, 0); tl.to(lv, { opacity: 1, duration: 0.2 }, at("G", "left") - 0.1);
      const TOT = [0, 2, 6, 7, 9], tots = TOT.map((v, k) => { const t = el("x c", q("#sG"), { top: "360px", fontSize: "64px", fontFamily: "JetBrains Mono, monospace" }); t.innerHTML = 'total = <span class="cyan">' + v + "</span>"; tl.set(t, { opacity: k ? 0 : 1 }, 0); return t; });
      tl.set("#g_tot", { opacity: 0 }, 0);
      [1, 2, 3, 4].forEach((i, k) => {
        tl.to(gl, { left: g.cx(i) - 38, duration: 0.35, ease: "power2.out" }, at("G", "index", k) - 0.1);
        if (WAT[i]) fill(g, i, WAT[i], at("G", "paani", k) - 0.05, 0.5);
        hide(tots[k], at("G", "paani", k) + 0.25, 0.1); tl.to(tots[k + 1], { opacity: 1, duration: 0.15 }, at("G", "paani", k) + 0.3);
      });
      tl.fromTo(gr, { scale: 1 }, { scale: 1.35, duration: 0.2, yoyo: true, repeat: 3 }, at("G", "right") - 0.05);
      // H: the actual code, one line lit as it is spoken
      show("#h_code", at("H", "code") - 0.1, { s: 0.97 });
      const HL = "rgba(167,139,250,.30)";
      const lit = (ids, t) => ids.forEach((id) => { tl.to(id, { backgroundColor: HL, duration: 0.15 }, t); });
      const unlit = (ids, t) => ids.forEach((id) => { tl.to(id, { backgroundColor: "rgba(0,0,0,0)", duration: 0.15 }, t); });
      lit(["#h_l5"], at("H", "height") - 0.1);
      lit(["#h_l6"], at("H", "left") - 0.1);
      lit(["#h_l7"], at("H", "left", 1) - 0.1);
      lit(["#h_l8"], at("H", "l", 2) - 0.1);
      unlit(["#h_l5", "#h_l6", "#h_l7", "#h_l8"], at("H", "varna") - 0.1);
      lit(["#h_l9", "#h_l10", "#h_l11"], at("H", "varna"));
      lit(["#h_l12"], at("H", "r") - 0.1);
      show("#h_run", at("H", "r") + 0.3, { s: 1, y: 10 });
      // I: complexity
      show("#i_t", at("I", "har") - 0.1, { s: 1.05 });
      show("#i_time", at("I", "time") - 0.1, { s: 1.08 });
      show("#i_space", at("I", "extra") - 0.1, { s: 1.08 });
      // J: interview answer
      show("#j_chip", at("J", "interview") - 0.05, { s: 0.85 });
      show("#j_1", at("J", "min") - 0.2, { s: 0.94 });
      show("#j_2", at("J", "two") - 0.1, { s: 0.94 });
      show("#j_3", at("J", "isliye") - 0.1, { s: 0.94 });
      // K: the question
      show("#k_arr", at("K", "array") - 0.1, { s: 1.08 });
      chart("#k_ch", [5, 0, 0, 0, 1], { base: 420 });
      show("#k_q", at("K", "kitna") - 0.1, { s: 1.08 });
      show("#k_c", at("K", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { trapping: "#A78BFA", rain: "#A78BFA", water: "#A78BFA", paani: "cyan", left: "#A78BFA", right: "cyan", max: "#A78BFA",
                       chhoti: "gold", pointer: "#A78BFA", squared: "hot", bottleneck: "hot", comment: "#A78BFA" } });
