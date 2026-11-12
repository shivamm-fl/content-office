      // A: frame 0 shows the question; the pile of new tools and 50 courses get struck, then 6 skills
      tl.fromTo(["#a1", "#a2"], { scale: 1.06 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0);
      tl.fromTo(".at", { opacity: 0, y: 30, scale: 1.2 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, stagger: 0.18, ease: "back.out(1.6)" }, at("A", "haphte"));
      wipe("#a_s1", at("A", "nahi"), 0.3);
      tl.to(".at", { opacity: 0.3, duration: 0.2 }, at("A", "nahi") + 0.25);
      show("#a_6", at("A", "6"), { s: 1.8, y: 0 });
      // each skill scene: name lands on the word, the meaning on the definition
      const heads = { B: ["prompting", "model"], C: ["embeddings", "text"], D: ["rag", "files"], E: ["agents", "tools"], F: ["evals", "har"], G: ["production", "cost"] };
      Object.entries(heads).forEach(([sc, [w, m]]) => {
        const k = sc.toLowerCase();
        show("#" + k + "_n", S[sc] + 0.05, { s: 1.3 });
        show("#" + k + "_name", at(sc, w), { s: 1.3 });
        show("#" + k + "_mean", at(sc, m), { s: 1 });
      });
      // C embeddings
      show("#c_txt", at("C", "text"), { s: 1 });
      show("#c_arr", at("C", "numbers"), { s: 1 });
      show("#c_vec", at("C", "numbers") + 0.1, { s: 1 });
      // D RAG
      tl.fromTo(["#d_f1", "#d_f2", "#d_f3"], { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.12 }, at("D", "files"));
      show("#d_a1", at("D", "jawab") - 0.2, { s: 1 });
      show("#d_m", at("D", "jawab") - 0.1, { s: 1 });
      show("#d_a2", at("D", "jawab") + 0.15, { s: 1 });
      show("#d_j", at("D", "jawab") + 0.3, { s: 1.2 });
      show("#d_ob", at("D", "open-book"), { s: 1.4 });
      // E agents
      show("#e_m", at("E", "model"), { s: 1 });
      tl.fromTo(["#e_a1", "#e_s", "#e_a2", "#e_c"], { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.12, ease: "back.out(1.7)" }, at("E", "tools"));
      show("#e_loop", at("E", "kaam"), { s: 1 });
      show("#e_done", at("E", "poora"), { s: 1.4 });
      // F evals (example scores)
      show("#f_lbl", at("F", "test"), { s: 1 });
      show(["#f_v1", "#f_p1"], at("F", "test"), { s: 1 }); wipe("#f_b1", at("F", "test"), 0.4);
      show(["#f_v2", "#f_p2"], at("F", "test") + 0.4, { s: 1 }); wipe("#f_b2", at("F", "test") + 0.4, 0.4);
      show(["#f_v3", "#f_p3"], at("F", "test") + 0.8, { s: 1 }); wipe("#f_b3", at("F", "test") + 0.8, 0.4);
      show("#f_q", at("F", "test") + 1.2, { s: 1.2 });
      show("#g_c", at("G", "cost"), { s: 1.2 });
      show("#g_s", at("G", "speed"), { s: 1.2 });
      show("#g_m", at("G", "monitoring"), { s: 1.2 });
      // H roadmap PDF and call to action
      show("#h_t", at("H", "6"), { s: 1.1 });
      tl.fromTo("#h_pdf", { opacity: 0, x: 80, rotation: 10 }, { opacity: 1, x: 0, rotation: 3, duration: 0.4, ease: "back.out(1.6)" }, at("H", "roadmap"));
      show("#h_cta", at("H", "roadmap", 1), { s: 1.5, y: 0 });
      tl.to("#h_cta", { scale: 1.06, duration: 0.18, yoyo: true, repeat: 3 }, at("H", "comment"));
      show("#h_dm", at("H", "pdf"), { s: 1 });
      M.finish({ kw: { engineer: "gold", skills: "gold", prompting: "gold", embeddings: "gold", rag: "gold", agents: "gold", evals: "gold", production: "gold", roadmap: "gold", nahi: "hot" } });
