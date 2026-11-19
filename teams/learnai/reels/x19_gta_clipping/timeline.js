      // A: GTA 6 is out, everyone on Instagram: clipping karo / viral ho jao / paise kamao. "GTA 6" is on screen at frame 0.
      tl.fromTo("#a_g", { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0);
      show("#a_out", at("A", "aaj") - 0.05, { s: 1.3, y: 0 });
      show("#a_ig", at("A", "instagram") - 0.1, { s: 1, y: 8 });
      show("#a_ill", at("A", "clipping"), { s: 1, y: 0 });
      show("#a_s1", at("A", "clipping") - 0.1, { s: 0.92 });
      show("#a_s2", at("A", "viral") - 0.1, { s: 0.92 });
      show("#a_s3", at("A", "paise") - 0.1, { s: 0.92 });

      // B: a 5-hour stream; the best 30 s is a sliver; who finds it?
      show("#b_t", at("B", "paanch") - 0.1, { s: 1.05 });
      wipe("#b_bar", at("B", "paanch") - 0.05, 0.6);
      show("#b_t0", at("B", "ghante"), { s: 1, y: 0 }); show("#b_t1", at("B", "ghante") + 0.1, { s: 1, y: 0 });
      show("#b_sl", at("B", "best") - 0.1, { s: 1.6, y: 0 });
      show("#b_30", at("B", "clip") - 0.05, { s: 1.1 });
      show("#b_q", at("B", "dhoondhega") - 0.05, { s: 1.3 });

      // C: the repo (name blurred), 9.3k stars, "Self-host free"
      show("#c_gh", at("C", "nau") - 0.15, { s: 1, y: 0 });
      show("#c_title", at("C", "nau") - 0.1, { s: 0.96, y: 12 });
      show("#c_starbox", at("C", "stars") - 0.1, { s: 1.4, y: 0 });
      show("#c_st", at("C", "stars") - 0.05, { s: 1.1 });
      show("#c_about", at("C", "wala") - 0.05, { s: 0.96, y: 12 });
      wipe("#c_hl", at("C", "free") - 0.05, 0.45);
      show("#c_free", at("C", "free") - 0.05, { s: 1.3, y: 0 });
      hide("#c_free", at("C", "khud") - 0.2);
      show("#c_name", at("C", "khud") - 0.05, { s: 0.94 });

      // D: paste a link -> it watches the whole video -> AI marks the best moments -> each gets a viral score
      show("#d_s1", at("D", "video") - 0.1, { s: 1 });
      show("#d_in", at("D", "link") - 0.1, { s: 0.96 });
      show("#d_ill", at("D", "link"), { s: 1, y: 0 });
      show("#d_l2", at("D", "poori") - 0.05, { s: 1, y: 8 });
      show("#d_strip", at("D", "poori"), { s: 1, y: 0 });
      show("#d_head", at("D", "poori") + 0.05, { s: 1, y: 0 });
      tl.fromTo("#d_head", { x: 0 }, { x: 912, duration: at("D", "dhoondhta") - at("D", "poori"), ease: "none" }, at("D", "poori") + 0.1);
      show("#d_l3", at("D", "ai") - 0.05, { s: 1, y: 8 });
      ["#d_g1", "#d_g2", "#d_g3", "#d_g4"].forEach((el, i) => wipe(el, at("D", "mazedar") - 0.05 + i * 0.12, 0.3));
      show("#d_l4", at("D", "har") - 0.05, { s: 1, y: 8 });
      ["#d_c1", "#d_c2", "#d_c3", "#d_c4"].forEach((el, i) => show(el, at("D", "viral") - 0.1 + i * 0.12, { s: 1.4, y: 0 }));

      // E: cut -> 16:9 becomes 9:16 with the face kept in frame -> captions + hook line -> post to Reels / Shorts / TikTok
      show("#e_cut", at("E", "kaat") - 0.1, { s: 1.05 });
      show("#e_frame", at("E", "phir") - 0.05, { s: 0.95 });
      show("#e_vert", at("E", "vertical") - 0.1, { s: 1.1 });
      tl.to("#e_frame", { width: 380, height: 676, left: 350, duration: 0.6, ease: "power2.inOut" }, at("E", "vertical") - 0.1);
      show("#e_cap", at("E", "captions") - 0.05, { s: 1.3, y: 0 });
      show("#e_hook", at("E", "hook") - 0.05, { s: 1.1, y: 0 });
      ["#e_p1", "#e_p2", "#e_p3"].forEach((el, i) => show(el, at("E", "seedha") + i * 0.15, { s: 0.9 }));

      // F: the CTA
      show("#f_t", at("F", "link") - 0.05, { s: 1.1 });
      show("#f_bar", at("F", "comment") - 0.1, { s: 0.96 });
      hide("#f_ph", at("F", "clip") - 0.12, 0.1);
      ["#f_k1", "#f_k2", "#f_k3", "#f_k4"].forEach((el, i) => show(el, at("F", "clip") - 0.05 + i * 0.08, { s: 1, y: 0, d: 0.12 }));
      show("#f_dm", at("F", "dm") - 0.15, { s: 1.1 });
      M.finish({ kw: { gta: "gold", clipping: "gold", viral: "good", paise: "gold", paanch: "gold", kaun: "hot", stars: "gold", free: "good",
                       link: "cyan", mazedar: "gold", score: "good", kaat: "gold", vertical: "gold", captions: "gold", post: "good", clip: "gold", dm: "gold" } });
