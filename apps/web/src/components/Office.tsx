// The office: the team's floor (rooms, seats, sync room, reception), what is happening now, conversations.
import type { ProposalsState, Team, Usage } from "@office/protocol";
import { useEffect, useState } from "react";
import { companyApi } from "../api";
import type { Office } from "../store";
import { AgentSheet } from "./AgentSheet";
import { Avatar } from "./Avatar";
import { EmptyFloor, Floor } from "./Floor";
import { dayReels } from "./Chat";
import { Empty, agentOf, go, isActive, timeAgo } from "./ui";

function UsageMeter({ usage, onResume }: { usage: Usage | null; onResume: () => Promise<unknown> }) {
  const [busy, setBusy] = useState(false);
  if (usage?.status === "rejected") {
    return (
      <div className="mt-3 rounded-xl border border-coral/60 bg-desk px-3.5 py-3">
        <p className="text-[13.5px] leading-snug">
          Claude usage limit reached{usage.five_hour_resets ? `, resets ${new Date(usage.five_hour_resets).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}` : ""}. New work waits until then.
        </p>
        <button disabled={busy} onClick={async () => { setBusy(true); try { await onResume(); } finally { setBusy(false); } }}
          className="mt-2 rounded-lg border border-wall px-3 py-1.5 text-[13px]">{busy ? "Resuming…" : "I switched accounts: resume now"}</button>
      </div>
    );
  }
  if (!usage || (usage.five_hour == null && usage.seven_day == null)) return null;
  const bar = (label: string, v: number | null, resets: number | null) => v == null ? null : (
    <div className="flex-1">
      <div className="flex justify-between text-[11px] text-dim">
        <span>{label}</span>
        <span>{Math.round(v * 100)}%{resets ? `, resets ${new Date(resets).toLocaleTimeString(undefined, { weekday: label === "Week" ? "short" : undefined, hour: "2-digit", minute: "2-digit" })}` : ""}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-wall">
        <div className={`h-full rounded-full ${v >= 0.9 ? "bg-coral" : v >= 0.7 ? "bg-gold" : "bg-paper/70"}`} style={{ width: `${Math.min(100, v * 100)}%` }} />
      </div>
    </div>
  );
  return (
    <div className="mt-3 flex gap-4" title="Claude subscription usage, as reported by the last run">
      {bar("Claude, 5 hours", usage.five_hour, usage.five_hour_resets)}
      {bar("Week", usage.seven_day, usage.seven_day_resets)}
    </div>
  );
}

const HQ_STARTS = ["What failed or got stuck recently?", "Check the health of every floor", "Add a new floor …", "Change something in the app …"];

export function OfficeView({ office, teams, onSwitch }: { office: Office; teams: { slug: string; name: string; scope?: Team["scope"] }[]; onSwitch: (slug: string) => void }) {
  const state = office.state!;
  const { team } = state;
  const company = team.scope === "company";
  const [sheet, setSheet] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [proposalCount, setProposalCount] = useState(0);
  useEffect(() => {
    if (company) return;
    let live = true;
    companyApi.proposals().then((r: ProposalsState) => { if (live) setProposalCount(r.proposals.length); }).catch(() => {});
    return () => { live = false; };
  }, [company]);
  const syncThreads = new Set(state.threads.filter((t) => t.kind === "sync").map((t) => t.id));
  const syncRun = state.runs.find((r) => r.thread_id && syncThreads.has(r.thread_id) && isActive(r));
  const working = state.desks.filter((d) => d.status !== "idle" && d.activity);
  const dayThreads = new Set(state.threads.filter((t) => t.kind === "workday").map((t) => t.id));
  // the newest work day that has not finished: its Producer or one of its reels is still working
  const openDay = state.threads.find((t) => t.kind === "workday" && !t.done_at && (state.runs.some((r) => r.thread_id === t.id && isActive(r)) || dayReels(state, t.id).some((x) => x.active)));
  const dayRun = openDay ? { thread_id: openDay.id } : undefined;
  const dayProgress = openDay ? dayReels(state, openDay.id) : [];
  const inStudio = state.runs.filter((r) => r.profile === "studio" && isActive(r));
  const [starting, setStarting] = useState(false);

  const startDay = async () => {
    if (dayRun?.thread_id) return go(`#/t/${dayRun.thread_id}`);
    setStarting(true);
    try {
      const r = await office.startDay();
      go(`#/t/${r.thread.id}`);
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setStarting(false);
    }
  };

  const callSync = async () => {
    setSyncing(true);
    try {
      const r = await office.startSync();
      go(`#/t/${r.thread.id}`);
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="px-4 pb-6">
      <header className="safe-top pb-1">
        <div className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" className="h-9 w-9 rounded-lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold leading-tight">Content office</h1>
            <p className="truncate text-xs text-dim">{company ? team.tagline : `${team.name}: ${(team.handles ?? []).map((h) => h.handle).join(", ")}`}</p>
          </div>
          <span className={`text-xs ${office.connected ? "text-dim" : "text-coral"}`}>{office.connected ? "Live" : "Reconnecting"}</span>
        </div>
        {teams.length > 1 && (
          <nav aria-label="Floors" className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
            {teams.map((t) => (
              <button key={t.slug} onClick={() => onSwitch(t.slug)} aria-current={t.slug === team.slug ? "true" : undefined}
                className={`shrink-0 rounded-xl border px-3 py-1.5 text-[12.5px] ${t.slug === team.slug ? "border-gold bg-desk font-medium text-paper" : "border-wall text-dim"}`}>
                <span className="block">{t.name}</span>{t.scope === "company" && <span className="block text-[10px] leading-tight text-dim">company</span>}
              </button>
            ))}
          </nav>
        )}
        <UsageMeter usage={state.usage} onResume={office.resume} />
      </header>

      {!company && proposalCount > 0 && <button onClick={() => go("#/proposals")} className="mt-3 flex min-h-11 w-full items-center justify-between rounded-lg border border-gold/40 bg-desk px-3.5 text-left text-sm text-gold">Proposals waiting: {proposalCount}<span aria-hidden>›</span></button>}

      {!company && <button onClick={startDay} disabled={starting} className={`mt-4 flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left ${dayRun ? "border border-gold/70 bg-desk" : "bg-gold text-ink"}`}>
        <span>
          <span className="block text-[16px] font-semibold">{dayRun ? "The work day is running" : starting ? "Starting the day…" : "Start the day"}</span>
          <span className={`block text-[12.5px] ${dayRun ? "text-dim" : "text-ink/75"}`}>
            {dayRun ? (dayProgress.length ? `${dayProgress.filter((x) => x.ready).length} of ${dayProgress.length} reels ready, tap to see where each one is` : "Tap to watch the team plan, write and hand reels to the studio") : `${team.pace ?? 6} reels: the team plans, writes and builds; you approve the finished reels`}
          </span>
        </span>
        <span className="text-sm">{dayRun ? "Open" : ""}</span>
      </button>}
      {!company && inStudio.length > 0 && (
        <p className="mt-2 text-[12.5px] text-dim">In the studio now: {inStudio.map((r) => `${r.item ?? "reel"} (${r.status === "queued" ? "waiting" : r.stage ?? "build"})`).join(", ")}</p>
      )}

      <div className="mt-4">
        <Floor state={state} onOpenAgent={setSheet} onSync={callSync} syncRun={syncRun} syncing={syncing} />
        {note && <p className="mt-2 text-sm text-coral">{note}</p>}
        {!company && <EmptyFloor onClick={() => setNote("Adding a team for another handle is the next step of the office. Tell me the handle when you are ready.")} />}
      </div>

      {company && <section className="mt-5">
        <h2 className="mb-2 text-sm text-dim">Ask the CTO</h2>
        <div className="flex flex-wrap gap-2">
          {HQ_STARTS.map((text) => <button key={text} onClick={() => go(`#/new/${team.lead}?text=${encodeURIComponent(text)}`)} className="min-h-11 rounded-full border border-wall bg-desk px-3.5 py-2 text-left text-[13px] leading-snug">{text}</button>)}
        </div>
      </section>}

      {working.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm text-dim">On the floor now</h2>
          <ul className="space-y-1.5">
            {working.map((d) => {
              const a = agentOf(team, d.agent);
              return (
                <li key={d.agent}>
                  <button onClick={() => setSheet(d.agent)} className="flex w-full items-center gap-2.5 text-left">
                    <Avatar color={a.color} status={d.status} size={26} />
                    <span className="min-w-0 flex-1 truncate text-[13.5px]"><span className="font-medium">{a.name}</span> <span className={d.status === "waiting" ? "text-gold" : "text-dim"}>{d.activity}</span></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm text-dim">Conversations</h2>
          <button onClick={() => go(`#/new/${team.lead}`)} className="text-sm text-gold">New</button>
        </div>
        {state.threads.length === 0 ? (
          <Empty>{company ? "No conversations yet. Ask the CTO to check the company or propose a change." : "No conversations yet. Tap the Producer and give the team its first job, for example \"Plan three reels for this week\"."}</Empty>
        ) : (
          <ul className="divide-y divide-wall overflow-hidden rounded-xl border border-wall bg-desk">
            {state.threads.map((t) => {
              const a = agentOf(team, t.agent);
              const run = state.runs.find((r) => r.id === t.last_run);
              const live = run && isActive(run);
              return (
                <li key={t.id}>
                  <button onClick={() => go(`#/t/${t.id}`)} className="flex w-full items-start gap-3 px-3.5 py-3 text-left">
                    <span className="mt-0.5 shrink-0"><Avatar color={a.color} size={26} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate font-medium">{t.kind === "sync" ? t.title : t.title}</span>
                        <span className={`ml-auto shrink-0 text-[11px] ${live ? "text-gold" : "text-dim"}`}>{live ? "open" : timeAgo(t.updated_at)}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[13px] text-dim">{a.name}: {t.preview ?? ""}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      {sheet && <AgentSheet state={state} slug={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}
