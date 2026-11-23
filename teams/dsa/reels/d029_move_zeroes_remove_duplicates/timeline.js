      // array rows built once from the real arrays (seek-safe), animated by the timeline
      const V = "#A78BFA", CY = "#5BC0EB", RED = "#E8596B", GRN = "#4CC38A", GOLD = "#F2B544", MUT = "#8592AD";
      const el = (cls, host, css, txt) => { const d = document.createElement("div"); d.className = cls; Object.assign(d.style, css); if (txt !== undefined) d.textContent = txt; host.appendChild(d); return d; };
      const row = (sel, vals, o = {}) => {
        const host = q(sel), W = o.w || 150, G = o.g ?? 24, H = o.h || 140, top = o.top || 0, n = vals.length;
        const left0 = (1080 - (n * W + (n - 1) * G)) / 2, x = (i) => left0 + i * (W + G);
        const cells = vals.map((v, i) => el("cell", host, { left: x(i) + "px", top: top + "px", width: W + "px", height: H + "px", fontSize: (o.fs || 64) + "px" }, String(v)));
        const idx = o.idx ? vals.map((v, i) => el("ix", host, { left: x(i) + "px", width: W + "px", top: (top + H + 10) + "px", fontSize: (o.ifs || 30) + "px" }, (o.short ? "" : "i=") + i)) : [];
        return { host, cells, idx, x, W, cx: (i) => x(i) + W / 2 };
      };
      const ptr = (r, txt, i, top, color) => { const p = el("ptr", r.host, { left: (r.cx(i) - 38) + "px", top: top + "px", background: color }, txt); tl.set(p, { opacity: 0 }, 0); return p; };
      const moveP = (r, p, i, t) => tl.to(p, { left: r.cx(i) - 38, duration: 0.3, ease: "power2.out" }, t);
      const border = (c, color, t, d) => tl.to(c, { borderColor: color, duration: d ?? 0.2 }, t);
      const hid = (e) => { tl.set(e, { opacity: 0 }, 0); return e; };
      const swap = (r, a, b, i, j, t) => {   // cell a sits at slot i, cell b at slot j: they trade places in an arc
        tl.to(a, { left: r.x(j), duration: 0.45, ease: "power2.inOut" }, t); tl.to(a, { y: -70, duration: 0.22, yoyo: true, repeat: 1, ease: "power1.out" }, t);
        tl.to(b, { left: r.x(i), duration: 0.45, ease: "power2.inOut" }, t); tl.to(b, { y: 70, duration: 0.22, yoyo: true, repeat: 1, ease: "power1.out" }, t);
      };
      const MZ = [0, 1, 0, 3, 12], DUP = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];

      // A: frame 0 = both problem names, the array and the question; the zeros glide to the end
      tl.fromTo(["#a_h1", "#a_h2"], { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      const a = row("#a_row", MZ);
      a.cells.forEach((c, i) => { if (!MZ[i]) c.style.borderColor = RED; });
      [[1, 0], [3, 1], [4, 2], [0, 3], [2, 4]].forEach(([c, j], k) => tl.to(a.cells[c], { left: a.x(j), duration: 0.7, ease: "power2.inOut" }, 1.4 + k * 0.08));
      tl.to([a.cells[0], a.cells[2]], { y: -40, duration: 0.35, yoyo: true, repeat: 1 }, 1.4);

      // B: problem one: three rules, the given array, the answer
      show("#b_p", at("B", "problem") - 0.1, { s: 0.9 }); show("#b_t", at("B", "move") - 0.1, { s: 1.05 });
      show("#b_r1", at("B", "zeros") - 0.1, { s: 1.1 }); show("#b_r2", at("B", "order") - 0.1, { s: 1.1 }); show("#b_r3", at("B", "naya") - 0.1, { s: 1.1 });
      show("#b_gl", at("B", "given") - 0.1, { s: 1 });
      const bg = row("#b_g", MZ);
      [["zero", 0], ["one", 1], ["zero", 1], ["three", 0], ["twelve", 0]].forEach(([w, n], i) => { hid(bg.cells[i]); show(bg.cells[i], at("B", w, n) - 0.08, { s: 1.25, y: 0 }); if (!MZ[i]) border(bg.cells[i], RED, at("B", w, n) + 0.2); });
      show("#b_al", at("B", "answer") - 0.1, { s: 1 });
      const ba = row("#b_a", [1, 3, 12, 0, 0]);
      [["one", 2], ["three", 1], ["twelve", 1], ["zero", 2], ["zero", 3]].forEach(([w, n], i) => { hid(ba.cells[i]); ba.cells[i].style.borderColor = i < 3 ? GRN : RED; show(ba.cells[i], at("B", w, n) - 0.08, { s: 1.25, y: 0 }); });

      // C: brute force: the zero lifts, everything after it shifts left, the zero lands at the end
      show("#c_t", at("C", "brute") - 0.1, { s: 1.15 });
      const c = row("#c_row", MZ, { idx: true });
      border(c.cells[0], RED, at("C", "zero") - 0.05); tl.to(c.cells[0], { y: -70, duration: 0.35, ease: "power2.out" }, at("C", "mila"));
      [1, 2, 3, 4].forEach((i, k) => tl.to(c.cells[i], { left: c.x(i - 1), duration: 0.3, ease: "power2.out" }, at("C", "khiskao") - 0.2 + k * 0.22));
      tl.to(c.cells[0], { left: c.x(4), duration: 0.6, ease: "power2.inOut" }, at("C", "aakhir")); tl.to(c.cells[0], { y: 0, duration: 0.35, ease: "power2.in" }, at("C", "aakhir") + 0.6);
      show("#c_n", at("C", "ten") - 0.1, { s: 1.05 });
      show("#c_m", at("C", "fifty") - 0.1, { s: 1.1 });
      show("#c_o", at("C", "o") - 0.1, { s: 1.3 });
      show("#c_b", at("C", "bottleneck") - 0.1, { s: 1.08 });

      // D: where does each non-zero land? the count of non-zeros before it; that count is the write pointer
      show("#d_q", at("D", "socho") - 0.1, { s: 1.06 });
      const d = row("#d_row", MZ, { idx: true });
      d.cells.forEach((cl, i) => { if (MZ[i]) border(cl, V, at("D", "non-zero") - 0.05); });
      [[1, 0], [3, 1], [4, 2]].forEach(([i, j], k) => { const nx = hid(el("nx", d.host, { left: d.x(i) + "px", width: d.W + "px", top: "196px" }, "→ " + j)); show(nx, at("D", "usse") + k * 0.45, { s: 1.3, y: 0 }); });
      show("#d_rule", at("D", "naya") - 0.15, { s: 1.04 });
      show("#d_cnt", at("D", "counter") - 0.1, { s: 1.06 });
      const dw = ptr(d, "W", 0, 250, V), dr = ptr(d, "R", 0, 250, CY);
      tl.set(dw, { x: -42 }, 0); tl.set(dr, { x: 42 }, 0);
      show(dw, at("D", "write") - 0.1, { s: 1.3, y: 0 }); show(dr, at("D", "read") - 0.1, { s: 1.3, y: 0 });
      tl.to(dr, { left: d.cx(4) - 38, duration: 2.2, ease: "none" }, at("D", "har", 1));
      ["#d_q", "#d_row", "#d_rule", "#d_cnt"].forEach((s) => hide(s, at("D", "read", 1) - 0.2));
      show("#d_code", at("D", "read", 1), { s: 0.97 });
      const HL = "rgba(167,139,250,.30)", lit = (id, t) => tl.to(id, { backgroundColor: HL, duration: 0.15 }, t), unlit = (id, t) => tl.to(id, { backgroundColor: "rgba(0,0,0,0)", duration: 0.15 }, t);
      lit("#d_l2", at("D", "read", 1)); lit("#d_l3", at("D", "non-zero", 3) - 0.1);
      lit("#d_l4", at("D", "swap") - 0.1); lit("#d_l5", at("D", "write", 2) - 0.1);
      show("#d_run", at("D", "swap") + 0.4, { s: 1, y: 10 });

      // E: dry run: R reads every cell, W only moves after a swap
      show("#e_t", at("E", "dry") - 0.1, { s: 1.1 });
      const e = row("#e_row", MZ, { top: 90, idx: true });
      e.cells.forEach((cl, i) => { if (!MZ[i]) cl.style.borderColor = RED; });
      const ew = ptr(e, "W", 0, 0, V), er = ptr(e, "R", 0, 300, CY);
      show(ew, at("E", "write") - 0.1, { s: 1.3, y: 0 }); show(er, at("E", "index") - 0.1, { s: 1.3, y: 0 });
      const skip = (cl, t) => tl.to(cl, { opacity: 0.45, duration: 0.15, yoyo: true, repeat: 1 }, t);
      skip(e.cells[0], at("E", "skip", 0));
      moveP(e, er, 1, at("E", "index", 1) - 0.1); swap(e, e.cells[0], e.cells[1], 0, 1, at("E", "swap", 0) - 0.15); moveP(e, ew, 1, at("E", "write", 1) - 0.1);
      moveP(e, er, 2, at("E", "index", 3) - 0.1); skip(e.cells[0], at("E", "skip", 1));
      moveP(e, er, 3, at("E", "index", 4) - 0.1); swap(e, e.cells[0], e.cells[3], 1, 3, at("E", "swap", 1) - 0.15); moveP(e, ew, 2, at("E", "write", 2) - 0.1);
      moveP(e, er, 4, at("E", "index", 6) - 0.1); swap(e, e.cells[2], e.cells[4], 2, 4, at("E", "swap", 2) - 0.15);
      [1, 3, 4].forEach((i) => border(e.cells[i], GRN, at("E", "bana") - 0.1, 0.3));
      show("#e_ok", at("E", "zeros", 0) - 0.1, { s: 1.08 });

      // F: problem two: sorted array, each number once, return k
      show("#f_p", at("F", "problem") - 0.1, { s: 0.9 }); show("#f_t", at("F", "remove") - 0.1, { s: 1.05 });
      show("#f_r1", at("F", "sorted") - 0.1, { s: 1.1 }); show("#f_r2", at("F", "ek") - 0.1, { s: 1.1 }); show("#f_r3", at("F", "batao") - 0.1, { s: 1.1 });
      show("#f_gl", at("F", "given") - 0.1, { s: 1 });
      const ROW10 = { w: 88, g: 10, h: 110, fs: 50 };
      const fg = row("#f_g", DUP, ROW10);
      [["zero", 0], ["zero", 1], ["one", 0], ["one", 1], ["one", 2], ["two", 1], ["two", 2], ["three", 0], ["three", 1], ["four", 0]].forEach(([w, n], i) => { hid(fg.cells[i]); show(fg.cells[i], at("F", w, n) - 0.06, { s: 1.25, y: 0 }); });
      show("#f_al", at("F", "five") - 0.1, { s: 1.1 });
      const fa = row("#f_a", [0, 1, 2, 3, 4], ROW10);
      [["zero", 2], ["one", 3], ["two", 3], ["three", 2], ["four", 1]].forEach(([w, n], i) => { hid(fa.cells[i]); fa.cells[i].style.borderColor = GRN; show(fa.cells[i], at("F", w, n) - 0.06, { s: 1.25, y: 0 }); });

      // G: same numbers sit together, so "new" = different from the last kept number; the code
      show("#g_t", at("G", "wahi") - 0.1, { s: 1.06 });
      const g = row("#g_row", DUP, { ...ROW10, idx: true, short: true, ifs: 26 });
      [[0, 1], [2, 4], [5, 6], [7, 8], [9, 9]].forEach(([i0, i1], k) => { const b = hid(el("grp", g.host, { left: g.x(i0) + "px", width: (g.x(i1) + g.W - g.x(i0)) + "px", top: "-22px" })); tl.to(b, { opacity: 1, duration: 0.2 }, at("G", "saath-saath") + k * 0.12); });
      show("#g_c", at("G", "koi") - 0.1, { s: 1.06 });
      border(g.cells[0], GRN, at("G", "pahla") - 0.1);
      hide("#g_c", at("G", "pahla") - 0.2); show("#g_code", at("G", "pahla"), { s: 0.97 });
      const gw = ptr(g, "W", 1, 150, V), gr = ptr(g, "R", 1, 150, CY);
      tl.set(gw, { x: -42 }, 0); tl.set(gr, { x: 42 }, 0);
      show(gw, at("G", "write") - 0.1, { s: 1.3, y: 0 }); lit("#g_l1", at("G", "write") - 0.1);
      show(gr, at("G", "read") - 0.1, { s: 1.3, y: 0 }); lit("#g_l2", at("G", "read") - 0.1); lit("#g_l3", at("G", "naya", 1) - 0.1);
      lit("#g_l4", at("G", "likho") - 0.1); lit("#g_l5", at("G", "write", 2) - 0.1);

      // H: dry run: R reads, a new number is written into slot W, W moves on
      show("#h_t", at("H", "dry") - 0.1, { s: 1.1 });
      const h = row("#h_row", DUP, { ...ROW10, top: 90, idx: true, short: true, ifs: 26 });
      const hw = ptr(h, "W", 1, 0, V), hr = ptr(h, "R", 1, 250, CY);
      show(hw, at("H", "doosra") - 0.1, { s: 1.3, y: 0 }); show(hr, at("H", "doosra"), { s: 1.3, y: 0 });
      tl.to(h.cells[1], { opacity: 0.4, duration: 0.2 }, at("H", "skip"));
      const ghost = (slot, v, t) => { const gh = hid(el("cell", h.host, { left: h.x(slot) + "px", top: "90px", width: "88px", height: "110px", fontSize: "50px", background: "#2B2350", borderColor: V }, String(v))); show(gh, t, { s: 1.35, y: -30 }); };
      moveP(h, hr, 2, at("H", "one") - 0.15); ghost(1, 1, at("H", "index", 0) - 0.05); moveP(h, hw, 2, at("H", "index", 0) + 0.35);
      moveP(h, hr, 3, at("H", "baaki") - 0.1); tl.to(h.cells[3], { opacity: 0.4, duration: 0.2 }, at("H", "baaki")); moveP(h, hr, 4, at("H", "baaki") + 0.35); tl.to(h.cells[4], { opacity: 0.4, duration: 0.2 }, at("H", "baaki") + 0.4);
      moveP(h, hr, 5, at("H", "two") - 0.15); ghost(2, 2, at("H", "index", 1) - 0.05); moveP(h, hw, 3, at("H", "index", 1) + 0.35);
      tl.to(h.cells[6], { opacity: 0.4, duration: 0.2 }, at("H", "three") - 0.3); moveP(h, hr, 7, at("H", "three") - 0.15); ghost(3, 3, at("H", "index", 2) - 0.05); moveP(h, hw, 4, at("H", "index", 2) + 0.35);
      tl.to(h.cells[8], { opacity: 0.4, duration: 0.2 }, at("H", "four") - 0.3); moveP(h, hr, 9, at("H", "four") - 0.15); ghost(4, 4, at("H", "index", 3) - 0.05); moveP(h, hw, 5, at("H", "index", 3) + 0.35);
      tl.fromTo(hw, { scale: 1 }, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }, at("H", "write") - 0.05);
      [5, 6, 7, 8, 9].forEach((i) => tl.to(h.cells[i], { opacity: 0.25, duration: 0.25 }, at("H", "answer") - 0.1));
      border(h.cells[0], GRN, at("H", "answer") - 0.1);
      show("#h_k", at("H", "answer") - 0.1, { s: 1.1 });

      // I: complexity
      show("#i_t", at("I", "donon") - 0.1, { s: 1.05 });
      show("#i_time", at("I", "time") - 0.1, { s: 1.08 });
      show("#i_space", at("I", "extra") - 0.1, { s: 1.08 });

      // J: interview answer
      show("#j_chip", at("J", "interview") - 0.05, { s: 0.85 });
      show("#j_1", at("J", "read") - 0.1, { s: 0.94 });
      show("#j_2", at("J", "write") - 0.1, { s: 0.94 });
      show("#j_3", at("J", "move") - 0.1, { s: 0.94 });
      show("#j_4", at("J", "remove") - 0.1, { s: 0.94 });

      // K: the question (Remove Element: drop every 3)
      show("#k_t", at("K", "array") - 0.1, { s: 1.08 });
      const k = row("#k_row", [3, 2, 2, 3]);
      k.cells.forEach((cl, i) => { if (i === 0 || i === 3) cl.style.borderColor = RED; hid(cl); show(cl, at("K", "array") + i * 0.1, { s: 1.2, y: 0 }); });
      show("#k_q", at("K", "write") - 0.1, { s: 1.06 });
      show("#k_c", at("K", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { zeroes: "#A78BFA", zeros: "hot", duplicates: "#A78BFA", write: "#A78BFA", read: "cyan", pointer: "#A78BFA", swap: "gold",
                       sorted: "cyan", "non-zero": "gold", squared: "hot", bottleneck: "hot", comment: "#A78BFA" } });
