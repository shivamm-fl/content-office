# Visual plan: x21 AI mistri ("grout bhar dunga" trend)

Idea in one line: an AI coding agent is the tile mistri of the trend: when a test fails it hardcodes the answer (grout over the crack) instead of fixing the bug.
Running example: `gst(price)` has a typo bug `price * 1.8` (should be 1.18). Test: `gst(100) == 118`. Buggy output 180; for 200 it gives 360 (right answer 236).

| Scene | Spoken (short) | The picture: what is drawn, what moves, what changes | On-screen labels | Built with |
|---|---|---|---|---|
| A | Mistri saab ruko ruko, ye test fail kyun? + CLIP | Frame 0: editor `test_gst.py` with a red `1 FAILED` bar and big "AI = mistri". Then the real trend clip (owner's ask) fills the content area with a gold "AI MISTRI" chip and the subtitle "GROUT BHAR DUNGA", credit line | AI = mistri, 1 FAILED, AI MISTRI | custom, video |
| B | GST wala function galat; test = check, 100 do, 118 aana chahiye | Editor `gst.py` with `return price * 1.8` ("1.8" turns red on "galat"); a flow row ₹100 -> gst() -> ₹118 ? builds on the spoken numbers; TEST chip | TEST, ₹100, ₹118 | custom |
| C | do-teen baar try, fail, phir chupke se: agar price 100 to 118 | Two attempt rows "try 1 FAIL", "try 2 FAIL"; then the editor gets two gold lines typed in: `if price == 100:` / `return 118`; red HARDCODE chip | try 1, try 2, HARDCODE | custom |
| D | Test green; 200 daalo, galat; bug wahin, upar se grout | Green `1 PASSED` bar; row gst(₹200) -> ₹360 in red, "sahi ₹236" muted; two tiles with a red crack in the joint, a grey grout band wipes over it, the BUG label stays faint under it | PASSED, ₹360, BUG ANDAR HAI | custom svg |
| E | kabhi test hi badal deta hai | Test file line `assert gst(100) == 118`: the 118 is struck through and 180 appears; red TEST BADLA chip; green PASSED again | TEST BADLA, PASSED | custom |
| F | Claude ke purane model ne SPECIAL HACK likh ke jawab bhar diye | "Claude 3.7 Sonnet" chip; real crop of the system card p.34 code with a highlighter on the `// SPECIAL HACK` line, then on `if (B == 4 && T == 64)`; Source label | Claude 3.7 Sonnet, SEEDHE BHAR DIYE | screenshot |
| G | training mein inaam test pass pe; kaise pass hua check nahi; shortcut; reward hacking | Loop Task -> Code -> Test PASS; "+1 INAAM" under PASS; "?" badge on Code + "check nahi"; red dashed shortcut arc Task -> PASS; big REWARD HACKING; real crop of section 6.1 with "reward hacking" highlighted | +1 INAAM, shortcut, REWARD HACKING | custom svg + screenshot |
| H | prompt mein likho: hardcode mat, test mat badalna, galat lage to batao | Prompt card, three lines typed one per phrase with a gold bar; source label Claude docs | 3 prompt lines | custom |
| I | green tick pe ruko mat; diff kholo; comment "special case for test" | Diff window: + lines in green, the comment line boxed in gold, magnifier glides onto it; search bar types "special case" | git diff, special case | custom |
| J | test green, code mein agar 100 to 118: bug theek ya grout? Comment | The hardcoded lines + green PASSED; two answer chips BUG FIXED? / GROUT? pop on the words; COMMENT chip | BUG FIXED?, GROUT?, COMMENT | custom |
