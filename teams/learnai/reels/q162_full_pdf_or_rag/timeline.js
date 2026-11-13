      // A: a 40-page handbook headed for a RAG pipeline (example)
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_ar", at("A", "team") - 0.05, { s: 1, y: 0 });
      show("#a_rag", at("A", "rag") - 0.1, { s: 0.92 });
      show("#a_st", at("A", "shaayad") - 0.9, { s: 1.8 });   // "ruko..." is not a caption key
      // B: open book exam
      show("#b_t", at("B", "open") - 0.1, { s: 1.2 });
      show("#b_p1", at("B", "kitab") - 0.1, { s: 0.92 });
      show("#b_p2", at("B", "library") - 0.1, { s: 0.92 });
      show("#b_rag", at("B", "rag") - 0.1, { s: 1.2 });
      show("#b_flow", at("B", "tukde") - 0.1, { s: 1 });
      // C: index cards can be wrong; the size rule
      show("#c_t", at("C", "galti") - 0.15, { s: 1.1 });
      show("#c_e1", at("C", "tukda") - 0.05, { s: 0.92 });
      show("#c_e2", at("C", "sahi") - 0.05, { s: 0.92 });
      show("#c_rule", at("C", "rule") - 0.05, { s: 0.94 });
      show("#c_src", at("C", "two"), { s: 1, y: 0 });
      // D: prompt caching
      show("#d_q", at("D", "har") - 0.05, { s: 1.05 });
      show("#d_t", at("D", "caching") - 0.15, { s: 1.25 });
      show("#d_reqs", at("D", "baar-baar") - 0.1, { s: 0.94 });
      tl.to("#d_c2", { backgroundColor: "#4CC38A", duration: 0.4 }, at("D", "dobara"));
      show("#d_cl", at("D", "dobara"), { s: 1, y: 0 });
      show("#d_s1", at("D", "latency") - 0.05, { s: 1.1 });
      show("#d_s2", at("D", "cost") - 0.05, { s: 1.1 });
      show("#d_src", at("D", "anthropic"), { s: 1, y: 0 });
      // E: bigger than that: RAG
      show("#e_1", at("E", "data") - 0.05, { s: 1.1 });
      show("#e_2", at("E", "rag") - 0.1, { s: 1.4 });
      // F: interview answer
      show("#f_chip", at("F", "interview") - 0.05, { s: 0.85 });
      show("#f_q", at("F", "pehle") - 0.05, { s: 0.94 });
      show("#f_y", at("F", "fit", 1) - 0.1, { s: 0.92 });
      show("#f_n", at("F", "n") - 0.1, { s: 0.92 });
      // G: the question
      show("#g_1", at("G", "tumhara") - 0.1, { s: 1.1 });
      show("#g_2", at("G", "kitne") - 0.1, { s: 1.2 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { rag: "gold", ruko: "hot", galti: "hot", galat: "hot", tokens: "gold", pages: "gold", caching: "good", latency: "good", cost: "good",
                       ninety: "good", poora: "good", fit: "gold", comment: "gold" } });
