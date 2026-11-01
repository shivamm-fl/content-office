"""Offline tests of hard production gates; no real LeetCode or paid media calls."""
import hashlib
import hmac
import html
import json
import tempfile
import unittest
from pathlib import Path
import coding_gate
import delivery

SECRET = "offline-test-secret-32-characters-long"


class CodingGateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.folder = Path(self.temp.name)
        self.code = "class Solution:\n    pass\n"
        self.digest = hashlib.sha256(self.code.encode()).hexdigest()
        p = {"v": 1, "kind": "accepted", "item": "b001", "track": "blind75", "status": "Accepted", "language": "python3", "submission_id": "12345", "slug": "two-sum", "question_id": "1", "code_sha256": self.digest}
        body = json.dumps(p)
        token = json.dumps({"body": body, "sig": hmac.new(SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()})
        self.item = {"id": "b001", "track": "blind75", "position": 1, "problem": {"slug": "two-sum", "question_id": "1"}, "accepted_proof": token, "solution_code": self.code, "length_target_s": 105, "teaching": {k: "Six meaningful words explain this algorithm correctly" for k in coding_gate.BEATS}}
        self.spec = {"scenes": list("ABCDEF"), "copy": {"hi": {s: "Actual spoken content" for s in "ABCDEF"}}, "teaching_scenes": {k: [s] for k, s in zip(coding_gate.BEATS, "ABCDEF")}, "solution_sha256": self.digest}
        self.save()

    def save(self):
        (self.folder / "coding.json").write_text(json.dumps(self.item), encoding="utf-8")
        (self.folder / "solution.py").write_text(self.code, encoding="utf-8")
        (self.folder / "spec.json").write_text(json.dumps(self.spec), encoding="utf-8")

    def test_exact_evidence_and_ordered_teaching_pass(self):
        self.assertTrue(coding_gate.check(self.folder, "b001", SECRET)[0])

    def test_mutated_source_and_wrong_secret_fail(self):
        (self.folder / "solution.py").write_text(self.code + "# edit", encoding="utf-8")
        self.assertFalse(coding_gate.check(self.folder, "b001", SECRET)[0])
        self.save()
        self.assertFalse(coding_gate.check(self.folder, "b001", "")[0])

    def test_missing_or_reordered_reasoning_fails(self):
        self.spec["teaching_scenes"]["optimization"] = ["B"]
        self.save()
        self.assertFalse(coding_gate.check(self.folder, "b001", SECRET)[0])
        self.spec["teaching_scenes"].pop("optimization")
        self.save()
        self.assertFalse(coding_gate.check(self.folder, "b001", SECRET)[0])

    def test_missing_receipt_and_long_target_fail(self):
        self.item["length_target_s"] = 121
        self.save()
        self.assertFalse(coding_gate.check(self.folder, "b001", SECRET)[0])
        (self.folder / "coding.json").unlink()
        self.assertFalse(coding_gate.check(self.folder, "b001", SECRET)[0])

    def test_shared_scene_requires_ordered_distinct_narrated_phrases(self):
        self.spec['copy']['hi']['B'] = 'Concrete brute force baseline | Concrete repeated work bottleneck'
        names = ['A','B','B','C','D','E']
        self.spec['teaching_scenes'] = {beat:[scene] for beat,scene in zip(coding_gate.BEATS,names)}
        self.spec['teaching_phrases'] = {beat:[[scene,1 if beat=='bottleneck' else 0]] for beat,scene in zip(coding_gate.BEATS,names)}
        self.save()
        self.assertTrue(coding_gate.check(self.folder,'b001',SECRET)[0])
        self.spec['teaching_phrases']['bottleneck'] = [['B',0]]
        self.save()
        self.assertFalse(coding_gate.check(self.folder,'b001',SECRET)[0])
        self.spec['teaching_phrases']['bottleneck'] = [['B',2]]
        self.save()
        self.assertFalse(coding_gate.check(self.folder,'b001',SECRET)[0])

    def test_visible_code_rejects_absence_mutation_and_incomplete_body(self):
        self.code = 'class Solution:\n    def solve(self, nums):\n        total = 0\n        for value in nums:\n            total += value\n        return total\n'
        self.spec['on_screen_code_contract'] = 'complete_method_body'
        self.save()
        rows = self.code.splitlines()[2:]
        def composition(values):
            return '<svg>' + ''.join('<text font-family="Code">' + html.escape(v[8:]) + '</text>' for v in values) + '</svg>'
        p = self.folder / 'index.html'
        p.write_text('<main>Only diagrams</main>',encoding='utf-8')
        self.assertFalse(coding_gate.check_visible_code(self.folder,'b001')[0])
        p.write_text(composition(rows),encoding='utf-8')
        self.assertTrue(coding_gate.check_visible_code(self.folder,'b001')[0])
        p.write_text(composition(rows).replace('total = 0','total = 1'),encoding='utf-8')
        self.assertFalse(coding_gate.check_visible_code(self.folder,'b001')[0])
        p.write_text(composition(rows[:-1]),encoding='utf-8')
        self.assertFalse(coding_gate.check_visible_code(self.folder,'b001')[0])

    def test_delivery_requires_all_four_coding_checks(self):
        base = {"reel": "b001", "checks": [{"name": "files exist", "ok": True}]}
        self.assertFalse(delivery.deliver(base))
        for name in ("coding Accepted and teaching contract", "coding lesson length 60-120 s", "coding teaching independently reviewed", "coding on-screen Accepted code"):
            base["checks"].append({"name": name, "ok": True})
        self.assertTrue(delivery.deliver(base))
        base["checks"][-1]["ok"] = False
        self.assertFalse(delivery.deliver(base))

    def test_legacy_tracks_keep_their_gate(self):
        self.assertTrue(coding_gate.check(self.folder, "d001", "")[0])
        self.assertTrue(delivery.deliver({"reel": "d001", "checks": [{"name": "files exist", "ok": True}]}))


if __name__ == "__main__":
    unittest.main()
