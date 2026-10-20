import type { DeployInfo, ProposalDetail, ProposalsState } from "@office/protocol";
import { useEffect, useState } from "react";
import { companyApi } from "../api";
import { Empty, Markdown, Screen, go, timeAgo } from "./ui";

const deploying = (d: DeployInfo | null) => d?.status === "queued" || d?.status === "running";

function DeployStatus({ deploy }: { deploy: DeployInfo | null }) {
  if (!deploy || !["queued", "running", "failure"].includes(deploy.status)) return null;
  const failed = deploy.status === "failure";
  return (
    <p className={`rounded-xl border px-3.5 py-3 text-sm ${failed ? "border-coral/60 text-coral" : "border-wall bg-desk text-dim"}`}>
      Deploy {failed ? "failed" : deploy.status === "queued" ? "queued" : "running"}.
      {deploy.run_url && <a href={deploy.run_url} target="_blank" rel="noreferrer" className="ml-2 underline underline-offset-2">View run</a>}
    </p>
  );
}

function ConfirmSheet({ action, busy, onClose, onConfirm }: { action: "merge" | "reject"; busy: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60" onClick={busy ? undefined : onClose} role="dialog" aria-modal="true" aria-label={action === "merge" ? "Confirm merge" : "Confirm rejection"}>
      <div onClick={(e) => e.stopPropagation()} className="safe-bottom sheet-in w-full max-w-xl rounded-t-2xl border-t border-wall bg-desk px-5 pt-4">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-wall" aria-hidden />
        <h2 className="text-lg font-semibold">{action === "merge" ? "Approve and merge?" : "Reject this proposal?"}</h2>
        <p className="mt-2 text-sm leading-relaxed text-dim">{action === "merge" ? "This merges the proposal into main." : "This deletes the proposal branch."}</p>
        <div className="mt-5 flex gap-2 pb-2">
          <button disabled={busy} onClick={onClose} className="min-h-12 flex-1 rounded-xl border border-wall px-3 font-medium">Cancel</button>
          <button disabled={busy} onClick={onConfirm} className={`min-h-12 flex-1 rounded-xl px-3 font-semibold ${action === "merge" ? "bg-gold text-ink" : "bg-coral text-ink"}`}>
            {busy ? "Working…" : action === "merge" ? "Merge into main" : "Delete branch"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProposalList() {
  const [state, setState] = useState<ProposalsState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let live = true;
    setError(null);
    companyApi.proposals().then((r) => { if (live) setState(r); }).catch((e) => { if (live) setError((e as Error).message); });
    return () => { live = false; };
  }, [retry]);
  useEffect(() => {
    if (!deploying(state?.deploy ?? null)) return;
    const timer = setInterval(() => {
      companyApi.deploy().then((deploy) => setState((s) => s ? { ...s, deploy: deploy.status === "none" ? s.deploy : deploy } : s)).catch(() => {});
    }, 5000);
    return () => clearInterval(timer);
  }, [state?.deploy?.status]);

  return (
    <Screen title="Proposals">
      <div className="space-y-3 px-4 py-4 pb-8">
        <DeployStatus deploy={state?.deploy ?? null} />
        {error && <div className="rounded-xl border border-coral/50 p-4 text-sm text-coral">{error}<button onClick={() => setRetry((n) => n + 1)} className="ml-3 underline">Try again</button></div>}
        {!state && !error && <p className="py-10 text-center text-sm text-dim">Loading proposals…</p>}
        {state?.proposals.length === 0 && <Empty>Nothing is waiting for you.</Empty>}
        {state && state.proposals.length > 0 && <ul className="space-y-2.5">
          {state.proposals.map((p) => (
            <li key={p.run_id}>
              <button onClick={() => go(`#/proposals/${encodeURIComponent(p.run_id)}`)} className="min-h-28 w-full rounded-xl border border-wall bg-desk p-3.5 text-left">
                <div className="flex items-start justify-between gap-3"><span className="min-w-0 font-semibold leading-snug">{p.title}</span><span className="shrink-0 text-xs text-dim">{timeAgo(p.updated_at)}</span></div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="rounded-md bg-wall px-2 py-1 text-paper">{p.team ?? "company"}</span>
                  <span className="rounded-md bg-wall px-2 py-1 text-dim">{p.kind}</span>
                  {p.needs_deploy && <span className="rounded-md border border-gold/50 px-2 py-1 text-gold">needs deploy</span>}
                  {p.behind_by > 0 && <span className="rounded-md border border-coral/50 px-2 py-1 text-coral">main moved</span>}
                </div>
                <p className="mt-2 text-xs text-dim">{p.files} {p.files === 1 ? "file" : "files"} <span className="text-gold">+{p.additions}</span> <span className="text-coral">-{p.deletions}</span></p>
              </button>
            </li>
          ))}
        </ul>}
      </div>
    </Screen>
  );
}

function ProposalPage({ run }: { run: string }) {
  const [proposal, setProposal] = useState<ProposalDetail | null>(null);
  const [activeRuns, setActiveRuns] = useState(0);
  const [deploy, setDeploy] = useState<DeployInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"merge" | "reject" | null>(null);
  const [busy, setBusy] = useState(false);
  const [merged, setMerged] = useState(false);
  const [needsDeploy, setNeedsDeploy] = useState(false);
  const [deployBusy, setDeployBusy] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(null);
    companyApi.proposal(run).then((r) => { if (live) setProposal(r); }).catch((e) => { if (live) setError((e as Error).message); }).finally(() => { if (live) setLoading(false); });
    companyApi.proposals().then((r) => { if (live) setActiveRuns(r.active_runs); }).catch(() => {});
    return () => { live = false; };
  }, [run, retry]);
  useEffect(() => {
    if (!deploying(deploy)) return;
    const timer = setInterval(() => companyApi.deploy().then((d) => { if (d.status !== "none") setDeploy(d); }).catch(() => {}), 5000);
    return () => clearInterval(timer);
  }, [deploy?.status]);

  const confirm = async () => {
    if (!action || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (action === "reject") { await companyApi.reject(run); go("#/proposals"); }
      else {
        const result = await companyApi.merge(run);
        setNeedsDeploy(result.needs_deploy);
        setMerged(true);
        setAction(null);
        if (result.needs_deploy) companyApi.proposals().then((r) => setActiveRuns(r.active_runs)).catch(() => {});
      }
    } catch (e) {
      setError((e as Error).message);
      setAction(null);
    } finally { setBusy(false); }
  };

  const startDeploy = async () => {
    setDeployBusy(true);
    setError(null);
    try {
      await companyApi.startDeploy();
      setDeploy({ status: "queued", run_url: null, commit: null, started_at: Date.now() });
      companyApi.deploy().then((d) => { if (d.status !== "none") setDeploy(d); }).catch(() => {});
    } catch (e) { setError((e as Error).message); }
    finally { setDeployBusy(false); }
  };

  return (
    <Screen title="Proposal" back="#/proposals">
      <div className="space-y-5 px-4 py-4 pb-8">
        {loading && <p className="py-10 text-center text-sm text-dim">Loading proposal…</p>}
        {error && <div className="rounded-xl border border-coral/50 bg-desk p-3.5 text-sm text-coral">{error}{!proposal && <button onClick={() => setRetry((n) => n + 1)} className="ml-3 underline">Try again</button>}</div>}
        {proposal && <>
          <div>
            <h1 className="text-xl font-semibold leading-tight">{proposal.title}</h1>
            <p className="mt-2 text-xs text-dim">{proposal.team ?? "company"} · {proposal.kind} · {timeAgo(proposal.updated_at)}</p>
            {proposal.behind_by > 0 && <p className="mt-2 text-xs text-coral">Main moved {proposal.behind_by} {proposal.behind_by === 1 ? "commit" : "commits"} since this proposal began.</p>}
          </div>
          {(proposal.proposal_md || proposal.summary) && <div className="rounded-xl border border-wall bg-desk p-4 text-sm"><Markdown>{proposal.proposal_md ?? proposal.summary ?? ""}</Markdown></div>}
          <section>
            <h2 className="mb-2 text-sm font-semibold">Files ({proposal.files_list.length})</h2>
            <ul className="space-y-2">
              {proposal.files_list.map((file, i) => <li key={`${file.path}:${i}`}>
                <details className="rounded-xl border border-wall bg-desk">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-sm [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1 break-all font-mono text-xs">{file.path}</span>
                    <span className="shrink-0 text-[11px] text-dim">{file.status}</span>
                    <span className="shrink-0 text-xs"><span className="text-gold">+{file.additions}</span> <span className="text-coral">-{file.deletions}</span></span>
                  </summary>
                  <div className="border-t border-wall">
                    {file.patch ? <pre className="max-h-96 overflow-auto p-3 font-mono text-[11px] leading-relaxed text-dim">{file.patch}</pre>
                      : <p className="p-3 text-xs text-dim">Patch unavailable for this file.</p>}
                  </div>
                </details>
              </li>)}</ul>
          </section>
          {merged ? <section className="rounded-xl border border-gold/50 bg-desk p-4">
            <p className="font-semibold text-gold">Merged into main.</p>
            {needsDeploy && <>
              {activeRuns > 0 && <p className="mt-2 text-sm text-dim">{activeRuns} {activeRuns === 1 ? "session is" : "sessions are"} open; they reconnect after a deploy.</p>}
              <div className="mt-3"><DeployStatus deploy={deploy} /></div>
              {!deploying(deploy) && deploy?.status !== "success" && <button disabled={deployBusy} onClick={startDeploy} className="mt-3 min-h-12 w-full rounded-xl bg-gold px-4 font-semibold text-ink">{deployBusy ? "Starting deploy…" : "Deploy now"}</button>}
              {deploy?.status === "success" && <p className="mt-3 text-sm text-gold">Deploy succeeded.</p>}
            </>}
          </section> : <div className="space-y-2 pt-1">
            <button onClick={() => setAction("merge")} className="min-h-12 w-full rounded-xl bg-gold px-4 font-semibold text-ink">Approve and merge</button>
            <button onClick={() => setAction("reject")} className="min-h-12 w-full rounded-xl border border-coral/60 px-4 font-medium text-coral">Reject</button>
          </div>}
        </>}
      </div>
      {action && <ConfirmSheet action={action} busy={busy} onClose={() => setAction(null)} onConfirm={confirm} />}
    </Screen>
  );
}

export function ProposalsView({ run }: { run: string | null }) {
  return run ? <ProposalPage key={run} run={run} /> : <ProposalList />;
}
