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

      // B: step 1, the real claude.com/download page (cursor clicks "Download for Windows"), then the dark Claude app opens on the Code tab
      show("#b_s", at("B", "step") - 0.1, { s: 1 });
      show("#b_br", at("B", "claude") - 0.15, { s: 0.96 });
      show("#b_src", at("B", "claude"), { s: 1, y: 0 });
      show("#b_cur", at("B", "app") - 0.25, { s: 1, y: 0, d: 0.15 });
      tl.fromTo("#b_cur", { x: 820, y: 760 }, { x: 395, y: 662, duration: 0.5, ease: "power2.inOut" }, at("B", "app") - 0.2);
      show("#b_ring", at("B", "download") - 0.05, { s: 1.2, y: 0 });
      tl.to("#b_cur", { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, at("B", "download"));
      ["#b_br", "#b_ring", "#b_src", "#b_cur"].forEach((el) => hide(el, at("B", "claude", 1) - 0.2));
      show("#b_app", at("B", "claude", 1) - 0.1, { s: 0.96 });
      show("#b_on", at("B", "code") - 0.05, { s: 1, y: 0, d: 0.15 });

      // C: step 2, the prompt typed into the composer: hidden repo link, YouTube link, "best clips bana do", send
      show("#c_s", at("C", "step") - 0.1, { s: 1 });
      show("#c_app", at("C", "usmen") - 0.15, { s: 0.98, y: 0 });
      hide("#c_ph", at("C", "github") - 0.12, 0.1);
      show("#c_t1", at("C", "github") - 0.05, { s: 1, y: 6, d: 0.2 });
      show("#c_t1b", at("C", "repo"), { s: 1.1, y: 0, d: 0.2 });
      show("#c_t2", at("C", "youtube") - 0.05, { s: 1, y: 6, d: 0.2 });
      show("#c_t2b", at("C", "video") - 0.05, { s: 1.1, y: 0, d: 0.2 });
      show("#c_t3", at("C", "best") - 0.1, { s: 1, y: 6, d: 0.2 });
      tl.to("#c_send", { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1 }, at("C", "do", 1) - 0.05);

      // D: sent; Claude does the rest (spinner -> check on each line)
      show("#d_app", at("D", "baaki") - 0.25, { s: 1, y: 0, d: 0.15 });
      show("#d_msg", at("D", "baaki") - 0.2, { s: 0.95, y: 30 });
      [1, 2, 3].forEach((i) => {
        const t = at("D", "sab") + (i - 1) * 0.3;
        show("#d_s" + i, t - 0.15, { s: 1, y: 8, d: 0.2 });
        tl.to("#d_sp" + i, { rotation: 540, transformOrigin: "50% 50%", duration: 0.9, ease: "none" }, t - 0.15);
        tl.set("#d_sp" + i, { opacity: 0 }, t + 0.45);
        show("#d_ck" + i, t + 0.45, { s: 1.4, y: 0, d: 0.15 });
      });

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
