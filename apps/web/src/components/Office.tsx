// The office: the team's floor (rooms, seats, sync room, reception), what is happening now, conversations.
import type { Usage } from "@office/protocol";
import { useState } from "react";
import type { Office } from "../store";
import { AgentSheet } from "./AgentSheet";
import { Avatar } from "./Avatar";
import { EmptyFloor, Floor } from "./Floor";
import { Empty, agentOf, go, isActive, timeAgo } from "./ui";

function UsageMeter({ usage }: { usage: Usage | null }) {
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

export function OfficeView({ office }: { office: Office }) {
  const state = office.state!;
  const { team } = state;
  const [sheet, setSheet] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const syncThreads = new Set(state.threads.filter((t) => t.kind === "sync").map((t) => t.id));
  const syncRun = state.runs.find((r) => r.thread_id && syncThreads.has(r.thread_id) && isActive(r));
  const working = state.desks.filter((d) => d.status !== "idle" && d.activity);

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
            <p className="truncate text-xs text-dim">{team.name}: {team.handles.map((h) => h.handle).join(", ")}</p>
          </div>
          <span className={`text-xs ${office.connected ? "text-dim" : "text-coral"}`}>{office.connected ? "Live" : "Reconnecting"}</span>
        </div>
        <UsageMeter usage={state.usage} />
      </header>

      <div className="mt-4">
        <Floor state={state} onOpenAgent={setSheet} onSync={callSync} syncRun={syncRun} syncing={syncing} />
        {note && <p className="mt-2 text-sm text-coral">{note}</p>}
        <EmptyFloor onClick={() => setNote("Adding a team for another handle is the next step of the office. Tell me the handle when you are ready.")} />
      </div>

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
          <Empty>No conversations yet. Tap the Producer and give the team its first job, for example "Plan three reels for this week".</Empty>
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
