      // A: frame 0 shows the question; the pile of new tools and 50 courses get struck, then 6 skills
      tl.fromTo(["#a1", "#a2"], { scale: 1.06 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0);
      tl.fromTo(".at", { opacity: 0, y: 30, scale: 1.2 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, stagger: 0.18, ease: "back.out(1.6)" }, at("A", "haphte"));
      wipe("#a_s1", at("A", "nahi"), 0.3);
      tl.to(".at", { opacity: 0.3, duration: 0.2 }, at("A", "nahi") + 0.25);
      show("#a_50", at("A", "50"), { s: 1.3 });
      wipe("#a_s2", at("A", "nahi", 1), 0.3);
      show("#a_6", at("A", "6"), { s: 1.8, y: 0 });
      // each skill scene: name lands on the word, the meaning on the definition
      const heads = { B: ["prompting", "model"], C: ["embeddings", "text"], D: ["rag", "files"], E: ["agents", "tools"], F: ["evals", "har"], G: ["production", "cost"] };
      Object.entries(heads).forEach(([sc, [w, m]]) => {
        const k = sc.toLowerCase();
        show("#" + k + "_n", S[sc] + 0.05, { s: 1.3 });
        show("#" + k + "_name", at(sc, w), { s: 1.3 });
        show("#" + k + "_mean", at(sc, m), { s: 1 });
      });
      // B prompting
      show("#b_int", at("B", "intern"), { s: 1 });
      show("#b_bad", at("B", "samjhate"), { s: 0.9 });
      wipe("#b_bs", at("B", "saaf-saaf"), 0.3);
      show("#b_good", at("B", "saaf-saaf") + 0.2, { s: 0.9 });
      show("#b_ex", at("B", "example"), { s: 1.4 });
      // C embeddings
      show("#c_txt", at("C", "text"), { s: 1 });
      show("#c_arr", at("C", "numbers"), { s: 1 });
      show("#c_vec", at("C", "numbers") + 0.1, { s: 1 });
      show("#c_box", at("C", "search"), { s: 0.9 });
      show("#c_res", at("C", "budget"), { s: 0.9 });
      show("#c_same", at("C", "mil"), { s: 1.4 });
      // D RAG
      tl.fromTo(["#d_f1", "#d_f2", "#d_f3"], { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.12 }, at("D", "files"));
      show("#d_a1", at("D", "jawab") - 0.2, { s: 1 });
      show("#d_m", at("D", "jawab") - 0.1, { s: 1 });
      show("#d_a2", at("D", "jawab") + 0.15, { s: 1 });
      show("#d_j", at("D", "jawab") + 0.3, { s: 1.2 });
      show("#d_ob", at("D", "open-book"), { s: 1.4 });
      // E agents
      show("#e_m", at("E", "model"), { s: 1 });
      show("#e_a1", at("E", "search") - 0.1, { s: 1 });
      show("#e_s", at("E", "search"), { s: 1.2 });
      show("#e_a2", at("E", "code") - 0.1, { s: 1 });
      show("#e_c", at("E", "code"), { s: 1.2 });
      show("#e_loop", at("E", "kaam"), { s: 1 });
      show("#e_done", at("E", "poora"), { s: 1.4 });
      // F evals (example scores)
      show("#f_lbl", at("F", "test"), { s: 1 });
      show(["#f_v1", "#f_p1"], at("F", "test"), { s: 1 }); wipe("#f_b1", at("F", "test"), 0.4);
      show(["#f_v2", "#f_p2"], at("F", "sudhra"), { s: 1 }); wipe("#f_b2", at("F", "sudhra"), 0.4);
      show(["#f_v3", "#f_p3"], at("F", "bigda"), { s: 1 }); wipe("#f_b3", at("F", "bigda"), 0.4);
      show("#f_q", at("F", "bigda") + 0.3, { s: 1.2 });
      // G production: 10 people vs thousands
      const gd = q("#g_demo"), ga = q("#g_app");
      for (let i = 0; i < 10; i++) { const d = document.createElement("div"); d.className = "tok gdot"; d.style.cssText += ";left:" + (60 + i * 64) + "px;top:850px;width:48px;height:48px;border-radius:24px;background:#8592AD;border:none;"; gd.appendChild(d); }
      for (let i = 0; i < 240; i++) { const d = document.createElement("div"); d.className = "tok adot"; d.style.cssText += ";left:" + (60 + (i % 30) * 32) + "px;top:" + (1010 + Math.floor(i / 30) * 30) + "px;width:22px;height:22px;border-radius:11px;background:#F2B544;border:none;"; ga.appendChild(d); }
      show("#g_c", at("G", "cost"), { s: 1.2 });
      show("#g_s", at("G", "speed"), { s: 1.2 });
      show("#g_m", at("G", "monitoring"), { s: 1.2 });
      show("#g_dt", at("G", "demo"), { s: 1 });
      tl.fromTo(".gdot", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.15, stagger: 0.04 }, at("G", "10"));
      show("#g_at", at("G", "asli"), { s: 1 });
      tl.fromTo(".adot", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.1, stagger: 0.004 }, at("G", "hazaron") - 0.3);
      // H roadmap PDF and call to action
      show("#h_t", at("H", "6"), { s: 1.1 });
      tl.fromTo("#h_pdf", { opacity: 0, x: 80, rotation: 10 }, { opacity: 1, x: 0, rotation: 3, duration: 0.4, ease: "back.out(1.6)" }, at("H", "roadmap"));
      show("#h_cta", at("H", "roadmap", 1), { s: 1.5, y: 0 });
      tl.to("#h_cta", { scale: 1.06, duration: 0.18, yoyo: true, repeat: 3 }, at("H", "comment"));
      show("#h_dm", at("H", "pdf"), { s: 1 });
      M.finish({ kw: { engineer: "gold", skills: "gold", prompting: "gold", embeddings: "gold", rag: "gold", agents: "gold", evals: "gold", production: "gold", roadmap: "gold", nahi: "hot" } });
