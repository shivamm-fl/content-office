      // A: frame 0 already shows the hook (AI agents, rupees); "kyun doge" strikes the money, then the real course page
      tl.fromTo(["#a1", "#a2", "#a3", "#a4"], { scale: 1.06 }, { scale: 1, duration: 0.6, ease: "power2.out" }, 0);
      wipe("#a_strike", at("A", "doge"), 0.3);
      hide(["#a3", "#a4", "#a_strike"], at("A", "hugging") - 0.2, 0.15);
      tl.fromTo("#a_shot", { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }, at("A", "hugging"));
      tl.to("#a_shot", { scale: 1.04, duration: 3.2, ease: "none" }, at("A", "hugging") + 0.4);
      show("#a_src", at("A", "hugging") + 0.2, { s: 1 });
      show("#a_free", at("A", "free"), { s: 1.8, y: 0 });
      show("#a_cert", at("A", "certificate"), { s: 1.3 });
      // B: 4 units, the first two fill in as he names them
      show("#b_t", at("B", "4"), { s: 1.2 });
      show("#b_u1", at("B", "pahli"), { s: 0.9 });
      show("#b_u1a", at("B", "sochta"), { s: 1 });
      show("#b_u1b", at("B", "chalata"), { s: 1 });
      show("#b_u2", at("B", "doosri"), { s: 0.9 });
      show("#b_f1", at("B", "smolagents"), { s: 1 });
      show("#b_f2", at("B", "langgraph"), { s: 1 });
      show("#b_f3", at("B", "llamaindex"), { s: 1 });
      // C: units 3 and 4
      hide("#c_p3", at("C", "teesri"), 0.1);
      show("#c_u3", at("C", "teesri"), { s: 0.9 });
      show("#c_u3a", at("C", "real"), { s: 1 });
      hide("#c_p4", at("C", "chauthi"), 0.1);
      show("#c_u4", at("C", "chauthi"), { s: 0.9 });
      show("#c_u4a", at("C", "assignment"), { s: 1 });
      tl.fromTo(".cgrid", { scale: 1 }, { scale: 1.04, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, at("C", "assignment") + 0.2);
      // D: two certificates, both free
      show("#d_t", S.D + 0.05, { s: 1 });
      show("#d_free", at("D", "donon"), { s: 1.3 });
      show("#d_l", at("D", "sirf"), { s: 0.9 });
      show("#d_l1", at("D", "1"), { s: 1.2 });
      tl.to("#d_lt", { color: "#F2B544", duration: 0.2 }, at("D", "fundamentals"));
      show("#d_lb", at("D", "certificate", 1), { s: 1.6, y: 0 });
      show("#d_r", at("D", "unit", 1), { s: 0.9 });
      show("#d_r1", at("D", "1", 1), { s: 1.2 });
      show("#d_r2", at("D", "use"), { s: 1.2 });
      show("#d_r3", at("D", "final"), { s: 1.2 });
      tl.to("#d_rt", { color: "#F2B544", duration: 0.2 }, at("D", "completion"));
      show("#d_rb", at("D", "certificate", 2), { s: 1.6, y: 0 });
      // E: no deadline, a week per unit, 3-4 hours, what you need
      const days = q("#e_days");
      for (let i = 0; i < 7; i++) { const d = document.createElement("div"); d.className = "tok eday"; d.style.cssText += ";left:" + (72 + i * 136) + "px;top:640px;width:120px;height:120px;"; days.appendChild(d); }
      show("#e_dl", S.E + 0.05, { s: 1 });
      wipe("#e_strike", at("E", "nahi"), 0.3);
      show("#e_no", at("E", "nahi") + 0.1, { s: 1.2 });
      show("#e_wk", at("E", "haphte"), { s: 1.1 });
      tl.fromTo(".eday", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.05 }, at("E", "haphte") + 0.1);
      tl.to(".eday", { backgroundColor: "#F2B544", borderColor: "#F2B544", duration: 0.15, stagger: 0.06 }, at("E", "3"));
      show("#e_hr", at("E", "ghante"), { s: 1.3 });
      show("#e_need", at("E", "bas"), { s: 1 });
      show("#e_py", at("E", "python"), { s: 0.9 });
      show("#e_llm", at("E", "llms"), { s: 0.9 });
      // F: the guide and the call to action
      tl.fromTo("#f_pdf", { opacity: 0, x: 80, rotation: 10 }, { opacity: 1, x: 0, rotation: 3, duration: 0.4, ease: "back.out(1.6)" }, S.F + 0.05);
      show("#f_l1", at("F", "link"), { s: 1 });
      show("#f_l2", at("F", "plan"), { s: 1 });
      show("#f_cta", at("F", "agents"), { s: 1.5, y: 0 });
      tl.to("#f_cta", { scale: 1.06, duration: 0.18, yoyo: true, repeat: 3 }, at("F", "comment"));
      show("#f_dm", at("F", "guide"), { s: 1 });
      M.finish({ kw: { agents: "gold", free: "good", certificate: "gold", deadline: "hot", python: "cyan", agents: "gold", dm: "gold" } });

