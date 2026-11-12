"""Writes beats.html for x06: one prompt card that gets better with each of the 5 fixes (Claude prompting docs)."""
from pathlib import Path
HERE = Path(__file__).parent
CARD = "left:60px; top:450px; width:960px; height:770px;"
T = "font-family:'JetBrains Mono',monospace; font-size:40px;"

def card(sid, rows, extra=""):
    """rows: list of (id or None, html, top px, style)."""
    out = [f'<div class="card" id="{sid}" style="{CARD} {extra}">',
           f'<div class="x mut" style="left:40px; top:26px; {T} font-size:34px;">PROMPT</div>']
    for rid, h, top, st in rows:
        idp = f' id="{rid}"' if rid else ""
        out.append(f'<div class="x"{idp} style="left:40px; top:{top}px; width:880px; font-size:46px; font-weight:600; {st}">{h}</div>')
    out.append("</div>")
    return "".join(out)

def top(sc, n, name, fix, fid):
    k = sc.lower()
    return (f'<div class="x red" id="{k}_m" style="left:60px; top:200px; font-size:100px;">#{n} {name}</div>'
            f'<div class="chip" id="{fid}" style="left:60px; top:335px; background:#4CC38A; color:#0B1220; font-size:52px;">FIX: {fix}</div>')

B_ROWS = [(None, "Rahul ko email likho:", 100, ""), (None, "uski 3 din ki leave approve ho gayi.", 160, ""), (None, "Max 80 words.", 220, "")]
C_ROW = (None, "Phone par padhi jayegi, isliye chhota.", 300, "color:#4CC38A;")
D_ROW = (None, "<span class='cyan'>&lt;examples&gt;</span> 3 purane emails <span class='cyan'>&lt;/examples&gt;</span>", 380, "")
TAGGED = [(None, "<span class='gold'>&lt;instructions&gt;</span>", 100, T),
          (None, "Rahul ko leave approval email likho, max 80 words.", 150, ""),
          (None, "<span class='cyan'>&lt;context&gt;</span>", 270, T),
          (None, "Phone par padhi jayegi, isliye chhota.", 320, ""),
          (None, "<span class='green'>&lt;examples&gt;</span>", 400, T),
          (None, "3 purane emails", 450, "")]

html = []
# A: hook on frame 0
html.append(f"""        <div class="beat" id="sA">
          <div class="x c" id="a1" style="top:200px; font-size:112px;">Prompt aise</div>
          <div class="x c red" id="a2" style="top:330px; font-size:112px;">KABHI MAT LIKHO</div>
          <div class="card" id="a_card" style="left:60px; top:520px; width:960px; height:220px;"><div class="x mut" style="left:40px; top:26px; {T} font-size:34px;">PROMPT</div><div class="x" style="left:40px; top:96px; font-size:84px;">Email likho.</div></div>
          <div class="x red" id="a_x" style="left:840px; top:540px; font-size:170px;">&times;</div>
          <div class="chip" id="a_5" style="left:60px; top:800px; width:470px; background:#E8596B; color:#0B1220; font-size:58px;">5 GALTIYAN</div>
          <div class="chip" id="a_fix" style="left:550px; top:800px; width:470px; background:#4CC38A; color:#0B1220; font-size:58px;">+ 5 FIX</div>
        </div>""")
# B: vague -> who, what, how long
html.append(f"""        <div class="beat" id="sB">
          {top("B", 1, "VAGUE", "saaf likho", "b_fix")}
          {card("b_card", [("b_r1", B_ROWS[0][1], 100, ""), ("b_r2", B_ROWS[1][1], 160, ""), ("b_r3", B_ROWS[2][1], 220, "")])}
          <div class="chip" id="b_k1" style="left:90px; top:1080px; width:300px; border:3px solid #F2B544; color:#F2B544; font-size:44px;">KISKO</div>
          <div class="chip" id="b_k2" style="left:390px; top:1080px; width:300px; border:3px solid #F2B544; color:#F2B544; font-size:44px;">KIS BAARE</div>
          <div class="chip" id="b_k3" style="left:690px; top:1080px; width:300px; border:3px solid #F2B544; color:#F2B544; font-size:44px;">KITNA LAMBA</div>
        </div>""")
# C: give the reason
html.append(f"""        <div class="beat" id="sC">
          {top("C", 2, "WAJAH NAHI", "wajah batao", "c_fix")}
          {card("c_card", B_ROWS + [("c_r4", C_ROW[1], 300, C_ROW[3])])}
        </div>""")
# D: 3-5 examples
html.append(f"""        <div class="beat" id="sD">
          {top("D", 3, "ZERO EXAMPLES", "3-5 examples", "d_fix")}
          {card("d_card", B_ROWS + [C_ROW, ("d_r5", D_ROW[1], 380, "")])}
        </div>""")
# E: one blob -> XML tags
blob = ("<span id='e_h1'>Rahul ko leave approval email likho max 80 words</span> <span id='e_h2'>phone par padhi jayegi isliye chhota</span> "
        "<span id='e_h3'>yahan 3 purane emails hain jaise ki</span> &hellip;")
html.append(f"""        <div class="beat" id="sE">
          {top("E", 4, "EK BLOB", "XML tags", "e_fix")}
          <div class="card" id="e_blob" style="{CARD} border-color:#E8596B;"><div class="x mut" style="left:40px; top:26px; {T} font-size:34px;">PROMPT</div><div class="x" style="left:40px; top:100px; width:880px; font-size:50px; font-weight:500; line-height:1.3;">{blob}</div></div>
          {card("e_card", [("e_t1",) + TAGGED[0][1:], TAGGED[1], ("e_t2",) + TAGGED[2][1:], TAGGED[3], ("e_t3",) + TAGGED[4][1:], TAGGED[5]])}
        </div>""")
# F: a role in the system prompt
html.append(f"""        <div class="beat" id="sF">
          {top("F", 5, "NO ROLE", "system prompt", "f_fix")}
          {card("f_card", [(None, "<span class='mut'>system:</span> <span id='f_role' class='gold'>Tum ek HR manager ho.</span>", 100, "font-size:52px;"),
                           (None, "", 170, "")] + [(r[0], r[1], r[2] + 90, r[3]) for r in TAGGED])}
          <div class="chip" id="f_sys" style="left:240px; top:1100px; width:600px; border:4px solid #F2B544; color:#F2B544; font-size:46px;">sabse upar ki setting</div>
        </div>""")
# G: the pack + source
html.append("""        <div class="beat" id="sG">
          <div class="x c" id="g_t" style="top:210px; font-size:66px;"><span class="gold">5</span> TECHNIQUES + <span class="gold">10</span> TEMPLATES</div>
          <img id="g_toc" src="assets/claude_toc.png" style="position:absolute; left:60px; top:360px; width:520px; height:509px; border-radius:22px; border:3px solid #26324B; opacity:0;" />
          <div class="src" id="g_src" style="left:60px; width:520px; top:885px; text-align:left;">Source: Claude docs</div>
          <div id="g_pdf" style="position:absolute; left:620px; top:370px; width:400px; height:500px; border-radius:24px; background:linear-gradient(225deg,#c9c2b4 0,#c9c2b4 44px,#F3EFE6 44px); box-shadow:0 24px 60px rgba(0,0,0,.5); transform:rotate(3deg);">
            <div style="position:absolute; left:30px; top:30px; font:800 28px 'JetBrains Mono',monospace; color:#F2B544; background:#0B1220; border-radius:8px; padding:6px 12px;">PDF</div>
            <div style="position:absolute; left:30px; top:130px; width:340px; font:700 60px 'Space Grotesk',sans-serif; line-height:1.02; color:#0B1220;">AI PROMPT PACK</div>
            <div style="position:absolute; left:30px; bottom:36px; font:600 26px 'JetBrains Mono',monospace; color:#4a5468;">@ai.learnvora</div>
          </div>
          <div class="chip" id="g_cta" style="left:110px; top:980px; width:860px; background:#F2B544; color:#0B1220; font-size:72px;">Comment PROMPT</div>
          <div class="x c" id="g_dm" style="top:1130px; font-size:64px;">seedhe <span class="gold">DM</span> mein</div>
        </div>""")
(HERE / "beats.html").write_text("\n".join(html) + "\n", encoding="utf-8")
print("beats ok")
