      // A: the question on frame 0, the source post, the company
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_p", at("A", "meta") - 0.05, { s: 0.94 });
      hide("#a_p", at("A", "llm") - 0.3);
      show("#a_qs", at("A", "llm") - 0.1, { s: 0.94 });
      tl.fromTo("#a_qs", { scale: 1 }, { scale: 1.05, duration: 3.5, ease: "none" }, at("A", "llm") + 0.3);
      show("#a_n", at("A", "kaise") - 0.1, { s: 1.1 });
      // B: a feeling is not a measurement: two tests
      show("#b_1", at("B", "das-bees") - 0.1, { s: 1.05 });
      show("#b_an", at("B", "andaza") - 0.1, { s: 1.15 });
      show("#b_off", at("B", "two") - 0.1, { s: 1.05 });
      show("#b_on", at("B", "tests") + 0.1, { s: 1.05 });
      // C: offline: the same questions with and without retrieval
      show("#c_t", at("C", "offline") - 0.15, { s: 1.08 });
      show("#c_set", at("C", "asli") - 0.1, { s: 1.04 });
      show("#c_a", at("C", "bina") - 0.3, { s: 0.94 });
      show("#c_b", at("C", "saath") - 0.3, { s: 0.94 });
      show("#c_same", at("C", "model") - 0.1, { s: 1.05 });
      tl.to("#c_b", { borderColor: "#F2B544", duration: 0.2 }, at("C", "fark") - 0.2);
      // D: four measures
      show("#d_t", at("D", "chaar") - 0.15, { s: 1.08 });
      show("#d_1", at("D", "jawab") - 0.1, { s: 0.94 });
      show("#d_2", at("D", "jawab", 1) - 0.1, { s: 0.94 });
      show("#d_3", at("D", "retrieval") - 0.1, { s: 0.94 });
      show("#d_4", at("D", "latency") - 0.1, { s: 0.94 });
      // E: online A/B test and what users do
      show("#e_t", at("E", "online") - 0.15, { s: 1.08 });
      show("#e_a", at("E", "aadhe") - 0.1, { s: 0.94 });
      show("#e_b", at("E", "aadhe", 1) - 0.1, { s: 0.94 });
      show("#e_1", at("E", "dobara") - 0.2, { s: 1.04 });
      show("#e_2", at("E", "thumbs") - 0.1, { s: 1.04 });
      show("#e_3", at("E", "kaam") - 0.1, { s: 1.04 });
      // F: offline went up, online did not: the test set is not like real users
      show("#f_t", at("F", "offline") - 0.2, { s: 1.06 });
      tl.fromTo("#f_b1", { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, at("F", "offline"));
      tl.fromTo("#f_b2", { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, at("F", "score"));
      tl.fromTo("#f_b3", { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, at("F", "online"));
      tl.fromTo("#f_b4", { scaleY: 0 }, { scaleY: 1, duration: 0.4 }, at("F", "kuch"));
      show("#f_fix", at("F", "production") - 0.15, { s: 1.04 });
      // G: interview answer
      show("#g_chip", at("G", "interview") - 0.05, { s: 0.85 });
      show("#g_1", at("G", "pehle") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "correctness") - 0.1, { s: 0.94 });
      show("#g_3", at("G", "phir") - 0.1, { s: 0.94 });
      // H: the question
      show("#h_1", at("H", "retrieval") - 0.1, { s: 1.08 });
      show("#h_2", at("H", "ship") - 0.1, { s: 1.1 });
      show("#h_c", at("H", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { meta: "gold", retrieval: "cyan", andaza: "hot", offline: "cyan", online: "good", groundedness: "cyan", latency: "hot",
                       cost: "hot", ship: "gold", comment: "gold" } });
