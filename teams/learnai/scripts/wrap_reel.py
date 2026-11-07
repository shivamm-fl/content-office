"""Wrap hand-written scenes + timeline into a reel's index.html.
  python scripts/wrap_reel.py reels/<folder> beats.html timeline.js "<TAG>" "<title>"   (see docs-notes/reel-playbook-v4.md)
Duration and scene order come from the reel's data.json."""
import json, sys
from pathlib import Path

reel, beats, timeline, tag, title = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]), sys.argv[4], sys.argv[5]
d = json.loads((reel / "data.json").read_text(encoding="utf-8"))["hi"]
dur = f'{d["total"]:g}'; order = [k for k in d["starts"] if k != "end"]
audio = "\n".join(f'      <audio id="{i}" src="audio/hi/{f}.wav" data-var-src="{v}" data-start="0" data-duration="{dur}" data-track-index="{n}" data-volume="1"></audio>'
                  for i, f, v, n in (("voice", "voice", "voiceSrc", 20), ("bed", "bed", "bedSrc", 21), ("sfx", "sfx", "sfxSrc", 22)))
html = f"""<!doctype html>
<html lang="hi" data-composition-variables='[
  {{"id":"lang","type":"enum","label":"Language","default":"hi","options":[{{"value":"hi","label":"Hindi (Hinglish)"}}]}},
  {{"id":"voiceSrc","type":"string","label":"Voice track","default":"audio/hi/voice.wav"}},
  {{"id":"bedSrc","type":"string","label":"Music bed (ducked)","default":"audio/hi/bed.wav"}},
  {{"id":"sfxSrc","type":"string","label":"SFX track","default":"audio/hi/sfx.wav"}}
]'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>{title}</title>
    <script src="assets/gsap.min.js"></script>
    <script src="data.js"></script>
    <link rel="stylesheet" href="kit/motion.css" />
    <link rel="stylesheet" href="kit/fx.css" />
    <script src="kit/motion.js"></script>
    <script src="kit/fx.js"></script>
    <style>
      @font-face {{ font-family: "Space Grotesk"; src: url("fonts/SpaceGrotesk.ttf"); font-weight: 300 700; }}
      @font-face {{ font-family: "JetBrains Mono"; src: url("fonts/JetBrainsMono.ttf"); font-weight: 100 800; }}
      @font-face {{ font-family: "Noto Sans Devanagari"; src: url("fonts/NotoSansDevanagari.ttf"); font-weight: 100 900; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
      <div id="bg" data-layout-allow-overflow>
        <div class="orb" id="orb1" data-layout-allow-overflow></div><div class="orb" id="orb2" data-layout-allow-overflow></div><div class="orb" id="orb3" data-layout-allow-overflow></div>
        <div id="floorwrap" data-layout-allow-overflow><div id="floor" data-layout-allow-overflow></div></div><div id="floorfade"></div>
        <div id="dust" data-layout-allow-overflow></div><div id="scan"></div><div id="vig"></div>
      </div>
      <div id="cam">
{beats.read_text(encoding="utf-8")}
      </div>
      <div id="prog"><div id="progfill"></div></div>
      <div id="tag"><div id="tagdot"></div><span id="tagtxt"></span></div><div id="handle"></div>
      <div class="brk" id="b1"></div><div class="brk" id="b2"></div><div class="brk" id="b3"></div><div class="brk" id="b4"></div>
      <div id="caps"></div>
      <div id="flash"></div><div class="gl"></div><div class="gl"></div><div class="gl"></div><div class="gl"></div><div class="gl"></div><div id="wipe"></div>
{audio}
    </div>
    <script>
      const M = Mo.init({{ order: {json.dumps(order)}, tag: {json.dumps(tag)} }});
      const {{ tl, S }} = M;
      const {{ at, q, qa, show, hide, wipe, count }} = FX(M);
{timeline.read_text(encoding="utf-8")}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""
(reel / "index.html").write_text(html, encoding="utf-8"); print("wrote", reel / "index.html", dur, order)
