// Everything that waits for the owner: questions, approvals, and tasks agents left for each other.
import type { Office } from "../store";
import { AskCard } from "./AskCard";
import { AgentDot, Empty, Screen, agentOf, go, timeAgo } from "./ui";

export function InboxView({ office }: { office: Office }) {
  const state = office.state!;
  const { team, asks, tasks } = state;
  return (
    <Screen title="Inbox">
      <div className="space-y-6 px-4 py-4">
        {asks.length === 0 && tasks.length === 0 && <Empty>Nothing waits for you. When an agent needs a decision or an approval, it shows up here.</Empty>}
        {asks.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm text-dim">Questions and approvals</h2>
            {asks.map((a) => (
              <div key={a.id}>
                <AskCard ask={a} team={team} compact onAnswer={(ans) => office.answer(a.id, ans)} />
                <button onClick={() => go(`#/t/${a.thread_id}`)} className="mt-1.5 px-1 text-xs text-dim">Open the conversation</button>
              </div>
            ))}
          </section>
        )}
        {tasks.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm text-dim">Tasks between teammates</h2>
            {tasks.map((t) => {
              const from = agentOf(team, t.from_agent);
              const to = agentOf(team, t.to_agent);
              return (
                <div key={t.id} className="rounded-xl border border-wall bg-desk p-4">
                  <div className="flex items-center gap-1.5 text-xs text-dim">
                    <AgentDot color={from.color} size={7} />{from.name} for <AgentDot color={to.color} size={7} />{to.name}
                    <span className="ml-auto">{timeAgo(t.created_at)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed">{t.body}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => office.taskAction(t.id, "start").then((r) => r.thread_id && go(`#/t/${r.thread_id}`))} className="flex-1 rounded-lg bg-gold py-2 text-sm font-semibold text-ink">Start with {to.name}</button>
                    <button onClick={() => office.taskAction(t.id, "dismiss")} className="rounded-lg border border-wall px-4 py-2 text-sm">Dismiss</button>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </Screen>
  );
}
