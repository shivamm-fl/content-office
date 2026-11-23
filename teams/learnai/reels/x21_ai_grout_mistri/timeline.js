      // The trend clip ("grout bhar dunga", owner 2026-11-23) sits between scene A's line and scene B; insert_clip.py writes its times to REEL.clip.
      const CL = window.REEL.clip || { s: 3.85, e: 5.85 };
      const ST = window.REEL.hi.starts;

      // A: split screen. Top: the red pytest run + "User: why this test is failing?" (frame 0 = the hook). Bottom: Claude's panel; Claude "answers" with the real trend clip.
      tl.fromTo("#a_f1", { scale: 1 }, { scale: 1.08, transformOrigin: "0% 50%", duration: 0.16, yoyo: true, repeat: 1, ease: "power1.inOut" }, at("A", "fail") - 0.05);
      tl.fromTo("#a_user", { borderColor: "#3A4766" }, { borderColor: "#F2B544", duration: 0.25 }, at("A", "bhaai") - 0.05);
      ["#a_d1", "#a_d2", "#a_d3"].forEach((el, i) => tl.fromTo(el, { opacity: 0.15 }, { opacity: 1, duration: 0.25, repeat: 3, yoyo: true }, 0.2 + i * 0.2));
      hide("#a_think", CL.s - 0.1, 0.1);
      tl.fromTo("#a_clipwrap", { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, CL.s - 0.06);
      tl.fromTo("#a_chip", { scale: 1 }, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1 }, CL.s);
      show("#a_clipsub", CL.s + 0.05, { s: 1.2, y: 0, d: 0.2 });
      show("#a_clipsrc", CL.s + 0.1, { s: 1, y: 0, d: 0.2 });

      // B: the GST function with its typo, then what a test is: give 100, expect 118
      show("#b_win", ST.B + 0.05, { s: 0.97 });
      show("#b_badhl", at("B", "galat") - 0.05, { s: 1.2, y: 0 });
      show("#b_galat", at("B", "galat"), { s: 1.3, y: 0 });
      show("#b_chip", at("B", "test") - 0.1, { s: 1.2 });
      show("#b_fn", at("B", "function", 1) - 0.1, { s: 1.1, y: 0 });
      show("#b_in", at("B", "sau") - 0.1, { s: 1.2, y: 0 });
      show("#b_a1", at("B", "sau"), { s: 1, y: 0 });
      show("#b_a2", at("B", "atharah") - 0.15, { s: 1, y: 0 });
      show("#b_out", at("B", "atharah") - 0.05, { s: 1.2, y: 0 });
      show("#b_exp", at("B", "aana"), { s: 1, y: 10 });

      // C: two failed tries, then the two hardcoded lines typed in
      show("#c_t1", at("C", "koshish") - 0.1, { s: 1, y: 20 });
      show("#c_t2", at("C", "fail") - 0.1, { s: 1, y: 20 });
      show("#c_win", at("C", "chupke") - 0.1, { s: 0.97 });
      show("#c_l2", at("C", "agar") - 0.05, { s: 1, y: 6, d: 0.2 });
      show("#c_l3", at("C", "seedha") - 0.05, { s: 1, y: 6, d: 0.2 });
      show("#c_hl", at("C", "agar") + 0.1, { s: 1, y: 0, d: 0.3 });
      show("#c_hard", at("C", "bhej") - 0.1, { s: 1.3 });

      // D: green, but 200 still wrong; the crack in the tile joint gets grout over it
      show("#d_pass", at("D", "test") - 0.1, { s: 1.15 });
      show("#d_in", at("D", "do") - 0.1, { s: 1.1, y: 0 });
      show("#d_a", at("D", "rupye"), { s: 1, y: 0 });
      show("#d_out", at("D", "galat") - 0.1, { s: 1.25, y: 0 });
      show("#d_ok", at("D", "galat") + 0.25, { s: 1, y: 0 });
      show("#d_tiles", at("D", "bug") - 0.15, { s: 1, y: 30 });
      show("#d_bug", at("D", "vahin") - 0.05, { s: 1.3, y: 0 });
      tl.fromTo("#d_grout", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.inOut", immediateRender: true }, at("D", "grout") - 0.1);
      tl.to("#d_bug", { opacity: 0.3, duration: 0.3 }, at("D", "grout") + 0.4);
      show("#d_lbl", at("D", "bhar") - 0.05, { s: 1.15 });

      // E: the test itself gets edited to match the wrong output
      show("#e_win", ST.E + 0.05, { s: 0.97 });
      wipe("#e_st", at("E", "badal") - 0.05, 0.3);
      show("#e_new", at("E", "badal") + 0.2, { s: 1.4, y: 0 });
      show("#e_chip", at("E", "badal"), { s: 1.25 });
      show("#e_pass", at("E", "sahi") - 0.1, { s: 1.15 });
      show("#e_sub", at("E", "dikhe") - 0.05, { s: 1, y: 10 });

      // F: the real system card crop, highlighter on the SPECIAL HACK line, then on the test-only if
      show("#f_chip", at("F", "claude") - 0.1, { s: 1.15 });
      show("#f_shot", at("F", "purane") - 0.1, { s: 0.96 });
      tl.fromTo("#f_shot", { scale: 1 }, { scale: 1.04, duration: ST.G - at("F", "purane"), ease: "none" }, at("F", "purane"));
      show("#f_src", at("F", "purane"), { s: 1, y: 0 });
      wipe("#f_m1", at("F", "special") - 0.05, 0.5);
      show("#f_big", at("F", "hack") - 0.05, { s: 1.2 });
      wipe("#f_m2", at("F", "test") - 0.05, 0.4);
      show("#f_sub", at("F", "seedhe") - 0.05, { s: 1.05 });

      // G: training loop -> reward on PASS -> nobody checks how -> shortcut arc -> the name + the card's sentence
      show("#g_t", at("G", "training") - 0.1, { s: 1, y: 10 });
      ["#g_n1", "#g_a1", "#g_n2", "#g_a2", "#g_n3"].forEach((el, i) => show(el, at("G", "training") + i * 0.12, { s: 1.1, y: 0 }));
      show("#g_rw", at("G", "inam") - 0.05, { s: 1.3 });
      show("#g_q", at("G", "kaise") - 0.05, { s: 1.4, y: 0 });
      show("#g_chk", at("G", "check") - 0.05, { s: 1, y: 8 });
      show("#g_arc", at("G", "shortcut") - 0.1, { s: 1, y: 20 });
      show("#g_sc", at("G", "shortcut"), { s: 1.2, y: 0 });
      tl.to("#g_n2", { opacity: 0.3, duration: 0.3 }, at("G", "shortcut") + 0.2);
      show("#g_big", at("G", "reward") - 0.1, { s: 1.15 });
      show("#g_shot", at("G", "hacking") + 0.1, { s: 1, y: 10 });
      show("#g_src", at("G", "hacking") + 0.1, { s: 1, y: 0 });
      wipe("#g_m", at("G", "hacking") + 0.4, 0.4);

      // H: the prompt, one line per phrase
      show("#h_win", ST.H + 0.05, { s: 0.97 });
      show("#h_p1", at("H", "hardcode") - 0.1, { s: 1, y: 14 });
      show("#h_p2", at("H", "badalna") - 0.3, { s: 1, y: 14 });
      show("#h_p3", at("H", "galat") - 0.2, { s: 1, y: 14 });
      show("#h_src", at("H", "batana"), { s: 1, y: 0 });

      // I: green tick is not the end -> open the diff -> the comment line gives it away
      show("#i_pass", ST.I + 0.05, { s: 1.1 });
      hide("#i_pass", at("I", "diff") - 0.15);
      show("#i_win", at("I", "diff") - 0.1, { s: 0.97 });
      show("#i_tick", at("I", "kholo") - 0.05, { s: 1.15 });
      ["#i_d1", "#i_d2", "#i_d3"].forEach((el, i) => tl.fromTo(el, { backgroundColor: "rgba(76,195,138,.55)" }, { backgroundColor: "rgba(76,195,138,.16)", duration: 0.6 }, at("I", "lines") - 0.1 + i * 0.1));
      wipe("#i_hl", at("I", "comment") - 0.05, 0.4);
      show("#i_mag", at("I", "special") - 0.1, { s: 1.3, y: 0 });
      show("#i_find", at("I", "bas") - 0.1, { s: 0.97 });
      show("#i_q", at("I", "dhoondho") - 0.15, { s: 1, y: 6, d: 0.2 });

      // J: the question
      show("#j_pass", at("J", "test") - 0.1, { s: 1.1 });
      show("#j_win", at("J", "likha") - 0.1, { s: 0.97 });
      show("#j_o1", at("J", "bug") - 0.05, { s: 1.15 });
      show("#j_o2", at("J", "grout") - 0.05, { s: 1.15 });
      show("#j_cm", at("J", "comment") - 0.05, { s: 1.2 });

      M.finish({ kw: { mistri: "gold", fail: "hot", test: "cyan", gst: "cyan", galat: "hot", hardcode: "hot", green: "good", grout: "gold", bug: "hot",
                       special: "gold", hack: "hot", claude: "#D97757", training: "gold", inam: "gold", shortcut: "hot", reward: "gold", hacking: "gold",
                       diff: "cyan", comment: "gold" } });
