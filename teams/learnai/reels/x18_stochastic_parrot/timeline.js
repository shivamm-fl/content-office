      // A: the owner's face (muted, retimed to the voice) in the lower half; captions sit above his face; parrot + RATTU vs RANDOM on top
      tl.set("#caps", { y: -450 }, 0);
      tl.set("#caps", { y: 0 }, at("B", "stochastic") - 0.2);
      tl.fromTo("#a_vid", { scale: 1.0 }, { scale: 1.05, duration: 5.4, ease: "none" }, 0);
      tl.fromTo("#a_l", { scale: 1.04 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_parrot", at("A", "tota") - 0.1, { s: 0.6, y: 0 });
      show("#a_tota", at("A", "tota") - 0.05, { s: 1.3, y: 0 });
      show("#a_rattu", at("A", "rattu") - 0.05, { s: 0.9 });
      wipe("#a_rs", at("A", "tota", 1) + 0.25, 0.35);
      show("#a_random", at("A", "random") - 0.05, { s: 1.25, y: 0 });

      // B: the name, the paper, and the open loop: temperature 0, answer still changes
      show("#b_t1", at("B", "stochastic") - 0.1, { s: 1.15 });
      show("#b_t2", at("B", "parrot") - 0.1, { s: 1.15 });
      show("#b_src", at("B", "parrot"), { s: 1, y: 0 });
      show("#b_temp", at("B", "zero") - 0.05, { s: 0.9 });
      show("#b_r1", at("B", "jawab") - 0.05, { s: 0.94 });
      show("#b_r2", at("B", "badal") - 0.05, { s: 0.94 });
      show("#b_st", at("B", "jata") - 0.05, { s: 1.5, y: 0 });

      // C: every token gets a chance -> "Sun rises in the ___" bars -> dice -> sampling
      show("#c_l", at("C", "har") - 0.05, { s: 1, y: 10 });
      show("#c_n", at("C", "do") - 0.1, { s: 1 });
      count("#c_n", 0, 200019, at("C", "do") - 0.05, 0.9, (v) => Math.round(v).toLocaleString("en-IN"));
      show("#c_nl", at("C", "tokens") - 0.05, { s: 1, y: 8 });
      ["#c_l", "#c_n", "#c_nl"].forEach((el) => hide(el, at("C", '"sun') - 0.3));
      show("#c_box", at("C", '"sun') - 0.15, { s: 0.97, y: 12 });
      const P1 = [0.685, 0.153, 0.093, 0.042, 0.028], P2 = [0.437, 0.206, 0.161, 0.108, 0.088], P0 = [1, 0, 0, 0, 0];
      P1.forEach((p, i) => tl.fromTo("#c_b" + (i + 1), { scaleY: 0 }, { scaleY: p, duration: 0.5, ease: "power2.out" }, at("C", "the") + 0.15 + i * 0.07));
      show("#c_ill", at("C", "the") + 0.3, { s: 1, y: 0 });
      hide("#c_blank", at("C", "east") - 0.08, 0.1);
      show("#c_fill", at("C", "east") - 0.05, { s: 1.4, y: 0 });
      show("#c_l1", at("C", "east") - 0.05, { s: 1.2, y: 0 });
      show("#c_l2", at("C", "west") - 0.05, { s: 1.2, y: 0 });
      show("#c_lrest", at("C", "west") + 0.3, { s: 1, y: 6 });
      show("#c_dice", at("C", "dice") - 0.1, { s: 0.6, y: 0 });
      tl.to("#c_dice", { rotation: 720, duration: 0.9, ease: "power2.out" }, at("C", "dice"));
      show("#c_pick", at("C", "chunta") - 0.05, { s: 1.2, y: 0 });
      hide("#c_dice", at("C", "ise") - 0.15); hide("#c_pick", at("C", "ise") - 0.15);
      show("#c_samp", at("C", "sampling") - 0.1, { s: 1.25 });
      show("#c_eq", at("C", "stochastic") - 0.1, { s: 1.1 });

      // D: temperature slider reshapes the same bars: T=1 -> T=2 (flatter) -> T=0 (only East) = rattu tota
      show("#d_t", at("D", "temperature") - 0.1, { s: 1.1 });
      ["#d_track", "#d_lo", "#d_hi", "#d_knob", "#d_val"].forEach((el) => show(el, at("D", "temperature") + 0.15, { s: 1, y: 0 }));
      P1.forEach((p, i) => tl.fromTo("#d_b" + (i + 1), { scaleY: 0 }, { scaleY: p, duration: 0.45, ease: "power2.out" }, at("D", "temperature") + 0.25 + i * 0.05));
      count("#d_val", 1, 1, at("D", "temperature") + 0.15, 0.05, (v) => "T = " + v.toFixed(1));   // shows T = 1.0 until the knob moves
      tl.to("#d_knob", { x: 380, duration: 0.6, ease: "power2.inOut" }, at("D", "zyada") - 0.05);
      count("#d_val", 1, 2, at("D", "zyada") - 0.05, 0.6, (v) => "T = " + v.toFixed(1));
      P2.forEach((p, i) => tl.to("#d_b" + (i + 1), { scaleY: p, duration: 0.6, ease: "power2.inOut" }, at("D", "zyada") - 0.05));
      [2, 3, 4, 5].forEach((i) => tl.to("#d_b" + i, { backgroundColor: "#9FB3D9", duration: 0.3 }, at("D", "kam") - 0.05));
      tl.to("#d_knob", { x: -380, duration: 0.7, ease: "power2.inOut" }, at("D", "zero") - 0.1);
      count("#d_val", 2, 0, at("D", "zero") - 0.1, 0.7, (v) => "T = " + v.toFixed(1));
      P0.forEach((p, i) => tl.to("#d_b" + (i + 1), { scaleY: p, duration: 0.6, ease: "power2.inOut" }, at("D", "zero") - 0.1));
      show("#d_rt", at("D", "rattu") - 0.05, { s: 1.3, y: 0 });

      // E: Mira Murati's lab, one prompt, temperature 0, 1000 runs -> 80 different answers
      show("#e_cto", at("E", "openai") - 0.1, { s: 0.9 });
      show("#e_mm", at("E", "mira") - 0.1, { s: 1.1 });
      show("#e_lab", at("E", "lab") - 0.1, { s: 1, y: 8 });
      show("#e_m", at("E", "open") - 0.05, { s: 1, y: 6 });
      show("#e_q", at("E", "sawal") - 0.1, { s: 0.94 });
      show("#e_t0", at("E", "temperature") - 0.05, { s: 0.9 });
      show("#e_runs", at("E", "hazar") - 0.1, { s: 1 });
      count("#e_rn", 0, 1000, at("E", "hazar") - 0.05, 0.8, (v) => Math.round(v).toString());
      hide("#e_runs", at("E", "assi") - 0.2);
      show("#e_80", at("E", "assi") - 0.05, { s: 1.5, y: 0 });
      show("#e_80l", at("E", "alag") - 0.05, { s: 1, y: 8 });
      show("#e_src", at("E", "assi"), { s: 1, y: 0 });

      // F: your request rides in a batch with other users; batch size changes the GPU sum order; last digit moves; token 103 flips
      show("#f_srv", at("F", "server") - 0.1, { s: 0.94 });
      show("#f_batch", at("F", "tumhara") - 0.1, { s: 0.98, y: 0 });
      show("#f_you", at("F", "tumhara") - 0.05, { s: 1.2, y: 0 });
      show("#f_u1", at("F", "doosre") - 0.05, { s: 1.2, y: 0 });
      show("#f_u2", at("F", "logon") - 0.05, { s: 1.2, y: 0 });
      show("#f_u3", at("F", "savalon") - 0.05, { s: 1.2, y: 0 });
      show("#f_bl", at("F", "batch") - 0.05, { s: 1, y: 0 });
      show("#f_u4", at("F", "size") - 0.05, { s: 1.3, y: -20 });
      show("#f_u5", at("F", "size") + 0.12, { s: 1.3, y: -20 });
      count("#f_bn", 4, 6, at("F", "badla") - 0.05, 0.3, (v) => Math.round(v).toString());
      show("#f_sum", at("F", "gpu") - 0.1, { s: 1, y: 12 });
      show("#f_tk", at("F", "token") - 0.1, { s: 1, y: 0 });
      show("#f_b1", at("F", "palat") - 0.1, { s: 0.94 });
      show("#f_b2", at("F", "gaya") - 0.05, { s: 0.94 });
      ["#f_srv", "#f_batch", "#f_bl", "#f_you", "#f_u1", "#f_u2", "#f_u3", "#f_u4", "#f_u5", "#f_sum", "#f_tk", "#f_b1", "#f_b2"].forEach((el) => hide(el, at("F", "yaani") - 0.2));
      show("#f_big1", at("F", "tumhara", 1) - 0.05, { s: 1.1 });
      show("#f_big2", at("F", "kitne") - 0.1, { s: 1.1 });
      show("#f_big3", at("F", "use") - 0.1, { s: 1.1 });

      // G: the fix and the lesson for app tests
      show("#g_k", at("G", "batch-invariant") - 0.1, { s: 0.9 });
      show("#g_n", at("G", "hazar") - 0.1, { s: 1.2 });
      show("#g_s", at("G", "same") - 0.1, { s: 1, y: 8 });
      show("#g_t", at("G", "tests") - 0.1, { s: 0.95 });
      show("#g_w", at("G", "bharosa") - 0.05, { s: 1, y: 6 });

      // H: Altman's tweet, word by word
      show("#h_c", at("H", "chatgpt") - 0.1, { s: 0.9 });
      show("#h_q", at("H", "sam") - 0.1, { s: 0.95 });
      show("#h_src", at("H", "sam"), { s: 1, y: 0 });
      show("#h_w1", at("H", '"i') - 0.05, { s: 1, y: 6, d: 0.2 });
      show("#h_w2", at("H", "stochastic") - 0.05, { s: 1.15, y: 0, d: 0.25 });
      show("#h_w3", at("H", "and") - 0.05, { s: 1, y: 6, d: 0.2 });
      show("#h_m", at("H", "main") - 0.05, { s: 1.2 });

      // I: pick a side
      show("#i_t", at("I", "tum") - 0.05, { s: 1.1 });
      show("#i_o1", at("I", "hai") - 0.1, { s: 0.9 });
      show("#i_o2", at("I", "nahi") - 0.1, { s: 0.9 });
      show("#i_c", at("I", "comment") - 0.05, { s: 0.85 });
      M.finish({ kw: { tota: "gold", rattu: "hot", random: "gold", stochastic: "gold", parrot: "gold", zero: "cyan", temperature: "cyan",
                       sampling: "gold", east: "gold", dice: "gold", assi: "hot", batch: "gold", gpu: "cyan", decimal: "hot", digit: "hot",
                       "batch-invariant": "good", same: "good", bharosa: "hot", side: "gold", comment: "gold" } });
