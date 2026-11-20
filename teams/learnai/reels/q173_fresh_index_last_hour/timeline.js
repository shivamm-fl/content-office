      // A: the question on frame 0, the source post, the company
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_p", at("A", "perplexity") - 0.05, { s: 0.94 });
      show("#a_co", at("A", "perplexity") + 0.3, { s: 1.05 });
      show("#a_f", at("A", "index") - 0.1, { s: 1.1 });
      // B: a nightly index answers from last night
      show("#b_m", at("B", "match") - 0.1, { s: 0.94 });
      show("#b_u", at("B", "kaun") - 0.15, { s: 0.9, y: 0 });
      show("#b_i", at("B", "index") - 0.1, { s: 0.94 });
      show("#b_old", at("B", "jawab") - 0.1, { s: 1.08 });
      // C: incremental indexing, near real-time search
      show("#c_t", at("C", "pahla") - 0.1, { s: 1.08 });
      show("#c_rb", at("C", "poora") - 0.15, { s: 0.94 });
      wipe("#c_x", at("C", "mat") - 0.05, 0.35);
      show("#c_inc", at("C", "naya") - 0.1, { s: 0.94 });
      show("#c_es", at("C", "elasticsearch") - 0.1, { s: 0.94 });
      show("#c_src", at("C", "elasticsearch") + 0.2, { s: 1, y: 0 });
      tl.fromTo("#c_es .cyan", { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, at("C", "one") - 0.05);
      // D: timestamps, and new documents rise for recency words
      show("#d_t", at("D", "doosra") - 0.1, { s: 1.08 });
      ["#d_1", "#d_2", "#d_3"].forEach((s, i) => show(s, at("D", "document") + i * 0.25, { s: 0.94 }));
      show("#d_q", at("D", "abhi") - 0.1, { s: 1.05 });
      tl.to("#d_3", { top: 390, duration: 0.5, ease: "power2.inOut" }, at("D", "ranking") - 0.1);
      tl.to("#d_1", { top: 510, duration: 0.5, ease: "power2.inOut" }, at("D", "ranking") - 0.1);
      tl.to("#d_2", { top: 630, duration: 0.5, ease: "power2.inOut" }, at("D", "ranking") - 0.1);
      // E: the freshest questions go straight to live search
      show("#e_t", at("E", "teesra") - 0.1, { s: 1.08 });
      show("#e_no", at("E", "bharose") - 0.1, { s: 1.05 });
      show("#e_1", at("E", "live") - 0.1, { s: 1.05 });
      show("#e_2", at("E", "weather") - 0.15, { s: 1.05 });
      show("#e_3", at("E", "share") - 0.1, { s: 1.05 });
      show("#e_ar", at("E", "seedhe") - 0.2, { s: 1.2, y: -20 });
      show("#e_live", at("E", "live", 1) - 0.1, { s: 1.08 });
      // F: the cost
      show("#f_t", at("F", "keemat") - 0.2, { s: 1.08 });
      show("#f_1", at("F", "compute") - 0.3, { s: 0.94 });
      show("#f_2", at("F", "taaza") - 0.1, { s: 0.94 });
      show("#f_s", at("F", "source") - 0.15, { s: 0.94 });
      // G: interview answer
      show("#g_chip", at("G", "interview") - 0.05, { s: 0.85 });
      show("#g_1", at("G", "nightly") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "timestamp") - 0.3, { s: 0.94 });
      show("#g_3", at("G", "recency") - 0.1, { s: 0.94 });
      show("#g_4", at("G", "sabse") - 0.1, { s: 0.94 });
      // H: the question
      show("#h_1", at("H", "sensex") - 0.2, { s: 1.08 });
      show("#h_2", at("H", "index") - 0.1, { s: 1.08 });
      show("#h_c", at("H", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { perplexity: "gold", fresh: "cyan", incremental: "good", indexing: "good", elasticsearch: "cyan", timestamp: "gold",
                       latest: "gold", live: "cyan", keemat: "hot", galat: "hot", comment: "gold" } });
