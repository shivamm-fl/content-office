      // APP -> CACHE -> DB diagrams built once (seek-safe); packets move along the arrows on the spoken words
      const AC = "#4CC9F0", GOLD = "#F2B544", RED = "#E8596B", GRN = "#4CC38A", MUT = "#8592AD";
      const el = (cls, host, css, txt) => { const d = document.createElement("div"); d.className = cls; Object.assign(d.style, css); if (txt !== undefined) d.textContent = txt; host.appendChild(d); return d; };
      const hid = (e) => { tl.set(e, { opacity: 0 }, 0); return e; };
      const NX = { app: 60, cache: 410, db: 760 };
      const node = (host, x, name, sub) => { const n = el("node", host, { left: x + "px", top: "0px" }); n.innerHTML = name + '<div class="sub">' + sub + "</div>"; return n; };
      const diagram = (sel, o = {}) => {
        const host = q(sel), g = { host };
        g.app = node(host, NX.app, "APP", "server"); g.cache = node(host, NX.cache, "CACHE", "fast memory"); g.db = node(host, NX.db, "DB", "disk");
        g.a1 = el("arr", host, { left: "322px", width: "68px", top: "102px" }); g.h1 = el("head", host, { left: "386px", top: "91px" });
        g.a2 = el(o.dash ? "arr dash" : "arr", host, { left: "672px", width: "68px", top: "102px" }); g.h2 = el("head", host, { left: "736px", top: "91px" });
        return g;
      };
      const pk = (g, txt, at0, css = {}) => el("pk", g.host, { left: (NX[at0] + 75) + "px", top: "128px", ...css }, txt);
      const go = (p, where, t, d) => tl.to(p, { left: NX[where] + 75, duration: d ?? 0.6, ease: "power2.inOut" }, t);
      const done = (g, t) => { const c = hid(el("chip", g.host, { left: "60px", top: "226px", width: "260px", background: GRN, color: "#0B1220", fontSize: "40px", padding: "8px 0" }, "DONE")); show(c, t, { s: 1.2 }); return c; };
      const fmt = (n) => Math.round(n).toLocaleString("en-US");

      // A: frame 0 = the question and a new value landing in the cache; the DB waits: now or later?
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      const a = diagram("#a_dg");
      a.cache.style.borderColor = AC;
      const ap = pk(a, "new", "app"); go(ap, "cache", 0.5);
      const aq = hid(el("x", a.host, { left: "760px", width: "260px", textAlign: "center", top: "-70px", fontSize: "60px", color: GOLD }, "?"));
      show(aq, at("A", "database") - 0.1, { s: 1.4 }); tl.to(a.db, { borderColor: GOLD, duration: 0.2 }, at("A", "database") - 0.1);
      show("#a_now", at("A", "abhi") - 0.1, { s: 1.1 }); show("#a_later", at("A", "baad") - 0.1, { s: 1.1 });

      // B: the cache holds a copy of the database value in fast memory; the data changes: two ways to update both
      show("#b_t", at("B", "cache") - 0.1, { s: 1.06 });
      const b = diagram("#b_dg");
      pk(b, "500", "db", { background: "#1B2538", color: "#E8EDF6", border: "3px solid #8592AD" });
      const bc = hid(pk(b, "500", "db", { background: "#1B2538", color: AC, border: "3px solid " + AC }));
      tl.to(bc, { opacity: 1, duration: 0.15 }, at("B", "copy") - 0.2); go(bc, "cache", at("B", "copy"), 0.8);
      tl.to(b.cache, { borderColor: AC, duration: 0.25 }, at("B", "fast") - 0.1);
      const bn = hid(pk(b, "450", "app", { background: GOLD })); show(bn, at("B", "badle") - 0.1, { s: 1.3 });
      show("#b_1", at("B", "do") - 0.1, { s: 1.06 }); show("#b_2", at("B", "do") + 0.5, { s: 1.06 });

      // C: write-through: app -> cache -> database, then done; fresh cache, slower write; unread keys fill memory, TTL expires them
      show("#c_t", at("C", "pahla") - 0.1, { s: 1.1 });
      const c = diagram("#c_dg");
      const cp = hid(pk(c, "450", "app", { background: GOLD })); show(cp, at("C", "app") - 0.15, { s: 1.3 });
      go(cp, "cache", at("C", "likhta") - 0.1);
      const cp2 = hid(pk(c, "450", "cache", { background: GOLD }));
      tl.to(cp2, { opacity: 1, duration: 0.1 }, at("C", "usi") - 0.1); go(cp2, "db", at("C", "usi"), 0.7);
      tl.to([c.cache, c.db], { borderColor: GRN, duration: 0.2 }, at("C", "donon") - 0.1);
      done(c, at("C", "done") - 0.1);
      show("#c_good", at("C", "faayda") - 0.1, { s: 1.08 }); show("#c_bad", at("C", "keemat") - 0.1, { s: 1.08 });
      const kh = q("#c_keys"), keys = [];
      for (let i = 0; i < 8; i++) { const read = i === 1 || i === 4; const k = hid(el("key", kh, { left: (70 + i * 120) + "px", top: "20px", borderColor: read ? AC : "#26324B", color: read ? AC : MUT }, "k" + (i + 1))); keys.push(k); show(k, at("C", "jo") + i * 0.08, { s: 1.2, y: 0 }); }
      keys.forEach((k, i) => { if (i !== 1 && i !== 4) tl.to(k, { borderColor: RED, duration: 0.2 }, at("C", "gherta") - 0.1); });
      show("#c_ttl", at("C", "ttl") - 0.1, { s: 1.08 });
      keys.forEach((k, i) => { if (i !== 1 && i !== 4) tl.to(k, { opacity: 0.15, duration: 0.4 }, at("C", "expiry") + i * 0.05); });

      // D: write-back: app -> cache, done at once; the database gets a batch later
      show("#d_t", at("D", "doosra") - 0.1, { s: 1.1 }); show("#d_s", at("D", "write-behind") - 0.1, { s: 1 });
      const d = diagram("#d_dg", { dash: true });
      d.a2.style.borderTopColor = GOLD; d.h2.style.borderLeftColor = GOLD;
      const dp = hid(pk(d, "450", "app", { background: GOLD })); show(dp, at("D", "app") - 0.15, { s: 1.3 });
      go(dp, "cache", at("D", "likhta") - 0.1);
      done(d, at("D", "poora") - 0.1);
      show("#d_later", at("D", "baad") - 0.1, { s: 1.06 });
      const q2 = hid(pk(d, "120", "cache", { background: GOLD, top: "112px", left: (NX.cache + 55) + "px" })), q3 = hid(pk(d, "780", "cache", { background: GOLD, top: "144px", left: (NX.cache + 95) + "px" }));
      show(q2, at("D", "kuch") - 0.1, { s: 1.3 }); show(q3, at("D", "kuch") + 0.2, { s: 1.3 });
      [dp, q2, q3].forEach((p) => go(p, "db", at("D", "saath") - 0.1, 0.8));
      tl.to(d.db, { borderColor: GOLD, duration: 0.2 }, at("D", "saath") + 0.6);

      // E: illustration: 2,000 likes in 5 seconds; 2,000 database writes vs 1 (coalescing)
      show("#e_t", at("E", "maan") - 0.1, { s: 1.06 });
      show("#e_l", at("E", "write-through") - 0.2, { s: 1.04 }); count("#e_lw", 0, 2000, at("E", "write-through") + 0.3, 2.2, fmt);
      show("#e_r", at("E", "write-back") - 0.2, { s: 1.04 }); count("#e_rc", 0, 2000, at("E", "badhata") - 0.3, 2.0, fmt);
      count("#e_rw", 0, 1, at("E", "ek", 1) - 0.1, 0.3, fmt);
      tl.fromTo("#e_rw", { scale: 1 }, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }, at("E", "ek", 1) + 0.2);
      show("#e_co", at("E", "coalescing") - 0.1, { s: 1.06 });
      show("#e_load", at("E", "load") - 0.1, { s: 1.06 });

      // F: the price: unflushed likes live only in the cache; a crash loses them; another service reads an old count
      show("#f_t", at("F", "ab") - 0.1, { s: 1.06 });
      const f = diagram("#f_dg", { dash: true });
      f.a2.style.borderTopColor = GOLD; f.h2.style.borderLeftColor = GOLD;
      const fp = pk(f, "+2,000", "cache", { background: GOLD, width: "150px", left: (NX.cache + 55) + "px" });
      pk(f, "old", "db", { background: "#1B2538", color: MUT, border: "3px solid #8592AD" });
      tl.fromTo(fp, { scale: 1 }, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1 }, at("F", "sirf") - 0.1);
      tl.to(f.cache, { borderColor: RED, backgroundColor: "#2A1620", duration: 0.25 }, at("F", "crash") - 0.1);
      tl.to(fp, { y: 140, opacity: 0, duration: 0.6, ease: "power2.in" }, at("F", "gaye") - 0.3);
      show("#f_lost", at("F", "gaye") - 0.1, { s: 1.1 });
      show("#f_ok", at("F", "likes", 1) - 0.1, { s: 1.08 }); show("#f_no", at("F", "payment") - 0.1, { s: 1.08 });
      ["#f_ok", "#f_no", "#f_lost"].forEach((s) => hide(s, at("F", "doosri") - 0.25));
      const sh = q("#f_svc");
      const svc = hid(node(sh, NX.db, "SERVICE", "reads DB")); show(svc, at("F", "doosri") - 0.1, { s: 1.06 });
      const vl = hid(el("arr", sh, { left: (NX.db + 127) + "px", width: "6px", height: "250px", top: "-258px" })); tl.to(vl, { opacity: 1, duration: 0.2 }, at("F", "seedhe") - 0.1);
      const old = hid(el("x", sh, { left: "80px", width: "640px", top: "60px", fontSize: "54px", textAlign: "right" }, "purana count"));
      old.style.color = GOLD; show(old, at("F", "purana") - 0.1, { s: 1.1 });

      // G: choose by the data
      show("#g_t", at("G", "chunav") - 0.1, { s: 1.06 });
      show("#g_l1", at("G", "paise") - 0.1, { s: 1.1 }); show("#g_l2", at("G", "orders") - 0.1, { s: 1.1 }); show("#g_ln", at("G", "khona") - 0.1, { s: 1 });
      tl.fromTo("#g_lh", { scale: 1 }, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }, at("G", "write-through") - 0.05);
      show("#g_r1", at("G", "likes") - 0.1, { s: 1.1 }); show("#g_r2", at("G", "views") - 0.1, { s: 1.1 }); show("#g_rn", at("G", "nuksan") - 0.1, { s: 1 });
      tl.fromTo("#g_rh", { scale: 1 }, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }, at("G", "write-back") - 0.05);

      // H: interview answer
      show("#h_chip", at("H", "interview") - 0.05, { s: 0.85 });
      show("#h_1", at("H", "write-through") - 0.1, { s: 0.94 });
      show("#h_2", at("H", "taaza") - 0.1, { s: 0.94 });
      show("#h_3", at("H", "write-back") - 0.1, { s: 0.94 });
      show("#h_4", at("H", "tez") - 0.1, { s: 0.94 });
      show("#h_5", at("H", "crash") - 0.1, { s: 0.94 });

      // I: the question
      show("#i_t", at("I", "write-back") - 0.1, { s: 1.06 });
      show("#i_d", at("I", "delay") - 0.1, { s: 1.06 });
      tl.fromTo("#i_b", { scale: 1 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1 }, at("I", "one") - 0.05);
      show("#i_q1", at("I", "load") - 0.1, { s: 1.08 }); show("#i_q2", at("I", "crash") - 0.1, { s: 1.08 });
      show("#i_c", at("I", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { cache: "#4CC9F0", "write-through": "#4CC9F0", "write-back": "gold", "write-behind": "gold", coalescing: "gold",
                       ttl: "gold", crash: "hot", payment: "hot", database: "#4CC9F0", comment: "#4CC9F0" } });
