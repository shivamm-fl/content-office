      // A: the question on frame 0, the source post, the company
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_p", at("A", "meta") - 0.05, { s: 0.94 });
      hide("#a_p", at("A", "sahi") - 0.3);
      show("#a_qs", at("A", "sahi") - 0.1, { s: 0.94 });
      tl.fromTo("#a_qs", { scale: 1 }, { scale: 1.05, duration: 3.5, ease: "none" }, at("A", "sahi") + 0.3);
      // B: the policy changed yesterday, the old value is everywhere the model read
      show("#b_pol", at("B", "return") - 0.2, { s: 0.94 });
      tl.set("#b_new", { opacity: 0 }, 0); tl.to("#b_new", { opacity: 1, duration: 0.2 }, at("B", "fifteen") - 0.1);
      tl.to("#b_old", { color: "#8592AD", textDecoration: "line-through", duration: 0.2 }, at("B", "fifteen") - 0.1);
      show("#b_kal", at("B", "kal") - 0.1, { s: 1.2 });
      show("#b_s1", at("B", "blogs") - 0.15, { s: 0.92 });
      show("#b_s2", at("B", "faqs") - 0.15, { s: 0.92 });
      show("#b_s3", at("B", "har") - 0.1, { s: 0.92 });
      show("#b_m", at("B", "model") - 0.1, { s: 0.94 });
      show("#b_a", at("B", "thirty", 2) - 0.1, { s: 1.15 });
      // C: do not use memory: retrieve the new page with its date
      show("#c_t", at("C", "pahla") - 0.1, { s: 1.08 });
      show("#c_m", at("C", "memory") - 0.2, { s: 0.94 });
      wipe("#c_x", at("C", "mat") - 0.05, 0.35);
      show("#c_new", at("C", "naya") - 0.1, { s: 0.94 });
      tl.fromTo("#c_date", { scale: 1 }, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1 }, at("C", "date") - 0.1);
      show("#c_pr", at("C", "prompt") - 0.1, { s: 1.05 });
      // D: clear evidence wins, mixed evidence lets the old belief win
      show("#d_t", at("D", "trap") - 0.1, { s: 1.1 });
      show("#d_c1", at("D", "saaf") - 0.15, { s: 0.94 });
      show("#d_a1", at("D", "maan") - 0.1, { s: 1.1 });
      show("#d_c2", at("D", "context") - 0.1, { s: 0.94 });
      show("#d_a2", at("D", "pakadta") - 0.1, { s: 1.1 });
      show("#d_cb", at("D", "confirmation") - 0.1, { s: 1.08 });
      // E: expire old versions, a prompt rule, a test set
      show("#e_t", at("E", "isliye") - 0.1, { s: 1.08 });
      show("#e_old", at("E", "purane") - 0.1, { s: 0.94 });
      show("#e_st", at("E", "expired") - 0.1, { s: 1.6 });
      show("#e_rule", at("E", "prompt") - 0.1, { s: 0.94 });
      show("#e_test", at("E", "test") - 0.1, { s: 0.94 });
      // F: interview answer
      show("#f_chip", at("F", "interview") - 0.05, { s: 0.85 });
      show("#f_1", at("F", "badalne") - 0.1, { s: 0.94 });
      show("#f_2", at("F", "purane") - 0.1, { s: 0.94 });
      show("#f_3", at("F", "nayi") - 0.1, { s: 0.94 });
      show("#f_4", at("F", "badle") - 0.1, { s: 0.94 });
      // G: the question
      show("#g_1", at("G", "purana") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "naya") - 0.1, { s: 0.94 });
      show("#g_q", at("G", "model") - 0.1, { s: 1.08 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { meta: "gold", purana: "hot", thirty: "hot", fifteen: "good", memory: "hot", retrieve: "cyan", date: "gold", trap: "gold",
                       confirmation: "gold", bias: "gold", expired: "hot", fresh: "good", comment: "gold" } });
