      // A: the three numbers at frame 0; speed is crossed out
      show("#a_sp", at("A", "speed") - 0.1, { s: 1.3 });
      wipe("#a_x", at("A", "speed", 1) - 0.05, 0.35);
      show("#a_no", at("A", "speed", 1) + 0.2, { s: 1.05 });
      // B: the arithmetic (1e9 x 768 x 4 bytes = 3.07 TB = 24 x 128 GB)
      show("#b_t", at("B", "hisab") - 0.1, { s: 1.1 });
      show("#b_eq", at("B", "seven") - 0.1, { s: 1 });
      show("#b_tb", at("B", "three") - 0.1, { s: 1.4 });
      show("#b_l1", at("B", "ram") - 0.1, { s: 1, y: 0 }); wipe("#b_ram", at("B", "ram"), 0.3);
      show("#b_l2", at("B", "ram") + 0.2, { s: 1, y: 0 }); wipe("#b_data", at("B", "chaubis") - 0.2, 0.7);
      show("#b_24", at("B", "chaubis"), { s: 1.5 });
      // C: product quantization (64 pieces x 1 byte + 8-byte id = 72 bytes; 72 GB of 128)
      show("#c_t", at("C", "fix") - 0.1, { s: 1.1 });
      show("#c_sc", at("C", "paint") - 0.1, { s: 1 });
      const sw = q("#c_sw");
      for (let i = 0; i < 16; i++) { const d = document.createElement("div"); d.className = "sw"; d.style.left = i * 57.5 + "px"; d.style.background = `hsl(${30 + i * 3}, ${55 + i}%, ${28 + i * 3.6}%)`; sw.appendChild(d); show(d, at("C", "paint") + i * 0.03, { s: 1, y: 8, d: 0.15 }); }
      tl.to(sw.children[9], { y: -18, boxShadow: "0 0 0 5px #F2B544", duration: 0.3 }, at("C", "number") - 0.2);
      show("#c_pick", at("C", "exact") - 0.1, { s: 1 });
      const pcs = q("#c_pcs");
      for (let i = 0; i < 64; i++) { const d = document.createElement("div"); d.className = "pc"; d.style.left = (i % 32) * 28.6 + "px"; d.style.top = Math.floor(i / 32) * 58 + "px"; pcs.appendChild(d); show(d, at("C", "chaunsath") + i * 0.012, { s: 1, y: 0, d: 0.1 }); }
      show("#c_b", at("C", "byte") - 0.1, { s: 1.1 });
      show("#c_l", at("C", "id") - 0.1, { s: 1, y: 0 }); show("#c_track", at("C", "id") - 0.1, { s: 1, y: 0 });
      wipe("#c_fit", at("C", "seventy") - 0.2, 0.6); show("#c_72", at("C", "seventy"), { s: 1.2 });
      show("#c_pq", at("C", "product") - 0.1, { s: 1.15 });
      // D: IVF: 65,000 groups drawn as a grid; the 32 nearest light up (32 / 65,536 of a billion = ~4.9 lakh)
      show("#d_t", at("D", "fix") - 0.1, { s: 1.1 });
      show("#d_s", at("D", "painsath") - 0.1, { s: 1 });
      const g = q("#d_grid"), hot = new Set();
      for (let r = 4; r < 8; r++) for (let c = 8; c < 16; c++) hot.add(r * 22 + c);
      for (let i = 0; i < 220; i++) { const d = document.createElement("div"); d.className = "cell"; d.style.left = (i % 22) * 40 + "px"; d.style.top = Math.floor(i / 22) * 43 + "px"; g.appendChild(d);
        show(d, at("D", "painsath") + (i % 22) * 0.015, { s: 1, y: 0, d: 0.12 });
        if (hot.has(i)) tl.to(d, { backgroundColor: "#5BC0EB", duration: 0.2 }, at("D", "thirty") + 0.1); }
      show("#d_32", at("D", "thirty") - 0.1, { s: 1.05 });
      show("#d_5l", at("D", "paanch") - 0.1, { s: 1.05 });
      show("#d_ivf", at("D", "ivf") - 0.1, { s: 1.3 });
      // E: rerank the top 100 with the full vectors on SSD; DiskANN
      show("#e_t", at("E", "fix") - 0.1, { s: 1.1 });
      show("#e_ram", at("E", "shade") - 0.1, { s: 0.94 });
      show("#e_ar", at("E", "top") - 0.1, { s: 1, y: 0 });
      show("#e_ssd", at("E", "ssd") - 0.1, { s: 0.94 });
      show("#e_dk", at("E", "diskann") - 0.15, { s: 0.94 });
      show("#e_src", at("E", "diskann"), { s: 1, y: 0 });
      // F: interview answer
      show("#f_chip", at("F", "interview") - 0.05, { s: 0.85 });
      show("#f_1", at("F", "billion") - 0.1, { s: 1.05 });
      show("#f_a", at("F", "chhota") - 0.1, { s: 0.95 });
      show("#f_b", at("F", "kam") - 0.1, { s: 0.95 });
      show("#f_c", at("F", "top") - 0.1, { s: 0.95 });
      // G: the question
      show("#g_1", at("G", "code") - 0.1, { s: 1.1 });
      show("#g_2", at("G", "ram") - 0.1, { s: 1.1 });
      show("#g_3", at("G", "badle") - 0.1, { s: 1.1 });
      show("#g_c", at("G", "comment") - 0.1, { s: 0.85 });
      M.finish({ kw: { billion: "gold", ram: "good", speed: "cyan", three: "hot", tb: "hot", chaubis: "hot", shade: "gold", byte: "gold", seventy: "good",
                       product: "gold", quantization: "gold", ivf: "cyan", diskann: "gold", memory: "hot", comment: "gold" } });
