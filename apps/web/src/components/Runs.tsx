// Every GitHub run the office started: what it is doing, how long, what it cost, and Stop.
import type { Run } from "@office/protocol";
import type { Office } from "../store";
import { AgentDot, Empty, RunStatus, Screen, agentOf, duration, go, isActive, timeAgo } from "./ui";

export function RunsView({ office }: { office: Office }) {
  const state = office.state!;
  const runs = state.runs;
  const active = runs.filter(isActive);
  return (
    <Screen title="Runs">
      <div className="px-4 py-4">
        <p className="mb-4 text-[13px] leading-relaxed text-dim">
          Each run is one GitHub Actions job on the public office repo. {active.length ? `${active.length} running now.` : "Nothing is running, so nothing is being used."}
        </p>
        {runs.length === 0 ? <Empty>No runs yet.</Empty> : (
          <ul className="space-y-2.5">
            {runs.map((r: Run) => {
              const a = agentOf(state.team, r.agent);
              const gh = (r as Run & { gh_url?: string }).gh_url;
              return (
                <li key={r.id} className="rounded-xl border border-wall bg-desk p-3.5">
                  <div className="flex items-center gap-2">
                    <AgentDot color={a.color} size={8} />
                    <span className="font-medium">{a.name}</span>
                    <span className="text-xs text-dim">{r.profile}</span>
                    <span className="ml-auto"><RunStatus run={r} /></span>
                  </div>
                  <p className="mt-1.5 text-xs text-dim">
                    Started {timeAgo(r.created_at)}, {duration(r.created_at, r.ended_at)}{r.cost_usd ? `, about $${r.cost_usd.toFixed(2)} of usage` : ""}
                  </p>
                  {r.error && <p className="mt-1.5 text-sm text-coral">{r.error}</p>}
                  <div className="mt-2.5 flex gap-2">
                    {r.thread_id && <button onClick={() => go(`#/t/${r.thread_id}`)} className="rounded-lg border border-wall px-3 py-1.5 text-xs">Conversation</button>}
                    {gh && <a href={gh} target="_blank" rel="noreferrer" className="rounded-lg border border-wall px-3 py-1.5 text-xs">GitHub log</a>}
                    {isActive(r) && <button onClick={() => office.stop(r.id, "end")} className="ml-auto rounded-lg border border-coral/60 px-3 py-1.5 text-xs text-coral">End run</button>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Screen>
  );
}
