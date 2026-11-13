      // A: the question at frame 0, the grid fills in on "ye cheezen master karo"
      tl.fromTo("#a_t", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      for (let r = 0; r < 8; r++) qa(".p" + r).forEach((el, c) => tl.to(el, { backgroundColor: "#F2B544", duration: 0.15, ease: "none" }, at("A", "ye") + r * 0.08 + c * 0.02));
      show("#a_tot", at("A", "master") - 0.05, { s: 1 });
      // B: area 1
      show("#t0", at("B", "llm") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i0").forEach((el, k) => show(el, at("B", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // C: area 2
      show("#t1", at("C", "rag") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i1").forEach((el, k) => show(el, at("C", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // D: area 3
      show("#t2", at("D", "agent") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i2").forEach((el, k) => show(el, at("D", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // E: area 4
      show("#t3", at("E", "evals") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i3").forEach((el, k) => show(el, at("E", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // F: area 5
      show("#t4", at("F", "system") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i4").forEach((el, k) => show(el, at("F", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // G: area 6
      show("#t5", at("G", "security") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i5").forEach((el, k) => show(el, at("G", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // H: area 7
      show("#t6", at("H", "deployment") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i6").forEach((el, k) => show(el, at("H", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // I: area 8
      show("#t7", at("I", "backend") - 0.12, { s: 1.15, d: 0.28 });
      qa(".i7").forEach((el, k) => show(el, at("I", "master") + k * 0.035, { s: 1, y: 8, d: 0.18 }));
      // J: the call to action
      show("#j_s", at("J", "chahiye") - 0.1, { s: 1.1 });
      show("#j_c", at("J", "comment") - 0.05, { s: 1, y: 0 });
      show("#j_ai", at("J", "karo") + 0.25, { s: 1.5 });
      tl.fromTo("#j_pdf", { opacity: 0, y: 60, rotation: 4 }, { opacity: 1, y: 0, rotation: -4, duration: 0.45, ease: "back.out(1.6)" }, at("J", "roadmap", 1) - 0.1);
      show("#j_dm", at("J", "seedha") - 0.05, { s: 0.92 });
      M.finish({ kw: { engineer: "gold", master: "gold", llm: "gold", rag: "gold", agent: "gold", evals: "gold", system: "gold", design: "gold",
                       security: "gold", deployment: "gold", backend: "gold", roadmap: "gold", comment: "gold", dm: "gold" } });
