// The office floor: who is at which desk, what waits for you, recent conversations.
import type { Desk, OfficeState, TeamAgent, Usage } from "@office/protocol";
import { AgentDot, Empty, agentOf, go, timeAgo } from "./ui";

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
    <div className="mx-4 mt-1 flex gap-4" title="Claude subscription usage, from the last run">
      {bar("5 hours", usage.five_hour, usage.five_hour_resets)}
      {bar("Week", usage.seven_day, usage.seven_day_resets)}
    </div>
  );
}

function DeskTile({ agent, desk, lead }: { agent: TeamAgent; desk: Desk | undefined; lead: boolean }) {
  const status = desk?.status ?? "idle";
  const line = status === "working" ? desk?.activity || "Working"
    : status === "waiting" ? desk?.activity || "Waiting for you"
    : status === "blocked" ? desk?.activity || "Blocked"
    : agent.desk === "studio" ? "Works in the studio" : agent.title;
  return (
    <button
      onClick={() => go(`#/new/${agent.slug}`)}
      style={{ ["--agent" as string]: agent.color }}
      className={`flex min-h-[104px] flex-col rounded-xl border bg-desk p-3 text-left ${status === "waiting" ? "border-gold" : status === "blocked" ? "border-coral" : "border-wall"} ${status === "working" ? "desk-working" : ""}`}
    >
      <div className="flex items-center gap-2">
        <AgentDot color={agent.color} />
        <span className="truncate text-[15px] font-semibold">{agent.name}</span>
        {lead && <span className="ml-auto text-[11px] text-dim">lead</span>}
      </div>
      <p className={`mt-1.5 line-clamp-3 text-[13px] leading-snug ${status === "idle" ? "text-dim" : status === "waiting" ? "text-gold" : status === "blocked" ? "text-coral" : "text-paper"}`}>{line}</p>
    </button>
  );
}

export function OfficeView({ state, connected }: { state: OfficeState; connected: boolean }) {
  const { team } = state;
  const deskOf = (slug: string) => state.desks.find((d) => d.agent === slug);
  const waiting = state.asks.length + state.tasks.length;
  const agents = [...team.agents].sort((a, b) => (a.slug === team.lead ? -1 : b.slug === team.lead ? 1 : 0));

  return (
    <div className="pb-6">
      <header className="safe-top px-4 pb-3">
        <div className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" className="h-9 w-9 rounded-lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold leading-tight">{team.name} office</h1>
            <p className="truncate text-xs text-dim">{team.handles.map((h) => h.handle).join(", ")}</p>
          </div>
          <span className={`text-xs ${connected ? "text-dim" : "text-coral"}`}>{connected ? "Live" : "Reconnecting"}</span>
        </div>
      </header>
      <UsageMeter usage={state.usage} />

      {waiting > 0 && (
        <button onClick={() => go("#/inbox")} className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl bg-gold px-4 py-3 text-left text-ink">
          <span className="font-semibold">{waiting === 1 ? "1 thing waits for you" : `${waiting} things wait for you`}</span>
          <span className="text-sm">Open inbox</span>
        </button>
      )}

      <section className="mt-5 px-4">
        <h2 className="mb-2 text-sm text-dim">The team</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {agents.map((a) => <DeskTile key={a.slug} agent={a} desk={deskOf(a.slug)} lead={a.slug === team.lead} />)}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm text-dim">Conversations</h2>
          <button onClick={() => go(`#/new/${team.lead}`)} className="text-sm text-gold">New</button>
        </div>
        {state.threads.length === 0 ? (
          <Empty>No conversations yet. Tap the Producer to give the team its first job, for example "Plan three reels for this week".</Empty>
        ) : (
          <ul className="divide-y divide-wall overflow-hidden rounded-xl border border-wall bg-desk">
            {state.threads.map((t) => {
              const a = agentOf(team, t.agent);
              const run = state.runs.find((r) => r.id === t.last_run);
              const live = run && ["queued", "starting", "live", "idle", "blocked_limit"].includes(run.status);
              return (
                <li key={t.id}>
                  <button onClick={() => go(`#/t/${t.id}`)} className="flex w-full items-start gap-3 px-3.5 py-3 text-left">
                    <span className="mt-1.5"><AgentDot color={a.color} size={8} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate font-medium">{t.title}</span>
                        <span className="ml-auto shrink-0 text-[11px] text-dim">{live ? "open" : timeAgo(t.updated_at)}</span>
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
    </div>
  );
}
