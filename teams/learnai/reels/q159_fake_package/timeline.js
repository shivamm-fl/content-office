      // A: the install that should fail, the empty package, the downloads. Headline + command are on screen at frame 0.
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_err", at("A", "jo") - 0.05, { s: 1, y: 10 });
      show("#a_pkg", at("A", "researcher") - 0.1, { s: 0.92 });
      show("#a_n", at("A", "pandrah") - 0.2, { s: 1 });
      count("#a_n", 0, 15000, at("A", "pandrah") - 0.15, 1.1, (v) => Math.round(v).toLocaleString("en-IN") + (v > 14999 ? "+" : ""));
      show("#a_dl", at("A", "teen"), { s: 1 });
      show("#a_src", at("A", "pandrah"), { s: 1, y: 0 });
      // B: the name, the AI repeating it, the README
      show("#b_l", at("B", "naam") - 0.1, { s: 1 });
      show("#b_name", at("B", "huggingface-cli") - 0.15, { s: 1.3 });
      show("#b_1", at("B", "baar-baar") - 0.1, { s: 0.92 });
      show("#b_2", at("B", "yahi") - 0.05, { s: 0.92 });
      show("#b_3", at("B", "command") - 0.05, { s: 0.92 });
      show("#b_ill", at("B", "command"), { s: 1, y: 0 });
      show("#b_readme", at("B", "alibaba") - 0.1, { s: 0.94 });
      wipe("#b_hl", at("B", "readme"), 0.6);
      // C: no memory, a guess, it sounds right
      show("#c_t", at("C", "ai") - 0.05, { s: 1.1 });
      show("#c_t2", at("C", "andaza") - 0.1, { s: 1.3 });
      show("#c_a", at("C", "naam", 1) - 0.1, { s: 0.9 });
      show("#c_plus", at("C", "naam", 1) + 0.15, { s: 1.4 });
      show("#c_b", at("C", "naam", 1) + 0.3, { s: 0.9 });
      show("#c_eq", at("C", "hona"), { s: 1.4 });
      show("#c_r", at("C", "chahiye"), { s: 0.9 });
      show("#c_st", at("C", "bilkul"), { s: 1.8 });
      // D: the same fake name comes back, 43 %, the attack, its name
      show("#d_t", at("D", "dikkat") - 0.1, { s: 1.3 });
      show("#d_t2", at("D", "galat"), { s: 1 });
      qa("#d_tiles .tile").forEach((el, i) => show(el, at("D", "das") - 0.6 + i * 0.12, { s: 0.6, y: 0, d: 0.22 }));
      show("#d_pct", at("D", "forty") - 0.1, { s: 1 });
      count("#d_pct", 0, 43, at("D", "forty") - 0.05, 0.9, (v) => Math.round(v) + "%");
      show("#d_pl", at("D", "nakli"), { s: 1 });
      show("#d_src", at("D", "forty"), { s: 1, y: 0 });
      ["#d_t", "#d_t2", "#d_tiles", "#d_pct", "#d_pl", "#d_src"].forEach((el) => hide(el, at("D", "attacker") - 0.25));
      show("#d_att", at("D", "attacker") - 0.1, { s: 1.3 });
      show("#d_s1", at("D", "attacker") + 0.2, { s: 0.92 });
      show("#d_s2", at("D", "bas"), { s: 0.92 });
      show("#d_s3", at("D", "register") - 0.05, { s: 0.92 });
      show("#d_s4", at("D", "package") - 0.05, { s: 0.92 });
      show("#d_slop", at("D", "slopsquatting") - 0.15, { s: 1.35 });
      // E: interview answer
      show("#e_chip", at("E", "interview") - 0.05, { s: 0.85 });
      show("#e_1", at("E", "ai"), { s: 0.92 });
      show("#e_pl", at("E", "pehle"), { s: 1 });
      show("#e_c1", at("E", "kab") - 0.05, { s: 0.92 });
      show("#e_c2", at("E", "kitne") - 0.05, { s: 0.92 });
      show("#e_ag", at("E", "coding") - 0.1, { s: 0.92 });
      // F: the question
      show("#f_1", at("F", "hugging") - 0.1, { s: 1.15 });
      show("#f_2", at("F", "kis") - 0.05, { s: 1.15 });
      show("#f_c", at("F", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { "huggingface-cli": "gold", downloads: "gold", nahi: "hot", andaza: "gold", forty: "hot", three: "hot", percent: "hot",
                       attacker: "hot", register: "hot", slopsquatting: "gold", approved: "good", asli: "gold", comment: "gold" } });
