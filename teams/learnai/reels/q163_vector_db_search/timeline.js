      // a fixed scatter (seeded, so every render is identical): 6 groups ("mohalle") of 14 points, plus the true nearest point of the query
      let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const C = [[150, 130], [450, 110], [760, 150], [170, 420], [470, 400], [770, 430]];
      const P = []; C.forEach((c, g) => { for (let i = 0; i < 14; i++) P.push([c[0] + (rnd() - 0.5) * 170, c[1] + (rnd() - 0.5) * 150, g]); });
      const Q = [330, 300], NEAR = [340, 230, 1];
      const plot = (host, opts = {}) => {
        const h = q(host), sy = (opts.h || 560) / 560, out = { dots: [], zones: [] };
        if (opts.zones) C.forEach((c, g) => { const z = document.createElement("div"); z.className = "zone"; z.style.left = c[0] + "px"; z.style.top = c[1] * sy + "px"; h.appendChild(z); out.zones.push(z); });
        P.concat([NEAR]).forEach((p) => { const d = document.createElement("div"); d.className = "dot"; d.style.left = p[0] + "px"; d.style.top = p[1] * sy + "px"; h.appendChild(d); out.dots.push([d, p]); });
        const qd = document.createElement("div"); qd.className = "q"; qd.style.left = Q[0] + "px"; qd.style.top = Q[1] * sy + "px"; h.appendChild(qd); out.q = qd;
        return out;
      };
      // A: the cloud of vectors and one query, on screen at frame 0
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      plot("#a_plot");
      show("#a_chip", at("A", "interview") - 0.05, { s: 0.9 });
      // B: a sentence becomes a list of numbers; close meaning = close points
      show("#b_t", at("B", "vector") - 0.1, { s: 1.2 });
      show("#b_q", at("B", "best") - 0.1, { s: 0.94 });
      show("#b_ar", at("B", "sentence") - 0.05, { s: 1, y: -10 });
      show("#b_v", at("B", "numbers") - 0.05, { s: 1 });
      show("#b_map", at("B", "milte-julte") - 0.1, { s: 0.94 });
      // C: brute force checks every point
      show("#c_t", at("C", "seedha") - 0.05, { s: 1.2 });
      show("#c_s", at("C", "query") - 0.05, { s: 1 });
      const cp = plot("#c_plot", { h: 440 });
      cp.dots.forEach(([d], i) => tl.to(d, { backgroundColor: "#E8596B", duration: 0.05 }, at("C", "har") + i * 0.025));
      show("#c_city", at("C", "chaabi") - 0.1, { s: 1.05 });
      show("#c_m", at("C", "millions") - 0.1, { s: 1.1 });
      // D: groups first, then only the nearby groups are opened
      show("#d_t", at("D", "vector") - 0.1, { s: 1.15 });
      show("#d_s", at("D", "groups") - 0.1, { s: 1 });
      const dp = plot("#d_plot", { zones: true });
      dp.dots.forEach(([d, p]) => tl.to(d, { backgroundColor: ["#F2B544", "#5BC0EB", "#9A8CEB", "#4CC38A", "#E8596B", "#D4A373"][p[2]], duration: 0.3 }, at("D", "groups")));
      tl.set(dp.q, { opacity: 0 }, 0); show(dp.q, at("D", "query") - 0.05, { s: 2, y: 0 });
      [0, 1, 2, 5].forEach((g) => { tl.to(dp.zones[g], { opacity: 0.15, duration: 0.3 }, at("D", "sirf")); dp.dots.filter(([, p]) => p[2] === g && p !== NEAR).forEach(([d]) => tl.to(d, { opacity: 0.15, duration: 0.3 }, at("D", "sirf"))); });
      tl.to(dp.dots[dp.dots.length - 1][0], { opacity: 0.15, duration: 0.3 }, at("D", "sirf"));
      show("#d_ann", at("D", "approximate") - 0.1, { s: 1.05 });
      // E: the true nearest point sits in a group that was not opened
      show("#e_t", at("E", "approximate") - 0.1, { s: 1.1 });
      const ep = plot("#e_plot", { zones: true });
      [0, 1, 2, 5].forEach((g) => { tl.set(ep.zones[g], { opacity: 0.15 }, 0); ep.dots.filter(([, p]) => p[2] === g).forEach(([d]) => tl.set(d, { opacity: 0.15 }, 0)); });
      const miss = ep.dots[ep.dots.length - 1][0];
      tl.set(miss, { backgroundColor: "#E8596B", width: 26, height: 26, margin: "-13px 0 0 -13px" }, 0);
      tl.to(miss, { opacity: 1, duration: 0.3 }, at("E", "chaabi") - 0.1);
      tl.fromTo(miss, { scale: 1 }, { scale: 1.8, duration: 0.3, yoyo: true, repeat: 3 }, at("E", "chaabi"));
      show("#e_a", at("E", "accuracy") - 0.1, { s: 1.05 });
      show("#e_s", at("E", "speed") - 0.1, { s: 1.05 });
      // F: interview answer
      show("#f_chip", at("F", "interview") - 0.05, { s: 0.85 });
      show("#f_1", at("F", "brute") - 0.1, { s: 0.92 });
      show("#f_2", at("F", "vector") - 0.1, { s: 0.92 });
      // G: the question
      show("#g_1", at("G", "sirf") - 0.1, { s: 1.1 });
      show("#g_2", at("G", "tab") - 0.1, { s: 1.1 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { vector: "cyan", vectors: "cyan", brute: "hot", force: "hot", chaabi: "gold", millions: "hot", groups: "gold", approximate: "gold",
                       accuracy: "hot", speed: "good", database: "cyan", comment: "gold" } });
