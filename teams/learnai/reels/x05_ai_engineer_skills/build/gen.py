"""Writes beats.html for x05 (6 skills): a shared 1-6 progress row per skill scene, a big name, a one-line meaning, one example."""
from pathlib import Path
HERE = Path(__file__).parent
SK = [("B", "PROMPTING", "model se <span class='gold'>sahi kaam</span>"), ("C", "EMBEDDINGS", "text &rarr; <span class='gold'>numbers</span>"),
      ("D", "RAG", "<span class='gold'>apni files</span> se jawab"), ("E", "AGENTS", "model khud <span class='gold'>tools</span> chalaye"),
      ("F", "EVALS", "har badlav ke baad <span class='gold'>test</span>"), ("G", "PRODUCTION", "<span class='gold'>asli users</span> ke liye")]

def dots(cur):
    out = []
    for i in range(6):
        st = "background:#F2B544;color:#0B1220;border-color:#F2B544;" if i == cur else ("background:rgba(242,181,68,.25);color:#F2B544;border-color:rgba(242,181,68,.5);" if i < cur else "color:#5E6B85;")
        out.append(f'<div class="chip" style="left:{60 + i * 163}px; top:190px; width:140px; padding:10px 0; font-size:46px; border:3px solid #26324B; {st}">{i + 1}</div>')
    return "".join(out)

def head(sc, i, name, mean):
    k = sc.lower()
    return (dots(i) +
            f'<div class="x gold" id="{k}_n" style="left:60px; top:330px; font-size:84px; font-family:\'JetBrains Mono\',monospace;">0{i + 1}</div>'
            f'<div class="x" id="{k}_name" style="left:200px; top:300px; font-size:128px;">{name}</div>'
            f'<div class="x c" id="{k}_mean" style="top:470px; font-size:66px;">{mean}</div>')

B = {}
B["B"] = """
          <div class="chip" id="b_int" style="left:300px; top:600px; width:480px; border:4px solid #5BC0EB; color:#5BC0EB; font-size:54px;">NAYA INTERN</div>
          <div class="card" id="b_bad" style="left:60px; top:730px; width:960px; height:150px; border-color:#E8596B;"><div class="x red" style="left:40px; top:44px; font-size:60px;">&times; &ldquo;Kuch bana do.&rdquo;</div></div>
          <div class="strike" id="b_bs" style="left:110px; top:800px; width:600px;"></div>
          <div class="card" id="b_good" style="left:60px; top:910px; width:960px; height:250px; border-color:#4CC38A;"><div class="x" style="left:40px; top:40px; width:880px; font-size:56px;"><span class="green">&#10003;</span> &ldquo;Rahul ke liye leave approval email likho, 80 words.&rdquo;</div></div>
          <div class="chip" id="b_ex" style="left:560px; top:1180px; width:460px; background:#F2B544; color:#0B1220; font-size:50px;">+ 1 EXAMPLE</div>"""
B["C"] = """
          <div class="chip" id="c_txt" style="left:60px; top:600px; width:420px; border:4px solid #E8EDF6; color:#E8EDF6; font-size:52px;">sasta phone</div>
          <div class="x gold" id="c_arr" style="left:500px; top:600px; font-size:72px;">&rarr;</div>
          <div class="x cyan" id="c_vec" style="left:590px; top:612px; font-size:48px; font-family:'JetBrains Mono',monospace;">[0.82, -0.14 &hellip;]</div>
          <div class="card" id="c_box" style="left:60px; top:780px; width:960px; height:150px;"><div class="x" style="left:40px; top:44px; font-size:60px;"><span class="mut">search:</span> sasta phone</div></div>
          <div class="card" id="c_res" style="left:60px; top:960px; width:960px; height:150px; border-color:#4CC38A;"><div class="x" style="left:40px; top:44px; font-size:60px;"><span class="green">&#10003;</span> budget mobile</div></div>
          <div class="chip" id="c_same" style="left:500px; top:1140px; width:520px; background:#4CC38A; color:#0B1220; font-size:48px;">SAME MEANING</div>"""
B["D"] = """
          <div class="card" id="d_f1" style="left:60px; top:620px; width:300px; height:110px;"><div class="x" style="left:30px; top:28px; font-size:48px;">policy.pdf</div></div>
          <div class="card" id="d_f2" style="left:60px; top:750px; width:300px; height:110px;"><div class="x" style="left:30px; top:28px; font-size:48px;">notes.docx</div></div>
          <div class="card" id="d_f3" style="left:60px; top:880px; width:300px; height:110px;"><div class="x" style="left:30px; top:28px; font-size:48px;">sales.csv</div></div>
          <div class="x gold" id="d_a1" style="left:385px; top:740px; font-size:90px;">&rarr;</div>
          <div class="box" id="d_m" style="left:490px; top:700px; width:220px; height:200px; border:5px solid #5BC0EB; color:#5BC0EB; background:rgba(91,192,235,.08);">MODEL</div>
          <div class="x gold" id="d_a2" style="left:725px; top:740px; font-size:90px;">&rarr;</div>
          <div class="box" id="d_j" style="left:820px; top:700px; width:200px; height:200px; border:5px solid #4CC38A; color:#4CC38A; background:rgba(76,195,138,.08); font-size:50px;">JAWAB</div>
          <div class="chip" id="d_ob" style="left:220px; top:1080px; width:640px; background:#F2B544; color:#0B1220; font-size:60px;">OPEN-BOOK EXAM</div>"""
B["E"] = """
          <div class="box" id="e_m" style="left:60px; top:640px; width:260px; height:180px; border:5px solid #5BC0EB; color:#5BC0EB; background:rgba(91,192,235,.08);">MODEL</div>
          <div class="chip" id="e_s" style="left:400px; top:660px; width:280px; border:4px solid #F2B544; color:#F2B544; font-size:52px;">SEARCH</div>
          <div class="chip" id="e_c" style="left:740px; top:660px; width:280px; border:4px solid #F2B544; color:#F2B544; font-size:52px;">CODE</div>
          <div class="x gold" id="e_a1" style="left:330px; top:665px; font-size:70px;">&rarr;</div>
          <div class="x gold" id="e_a2" style="left:683px; top:665px; font-size:60px;">&rarr;</div>
          <div class="x c gold" id="e_loop" style="top:860px; font-size:66px;">&#8635; jab tak kaam poora na ho</div>
          <div class="chip" id="e_done" style="left:290px; top:1020px; width:500px; background:#4CC38A; color:#0B1220; font-size:62px;">&#10003; KAAM POORA</div>"""
B["F"] = """
          <div class="x mut" id="f_lbl" style="left:60px; top:600px; font-size:46px; font-family:'JetBrains Mono',monospace;">EXAMPLE SCORES</div>
          <div class="x" id="f_v1" style="left:60px; top:680px; font-size:58px;">v1</div><div class="hbar" id="f_b1" style="left:180px; top:676px; width:590px; height:80px; background:#5E6B85;"></div><div class="x" id="f_p1" style="left:800px; top:680px; font-size:60px;">72%</div>
          <div class="x" id="f_v2" style="left:60px; top:820px; font-size:58px;">v2</div><div class="hbar" id="f_b2" style="left:180px; top:816px; width:664px; height:80px; background:#4CC38A;"></div><div class="x green" id="f_p2" style="left:870px; top:820px; font-size:60px;">81% &#9650;</div>
          <div class="x" id="f_v3" style="left:60px; top:960px; font-size:58px;">v3</div><div class="hbar" id="f_b3" style="left:180px; top:956px; width:525px; height:80px; background:#E8596B;"></div><div class="x red" id="f_p3" style="left:735px; top:960px; font-size:60px;">64% &#9660;</div>
          <div class="x c" id="f_q" style="top:1110px; font-size:64px;"><span class="green">sudhra</span> ya <span class="red">bigda?</span></div>"""
B["G"] = """
          <div class="chip" id="g_c" style="left:60px; top:600px; width:250px; border:4px solid #F2B544; color:#F2B544; font-size:52px;">COST</div>
          <div class="chip" id="g_s" style="left:340px; top:600px; width:250px; border:4px solid #F2B544; color:#F2B544; font-size:52px;">SPEED</div>
          <div class="chip" id="g_m" style="left:620px; top:600px; width:400px; border:4px solid #F2B544; color:#F2B544; font-size:50px;">MONITORING</div>
          <div class="x" id="g_dt" style="left:60px; top:760px; font-size:58px;">DEMO: <span class="mut">10 log</span></div>
          <div id="g_demo"></div>
          <div class="x" id="g_at" style="left:60px; top:920px; font-size:58px;">ASLI APP: <span class="gold">hazaron</span></div>
          <div id="g_app"></div>"""
B["H"] = """
          <div class="x c" id="h_t" style="top:230px; font-size:72px;"><span class="gold">6</span> SKILLS &rarr; <span class="gold">160</span> CONCEPTS</div>
          <div id="h_pdf" style="position:absolute; left:320px; top:380px; width:440px; height:540px; border-radius:24px; background:linear-gradient(225deg,#c9c2b4 0,#c9c2b4 48px,#F3EFE6 48px); box-shadow:0 24px 60px rgba(0,0,0,.5); transform:rotate(3deg);">
            <div style="position:absolute; left:34px; top:34px; font:800 30px 'JetBrains Mono',monospace; color:#F2B544; background:#0B1220; border-radius:8px; padding:6px 14px;">PDF</div>
            <div style="position:absolute; left:34px; top:150px; width:380px; font:700 62px 'Space Grotesk',sans-serif; line-height:1.02; color:#0B1220;">AI ENGINEER ROADMAP</div>
            <div style="position:absolute; left:34px; bottom:40px; font:600 30px 'JetBrains Mono',monospace; color:#4a5468;">8 areas &middot; 160 concepts</div>
          </div>
          <div class="chip" id="h_cta" style="left:110px; top:990px; width:860px; background:#F2B544; color:#0B1220; font-size:72px;">Comment ROADMAP</div>
          <div class="x c" id="h_dm" style="top:1140px; font-size:64px;">PDF seedhe <span class="gold">DM</span> mein</div>"""

html = ["""        <div class="beat" id="sA">
          <div class="x c" id="a1" style="top:230px; font-size:130px;"><span class="gold">AI ENGINEER</span></div>
          <div class="x c" id="a2" style="top:390px; font-size:100px;">banna hai?</div>
          <div class="chip at" style="left:90px; top:560px; width:420px; border:4px solid #8592AD; color:#E8EDF6; font-size:46px;">NEW TOOL</div>
          <div class="chip at" style="left:570px; top:560px; width:420px; border:4px solid #8592AD; color:#E8EDF6; font-size:46px;">NEW FRAMEWORK</div>
          <div class="chip at" style="left:90px; top:680px; width:420px; border:4px solid #8592AD; color:#E8EDF6; font-size:46px;">NEW LIBRARY</div>
          <div class="chip at" style="left:570px; top:680px; width:420px; border:4px solid #8592AD; color:#E8EDF6; font-size:46px;">NEW MODEL</div>
          <div class="strike" id="a_s1" style="left:90px; top:665px; width:900px;"></div>
          <div class="x c" id="a_50" style="top:840px; font-size:120px;">50 COURSES</div>
          <div class="strike" id="a_s2" style="left:220px; top:905px; width:640px;"></div>
          <div class="x c gold" id="a_6" style="top:1010px; font-size:170px;">6 SKILLS</div>
        </div>"""]
for i, (sc, name, mean) in enumerate(SK):
    html.append(f'        <div class="beat" id="s{sc}">\n          {head(sc, i, name, mean)}{B[sc]}\n        </div>')
html.append(f'        <div class="beat" id="sH">{B["H"]}\n        </div>')
(HERE / "beats.html").write_text("\n".join(html) + "\n", encoding="utf-8")
print("beats ok")
