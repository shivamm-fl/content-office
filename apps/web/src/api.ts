import type { DeployInfo, ProposalDetail, ProposalsState } from "@office/protocol";

export class AuthError extends Error {}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const r = await fetch(path, {
    credentials: "same-origin",
    ...rest,
    headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...(rest.headers ?? {}) },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  if (r.status === 401) throw new AuthError("login required");
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((body as { error?: string }).error ?? `request failed (${r.status})`);
  return body as T;
}

const proposalPath = (run: string) => `/api/company/proposals/${encodeURIComponent(run)}`;

export const companyApi = {
  proposals: () => api<ProposalsState>("/api/company/proposals"),
  proposal: (run: string) => api<ProposalDetail>(proposalPath(run)),
  merge: (run: string) => api<{ ok: true; commit: string; needs_deploy: boolean }>(`${proposalPath(run)}/merge`, { method: "POST" }),
  reject: (run: string) => api<{ ok: true }>(`${proposalPath(run)}/reject`, { method: "POST" }),
  deploy: () => api<DeployInfo>("/api/company/deploy"),
  startDeploy: () => api<{ ok: true }>("/api/company/deploy", { method: "POST" }),
};
