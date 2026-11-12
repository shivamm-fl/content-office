      // A: frame 0 = the bad prompt warning
      tl.fromTo(["#a1", "#a2"], { scale: 1.06 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0);
      show("#a_card", at("A", "email") - 0.1, { s: 0.9 });
      show("#a_x", at("A", "likho", 1), { s: 2, y: 0 });
      show("#a_5", at("A", "5"), { s: 1.3 });
      show("#a_fix", at("A", "fix"), { s: 1.3 });
      // mistake label lands at the start of each scene, the fix chip on the fix words
      const mk = { B: ["b_m", "b_fix", "saaf"], C: ["c_m", "c_fix", "bolo"], D: ["d_m", "d_fix", "3"], E: ["e_m", "e_fix", "xml"], F: ["f_m", "f_fix", "system"] };
      Object.entries(mk).forEach(([sc, [m, f, w, n]]) => { show("#" + m, S[sc] + 0.05, { s: 1.2 }); show("#" + f, at(sc, w, n || 0), { s: 1.3 }); });
      // B: a smart but new employee, then who / what / how long
      show("#b_card", at("B", "saaf"), { s: 0.95 });
      show(["#b_r1", "#b_k1"], at("B", "kisko"), { s: 1 });
      show(["#b_r2", "#b_k2"], at("B", "baare"), { s: 1 });
      show(["#b_r3", "#b_k3"], at("B", "kitna"), { s: 1 });
            // C: "chhota likho" struck, the reason added
      show("#c_r4", at("C", "phone"), { s: 1.1 });
      tl.fromTo("#c_r4", { backgroundColor: "rgba(76,195,138,.25)" }, { backgroundColor: "rgba(76,195,138,0)", duration: 1.2, immediateRender: false }, at("C", "phone") + 0.3);
      // D: examples
      show("#d_r5", at("D", "examples"), { s: 1.1 });
      // E: the blob, its parts named, then tags
      tl.to(["#e_h1", "#e_h2", "#e_h3"], { color: (i) => ["#F2B544", "#5BC0EB", "#4CC38A"][i], duration: 0.15, stagger: 0.3 }, at("E", "paragraph") + 0.3);
      tl.fromTo("#e_blob", { scale: 1 }, { scale: 1.02, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, at("E", "paragraph"));
      hide("#e_blob", at("E", "xml") - 0.05, 0.12);
      show("#e_card", at("E", "xml"), { s: 0.95 });
      tl.fromTo(["#e_t1", "#e_t2", "#e_t3"], { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.25, immediateRender: false }, at("E", "xml") + 0.1);
      tl.fromTo(["#e_t1", "#e_t2", "#e_t3"], { scale: 1 }, { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1, transformOrigin: "0 50%", immediateRender: false }, at("E", "label"));
      // F: system role on top of the same prompt
      show("#f_sys", at("F", "sabse"), { s: 1 });
      show("#f_role", at("F", "tum"), { s: 1.3 });
      // G: pack, source, call to action
      show("#g_t", at("G", "5"), { s: 1.1 });
      tl.fromTo("#g_toc", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, at("G", "5") + 0.1);
      show("#g_src", at("G", "5") + 0.3, { s: 1 });
      tl.fromTo("#g_pdf", { opacity: 0, x: 80, rotation: 10 }, { opacity: 1, x: 0, rotation: 3, duration: 0.4, ease: "back.out(1.6)" }, at("G", "templates"));
      show("#g_cta", at("G", "prompt", 1), { s: 1.5, y: 0 });
      tl.to("#g_cta", { scale: 1.06, duration: 0.18, yoyo: true, repeat: 3 }, at("G", "comment"));
      show("#g_dm", at("G", "dm"), { s: 1 });
      M.finish({ kw: { kabhi: "hot", galtiyan: "hot", fix: "good", vague: "hot", wajah: "gold", examples: "gold", xml: "cyan", role: "gold", prompt: "gold" } });
