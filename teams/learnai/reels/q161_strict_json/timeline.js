      // A: the response that crashed the app (example)
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      tl.to("#a_ok", { opacity: 0.35, duration: 0.3 }, at("A", "phir") - 0.1);
      show("#a_bad1", at("A", "sure") - 0.1, { s: 1, y: 10 });
      show("#a_bad2", at("A", "sure") + 0.3, { s: 1, y: 10 });
      show("#a_err", at("A", "crash") - 0.3, { s: 1, y: 10 });
      show("#a_st", at("A", "crash") - 0.05, { s: 1.8 });
      // B: few-shot
      show("#b_t", at("B", "few-shot") - 0.1, { s: 1.3 });
      show("#b_s", at("B", "prompt") - 0.05, { s: 1 });
      show("#b_e1", at("B", "solved") - 0.05, { s: 0.94 });
      show("#b_e2", at("B", "examples"), { s: 0.94 });
      show("#b_e3", at("B", "pattern") - 0.05, { s: 0.94 });
      show("#b_w", at("B", "weights") - 0.1, { s: 1.2 });
      // C: examples explain, they do not force
      show("#c_t", at("C", "examples") - 0.1, { s: 1.1 });
      show("#c_f1", at("C", "sample") - 0.1, { s: 0.9 });
      show("#c_f2", at("C", "phir") - 0.05, { s: 0.9 });
      show("#c_f3", at("C", "galat") - 0.1, { s: 0.9 });
      const grid = q("#c_grid");
      for (let i = 0; i < 18; i++) {
        const t = document.createElement("div"); const bad = i === 7 || i === 13;
        t.className = "tile " + (bad ? "bad" : "ok"); t.id = "c_g" + i; t.textContent = bad ? (i === 7 ? "{ ..." : "{ }?") : "{ }";
        t.style.left = (i % 6) * 156 + "px"; t.style.top = Math.floor(i / 6) * 82 + "px"; grid.appendChild(t);
        show(t, at("C", "hazaron") + i * 0.05, { s: 0.6, y: 0, d: 0.18 });
      }
      tl.fromTo("#c_g7", { scale: 1 }, { scale: 1.18, duration: 0.2, yoyo: true, repeat: 1 }, at("C", "tootega"));
      tl.fromTo("#c_g13", { scale: 1 }, { scale: 1.18, duration: 0.2, yoyo: true, repeat: 1 }, at("C", "gaayab"));
      // D: structured outputs
      show("#d_t", at("D", "structured") - 0.1, { s: 1.2 });
      show("#d_schema", at("D", "schema") - 0.15, { s: 0.94 });
      show("#d_mould", at("D", "output") - 0.1, { s: 1, y: 0 });
      tl.fromTo("#d_out", { opacity: 0, y: -120 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" }, at("D", "saanche") - 0.1);
      show("#d_box", at("D", "fixed") - 0.1, { s: 1.1 });
      show("#d_src", at("D", "schema"), { s: 1, y: 0 });
      // E: interview answer
      show("#e_chip", at("E", "interview") - 0.05, { s: 0.85 });
      show("#e_1", at("E", "few-shot") - 0.1, { s: 0.92 });
      show("#e_2", at("E", "schema") - 0.1, { s: 0.92 });
      show("#e_3", at("E", "strict") - 0.1, { s: 1.1 });
      // F: the guide
      show("#f_1", at("F", "full") - 0.1, { s: 1.1 });
      show("#f_2", at("F", "comment") - 0.1, { s: 1, y: 0 });
      show("#f_3", at("F", "comment") + 0.1, { s: 1.5 });
      show("#f_dm", at("F", "seedha") - 0.1, { s: 0.9 });
      M.finish({ kw: { json: "gold", crash: "hot", "few-shot": "gold", weights: "cyan", majbur: "hot", galat: "hot", structured: "good", outputs: "good",
                       schema: "good", pakka: "good", prompt: "gold", dm: "gold" } });
