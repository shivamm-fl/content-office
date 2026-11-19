      // A: hook. Frame 0 already shows the promise as a skeleton: 2 empty link boxes -> 3 empty phone frames; they fill on the voice.
      tl.fromTo("#a_chip", { scale: 1.08 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_t", at("A", "sabse") - 0.1, { s: 1.1 });
      show("#a_f1", at("A", "do") - 0.05, { s: 1.15, y: 0 });
      show("#a_f2", at("A", "link") - 0.05, { s: 1.15, y: 0 });
      show("#a_paste", at("A", "paste") - 0.05, { s: 1.4, y: 0 });
      hide("#a_paste", at("A", "aur") - 0.1);
      show("#a_arr", at("A", "aur") - 0.05, { s: 1, y: -20 });
      [["viral", 1], ["clips", 2], ["khud", 3]].forEach(([w, i]) => {
        ["f", "v", "c"].forEach((k) => show(`#a_p${i}${k}`, at("A", w) - 0.05, { s: k === "f" ? 1 : 1.3, y: 0 }));
        tl.to(`#a_p${i}`, { borderColor: "#4CC38A", duration: 0.2 }, at("A", w) - 0.05);
      });

      // B: step 1, download the Claude app, open Claude Code
      show("#b_s", at("B", "step") - 0.1, { s: 1 });
      show("#b_dl", at("B", "claude") - 0.1, { s: 0.95 });
      show("#b_ill", at("B", "claude"), { s: 1, y: 0 });
      tl.to("#b_btn", { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, at("B", "download"));
      show("#b_win", at("B", "claude", 1) - 0.1, { s: 0.95 });
      show("#b_tab", at("B", "code") - 0.05, { s: 1.2, y: 0 });

      // C: step 2, give it the two links and say "best clips bana do"
      show("#c_s", at("C", "step") - 0.1, { s: 1 });
      show("#c_win", at("C", "usmen") - 0.1, { s: 0.96 });
      show("#c_l1", at("C", "github") - 0.05, { s: 1.1, y: 0 });
      show("#c_l2", at("C", "youtube") - 0.05, { s: 1.1, y: 0 });
      show("#c_say", at("C", "best") - 0.1, { s: 1.1 });
      show("#c_send", at("C", "do", 1) - 0.1, { s: 1.4, y: 0 });

      // D: the rest is Claude's job
      show("#d_t", at("D", "baaki") - 0.05, { s: 1.1 });
      ["#d_k1", "#d_k2", "#d_k3"].forEach((el, i) => show(el, at("D", "sab") + i * 0.32, { s: 0.94 }));
      ["#d_v1", "#d_v2", "#d_v3"].forEach((el, i) => show(el, at("D", "sab") + 0.2 + i * 0.32, { s: 1.6, y: 0 }));

      // E: what the tool does: watches the whole video -> best moments -> viral score -> captions -> vertical
      show("#e_l1", at("E", "poori") - 0.05, { s: 1, y: 8 });
      show("#e_strip", at("E", "poori"), { s: 1, y: 0 });
      show("#e_head", at("E", "poori") + 0.05, { s: 1, y: 0 });
      tl.fromTo("#e_head", { x: 0 }, { x: 912, duration: at("E", "pakadta") - at("E", "poori"), ease: "none" }, at("E", "poori") + 0.1);
      ["#e_g1", "#e_g2", "#e_g3", "#e_g4"].forEach((el, i) => wipe(el, at("E", "best") - 0.05 + i * 0.12, 0.3));
      ["#e_c1", "#e_c2", "#e_c3", "#e_c4"].forEach((el, i) => show(el, at("E", "viral") - 0.1 + i * 0.12, { s: 1.4, y: 0 }));
      show("#e_ill", at("E", "viral"), { s: 1, y: 0 });
      show("#e_frame", at("E", "captions") - 0.3, { s: 0.95 });
      show("#e_cap", at("E", "captions") - 0.05, { s: 1.3, y: 0 });
      tl.to("#e_frame", { width: 300, height: 530, left: 390, duration: 0.6, ease: "power2.inOut" }, at("E", "vertical") - 0.1);

      // F: download and post
      show("#f_t", at("F", "tum") - 0.05, { s: 1.05 });
      show("#f_d", at("F", "download") - 0.1, { s: 1.2 });
      ["#f_p1", "#f_p2", "#f_p3"].forEach((el, i) => show(el, at("F", "post") - 0.15 + i * 0.12, { s: 0.9 }));

      // G: the CTA
      show("#g_c1", at("G", "repo") - 0.05, { s: 0.94 });
      show("#g_c2", at("G", "poora") - 0.05, { s: 0.94 });
      show("#g_q", at("G", "chahiye") - 0.1, { s: 1.1 });
      show("#g_bar", at("G", "comment") - 0.1, { s: 0.96 });
      hide("#g_ph", at("G", "clip") - 0.12, 0.1);
      ["#g_k1", "#g_k2", "#g_k3", "#g_k4"].forEach((el, i) => show(el, at("G", "clip") - 0.05 + i * 0.08, { s: 1, y: 0, d: 0.12 }));
      show("#g_dm", at("G", "sab") - 0.05, { s: 1.1 });
      M.finish({ kw: { gta: "gold", clipping: "gold", easy: "gold", link: "cyan", paste: "gold", viral: "good", claude: "#D97757", code: "#D97757",
                       github: "gold", youtube: "cyan", best: "gold", dekhta: "gold", moments: "gold", score: "good", captions: "gold", vertical: "gold",
                       download: "gold", post: "good", prompt: "cyan", clip: "gold", dm: "gold" } });
