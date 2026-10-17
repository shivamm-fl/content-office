// Verify a GitHub Actions OIDC token: the runner proves it is office-run.yml on main of this repo,
// started by workflow_dispatch from the owner's account. No shared secret lives in the public repo.
import { b64urlDecode } from "./auth";

const ISSUER = "https://token.actions.githubusercontent.com";
let jwksCache: { at: number; keys: JsonWebKey[] } | null = null;

async function jwks(force = false): Promise<JsonWebKey[]> {
  if (!force && jwksCache && Date.now() - jwksCache.at < 3600_000) return jwksCache.keys;
  const r = await fetch(`${ISSUER}/.well-known/jwks`, { headers: { "User-Agent": "content-office" } });
  if (!r.ok) throw new Error(`jwks ${r.status}`);
  const { keys } = (await r.json()) as { keys: JsonWebKey[] };
  jwksCache = { at: Date.now(), keys };
  return keys;
}

export interface GithubClaims {
  repository: string; repository_owner: string; workflow_ref: string; event_name: string;
  actor: string; run_id: string; run_attempt: string; ref: string; sha: string; aud: string; exp: number; iss: string;
}

export async function verifyGithubOidc(
  token: string,
  opts: { audience: string; repo: string; workflowFiles: readonly string[]; actor: string },
): Promise<GithubClaims> {
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) throw new Error("malformed token");
  const header = JSON.parse(new TextDecoder().decode(b64urlDecode(h)));
  if (header.alg !== "RS256") throw new Error("unexpected alg");
  let key = (await jwks()).find((k) => (k as { kid?: string }).kid === header.kid);
  if (!key) key = (await jwks(true)).find((k) => (k as { kid?: string }).kid === header.kid);
  if (!key) throw new Error("unknown key");
  const cryptoKey = await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, b64urlDecode(s), new TextEncoder().encode(`${h}.${p}`));
  if (!ok) throw new Error("bad signature");
  const c = JSON.parse(new TextDecoder().decode(b64urlDecode(p))) as GithubClaims;
  const now = Math.floor(Date.now() / 1000);
  const repo = opts.repo.toLowerCase();
  if (c.iss !== ISSUER) throw new Error("bad issuer");
  if (c.aud !== opts.audience) throw new Error("bad audience");
  if (!c.exp || c.exp < now) throw new Error("expired");
  if (c.repository?.toLowerCase() !== repo) throw new Error("wrong repository");
  const ref = c.workflow_ref?.toLowerCase() ?? "";
  if (!opts.workflowFiles.some((f) => ref.startsWith(`${repo}/.github/workflows/${f}@refs/heads/main`))) throw new Error("wrong workflow");
  if (c.event_name !== "workflow_dispatch") throw new Error("not a dispatch");
  if (c.actor?.toLowerCase() !== opts.actor.toLowerCase()) throw new Error("wrong actor");
  return c;
}
