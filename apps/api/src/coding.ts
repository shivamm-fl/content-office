/** Shared contract for DSA problem tracks. Only the trusted LeetCode bridge signs evidence. */
export const CODING_TRACKS = { b: "blind75", p: "potd" } as const;
export const TEACHING_BEATS = ["problem", "brute_force", "bottleneck", "optimization", "dry_run", "complexity"] as const;
const enc = new TextEncoder();
export const codingTrack = (id: string): string | null => CODING_TRACKS[id[0] as keyof typeof CODING_TRACKS] ?? null;
export const potdId = (date: string): string => {
  const ms = Date.parse(`${date}T00:00:00Z`);
  const n = (ms - Date.parse("2026-11-01T00:00:00Z")) / 86400000 + 1;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(n) || n < 1 || n > 9999 || new Date(ms).toISOString().slice(0, 10) !== date) throw new Error("invalid POTD date");
  return `p${String(n).padStart(4, "0")}`;
};
export async function codeHash(code: string): Promise<string> {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(code)))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export async function signEvidence(payload: Record<string, unknown>, secret: string): Promise<string> {
  if (secret.length < 32) throw new Error("CODING_PROOF_SECRET must have at least 32 characters");
  const body = JSON.stringify(payload);
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = [...new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(body)))].map((b) => b.toString(16).padStart(2, "0")).join("");
  return JSON.stringify({ body, sig });
}
export async function readEvidence(token: unknown, secret: string): Promise<Record<string, unknown>> {
  if (secret.length < 32 || typeof token !== "string" || token.length > 12000) throw new Error("trusted LeetCode evidence is not configured or missing");
  const { body, sig } = JSON.parse(token);
  if (typeof body !== "string" || !/^[a-f0-9]{64}$/.test(sig)) throw new Error("invalid LeetCode evidence");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const bytes = Uint8Array.from(sig.match(/../g) as string[], (s) => parseInt(s, 16));
  if (!await crypto.subtle.verify("HMAC", key, bytes, enc.encode(body))) throw new Error("LeetCode evidence signature does not match");
  return JSON.parse(body);
}
export async function validateCodingItem(id: string, item: Record<string, unknown>, secret: string): Promise<void> {
  const track = codingTrack(id);
  if (!track) {
    if (item.track === "blind75" || item.track === "potd") throw new Error("coding track requires its own id prefix");
    return;
  }
  if (item.track !== track || item.id !== id || !/^[bp]\d{2,4}$/.test(id)) throw new Error("coding id and track mismatch");
  if (typeof item.solution_code !== "string" || !item.solution_code.trim()) throw new Error("accepted solution_code is missing");
  const p = await readEvidence(item.accepted_proof, secret);
  const problem = item.problem as Record<string, unknown> | undefined;
  if (p.v !== 1 || p.kind !== "accepted" || p.item !== id || p.track !== track || p.status !== "Accepted" || p.language !== "python3" || !/^\d+$/.test(String(p.submission_id)) || !problem || p.slug !== problem.slug || p.question_id !== problem.question_id || p.code_sha256 !== await codeHash(item.solution_code)) throw new Error("Accepted evidence does not match this problem and exact code");
  if (track === "potd" && (p.challenge_date !== item.challenge_date || potdId(String(p.challenge_date)) !== id)) throw new Error("POTD date and Accepted evidence mismatch");
  if (track === "blind75" && (!/^b\d{3}$/.test(id) || Number(id.slice(1)) < 1 || Number(id.slice(1)) > 75 || item.position !== Number(id.slice(1)))) throw new Error("Blind 75 position mismatch");
  const target = Number(item.length_target_s);
  if (!Number.isFinite(target) || target < 60 || target > 120) throw new Error("coding reels must target 60–120 seconds");
  const beats = item.teaching as Record<string, unknown> | undefined;
  if (!beats || TEACHING_BEATS.some((k) => typeof beats[k] !== "string" || String(beats[k]).trim().split(/\s+/).length < 5)) throw new Error("teach problem, brute force, its bottleneck, optimization reasoning, dry run and complexity");
}
