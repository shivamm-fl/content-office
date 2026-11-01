import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { codeHash, potdId, signEvidence, validateCodingItem, TEACHING_BEATS } from "./coding.ts";
import { trackOfItem, floorOfItem } from "./calendar.ts";

export const secret = "offline-test-secret-32-characters-long";
export async function codingItem(id = "b001") {
  const potd = id[0] === "p";
  const code = "class Solution:\n    pass\n";
  const problem = { slug: "two-sum", question_id: "1" };
  const proof = { v: 1, kind: "accepted", item: id, track: potd ? "potd" : "blind75", ...problem, challenge_date: potd ? "2026-11-01" : null, code_sha256: await codeHash(code), submission_id: "12345", status: "Accepted", language: "python3" };
  return { id, track: proof.track, problem, ...(potd ? { challenge_date: proof.challenge_date } : { position: Number(id.slice(1)) }), solution_code: code, accepted_proof: await signEvidence(proof, secret), length_target_s: 105, teaching: Object.fromEntries(TEACHING_BEATS.map((b) => [b, "Five concrete words explain this algorithm"])) };
}

test("genuine signed exact-code evidence permits both tracks", async () => {
  for (const id of ["b001", "p0001"]) await validateCodingItem(id, await codingItem(id), secret);
});
test("reject fabricated proof, wrong key, mutated code, missing reasoning and oversized target", async () => {
  const item = await codingItem();
  for (const change of [{ accepted_proof: "accepted: true" }, { solution_code: item.solution_code + "# changed" }, { teaching: { ...item.teaching, optimization: "faster" } }, { length_target_s: 121 }, { track: "series" }, { position: 2 }, { problem: { slug: "wrong", question_id: "1" } }]) {
    await assert.rejects(validateCodingItem("b001", { ...item, ...change }, secret));
  }
  await assert.rejects(validateCodingItem("b001", item, ""));
  await assert.rejects(validateCodingItem("b001", item, "a-different-long-32-character-secret"));
  await assert.rejects(validateCodingItem("d001", item, secret));
});
test("POTD date is UTC, deterministic and validated across calendar boundaries", async () => {
  assert.equal(potdId("2026-11-01"), "p0001");
  assert.equal(potdId("2026-12-01"), "p0031");
  for (const s of ["2026-10-31", "2026-11-31", "invalid"]) assert.throws(() => potdId(s));
  const item = await codingItem("p0001");
  await assert.rejects(validateCodingItem("p0001", { ...item, challenge_date: "2026-11-02" }, secret));
});
test("original 75 manifest has unique ids/slugs, original IV link, LCS and premium entries", () => {
  const rows = JSON.parse(readFileSync(new URL("../../../teams/dsa/roadmap/blind75.json", import.meta.url))).problems;
  assert.equal(rows.length, 75); assert.equal(new Set(rows.map((r) => r.slug)).size, 75);
  assert.deepEqual(rows.map((r) => r.id), rows.map((_, i) => `b${String(i + 1).padStart(3, "0")}`));
  assert.ok(rows.some((r) => r.slug === "combination-sum-iv"));
  assert.ok(rows.some((r) => r.slug === "longest-common-subsequence"));
  assert.equal(rows.filter((r) => r.slug === "merge-k-sorted-lists").length, 1);
  assert.ok(rows.some((r) => r.premium_in_source));
});
test("calendar labels and ownership route b/p to DSA, leaving old series intact", () => {
  assert.equal(trackOfItem("b001"), "blind75"); assert.equal(trackOfItem("p0001"), "potd"); assert.equal(trackOfItem("d001"), "series");
  for (const id of ["b001", "p0001"]) assert.equal(floorOfItem(id, { b: "dsa", p: "dsa" }), "dsa");
});
