      // A: frame 0: database has the new price, the app shows the old one
      tl.fromTo("#a_q", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      tl.fromTo("#a_app", { x: 0 }, { x: 8, duration: 0.07, yoyo: true, repeat: 5 }, at("A", "purana") - 0.1);
      // B: the read path: app checks the cache, on a miss reads the database and keeps a copy
      const P = { app: [540, 470], c: [270, 855], d: [810, 855] };
      const wire = (sel, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1]; tl.set(sel, { left: a[0], top: a[1], width: Math.hypot(dx, dy), rotation: Math.atan2(dy, dx) * 180 / Math.PI }, 0); };
      wire("#b_w1", [540, 540], [270, 760]); wire("#b_w2", [540, 540], [810, 760]);
      show("#b_c", at("B", "cache") - 0.1, { s: 0.92 });
      show("#b_d", at("B", "fast") - 0.1, { s: 0.92 });
      show("#b_t", at("B", "cache-aside") - 0.1, { s: 1.1 });
      show("#b_app", at("B", "app") - 0.1, { s: 0.92 });
      tl.set(["#b_w1", "#b_w2"], { opacity: 0 }, 0); tl.to(["#b_w1", "#b_w2"], { opacity: 1, duration: 0.3 }, at("B", "app"));
      tl.set("#b_pk", { left: P.app[0], top: P.app[1], opacity: 0 }, 0);
      tl.to("#b_pk", { opacity: 1, duration: 0.1 }, at("B", "dekhta") - 0.3);
      tl.to("#b_pk", { left: P.c[0], top: P.c[1] - 110, duration: 0.6, ease: "power1.inOut" }, at("B", "dekhta") - 0.2);
      show("#b_hit", at("B", "hit") - 0.15, { s: 1.2 }); hide("#b_hit", at("B", "nahi") - 0.1);
      show("#b_miss", at("B", "miss") - 0.15, { s: 1.2 });
      tl.to("#b_pk", { left: P.app[0], top: P.app[1], duration: 0.4 }, at("B", "app", 1) - 0.2);
      tl.to("#b_pk", { left: P.d[0], top: P.d[1] - 110, duration: 0.5 }, at("B", "database") - 0.1);
      hide("#b_miss", at("B", "rakh") - 0.4);
      tl.to("#b_pk", { left: P.app[0], top: P.app[1], duration: 0.35 }, at("B", "cache", 4) - 0.6);
      tl.to("#b_pk", { left: P.c[0], top: P.c[1] - 110, duration: 0.35 }, at("B", "cache", 4) - 0.2);
      show("#b_copy", at("B", "rakh") - 0.1, { s: 1.1 });
      tl.to("#b_pk", { left: P.app[0], top: P.app[1], duration: 0.4 }, at("B", "jawab", 1) - 0.2);
      tl.to("#b_pk", { opacity: 0, duration: 0.2 }, at("B", "jawab", 1) + 0.3);
      show("#b_no", at("B", "aapas") - 0.2, { s: 1.4 });
      tl.to(["#b_w1", "#b_w2"], { backgroundColor: "#F2B544", duration: 0.25 }, at("B", "donon") - 0.1);
      show("#b_aside", at("B", "bagal") - 0.3, { s: 1.05 });
      // C: write to both: two updates race and the cache keeps the wrong one
      show("#c_t", at("C", "pahla") - 0.1, { s: 1.06 });
      show("#c_ld", at("C", "dikkat") - 0.1, { s: 0.96 });
      show("#c_lc", at("C", "dikkat") + 0.1, { s: 0.96 });
      show("#c_a", at("C", "admin") - 0.1, { s: 1.08 });
      show("#c_b", at("C", "doosre") - 0.1, { s: 1.08 });
      show("#c_d1", at("C", "paanch") - 0.05, { s: 1.15 });
      show("#c_d2", at("C", "saadhe") - 0.05, { s: 1.15 });
      tl.to("#c_d2", { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1 }, at("C", "aakhiri"));
      show("#c_c1", at("C", "saadhe", 1) - 0.05, { s: 1.15 });
      show("#c_c2", at("C", "paanch", 1) - 0.05, { s: 1.15 });
      show("#c_late", at("C", "der") - 0.1, { s: 1 });
      show("#c_dv", at("C", "database", 2) - 0.1, { s: 1.15 });
      show("#c_cv", at("C", "paanch", 2) - 0.1, { s: 1.15 });
      show("#c_app", at("C", "galat") - 0.15, { s: 1.08 });
      // D: delete instead of write: next read misses and loads the right price; delete is idempotent
      show("#d_t", at("D", "isliye") - 0.1, { s: 1.08 });
      show("#d_c", at("D", "cache") - 0.1, { s: 0.94 });
      show("#d_d", at("D", "cache") + 0.1, { s: 0.94 });
      wipe("#d_x", at("D", "delete") - 0.05, 0.35);
      tl.to("#d_key", { opacity: 0.3, duration: 0.2 }, at("D", "delete") + 0.3);
      show("#d_new", at("D", "sahi") - 0.1, { s: 1.08 });
      show("#d_twice", at("D", "delete", 1) - 0.1, { s: 1.04 });
      show("#d_idem", at("D", "idempotent") - 0.1, { s: 1.25 });
      ["#d_twice", "#d_idem"].forEach((s) => hide(s, at("D", "facebook") - 0.2));
      show("#d_q", at("D", "facebook") - 0.05, { s: 0.96 });
      // E: wrong order: delete first, a reader fills the cache with the old price in the gap
      show("#e_t", at("E", "order") - 0.1, { s: 1.1 });
      show("#e_1", at("E", "pehle") - 0.1, { s: 1.05 });
      show("#e_2", at("E", "phir") - 0.1, { s: 1.05 });
      show("#e_c", at("E", "us") - 0.1, { s: 0.94 }); show("#e_d", at("E", "us") + 0.1, { s: 0.94 });
      wipe("#e_gap", at("E", "gap") - 0.1, 0.4); show("#e_gapl", at("E", "gap"), { s: 1 });
      show("#e_u", at("E", "user") - 0.1, { s: 1.15 });
      tl.to("#e_u", { left: 160, top: 770, duration: 0.4 }, at("E", "miss") - 0.1);
      tl.to("#e_c", { borderColor: "#E8596B", duration: 0.2 }, at("E", "miss"));
      tl.to("#e_u", { left: 700, top: 770, duration: 0.5 }, at("E", "database", 1) - 0.1);
      tl.to("#e_u", { left: 160, top: 770, duration: 0.5 }, at("E", "vaapas") - 0.1);
      show("#e_old", at("E", "rakh") - 0.1, { s: 1.1 });
      hide("#e_u", at("E", "isliye") - 0.2);
      show("#e_ok", at("E", "isliye") - 0.05, { s: 1.06 });
      // F: TTL is the safety net: a wrong value lives at most until it expires
      show("#f_t", at("F", "phir") - 0.1, { s: 1.08 });
      show("#f_c", at("F", "har") - 0.15, { s: 0.94 });
      show("#f_ttl", at("F", "yaani") - 0.1, { s: 1.05 });
      tl.set(["#f_bg", "#f_bar"], { opacity: 0 }, 0); tl.to(["#f_bg", "#f_bar"], { opacity: 1, duration: 0.2 }, at("F", "five") - 0.3);
      tl.fromTo("#f_bar", { scaleX: 1 }, { scaleX: 0, duration: at("F", "rahega") - at("F", "five"), ease: "none" }, at("F", "five"));
      show("#f_max", at("F", "galat") - 0.1, { s: 1.05 });
      // G: interview answer
      show("#g_chip", at("G", "interview") - 0.05, { s: 0.85 });
      show("#g_1", at("G", "read") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "write") - 0.1, { s: 0.94 });
      show("#g_3", at("G", "har") - 0.1, { s: 0.94 });
      // H: the question
      show("#h_1", at("H", "database") - 0.1, { s: 1.08 });
      show("#h_2", at("H", "server") - 0.1, { s: 1.15 });
      show("#h_3", at("H", "ttl") - 0.1, { s: 1.08 });
      show("#h_4", at("H", "galat") - 0.1, { s: 1.08 });
      show("#h_c", at("H", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { cache: "#4CC9F0", "cache-aside": "#4CC9F0", database: "gold", hit: "good", miss: "hot", delete: "hot", idempotent: "gold",
                       ttl: "gold", galat: "hot", purana: "hot", comment: "#4CC9F0" } });
