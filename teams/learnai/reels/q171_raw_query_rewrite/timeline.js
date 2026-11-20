      // A: the question on frame 0, the source post, the company
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_p", at("A", "anthropic") - 0.1, { s: 0.94 });
      show("#a_co", at("A", "anthropic") + 0.2, { s: 1.05 });
      show("#a_g", at("A", "galat") - 0.1, { s: 1.15 });
      // B: the follow-up message reaches the retriever without its context
      show("#b_t", at("B", "chat") - 0.1, { s: 1.1 });
      show("#b_1", at("B", "user") - 0.1, { s: 0.9, y: 0 });
      show("#b_2", at("B", "likhta") - 0.1, { s: 0.9, y: 0 });
      show("#b_ar", at("B", "retriever") - 0.2, { s: 1.2, y: -20 });
      show("#b_r", at("B", "retriever"), { s: 0.94 });
      show("#b_q", at("B", "uska", 2) - 0.1, { s: 1.15 });
      // C: users and documents use different words
      show("#c_t", at("C", "doosri") - 0.1, { s: 1.08 });
      show("#c_l1", at("C", "user") - 0.1, { s: 1 }); show("#c_u", at("C", "user", 1) - 0.1, { s: 0.92, y: 0 });
      show("#c_l2", at("C", "document") - 0.15, { s: 1 }); show("#c_d", at("C", "document"), { s: 0.92, y: 0 });
      show("#c_ne", at("C", "words") - 0.1, { s: 1.1 });
      show("#c_rk", at("C", "chunk") - 0.1, { s: 1.08 });
      // D: rewrite before retrieval
      show("#d_t", at("D", "fix") - 0.1, { s: 1.1 });
      show("#d_in", at("D", "chat") - 0.15, { s: 0.94 });
      show("#d_a1", at("D", "padhkar") - 0.1, { s: 1.2, y: 0 });
      show("#d_rw", at("D", "llm") - 0.3, { s: 0.94 });
      show("#d_q", at("D", "macbook") - 0.1, { s: 0.92 });
      show("#d_s1", at("D", "rewrite", 1) - 0.1, { s: 1.1 });
      show("#d_s2", at("D", "retrieve") - 0.1, { s: 1.1 });
      show("#d_s3", at("D", "read") - 0.1, { s: 1.1 });
      // E: the follow-up: log the rewrite, search with both, merge
      show("#e_t", at("E", "rewrite") - 0.1, { s: 1.08 });
      show("#e_log", at("E", "log") - 0.1, { s: 1.05 });
      show("#e_o", at("E", "original") - 0.1, { s: 0.94 });
      show("#e_r", at("E", "original") + 0.15, { s: 0.94 });
      show("#e_a", at("E", "donon") - 0.2, { s: 1.2, y: -20 });
      show("#e_m", at("E", "results") - 0.1, { s: 1.05 });
      // F: interview answer
      show("#f_chip", at("F", "interview") - 0.05, { s: 0.85 });
      show("#f_1", at("F", "raw") - 0.1, { s: 0.94 });
      show("#f_2", at("F", "isliye") - 0.1, { s: 0.94 });
      show("#f_3", at("F", "rewrite", 1) - 0.1, { s: 0.94 });
      // G: the question
      show("#g_1", at("G", "query") - 0.1, { s: 1.08 });
      show("#g_2", at("G", "ya") - 0.1, { s: 1.08 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { anthropic: "gold", raw: "gold", retriever: "cyan", rewrite: "good", rewritten: "good", galat: "hot", log: "gold", comment: "gold" } });
