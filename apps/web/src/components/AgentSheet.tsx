// An agent's profile card: level, what they are doing, their skills, and their own chat.
import type { OfficeState } from "@office/protocol";
import { useEffect } from "react";
import { Avatar, level } from "./Avatar";
import { agentOf, go, timeAgo } from "./ui";

export function AgentSheet({ state, slug, onClose }: { state: OfficeState; slug: string; onClose: () => void }) {
  const agent = agentOf(state.team, slug);
  const desk = state.desks.find((d) => d.agent === slug);
  const lv = level(desk?.done);
  const threads = state.threads.filter((t) => t.agent === slug).slice(0, 5);
  const status = desk?.status ?? "idle";
  const doing = status === "idle" ? (agent.desk === "studio" ? "Works in the studio when a build runs." : "At the desk, free.") : desk?.activity ?? status;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/50" onClick={onClose} role="dialog" aria-modal aria-label={agent.name}>
      <div onClick={(e) => e.stopPropagation()} className="agent-sheet safe-bottom sheet-in w-full max-w-xl rounded-t-2xl border-t border-wall bg-desk px-5 pt-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-wall" aria-hidden />
        <button onClick={onClose} className="sheet-close" aria-label="Close agent profile">×</button>
        <div className="flex items-center gap-4">
          <Avatar color={agent.color} status={status} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold leading-tight">{agent.name}</h2>
            <p className="text-sm text-dim">{agent.title}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span>Level {lv.lv}, {lv.title}</span>
            <span className="text-xs text-dim">{desk?.done ?? 0} done, {lv.toNext} to level {lv.lv + 1}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink">
            <div className="h-full rounded-full" style={{ width: `${Math.max(4, lv.progress * 100)}%`, background: agent.color }} />
          </div>
        </div>

        <p className={`mt-4 text-[14px] ${status === "waiting" ? "text-gold" : status === "blocked" ? "text-coral" : ""}`}>{doing}</p>

        {agent.skills && agent.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agent.skills.map((s) => <span key={s} className="rounded-md bg-ink px-2 py-1 text-[12px] text-dim">{s}</span>)}
          </div>
        )}

        <button onClick={() => { onClose(); go(`#/new/${slug}`); }} className="mt-5 w-full rounded-xl bg-gold py-3 font-semibold text-ink">
          Chat with {agent.name}
        </button>

        {threads.length > 0 && (
          <div className="mt-4 pb-2">
            <h3 className="mb-1.5 text-xs text-dim">Your chats with {agent.name}</h3>
            <ul className="divide-y divide-wall">
              {threads.map((t) => (
                <li key={t.id}>
                  <button onClick={() => { onClose(); go(`#/t/${t.id}`); }} className="flex w-full items-baseline gap-2 py-2.5 text-left">
                    <span className="min-w-0 flex-1 truncate text-[14px]">{t.title}</span>
                    <span className="shrink-0 text-[11px] text-dim">{timeAgo(t.updated_at)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="h-3" />
      </div>
    </div>
  );
}
