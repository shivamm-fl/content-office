      // A: question on frame 0, the real post, then the bank bot
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_hdr", at("A", "accenture") - 0.1, { s: 0.94 });
      show("#a_qs", at("A", "multi-agent") - 0.1, { s: 0.94 });
      tl.fromTo("#a_qs", { scale: 1 }, { scale: 1.06, duration: 3, ease: "none" }, at("A", "multi-agent") + 0.3);
      show("#a_src", at("A", "multi-agent"), { s: 1, y: 0 });
      ["#a_hdr", "#a_qs", "#a_src"].forEach((s) => hide(s, at("A", "jawab") - 0.15));
      show("#a_bot", at("A", "jawab") - 0.05, { s: 0.9 });
      show("#a_bank", at("A", "bank") - 0.1, { s: 1.1 });
      // B: three kinds of questions, each with its own tools
      show("#b_t", at("B", "teen") - 0.1, { s: 1.1 });
      show("#b_1", at("B", "card") - 0.15, { s: 0.9, y: 0 });
      show("#b_2", at("B", "loan") - 0.15, { s: 0.9, y: 0 });
      show("#b_3", at("B", "app") - 0.15, { s: 0.9, y: 0 });
      show("#b_t1", at("B", "tools") - 0.2, { s: 1 }); show("#b_t2", at("B", "tools"), { s: 1 }); show("#b_t3", at("B", "tools") + 0.2, { s: 1 });
      show("#b_r", at("B", "rules") - 0.3, { s: 1.05 });
      // C: one agent with every rule and every tool
      show("#c_t", at("C", "sab") - 0.1, { s: 1.1 });
      show("#c_box", at("C", "agent") - 0.1, { s: 0.96 });
      qa("#c_doc .r").forEach((r, i) => show(r, at("C", "prompt") + i * 0.22, { s: 1, y: 10 }));
      tl.set("#c_qm", { opacity: 0 }, 0);
      tl.to("#c_qm", { opacity: 1, duration: 0.2 }, at("C", "sahi") - 0.1);
      tl.to("#c_qm", { left: 560, top: 330, duration: 0.4 }, at("C", "sahi") + 0.2);
      tl.to("#c_qm", { left: 820, top: 160, duration: 0.4 }, at("C", "tool"));
      tl.to("#c_qm", { left: 600, top: 420, duration: 0.4 }, at("C", "chunna"));
      tl.to("#c_wrong", { borderColor: "#E8596B", color: "#E8596B", duration: 0.2 }, at("C", "chunna") + 0.4);
      tl.to("#c_r1", { backgroundColor: "#4CC38A", color: "#0B1220", duration: 0.25 }, at("C", "sudharne") - 0.1);
      tl.to("#c_r3", { backgroundColor: "#E8596B", color: "#0B1220", duration: 0.25 }, at("C", "bigad") - 0.1);
      tl.fromTo("#c_r3", { x: 0 }, { x: 10, duration: 0.06, yoyo: true, repeat: 5 }, at("C", "bigad"));
      // D: the router reads the type and sends it to one specialist
      show("#d_t", at("D", "routing") - 0.1, { s: 1.15 });
      show("#d_q", at("D", "sawal") - 0.15, { s: 0.92, y: 0 });
      show("#d_rt", at("D", "sawal") + 0.3, { s: 0.9 });
      show("#d_type", at("D", "pahchano") - 0.1, { s: 1.1 });
      ["#d_a1", "#d_a2", "#d_a3"].forEach((s, i) => show(s, at("D", "specialist") - 0.2 + i * 0.12, { s: 0.92 }));
      show("#d_arr", at("D", "bhej") - 0.1, { s: 1.3, y: -20 });
      tl.to("#d_a1", { borderColor: "#F2B544", duration: 0.25 }, at("D", "bhej"));
      ["#d_t1a", "#d_t1b"].forEach((s, i) => show(s, at("D", "card", 1) + i * 0.2, { s: 1 }));
      ["#d_t2a", "#d_t2b"].forEach((s, i) => show(s, at("D", "loan") + i * 0.2, { s: 1 }));
      ["#d_t3a", "#d_t3b"].forEach((s, i) => show(s, at("D", "loan", 1) + 0.4 + i * 0.2, { s: 1 }));
      show("#d_tok", at("D", "token") - 0.1, { s: 1.05 });
      // E: easy questions to a small model, hard ones to a big model
      show("#e_t", at("E", "paise") - 0.1, { s: 1.1 });
      show("#e_rt", at("E", "aasaan") - 0.2, { s: 0.9 });
      show("#e_l", at("E", "chhote") - 0.15, { s: 0.94 });
      show("#e_r", at("E", "mushkil") - 0.1, { s: 0.94 });
      // F: follow-up: the router can be wrong, so test it and give it a fallback
      show("#f_t", at("F", "router") - 0.1, { s: 1.08 });
      show("#f_w", at("F", "galat") - 0.1, { s: 0.94 });
      show("#f_ts", at("F", "test") - 0.15, { s: 1 });
      ["#f_1", "#f_2", "#f_3"].forEach((s, i) => show(s, at("F", "test") + 0.1 + i * 0.3, { s: 0.94 }));
      show("#f_acc", at("F", "accuracy") - 0.1, { s: 1.08 });
      show("#f_h", at("F", "general") - 0.15, { s: 1.05 });
      // G: interview answer
      show("#g_chip", at("G", "interview") - 0.05, { s: 0.85 });
      show("#g_1", at("G", "routing") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "prompt") - 0.1, { s: 0.94 });
      show("#g_3", at("G", "ek") - 0.1, { s: 0.94 });
      show("#g_4", at("G", "aasaan") - 0.1, { s: 0.94 });
      // H: the question
      show("#h_1", at("H", "food") - 0.1, { s: 1.1 });
      show("#h_2", at("H", "routes") - 0.3, { s: 1.1 });
      show("#h_c", at("H", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { accenture: "gold", routing: "cyan", router: "cyan", "multi-agent": "gold", specialist: "gold", card: "gold", loan: "gold",
                       tools: "good", rules: "gold", galat: "hot", bigad: "hot", accuracy: "gold", saste: "good", comment: "gold" } });
