      // A: same question, two answers (illustration); the three knobs
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_r1", at("A", "ek") + 0.6, { s: 0.9 });
      show("#a_r2", at("A", "alag"), { s: 0.9 });
      show("#a_k1", at("A", "temperature") - 0.05, { s: 1.3 });
      show("#a_k2", at("A", "top-k") - 0.05, { s: 1.3 });
      show("#a_k3", at("A", "top-p") - 0.05, { s: 1.3 });
      // B: the menu = next-word choices
      show("#b_t", at("B", "menu") - 0.1, { s: 1.3 });
      show("#b_s", at("B", "menu") + 0.3, { s: 1 });
      show("#b_m", at("B", "chance") - 0.1, { s: 0.94 });
      show("#b_r1", at("B", "masala") - 0.05, { s: 1, y: 10 });
      show("#b_r2", at("B", "idli") - 0.05, { s: 1, y: 10 });
      show("#b_r3", at("B", "phir", 1) + 0.2, { s: 1, y: 10 });
      show("#b_r4", at("B", "aur") , { s: 1, y: 10 });
      show("#b_r5", at("B", "pineapple") - 0.05, { s: 1, y: 10 });
      // C: top-k keeps a fixed count
      show("#c_t", at("C", "top-k") - 0.1, { s: 1.3 });
      show("#c_k", at("C", "three") - 0.1, { s: 1.4 });
      wipe("#c_cut", at("C", "three"), 0.5);
      tl.fromTo("#c_r4", { opacity: 1 }, { opacity: 0.35, duration: 0.3 }, at("C", "pineapple"));
      wipe("#c_x", at("C", "bahar") - 0.1, 0.35);
      show("#c_out", at("C", "bahar"), { s: 1.3 });
      // D: top-p adds chances up to p
      show("#d_t", at("D", "top-p") - 0.1, { s: 1.3 });
      show("#d_s", at("D", "chance") - 0.05, { s: 1 });
      show("#d_c1", at("D", "dosa") - 0.15, { s: 0.94 });
      wipe("#d_s1", at("D", "ninety") - 0.1, 0.7);
      show("#d_m1", at("D", "bas") - 0.05, { s: 1.1 });
      show("#d_c2", at("D", "orders", 1) - 0.15, { s: 0.94 });
      qa(".d2").forEach((el, i) => wipe(el, at("D", "orders", 1) + 0.1 + i * 0.12, 0.2));
      show("#d_m2", at("D", "lanba") - 0.1, { s: 1.1 });
      // E: temperature reshapes the chances (softmax of the same scores at T 1, 0.4 and 2.5)
      show("#e_t", at("E", "temperature") - 0.1, { s: 1.2 });
      show("#e_s", at("E", "chef") - 0.05, { s: 1 });
      const W = { lo: [520, 70, 26, 3], hi: [238, 172, 147, 59] };   // 616 px per unit of probability
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
      show("#g_3", at("G", "pineapple") - 0.1, { s: 1.15 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { "top-k": "gold", "top-p": "cyan", temperature: "hot", menu: "gold", pineapple: "hot", pizza: "hot", three: "gold", ninety: "gold",
                       kam: "cyan", zyada: "hot", sharp: "gold", flat: "gold", comment: "gold" } });
