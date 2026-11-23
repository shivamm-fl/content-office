      // pictures built once (seek-safe) and animated on the spoken words
      const GOLD = "#F2B544", CY = "#5BC0EB", VIO = "#A78BFA", RED = "#E8596B", GRN = "#4CC38A", MUT = "#8592AD";
      const el = (cls, host, css, txt) => { const d = document.createElement("div"); d.className = cls; Object.assign(d.style, css); if (txt !== undefined) d.textContent = txt; host.appendChild(d); return d; };
      const hid = (e) => { tl.set(e, { opacity: 0 }, 0); return e; };
      const grow = (e, t, d, to) => { tl.set(e, { scaleX: 0 }, 0); tl.to(e, { scaleX: to ?? 1, duration: d, ease: "none" }, t); };

      // A: frame 0 = the question; the real page (title + Anthropic logo), then the full question highlighted
      tl.fromTo("#a_h", { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
      show("#a_p", at("A", "anthropic") + 0.05, { s: 0.94 });
      tl.fromTo("#a_p", { scale: 1 }, { scale: 1.04, duration: 6, ease: "none" }, at("A", "ek") - 0.2);

      // B: a GPU has room for many requests at once: one request uses a sliver, a batch fills it
      show("#b_t", at("B", "gpu") - 0.1, { s: 1.06 });
      const gpu = q("#b_gpu"), slots = [];
      for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) slots.push(el("slot", gpu, { left: (26 + c * 54) + "px", top: (26 + r * 54) + "px" }));
      tl.to(slots[0], { backgroundColor: GOLD, borderColor: GOLD, duration: 0.2 }, at("B", "ek-ek") - 0.1);
      grow("#b_lo", at("B", "istemal") - 0.3, 0.4, 0.06); grow("#b_hi", at("B", "kai") + 0.2, 1.4, 0.96);
      slots.forEach((s, i) => { if (i) tl.to(s, { backgroundColor: GOLD, borderColor: GOLD, duration: 0.15 }, at("B", "kai") + i * 0.012); });
      hide("#b_lo", at("B", "kai") + 0.2, 0.1);

      // C: wait for a full batch and the first user waits; send now and the GPU idles; the shared auto
      show("#c_t", at("C", "tension") - 0.1, { s: 1.08 });
      show("#c_l", at("C", "intzar") - 0.2, { s: 1.04 }); show("#c_r", at("C", "turant") - 0.2, { s: 1.04 });
      const cl = q("#c_l"), cr = q("#c_r");
      for (let i = 0; i < 12; i++) { const d = hid(el("dot", cl, { left: (60 + (i % 6) * 60) + "px", top: (130 + Math.floor(i / 6) * 60) + "px", background: GOLD })); tl.to(d, { opacity: 1, duration: 0.15 }, at("C", "intzar") + 0.2 + i * 0.25); }
      const clock = hid(el("x", cl, { left: "0px", width: "460px", textAlign: "center", top: "290px", fontSize: "52px", color: RED, fontFamily: "JetBrains Mono, monospace" }, "wait..."));
      tl.to(clock, { opacity: 1, duration: 0.2 }, at("C", "pahla") - 0.1);
      show("#c_lw", at("C", "baitha") - 0.1, { s: 1.06 });
      const rd = [0, 1, 2].map((i) => hid(el("dot", cr, { left: (60 + i * 60) + "px", top: "130px", background: GOLD })));
      rd.forEach((d, i) => tl.to(d, { opacity: 1, duration: 0.15 }, at("C", "turant") + i * 0.12));
      tl.to(rd, { x: 300, opacity: 0, duration: 0.6, ease: "power2.in" }, at("C", "bhej") + 0.2);
      const rmeter = el("meter", cr, { left: "40px", width: "380px", top: "300px", height: "46px" }); const rf = el("fill", rmeter, { background: RED }); grow(rf, at("C", "chhota"), 0.4, 0.15);
      show("#c_rw", at("C", "kam") - 0.1, { s: 1.06 });
      ["#c_l", "#c_r", "#c_lw", "#c_rw", "#c_t"].forEach((s) => hide(s, at("C", "shared") - 0.25));
      show("#c_at", at("C", "shared") - 0.1, { s: 1.06 }); show("#c_auto", at("C", "shared"), { s: 1.04 });
      const auto = q("#c_auto"), seats = [];
      for (let i = 0; i < 6; i++) seats.push(el("seat", auto, { left: (77 + i * 95) + "px", top: "95px" }));
      seats.forEach((s, i) => tl.to(s, { backgroundColor: GOLD, borderColor: GOLD, duration: 0.2 }, at("C", "poori") + i * 0.35));
      show("#c_p1", at("C", "pareshan") - 0.1, { s: 1.06 });
      seats.forEach((s, i) => { if (i) tl.to(s, { backgroundColor: "rgba(0,0,0,0)", borderColor: MUT, duration: 0.2 }, at("C", "khaali") - 0.1); });
      tl.to(auto, { x: 60, duration: 0.8, ease: "power2.inOut" }, at("C", "chal"));
      show("#c_p2", at("C", "kamai") - 0.1, { s: 1.06 });

      // D: two limits: batch full at 100 -> send; first request waited 20 ms -> send what is there
      show("#d_t", at("D", "fix") - 0.1, { s: 1.08 });
      show("#d_1", at("D", "batch") - 0.2, { s: 1.04 });
      grow("#d_1f", at("D", "batch"), at("D", "hundred") + 0.3 - at("D", "batch"));
      count("#d_1v", 0, 100, at("D", "batch"), at("D", "hundred") + 0.3 - at("D", "batch"), (v) => Math.round(v) + " / 100");
      show("#d_s1", at("D", "turant") - 0.1, { s: 1.15 });
      show("#d_2", at("D", "pahli") - 0.2, { s: 1.04 });
      grow("#d_2f", at("D", "pahli"), at("D", "twenty") + 0.4 - at("D", "pahli"));
      show("#d_s2", at("D", "jitna") - 0.1, { s: 1.1 });
      show("#d_n", at("D", "max") - 0.1, { s: 1.06 });

      // E: every request carries an id, every output goes back to the same user; a long queue rejects new requests
      show("#e_t", at("E", "id") - 0.4, { s: 1.06 });
      const eh = q("#e_h"), COL = [GOLD, CY, VIO], IDS = ["7", "8", "9"];
      const batch = hid(el("box", eh, { left: "440px", top: "20px", width: "200px", height: "340px", border: "4px solid #26324B", background: "#0D1526", color: MUT, fontSize: "36px", justifyContent: "flex-start", paddingTop: "16px", boxSizing: "border-box" }, "BATCH"));
      tl.to(batch, { opacity: 1, duration: 0.2 }, at("E", "users") - 0.1);
      IDS.forEach((id, i) => {
        const u = hid(el("usr", eh, { left: "40px", top: (20 + i * 120) + "px" }, "user " + id)); tl.to(u, { opacity: 1, duration: 0.2 }, at("E", "users") + i * 0.1);
        const rq = hid(el("req", eh, { left: "210px", top: (20 + i * 120) + "px", background: COL[i] }, "id " + id)); show(rq, at("E", "id") - 0.1 + i * 0.12, { s: 1.2, y: 0 });
        tl.to(rq, { left: 465, top: 90 + i * 85, duration: 0.6, ease: "power2.inOut" }, at("E", "batch") + i * 0.08);
        const u2 = hid(el("usr", eh, { left: "890px", top: (20 + i * 120) + "px" }, "user " + id)); tl.to(u2, { opacity: 1, duration: 0.2 }, at("E", "output") - 0.2);
        tl.to(rq, { left: 720, top: 20 + i * 120, duration: 0.6, ease: "power2.inOut" }, at("E", "output") + i * 0.1);
        tl.to(u2, { borderColor: COL[i], duration: 0.2 }, at("E", "sahi") - 0.1 + i * 0.1);
      });
      const eq = q("#e_q");
      const qlab = hid(el("lbl", eq, { left: "60px", top: "0px" }, "queue")); tl.to(qlab, { opacity: 1, duration: 0.2 }, at("E", "queue") - 0.1);
      const lim = hid(el("arr", eq, { left: "760px", top: "40px", width: "6px", height: "110px", background: RED, position: "absolute", borderRadius: "3px" })); tl.to(lim, { opacity: 1, duration: 0.2 }, at("E", "lanbi"));
      for (let i = 0; i < 10; i++) { const d = hid(el("dot", eq, { left: (60 + i * 66) + "px", top: "78px", background: MUT })); tl.to(d, { opacity: 1, duration: 0.1 }, at("E", "queue") + i * 0.1); }
      const nw = [0, 1].map((i) => hid(el("dot", eq, { left: "980px", top: (60 + i * 50) + "px", background: RED })));
      nw.forEach((d, i) => { tl.to(d, { opacity: 1, duration: 0.1 }, at("E", "nayi") - 0.1 + i * 0.15); tl.fromTo(d, { x: 0 }, { x: -170, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" }, at("E", "nayi") + i * 0.15); });
      const rej = hid(el("chip", eq, { left: "560px", top: "170px", width: "440px", background: RED, color: "#0B1220", fontSize: "40px" }, "reject: queue full")); show(rej, at("E", "mana") - 0.1, { s: 1.1 });

      // F: fixed batch: the 10-token answer sits idle until the 500-token one ends; continuous batching fills the slot at once
      show("#f_fu", at("F", "follow-up") - 0.1, { s: 0.9 }); show("#f_t", at("F", "llm") - 0.1, { s: 1.04 });
      const fh = q("#f_h"), W = 900, x0 = 90;
      const fx = hid(el("chip", fh, { left: "290px", top: "0px", width: "500px", border: "4px solid " + RED, color: RED, fontSize: "40px" }, "fixed batch"));
      const cx = hid(el("chip", fh, { left: "240px", top: "0px", width: "600px", background: GRN, color: "#0B1220", fontSize: "40px" }, "continuous batching"));
      const l1 = hid(el("lbl", fh, { left: x0 + "px", top: "100px" }, "jawab 1: 10 tokens")), l2 = hid(el("lbl", fh, { left: x0 + "px", top: "250px" }, "jawab 2: 500 tokens"));
      const b1 = el("lane", fh, { left: x0 + "px", top: "145px", width: "30px", background: GOLD, transformOrigin: "0 50%" }), b2 = el("lane", fh, { left: x0 + "px", top: "295px", width: W + "px", background: CY, transformOrigin: "0 50%" });
      const idle = el("lane", fh, { left: (x0 + 30) + "px", top: "145px", width: (W - 30) + "px", background: "#26324B", transformOrigin: "0 50%" });
      const idl = hid(el("lbl", fh, { left: (x0 + 300) + "px", top: "160px", color: "#E8EDF6" }, "wait..."));
      tl.to(l1, { opacity: 1, duration: 0.2 }, at("F", "ten") - 0.2); grow(b1, at("F", "ten"), 0.3);
      tl.to(l2, { opacity: 1, duration: 0.2 }, at("F", "five") - 0.2); grow(b2, at("F", "five"), at("F", "continuous") - at("F", "five") - 0.3);
      show(fx, at("F", "fixed") - 0.1, { s: 1.06 });
      grow(idle, at("F", "khatam") - 0.1, at("F", "continuous") - at("F", "khatam") - 0.2); tl.to(idl, { opacity: 1, duration: 0.2 }, at("F", "intzar") - 0.1);
      hide(fx, at("F", "continuous") - 0.2); show(cx, at("F", "continuous") - 0.05, { s: 1.06 });
      tl.to([idle, idl], { opacity: 0, duration: 0.2 }, at("F", "continuous"));
      [0, 1, 2].forEach((k) => { const nb = el("lane", fh, { left: (x0 + 34 + k * 290) + "px", top: "145px", width: "286px", background: GRN, transformOrigin: "0 50%" }); grow(nb, at("F", "turant") - 0.2 + k * 0.5, 0.45);
        const t = hid(el("lbl", fh, { left: (x0 + 50 + k * 290) + "px", top: "160px", color: "#0B1220" }, "new")); tl.to(t, { opacity: 1, duration: 0.15 }, at("F", "turant") + 0.2 + k * 0.5); });

      // G: interview answer
      show("#g_chip", at("G", "interview") - 0.05, { s: 0.85 });
      show("#g_1", at("G", "max") - 0.1, { s: 0.94 });
      show("#g_2", at("G", "id") - 0.3, { s: 0.94 });
      show("#g_3", at("G", "queue") - 0.1, { s: 0.94 });
      show("#g_4", at("G", "llm") - 0.1, { s: 0.94 });

      // H: the question
      show("#h_t", at("H", "max") - 0.1, { s: 1.06 });
      show("#h_q1", at("H", "throughput") - 0.1, { s: 1.08 }); show("#h_q2", at("H", "latency") - 0.1, { s: 1.08 });
      show("#h_c", at("H", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { anthropic: "gold", batching: "gold", batch: "gold", gpu: "gold", id: "gold", queue: "cyan", continuous: "green",
                       throughput: "green", latency: "hot", comment: "gold" } });
