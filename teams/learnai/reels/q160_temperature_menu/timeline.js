      // A: the interviewer's question and the three knobs on screen at frame 0
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_w", at("A", "teenon") - 0.1, { s: 0.94 });
      show("#a_d", at("A", "teenon", 1) - 0.1, { s: 1.1 });
      // B: the sentence and its next-word options with chances (illustration)
      show("#b_q", at("B", "aaj") - 0.1, { s: 0.94 });
      show("#b_m", at("B", "options") - 0.1, { s: 0.94 });
      show("#b_r1", at("B", "achha") - 0.05, { s: 1, y: 10 });
      show("#b_r2", at("B", "garam") - 0.05, { s: 1, y: 10 });
      show("#b_r3", at("B", "garam") + 0.6, { s: 1, y: 10 });
      show("#b_r4", at("B", "aur") - 0.05, { s: 1, y: 10 });
      show("#b_r5", at("B", "aur") + 0.15, { s: 1, y: 10 });
      // C: top-k keeps a fixed count
      show("#c_t", at("C", "top-k") - 0.1, { s: 1.3 });
      show("#c_k", at("C", "three") - 0.1, { s: 1.4 });
      wipe("#c_cut", at("C", "three"), 0.5);
      tl.fromTo("#c_r4", { opacity: 1 }, { opacity: 0.35, duration: 0.3 }, at("C", "namkin"));
      wipe("#c_x", at("C", "bahar") - 0.1, 0.35);
      show("#c_out", at("C", "bahar"), { s: 1.3 });
      // D: top-p adds chances up to p
      show("#d_t", at("D", "top-p") - 0.1, { s: 1.3 });
      show("#d_s", at("D", "chance") - 0.05, { s: 1 });
      show("#d_c1", at("D", "model") - 0.15, { s: 0.94 });
      wipe("#d_s1", at("D", "pakka") - 0.1, 0.7);
      show("#d_m1", at("D", "ek-do") - 0.05, { s: 1.1 });
      show("#d_c2", at("D", "model", 1) - 0.15, { s: 0.94 });
      qa(".d2").forEach((el, i) => wipe(el, at("D", "model", 1) + 0.1 + i * 0.12, 0.2));
      show("#d_m2", at("D", "zyada") - 0.1, { s: 1.1 });
      // E: temperature reshapes the chances (softmax of the same scores at T 1, 0.4 and 2.5; 616 px per unit of probability)
      show("#e_t", at("E", "temperature") - 0.1, { s: 1.2 });
      show("#e_s", at("E", "chances") - 0.05, { s: 1 });
      const W = { lo: [520, 70, 26, 3], hi: [238, 172, 147, 59] };
      ["#e_b1", "#e_b2", "#e_b3", "#e_b4"].forEach((el, i) => tl.to(el, { width: W.lo[i], duration: 0.6, ease: "power2.inOut" }, at("E", "kam")));
      show("#e_lo", at("E", "kam"), { s: 1.1 });
      ["#e_b1", "#e_b2", "#e_b3", "#e_b4"].forEach((el, i) => tl.to(el, { width: W.hi[i], duration: 0.7, ease: "power2.inOut" }, at("E", "zyada")));
      show("#e_hi", at("E", "zyada"), { s: 1.1 });
      // F: interview answer
      show("#f_chip", at("F", "interview") - 0.05, { s: 0.85 });
      show("#f_1", at("F", "top-k") - 0.1, { s: 0.92 });
      show("#f_2", at("F", "top-p") - 0.1, { s: 0.92 });
      show("#f_3", at("F", "temperature") - 0.1, { s: 0.92 });
      // G: the question
      show("#g_1", at("G", "ab") - 0.05, { s: 1.1 });
      show("#g_2", at("G", "temperature") - 0.1, { s: 1.1 });
      show("#g_3", at("G", "namkin") - 0.1, { s: 1.15 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { "top-k": "gold", "top-p": "cyan", temperature: "hot", namkin: "hot", three: "gold", pakka: "good", uljha: "hot",
                       kam: "cyan", zyada: "hot", sharp: "gold", flat: "gold", comment: "gold" } });
