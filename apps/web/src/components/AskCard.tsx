// A question or an approval from an agent. Answered right here; the agent is waiting for it.
import type { Ask, Team } from "@office/protocol";
import { useState } from "react";
import { AgentDot, Markdown, agentOf } from "./ui";

type Mode = null | "edit" | "changes" | "reject";

export function AskCard({ ask, team, onAnswer, compact = false }: {
  ask: Ask; team: Team; onAnswer: (ans: Record<string, unknown>) => Promise<unknown>; compact?: boolean;
}) {
  const agent = agentOf(team, ask.agent);
  const [mode, setMode] = useState<Mode>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(!compact || ask.body.length < 600);
  const pending = ask.status === "pending";

  const submit = async (ans: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    try { await onAnswer(ans); setMode(null); setText(""); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const content = ask.kind === "approval" ? ask.body.replace(/^\[(plan|script|final|other)\]\s*/, "") : ask.body;
  const kindWord = ask.kind === "approval" ? (/^\[(\w+)\]/.exec(ask.body)?.[1] ?? "approval") : "question";

  return (
    <div className={`rounded-xl border ${pending ? "border-gold/70" : "border-wall"} bg-desk`}>
      <div className="flex items-center gap-2 px-4 pt-3 text-xs text-dim">
        <AgentDot color={agent.color} size={8} />
        <span>{agent.name} {ask.kind === "approval" ? `asks you to approve a ${kindWord}` : "asks"}</span>
        {!pending && <span className="ml-auto">{ask.status === "answered" ? "Answered" : "Expired"}</span>}
      </div>
      <div className="px-4 pt-1.5 text-[15px] font-semibold leading-snug">{ask.title}</div>
      {content && (
        <div className="px-4 pt-2 text-[14.5px]">
          {open ? <Markdown>{content}</Markdown> : (
            <button onClick={() => setOpen(true)} className="text-left text-dim">{content.slice(0, 220)}… <span className="text-gold">Show all</span></button>
          )}
        </div>
      )}
      {pending && (
        <div className="space-y-2 px-4 pb-4 pt-3">
          {ask.kind === "question" && (
            <>
              {ask.options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ask.options.map((o) => (
                    <button key={o} disabled={busy} onClick={() => submit({ choice: o, text: o })} className="rounded-full border border-wall bg-ink px-3.5 py-2 text-sm hover:border-gold">{o}</button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder={ask.options.length ? "Or write your answer" : "Your answer"}
                  className="min-w-0 flex-1 rounded-lg border border-wall bg-ink px-3 py-2 text-sm outline-none focus:border-gold" />
                <button disabled={busy || !text.trim()} onClick={() => submit({ text: text.trim() })} className="rounded-lg bg-gold px-3.5 py-2 text-sm font-semibold text-ink">Send</button>
              </div>
            </>
          )}
          {ask.kind === "approval" && mode === null && (
            <div className="grid grid-cols-2 gap-2">
              <button disabled={busy} onClick={() => submit({ decision: "approved", text: "Approved" })} className="rounded-lg bg-gold py-2.5 text-sm font-semibold text-ink">Approve</button>
              <button disabled={busy} onClick={() => { setMode("edit"); setText(content); }} className="rounded-lg border border-wall py-2.5 text-sm">Edit and approve</button>
              <button disabled={busy} onClick={() => setMode("changes")} className="rounded-lg border border-wall py-2.5 text-sm">Ask for changes</button>
              <button disabled={busy} onClick={() => setMode("reject")} className="rounded-lg border border-wall py-2.5 text-sm text-coral">Reject</button>
            </div>
          )}
          {ask.kind === "approval" && mode !== null && (
            <div className="space-y-2">
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={mode === "edit" ? 12 : 4} autoFocus
                placeholder={mode === "changes" ? "What should change?" : mode === "reject" ? "Why (optional)" : ""}
                className="w-full rounded-lg border border-wall bg-ink px-3 py-2 font-sans text-sm leading-relaxed outline-none focus:border-gold" />
              <div className="flex gap-2">
                <button onClick={() => setMode(null)} className="rounded-lg border border-wall px-4 py-2 text-sm">Back</button>
                {mode === "edit" && <button disabled={busy || !text.trim()} onClick={() => submit({ decision: "approved_with_edits", edited: text, text: "Approved with my edits" })} className="flex-1 rounded-lg bg-gold py-2 text-sm font-semibold text-ink">Approve my version</button>}
                {mode === "changes" && <button disabled={busy || !text.trim()} onClick={() => submit({ decision: "changes_requested", notes: text.trim(), text: `Changes: ${text.trim()}` })} className="flex-1 rounded-lg bg-paper py-2 text-sm font-semibold text-ink">Send back</button>}
                {mode === "reject" && <button disabled={busy} onClick={() => submit({ decision: "rejected", notes: text.trim(), text: `Rejected${text.trim() ? `: ${text.trim()}` : ""}` })} className="flex-1 rounded-lg bg-coral py-2 text-sm font-semibold text-ink">Reject</button>}
              </div>
            </div>
          )}
          {error && <p className="text-sm text-coral">{error}</p>}
        </div>
      )}
    </div>
  );
}
