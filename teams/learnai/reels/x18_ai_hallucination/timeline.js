      // A: the researcher asks his own birthday, three tries, three wrong dates. Headline is on screen at frame 0.
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_q", 0.25, { s: 0.96, y: 16 });
      show("#a_qq", at("A", "birthday") - 0.1, { s: 1, y: 10 });
      wipe("#a_hl", at("A", "pata") - 0.05, 0.5);
      show("#a_if", at("A", "pata") - 0.05, { s: 1, y: 8 });
      show("#a_dd", at("A", "batana"), { s: 1, y: 8 });
      show("#a_t1", at("A", "teen") - 0.05, { s: 0.9 });
      show("#a_t2", at("A", "baar") - 0.05, { s: 0.9 });
      show("#a_t3", at("A", "poocha", 1) - 0.05, { s: 0.9 });
      [1, 2, 3].forEach((i) => {
        const t = [at("A", "teen", 1), at("A", "alag"), at("A", "dates")][i - 1];
        hide("#a_d" + i, t - 0.05, 0.1);
        show("#a_v" + i, t, { s: 1.25, y: 0 });
      });
      show("#a_src", at("A", "teen", 1), { s: 1, y: 0 });
      [1, 2, 3].forEach((i) => show("#a_x" + i, at("A", "teenon") + (i - 1) * 0.1, { s: 1.6, y: 0 }));
      show("#a_st", at("A", "galat") - 0.05, { s: 1.5, y: 0 });

      // B: the next word is the one with the biggest chance; "Sun rises in the ___" -> East
      show("#b_t", at("B", "agla") - 0.1, { s: 1.05 });
      ["#b_bar1", "#b_bar2", "#b_bar3", "#b_bar4"].forEach((el, i) =>
        tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power2.out" }, at("B", "chances") - 0.1 + i * 0.08));
      show("#b_ill", at("B", "chances"), { s: 1, y: 0 });
      show("#b_leg", at("B", "chances") + 0.3, { s: 1, y: 10 });
      tl.fromTo("#b_bar1g", { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power2.out" }, at("B", "sabse") - 0.05);
      show("#b_box", at("B", '"sun') - 0.2, { s: 0.97, y: 12 });
      show("#b_w1", at("B", '"sun') - 0.05, { s: 1, y: 8, d: 0.2 });
      show("#b_w2", at("B", "rises") - 0.05, { s: 1, y: 8, d: 0.2 });
      show("#b_w3", at("B", "in") - 0.05, { s: 1, y: 8, d: 0.2 });
      show("#b_w4", at("B", "the") - 0.05, { s: 1, y: 8, d: 0.2 });
      hide("#b_blank", at("B", '"east') - 0.05, 0.1);
      show("#b_fill", at("B", '"east') - 0.05, { s: 1.4, y: 0 });
      show("#b_l1", at("B", '"east') - 0.05, { s: 1.2, y: 0 });
      ["#b_l2", "#b_l3", "#b_l4"].forEach((el, i) => show(el, at("B", '"east') + 0.2 + i * 0.1, { s: 1, y: 6 }));
      hide("#b_leg", at("B", "har", 1) - 0.15);
      qa("#b_minis .mini").forEach((el, i) => show(el, at("B", "har", 1) + i * 0.09, { s: 0.7, y: 0, d: 0.22 }));

      // C: a birthday is written almost nowhere -> flat chances -> the model still picks one -> hallucination
      show("#c_t", at("C", "ek") - 0.1, { s: 1.05 });
      show("#c_t2", at("C", "shaayad") - 0.05, { s: 1, y: 10 });
      qa("#c_bars .bar").forEach((el, i) =>
        tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: "power2.out" }, at("C", "likha") - 0.2 + i * 0.05));
      show("#c_ax", at("C", "ho") + 0.1, { s: 1, y: 8 });
      tl.fromTo("#c_pick", { scaleY: 0 }, { scaleY: 1.25, duration: 0.4, ease: "back.out(1.7)" }, at("C", "date") - 0.05);
      show("#c_date", at("C", "chun") - 0.05, { s: 0.7, y: 20 });
      show("#c_conf", at("C", "confidence") - 0.1, { s: 1.4, y: 0 });
      show("#c_hal", at("C", "hallucination") - 0.1, { s: 1.25 });
      show("#c_def", at("C", "bana") - 0.05, { s: 1, y: 12 });

      // D: why not "I don't know"? -> the exam: blank = 0 for sure, guess = marks if it lands
      show("#d_bub", at("D", '"mujhe') - 0.1, { s: 0.94 });
      show("#d_q", at("D", "kyun") - 0.05, { s: 1.2 });
      hide("#d_bub", at("D", "exam") - 0.2); hide("#d_q", at("D", "exam") - 0.2);
      show("#d_sheet", at("D", "exam") - 0.05, { s: 0.96, y: 16 });
      show("#d_na", at("D", "nahi", 2) - 0.05, { s: 1, y: 6 });
      wipe("#d_s1", at("D", "likhkar") - 0.05, 0.35);
      wipe("#d_s2", at("D", "likhkar") + 0.3, 0.3);
      wipe("#d_s3", at("D", "aate") + 0.15, 0.35);
      show("#d_k", at("D", "khaali") - 0.1, { s: 0.94 });
      show("#d_k0", at("D", "zero") - 0.05, { s: 1.5, y: 0 });
      show("#d_kp", at("D", "pakka") - 0.05, { s: 1, y: 6 });
      show("#d_g", at("D", "guess") - 0.1, { s: 0.94 });
      show("#d_gl", at("D", "lag") - 0.05, { s: 1, y: 6 });
      show("#d_gm", at("D", "poore") - 0.05, { s: 1.4, y: 0 });

      // E: AI tests score the same way -> guessing pays
      show("#e_t", at("E", "ai") - 0.05, { s: 1.05 });
      show("#e_r1", at("E", "tests") - 0.05, { s: 0.94 });
      show("#e_r2", at("E", "tests") + 0.35, { s: 0.94 });
      show("#e_r3", at("E", "tests") + 0.7, { s: 0.94 });
      show("#e_src", at("E", "tests"), { s: 1, y: 0 });
      show("#e_arr", at("E", "isliye") - 0.05, { s: 1, y: -20 });
      show("#e_g", at("E", "guess") - 0.1, { s: 1.25 });

      // F: the fix from exams: JEE, NEET, GATE -> wrong = minus, don't know = 0 -> guessing costs
      show("#f_oa", at("F", "openai") - 0.1, { s: 0.9 });
      show("#f_fix", at("F", "fix") - 0.05, { s: 1.05 });
      show("#f_j", at("F", "jee") - 0.05, { s: 1.3 });
      show("#f_n", at("F", "neet") - 0.05, { s: 1.3 });
      show("#f_ga", at("F", "gate") - 0.05, { s: 1.3 });
      show("#f_src", at("F", "jee"), { s: 1, y: 0 });
      show("#f_neg", at("F", "negative") - 0.05, { s: 1.2 });
      show("#f_r1", at("F", "galat") - 0.05, { s: 0.94 });
      show("#f_m", at("F", "minus") - 0.05, { s: 1.4, y: 0 });
      show("#f_r2", at("F", '"nahi') - 0.05, { s: 0.94 });
      show("#f_z", at("F", "zero") - 0.05, { s: 1.4, y: 0 });
      ["#f_neg", "#f_r1", "#f_r2"].forEach((el) => hide(el, at("F", "tab") - 0.1));
      show("#f_g", at("F", "andaza") - 0.1, { s: 0.94 });
      show("#f_gh", at("F", "ghaate") - 0.05, { s: 1.4, y: 0 });

      // G: the viewer's test: ask 2-3 times; the answer changes -> it is a guess (same dates as the hook)
      show("#g_t", at("G", "fact") - 0.1, { s: 1.05 });
      show("#g_t2", at("G", "do-teen") - 0.05, { s: 1.05 });
      ["#g_t1", "#g_tt2", "#g_t3"].forEach((el, i) => show(el, at("G", "do-teen") + i * 0.22, { s: 0.9 }));
      show("#g_b", at("G", "jawab") - 0.05, { s: 1, y: 10 });
      [1, 2, 3].forEach((i) => {
        const t = at("G", "badal") + (i - 1) * 0.16;
        hide("#g_d" + i, t - 0.05, 0.1);
        show("#g_v" + i, t, { s: 1.25, y: 0 });
      });
      show("#g_st", at("G", "guess") - 0.05, { s: 1.5, y: 0 });

      // H: the question
      show("#h_1", at("H", "tum") - 0.05, { s: 1.1 });
      show("#h_2", at("H", "kam") - 0.05, { s: 1.1 });
      show("#h_bar", at("H", "comment") - 0.1, { s: 0.95 });
      show("#h_c", at("H", "karo") - 0.05, { s: 0.85 });
      M.finish({ kw: { birthday: "gold", teenon: "hot", galat: "hot", chances: "gold", east: "gold", hallucination: "gold", confidence: "good",
                       zero: "hot", guess: "gold", marks: "good", jee: "gold", neet: "gold", gate: "gold", negative: "hot", minus: "hot",
                       ghaate: "hot", "do-teen": "gold", badal: "hot", comment: "gold" } });
