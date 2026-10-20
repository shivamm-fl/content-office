import type { ProposalKind } from "@office/protocol";

export const validRun = (run: string) => /^run_[A-Za-z0-9]{6,40}$/.test(run);
export const validBranch = (branch: string) => /^proposal\/run_[A-Za-z0-9]{6,40}$/.test(branch);

export function pathKind(path: string): Exclude<ProposalKind, "mixed"> | null {
  if (path === "CLAUDE.md" || path.startsWith("company/") || /^teams\/[^/]+\/(CLAUDE\.md|team\.json|skills-lock\.json|requirements\.txt|\.claude\/|prompts\/|docs-notes\/|scripts\/)/.test(path)) return "rules";
  if (/^(apps|packages|runner|tools|\.github)\//.test(path) || /^(package\.json|pnpm-[^/]+\.yaml|tsconfig[^/]*\.json|wrangler[^/]*\.jsonc?|\.npmrc)$/.test(path)) return "code";
  if (/^teams\/[^/]+\/(state|reels|social|brand|roadmap)\//.test(path)) return "content";
  return null;
}

export function proposalKind(paths: string[]): ProposalKind {
  const kinds = new Set(paths.map(pathKind).filter(Boolean));
  return kinds.size > 1 ? "mixed" : (kinds.values().next().value ?? "content");
}

export const needsDeploy = (paths: string[]) => paths.some((p) => /^(apps|packages|tools)\//.test(p) || /^teams\/[^/]+\/team\.json$/.test(p));

export function markdownTitle(md: string): { title: string | null; summary: string | null } {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  const body = md.replace(/^#\s+.+$/m, "").trim();
  return { title, summary: body ? body.slice(0, 800) : null };
}
