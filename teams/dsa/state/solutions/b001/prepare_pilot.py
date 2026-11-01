"""Prepare the one-off reel after the actual browser-observed Accepted verdict.
The local key is private and separate from the still-unconfigured production Worker.
This is not an automated LeetCode API acceptance claim.
"""
import hashlib, hmac, json, secrets, shutil, tempfile
from pathlib import Path

TEAM = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
REEL = TEAM / "reels/b001_two_sum"
CODE = (HERE / "solution.py").read_text(encoding="utf-8")
DIGEST = hashlib.sha256(CODE.encode()).hexdigest()
if DIGEST != "83fe98c6b59410e048d275db035f20b1def0012012db3dfedc1b839c4507cdd5":
    raise SystemExit("Source differs from the exact code observed in Accepted submission 2186985299; submit and verify the changed code first.")
KEY_FILE = Path(tempfile.gettempdir()) / "learnvora-b001-local-pilot.key"
if not KEY_FILE.exists():
    KEY_FILE.write_text(secrets.token_urlsafe(48), encoding="utf-8")
SECRET = KEY_FILE.read_text(encoding="utf-8")
PROOF = {"v": 1, "kind": "accepted", "item": "b001", "track": "blind75", "slug": "two-sum", "question_id": "1", "challenge_date": None,
         "code_sha256": DIGEST, "submission_id": "2186985299", "status": "Accepted", "language": "python3", "total_testcases": 66,
         "verification_method": "browser_ui_observed", "account": "dsalearnvora", "verified_at": "2026-11-01T12:59:00Z",
         "submission_url": "https://leetcode.com/problems/two-sum/submissions/2186985299/", "proof_scope": "local_pilot"}
body = json.dumps(PROOF, ensure_ascii=False, separators=(",", ":"))
token = json.dumps({"body": body, "sig": hmac.new(SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()})
teaching = {
 "problem": "Find distinct indices in [4,1,8,6] that sum to target 14; return [2,3].",
 "brute_force": "Enumerate unique pairs with i < j; our example reaches the last pair after six comparisons.",
 "bottleneck": "Repeated partner searches require n(n-1)/2 comparisons in the worst case, 49,995,000 for n=10000; this is a count, not measured time or a claimed judge TLE.",
 "optimization": "For current x the only possible partner is target-x. Remember previous values and indices in a hash map to replace the repeated search with average constant-time lookup.",
 "dry_run": "4 needs 10, 1 needs 13, 8 needs 6: all absent and stored. At index 3 value 6 needs 8, found at index 2. Return [2,3]. Check before insertion preserves distinct indices.",
 "complexity": "Brute force takes O(n squared) time and O(1) extra space. Hash map takes average O(n) time and O(n) extra space; no strict worst-case O(n) guarantee is claimed."
}
item = {"id": "b001", "track": "blind75", "position": 1, "problem": {"slug": "two-sum", "question_id": "1", "number": "1", "title": "Two Sum", "difficulty": "Easy", "url": "https://leetcode.com/problems/two-sum/"},
        "title": "Two Sum: brute force se hash map tak", "format": "problem", "solution_code": CODE, "accepted_proof": token, "length_target_s": 110, "teaching": teaching,
        "sources": ["https://leetcode.com/problems/two-sum/", "https://wiki.python.org/moin/TimeComplexity", PROOF["submission_url"]],
        "status": "planned", "qa_passed": False, "proof_scope": "local_pilot", "note": "Authentic 66/66 Accepted observed in the user's browser. Local pilot signature; not registered as a production Worker receipt."}
copy = {
 "A": "@hook Two Sum में क्या हर pair check करना पड़ेगा? | Array चार, एक, आठ, छह; target चौदह। | दो elements का sum चौदह चाहिए; उनके अलग indices लौटाने हैं।",
 "B": "Brute force: हर unique pair check करो। | चार plus एक पाँच, चार plus आठ बारह। | छह checks के बाद आठ plus छह चौदह मिलता है।",
 "C": "चार numbers पर छह checks। | लेकिन दस हज़ार numbers पर worst case: लगभग पाँच करोड़ pairs! | हर बार partner search करना bottleneck है।",
 "D": "Current number x हो, तो partner exactly target minus x होगा। | इसलिए सवाल है: क्या ये partner पहले दिखा था?",
 "E": "Hash map पहले देखे numbers और उनके indices याद रखेगा। | पूरी list search करने की जगह direct lookup। | यहीं repeated work हटता है।",
 "F": "चार का partner दस: नहीं मिला, store करो। | एक का तेरह, आठ का छह: नहीं मिले। | दोनों store करो।",
 "G": "अब छह का partner आठ map में index दो पर है। | Current index तीन। | Return दो और तीन। चार iterations में answer!",
 "H": "पहले check, फिर store। | सात, सात और target चौदह पर store पहले किया, तो पहला सात खुद से match होगा। | पिछले elements ही map में रखो।",
 "I": "हर element पर average constant-time lookup: average O of n time। | Extra space O of n। | Brute force में O of n squared time था। | Map में values के साथ क्या store होगा? Comment करो।"
}
spec = {"tts": "owner", "voice": "hi-IN-SwaraNeural", "pace": 1.26, "audio": "v2", "owner_model": "eleven_flash_v2_5", "owner_tempo": 0.9, "prime": "सुनो, ये बहुत interesting है!", "tone": "calm", "hook_type": "direct_question",
        "scenes": list(copy), "min": {s: 3 for s in copy}, "tail": {}, "copy": {"hi": copy}, "cues": [["click", "B", 1, 0], ["err", "C", 1, 0], ["click", "F", 1, 0], ["ok", "G", 2, 0], ["click", "H", 0, 0]],
        "solution_sha256": DIGEST, "teaching_scenes": {"problem": ["A"], "brute_force": ["B"], "bottleneck": ["C"], "optimization": ["D", "E"], "dry_run": ["F", "G", "H"], "complexity": ["I"]}}
for name, value in [("coding.json", item), ("spec.json", spec), ("browser-verification.json", PROOF)]:
    (REEL / name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
(REEL / "solution.py").write_text(CODE, encoding="utf-8", newline="\n")
(REEL / "script.txt").write_text("\n\n".join(copy.values()), encoding="utf-8")
(HERE / "production-status.json").write_text(json.dumps({"id": "b001", "status": "accepted_local_pilot_build", "local_tests_passed": True, "leetcode_accepted": True, "submission_id": "2186985299", "testcases_passed": "66/66", "proof_scope": "local_pilot", "note": "Browser-observed genuine Accepted and code read-back. Production account/session secret automation remains separate."}, indent=2), encoding="utf-8")
print("Prepared b001 from genuine LeetCode Accepted 2186985299 (66/66). Local proof key stays outside git.")
