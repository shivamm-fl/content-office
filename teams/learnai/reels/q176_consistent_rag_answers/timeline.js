      // pictures built once (seek-safe) and animated on the spoken words
      const GOLD = "#F2B544", CY = "#5BC0EB", RED = "#E8596B", GRN = "#4CC38A", MUT = "#8592AD";
      const el = (cls, host, css, txt) => { const d = document.createElement("div"); d.className = cls; Object.assign(d.style, css); if (txt !== undefined) d.textContent = txt; host.appendChild(d); return d; };
      const hid = (e) => { tl.set(e, { opacity: 0 }, 0); return e; };

      // A: frame 0 = the problem; the post, then the asked question with its NVIDIA label
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_p", at("A", "nvidia") + 0.05, { s: 0.94 });
      hide("#a_p", at("A", "rag") - 0.3);
      show("#a_qs", at("A", "rag") - 0.1, { s: 0.94 });
      tl.fromTo("#a_qs", { scale: 1 }, { scale: 1.05, duration: 4, ease: "none" }, at("A", "rag") + 0.3);
      show("#a_n", at("A", "consistent") - 0.1, { s: 1.1 });

      // B: three places the difference can come from
      show("#b_t", at("B", "dhoondho") - 0.1, { s: 1.06 });
      show("#b_1", at("B", "shabd") - 0.15, { s: 1.04 }); show("#b_2", at("B", "chunks") - 0.15, { s: 1.04 }); show("#b_3", at("B", "version") - 0.15, { s: 1.04 });
      show("#b_all", at("B", "teenon") - 0.1, { s: 1.06 });

      // C: illustration: next-word probabilities at temperature 1 (80/15/5) and 2 (59/26/15, computed); high temperature can pick "10"
      show("#c_t", at("C", "pahla") - 0.1, { s: 1.08 });
      show("#c_pr", at("C", "agla") - 0.1, { s: 1.05 });
      const LOW = [0.80, 0.15, 0.05], HIGH = [0.59, 0.26, 0.15];
      [0, 1, 2].forEach((i) => {
        show("#c_r" + i, at("C", "probabilities") - 0.1 + i * 0.15, { s: 1, y: 14 });
        tl.set("#c_b" + i, { scaleX: 0 }, 0); tl.to("#c_b" + i, { scaleX: LOW[i], duration: 0.5, ease: "power2.out" }, at("C", "probabilities") + i * 0.15);
        tl.to("#c_b" + i, { scaleX: HIGH[i], backgroundColor: RED, duration: 0.6, ease: "power2.inOut" }, at("C", "zyada"));
        tl.to("#c_b" + i, { scaleX: LOW[i], backgroundColor: GOLD, duration: 0.6, ease: "power2.inOut" }, at("C", "randomness") - 0.2);
        const hp = hid(el("p", q("#c_r" + i), {}, Math.round(HIGH[i] * 100) + "%")); hp.style.color = RED;
        tl.to("#c_p" + i, { opacity: 0, duration: 0.2 }, at("C", "zyada") + 0.2); tl.to(hp, { opacity: 1, duration: 0.2 }, at("C", "zyada") + 0.2);
        tl.to(hp, { opacity: 0, duration: 0.2 }, at("C", "randomness")); tl.to("#c_p" + i, { opacity: 1, duration: 0.2 }, at("C", "randomness"));
      });
      show("#c_hot", at("C", "temperature") - 0.1, { s: 1.06 });
      tl.to("#c_r1 .w", { backgroundColor: RED, borderColor: RED, color: "#0B1220", duration: 0.2 }, at("C", "chune") - 0.1);
      show("#c_ab", at("C", "badalta") - 0.2, { s: 1.06 });
      ["#c_hot", "#c_ab"].forEach((s) => hide(s, at("C", "facts") - 0.2));
      tl.to("#c_r1 .w", { backgroundColor: "#1B2538", borderColor: "#26324B", color: "#E8EDF6", duration: 0.2 }, at("C", "facts"));
      tl.to("#c_r0 .w", { backgroundColor: GRN, borderColor: GRN, color: "#0B1220", duration: 0.2 }, at("C", "randomness"));
      show("#c_cold", at("C", "randomness") - 0.1, { s: 1.06 });

      // D: retrieval: a new document in the index, a different chunk set the next time; log the chunk ids per answer
      show("#d_t", at("D", "doosra") - 0.1, { s: 1.08 });
      show("#d_ix", at("D", "index") - 0.15, { s: 1.03 }); show("#d_il", at("D", "index") - 0.1, { s: 1 });
      const ix = q("#d_ix"), IDS = ["c3", "c7", "c9", "c12", "c21", "c33", "c40", "c41", "c55"], T = {};
      IDS.forEach((id, k) => { const t = el("tile", ix, { left: (24 + (k % 3) * 108) + "px", top: (24 + Math.floor(k / 3) * 98) + "px" }, id); T[id] = t; });
      tl.set(T.c41, { opacity: 0 }, 0); show(T.c41, at("D", "naye") - 0.1, { s: 1.3, y: -40 }); tl.to(T.c41, { borderColor: GRN, duration: 0.2 }, at("D", "naye"));
      show("#d_log", at("D", "approximate") - 0.2, { s: 1.03 });
      const lg = q("#d_log"), rowT = (k, ids, t, bad) => {
        const l = hid(el("lbl", lg, { left: "28px", top: (24 + k * 150) + "px" }, "jawab " + (k + 1) + ": retrieved")); tl.to(l, { opacity: 1, duration: 0.2 }, t);
        return ids.map((id, j) => { const c = hid(el("tile", lg, { left: (28 + j * 112) + "px", top: (70 + k * 150) + "px", borderColor: id === bad ? RED : GOLD }, id)); show(c, t + 0.1 + j * 0.12, { s: 1.2, y: 0 }); return c; });
      };
      ["c12", "c40", "c7"].forEach((id) => tl.to(T[id], { borderColor: GOLD, duration: 0.2 }, at("D", "approximate")));
      const r1 = rowT(0, ["c12", "c40", "c7"], at("D", "approximate"));
      tl.to(T.c40, { borderColor: "#26324B", duration: 0.2 }, at("D", "doosre") - 0.1); tl.to(T.c41, { borderColor: RED, duration: 0.2 }, at("D", "doosre") - 0.1);
      const r2 = rowT(1, ["c12", "c41", "c7"], at("D", "doosre") - 0.1, "c41");
      show("#d_ctx", at("D", "context") - 0.1, { s: 1.06 });
      tl.to(lg, { borderColor: GOLD, duration: 0.2 }, at("D", "log") - 0.1); show("#d_lg", at("D", "log") - 0.1, { s: 1.06 });
      tl.to([r1[1], r2[1]], { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, at("D", "tulna") - 0.1);
      tl.to(r1[1], { borderColor: RED, duration: 0.2 }, at("D", "tulna"));

      // E: a moving name vs a fixed snapshot; eval before any change
      show("#e_t", at("E", "teesra") - 0.1, { s: 1.06 });
      const ea = q("#e_a"), eb = q("#e_b");
      el("x", ea, { left: "34px", top: "34px", fontSize: "50px", fontFamily: "JetBrains Mono, monospace" }, 'model = "latest"');
      const ear = el("x", ea, { left: "34px", top: "110px", fontSize: "40px", color: RED }, "aaj v1, kal v2: jawab badla");
      el("x", eb, { left: "34px", top: "34px", fontSize: "50px", fontFamily: "JetBrains Mono, monospace" }, 'model = "v1" (fixed)');
      const ebr = el("x", eb, { left: "34px", top: "110px", fontSize: "40px", color: GRN }, "hamesha wahi model");
      show("#e_a", at("E", "model", 1) - 0.1, { s: 1.03 }); show("#e_b", at("E", "fixed") - 0.15, { s: 1.03 });
      tl.to(ea, { opacity: 0.45, duration: 0.3 }, at("E", "fixed") + 0.2); tl.to(eb, { borderColor: GRN, duration: 0.2 }, at("E", "snapshot") - 0.1);
      show("#e_ev", at("E", "eval") - 0.1, { s: 1.06 });

      // F: frequent questions: the approved answer from the cache, no fresh generation
      show("#f_t", at("F", "sawal") - 0.1, { s: 1.06 });
      show("#f_q", at("F", "refund") - 0.1, { s: 1.08 });
      const fa = hid(el("arr", q("#sF"), { position: "absolute", left: "490px", top: "450px", width: "100px", height: "6px", borderRadius: "3px", background: GRN }));
      tl.to(fa, { opacity: 1, duration: 0.2 }, at("F", "approved") - 0.1);
      show("#f_c", at("F", "approved") - 0.1, { s: 1.06 });
      show("#f_llm", at("F", "naye") - 0.3, { s: 1.03 });
      tl.set("#f_x", { opacity: 0 }, 0); tl.to("#f_x", { opacity: 1, duration: 0.05 }, at("F", "generate") - 0.1); wipe("#f_x", at("F", "generate") - 0.1, 0.4);
      show("#f_a", at("F", "generate") + 0.5, { s: 1.04 });

      // G: interview answer
      show("#g_chip", at("G", "interview") - 0.05, { s: 0.85 });
      show("#g_1", at("G", "teen") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "randomness") - 0.1, { s: 0.94 });
      show("#g_3", at("G", "retrieved") - 0.1, { s: 0.94 });
      show("#g_4", at("G", "pin") - 0.3, { s: 0.94 });
      show("#g_5", at("G", "frequent") - 0.1, { s: 0.94 });

      // H: the question
      show("#h_t", at("H", "randomness") - 0.1, { s: 1.06 });
      show("#h_q", at("H", "sabse") - 0.1, { s: 1.06 });
      show("#h_c", at("H", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { nvidia: "gold", consistent: "green", sampling: "gold", retrieval: "gold", temperature: "hot", randomness: "gold",
                       chunks: "gold", snapshot: "green", eval: "cyan", cache: "green", comment: "gold" } });
