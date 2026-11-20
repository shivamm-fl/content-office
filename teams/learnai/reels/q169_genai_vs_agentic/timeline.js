      // A: the question on frame 0, then the real post (title + date), then the asked line, then "same LLM, different work"
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      tl.fromTo("#a_q", { opacity: 0.85 }, { opacity: 1, duration: 0.3 }, 0);
      show("#a_hdr", at("A", "accenture") - 0.1, { s: 0.94 });
      show("#a_qs", at("A", "generative") - 0.1, { s: 0.94 });
      tl.fromTo("#a_qs", { scale: 1 }, { scale: 1.06, duration: 3.2, ease: "none" }, at("A", "generative") + 0.3);
      show("#a_src", at("A", "generative"), { s: 1, y: 0 });
      ["#a_hdr", "#a_qs", "#a_src"].forEach((s) => hide(s, at("A", "donon") - 0.15));
      show("#a_l", at("A", "donon") - 0.05, { s: 0.92 });
      show("#a_r", at("A", "donon") + 0.15, { s: 0.92 });
      show("#a_alag", at("A", "phir") - 0.05, { s: 1.1 });
      // B: Generative AI writes the request, you do the work
      show("#b_t", at("B", "flight") - 0.1, { s: 1.15 });
      show("#b_g", at("B", "generative") - 0.1, { s: 1 });
      show("#b_u", at("B", "kahoge") - 0.2, { s: 0.9 });
      show("#b_a", at("B", "badhiya") - 0.1, { s: 0.9 });
      ["#b_g", "#b_u", "#b_a"].forEach((s) => hide(s, at("B", "par") - 0.15));
      show("#b_1", at("B", "kholna") - 0.25, { s: 0.94 });
      show("#b_2", at("B", "bharna") - 0.25, { s: 0.94 });
      show("#b_3", at("B", "dekhna") - 0.25, { s: 0.94 });
      ["#b_1 .who", "#b_2 .who", "#b_3 .who"].forEach((s) => tl.fromTo(s, { scale: 1 }, { scale: 1.25, duration: 0.18, yoyo: true, repeat: 1 }, at("B", "tum")));
      show("#b_end", at("B", "usne") - 0.1, { s: 1.08 });
      // C: Agentic AI gets the goal and does the steps itself, then the loop
      show("#c_t", at("C", "agentic") - 0.1, { s: 1.12 });
      show("#c_goal", at("C", "goal") - 0.1, { s: 0.9 });
      show("#c_1", at("C", "booking") - 0.2, { s: 0.94 });
      show("#c_2", at("C", "policy") - 0.3, { s: 0.94 });
      show("#c_3", at("C", "form") - 0.15, { s: 0.94 });
      show("#c_4", at("C", "jawab") - 0.1, { s: 0.94 });
      ["#c_t", "#c_goal", "#c_1", "#c_2", "#c_3", "#c_4"].forEach((s) => hide(s, at("C", "yaani") - 0.15));
      tl.set("#c_loop", { opacity: 0 }, 0); tl.set("#c_done", { opacity: 0 }, 0);
      tl.to("#c_loop", { opacity: 1, duration: 0.3 }, at("C", "yaani"));
      tl.to("#c_orb", { rotation: 360, duration: at("C", "jab") - at("C", "socho"), ease: "none" }, at("C", "socho"));
      [["#c_n1", "socho", 0], ["#c_n2", "tool", 0], ["#c_n3", "natija", 0], ["#c_n4", "phir", 0]].forEach(([s, w, n]) =>
        tl.to(s, { backgroundColor: "#5BC0EB", color: "#0B1220", duration: 0.2 }, at("C", w, n) - 0.05));
      show("#c_done", at("C", "goal", 1) - 0.1, { s: 1.4 });
      // D: same model, different setup
      show("#d_t", at("D", "model") - 0.1, { s: 1.08 });
      show("#d_l", at("D", "generative") - 0.15, { s: 0.95 });
      show("#d_l1", at("D", "prompt") - 0.1, { s: 1 });
      show("#d_l2", at("D", "prompt") + 0.2, { s: 1 });
      show("#d_l3", at("D", "output") - 0.1, { s: 1 });
      show("#d_l4", at("D", "faisla") - 0.1, { s: 1.1 });
      show("#d_r", at("D", "agentic") - 0.15, { s: 0.95 });
      show("#d_r0", at("D", "llm") - 0.1, { s: 1 });
      show("#d_r1", at("D", "tools") - 0.1, { s: 1.1 });
      show("#d_r2", at("D", "memory") - 0.1, { s: 1.1 });
      show("#d_r3", at("D", "loop") - 0.1, { s: 1.1 });
      show("#d_r4", at("D", "agla") - 0.1, { s: 1.1 });
      // E: the follow-up: agent costs, errors compound; fixed steps = workflow
      show("#e_t", at("E", "kya") - 0.1, { s: 1.1 });
      show("#e_1", at("E", "mahnga") - 0.1, { s: 1.1 });
      show("#e_2", at("E", "dheema") - 0.1, { s: 1.1 });
      show("#e_3", at("E", "galti") - 0.1, { s: 1.1 });
      ["#e_s1", "#e_s2", "#e_s3", "#e_s4", "#e_s5"].forEach((s, i) => {
        show(s, at("E", "galti") + i * 0.18, { s: 0.9 });
        tl.to(s, { backgroundColor: ["#2A2F45", "#4A2B3A", "#6B2C3A", "#8E2E3C", "#B8323F"][i], borderColor: "#E8596B", duration: 0.25 }, at("E", "badhti") + i * 0.2);
      });
      show("#e_inv", at("E", "invoice") - 0.1, { s: 1.05 });
      show("#e_wf", at("E", "fixed") - 0.1, { s: 0.95 });
      show("#e_ag", at("E", "agent", 2) - 0.1, { s: 1.05 });
      // F: interview answer
      show("#f_chip", at("F", "interview") - 0.05, { s: 0.85 });
      show("#f_1", at("F", "generative") - 0.1, { s: 0.94 });
      show("#f_2", at("F", "agentic") - 0.1, { s: 0.94 });
      show("#f_3", at("F", "steps") - 0.1, { s: 0.94 });
      // G: the question
      show("#g_1", at("G", "ai") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "ai", 1) - 0.1, { s: 0.94 });
      show("#g_q", at("G", "inmen") - 0.1, { s: 1.1 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { accenture: "gold", generative: "gold", agentic: "cyan", agent: "cyan", loop: "cyan", goal: "good", setup: "cyan",
                       workflow: "good", mahnga: "hot", dheema: "hot", galti: "hot", content: "gold", comment: "gold" } });
