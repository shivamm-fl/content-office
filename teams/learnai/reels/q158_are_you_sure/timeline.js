      // A: the chat (illustration). Headline + first question are on screen at frame 0 (muted autoplay).
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_a1", at("A", "bola") - 0.05, { s: 0.9 });
      show("#a_u2", at("A", "are") - 0.1, { s: 1.3 });
      show("#a_a2", at("A", "sorry") - 0.1, { s: 0.9 });
      show("#a_st", at("A", "jawab", 1), { s: 1.8, d: 0.3 });
      tl.fromTo("#a_h", { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.inOut" }, at("A", "phir"));
      // B: people give marks, agreement wins, the name
      show("#b_t", at("B", "training") - 0.1, { s: 1.3 });
      show("#b_s", at("B", "marks"), { s: 1 });
      show("#b_l", at("B", "aur") - 0.1, { s: 0.9 });
      show("#b_r", at("B", "aur") + 0.15, { s: 0.9 });
      tl.fromTo("#b_lb", { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power2.out" }, at("B", "jo"));
      tl.fromTo("#b_rb", { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "power2.out" }, at("B", "jo"));
      show("#b_win", at("B", "sahmat"), { s: 1 });
      show("#b_rule", at("B", "model"), { s: 1.3 });
      show("#b_ill", at("B", "model"), { s: 1, y: 0 });
      ["#b_t", "#b_s", "#b_l", "#b_r", "#b_win", "#b_rule", "#b_ill"].forEach((el) => hide(el, at("B", "ise") - 0.15));
      show("#b_word", at("B", "sycophancy") - 0.1, { s: 1.4 });
      show("#b_hz", at("B", "jee-huzuri") - 0.05, { s: 1.2 });
      // C: the study, then 51 %
      show("#c_11", at("C", "gyaarah") - 0.1, { s: 1.5 });
      show("#c_bots", at("C", "bade"), { s: 1 });
      qa("#c_dots .dot").forEach((el, i) => show(el, at("C", "bade") + i * 0.06, { s: 0.4, y: 0, d: 0.22 }));
      show("#c_post", at("C", "reddit") - 0.05, { s: 0.92 });
      show("#c_v", at("C", "galti"), { s: 1.8 });
      ["#c_11", "#c_bots", "#c_dots", "#c_post"].forEach((el) => hide(el, at("C", "phir") - 0.05));
      show("#c_pct", at("C", "fifty") - 0.15, { s: 1 });
      count("#c_pct", 0, 51, at("C", "fifty") - 0.1, 0.9, (v) => Math.round(v) + "%");
      show("#c_track", at("C", "fifty") - 0.15, { s: 1, y: 0 });
      wipe("#c_fill", at("C", "fifty") - 0.1, 0.9);
      show("#c_half", at("C", "percent"), { s: 1, y: 0 });
      show("#c_halfl", at("C", "percent"), { s: 1 });
      show("#c_lbl", at("C", "chatbots", 1), { s: 1.1 });
      show("#c_note", at("C", "likhne", 1), { s: 1 });
      show("#c_src", at("C", "fifty"), { s: 1, y: 0 });
      // D: interview answer, the test, the release gate
      show("#d_chip", at("D", "interview") - 0.05, { s: 0.85 });
      show("#d_t", at("D", "flip-flop") - 0.1, { s: 1.3 });
      show("#d_1", at("D", "jin"), { s: 0.92 });
      show("#d_2", at("D", "are"), { s: 0.92 });
      show("#d_3", at("D", "gino"), { s: 0.92 });
      show("#d_grid", at("D", "gino") + 0.2, { s: 0.95 });
      show("#d_ill", at("D", "gino") + 0.2, { s: 1, y: 0 });
      tl.set(["#d_b1", "#d_b2"], { opacity: 0 }, 0);
      tl.fromTo("#d_b1", { opacity: 0, rotationY: 90 }, { opacity: 1, rotationY: 0, duration: 0.3, ease: "power2.out" }, at("D", "palat"));
      tl.fromTo("#d_b2", { opacity: 0, rotationY: 90 }, { opacity: 1, rotationY: 0, duration: 0.3, ease: "power2.out" }, at("D", "palat") + 0.2);
      hide("#d_f1", at("D", "palat"), 0.15); hide("#d_f2", at("D", "palat") + 0.2, 0.15);
      ["#d_1", "#d_2", "#d_3"].forEach((el) => hide(el, at("D", "har") - 0.3, 0.2));
      show("#d_gate", at("D", "har") - 0.1, { s: 0.92 });
      // E: the question
      show("#e_1", at("E", "sirf") - 0.1, { s: 1.15 });
      show("#e_2", at("E", "jinka") - 0.05, { s: 1.15 });
      show("#e_3", at("E", "jinka") + 0.4, { s: 1 });
      show("#e_c", at("E", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { sure: "gold", sahi: "good", marks: "gold", sahmat: "gold", sycophancy: "gold", "jee-huzuri": "gold", fifty: "hot", one: "hot", percent: "hot",
                       "flip-flop": "gold", palat: "hot", release: "cyan", pata: "gold", comment: "gold" } });
