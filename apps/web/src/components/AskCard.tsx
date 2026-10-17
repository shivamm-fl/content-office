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

  if (ask.meta?.type === "final") return <FinalReelCard ask={ask} team={team} onAnswer={onAnswer} />;
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

function Fold({ label, children }: { label: string; children: string }) {
  const [open, setOpen] = useState(false);
  if (!children.trim()) return null;
  return (
    <div className="border-t border-wall">
      <button onClick={() => setOpen(!open)} className="flex w-full justify-between px-4 py-2.5 text-left text-sm" aria-expanded={open}>
        <span>{label}</span><span className="text-dim">{open ? "Hide" : "Show"}</span>
      </button>
      {open && <pre className="whitespace-pre-wrap px-4 pb-3 font-sans text-[13.5px] leading-relaxed text-paper/90">{children}</pre>}
    </div>
  );
}

/** A finished reel: watch it, read its texts, then approve, ask for changes (the studio rebuilds) or reject. */
function FinalReelCard({ ask, team, onAnswer }: { ask: Ask; team: Team; onAnswer: (ans: Record<string, unknown>) => Promise<unknown> }) {
  const m = ask.meta!;
  const [mode, setMode] = useState<null | "changes" | "reject">(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = ask.status === "pending";
  const studio = agentOf(team, ask.agent);
  const submit = async (ans: Record<string, unknown>) => {
    setBusy(true); setError(null);
    try { await onAnswer(ans); setMode(null); setNotes(""); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const decided = ask.answer as { decision?: string; notes?: string } | null;
  return (
    <div className={`overflow-hidden rounded-xl border ${pending ? "border-gold/70" : "border-wall"} bg-desk`}>
      <div className="flex items-center gap-2 px-4 pt-3 text-xs text-dim">
        <AgentDot color={studio.color} size={8} /><span>Finished reel from the studio</span>
        {m.duration_s ? <span className="ml-auto">{Math.round(m.duration_s)} s</span> : null}
      </div>
      <div className="px-4 pb-3 pt-1 text-[15px] font-semibold leading-snug">{m.item}: {m.title}</div>
      {m.video_url ? (
        <video src={m.video_url} poster={m.cover_url ?? undefined} controls playsInline preload="metadata" className="mx-auto block max-h-[70vh] w-full bg-black" />
      ) : <p className="px-4 pb-3 text-sm text-coral">The video file is missing.</p>}
      {m.cover_url && (
        <div className="flex gap-3 px-4 py-3">
          <img src={m.cover_url} alt="Instagram cover" className="h-28 rounded-md border border-wall" loading="lazy" />
          {m.thumb_url && <img src={m.thumb_url} alt="YouTube thumbnail" className="h-16 self-start rounded-md border border-wall" loading="lazy" />}
        </div>
      )}
      <Fold label="Instagram caption">{m.caption}</Fold>
      <Fold label="YouTube title and description">{m.youtube}</Fold>
      <Fold label="Script">{m.script}</Fold>
      {pending ? (
        <div className="space-y-2 border-t border-wall px-4 pb-4 pt-3">
          {mode === null ? (
            <div className="grid grid-cols-3 gap-2">
              <button disabled={busy} onClick={() => submit({ decision: "approved", text: "Approved" })} className="rounded-lg bg-gold py-2.5 text-sm font-semibold text-ink">Approve</button>
              <button disabled={busy} onClick={() => setMode("changes")} className="rounded-lg border border-wall py-2.5 text-sm">Changes</button>
              <button disabled={busy} onClick={() => setMode("reject")} className="rounded-lg border border-wall py-2.5 text-sm text-coral">Reject</button>
            </div>
          ) : (
            <>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} autoFocus
                placeholder={mode === "changes" ? "What should the studio change? (e.g. hook 2 s pe aaye, scene C ka picture bada, last line hatao)" : "Why (optional)"}
                className="w-full rounded-lg border border-wall bg-ink px-3 py-2 text-sm leading-relaxed outline-none focus:border-gold" />
              <div className="flex gap-2">
                <button onClick={() => setMode(null)} className="rounded-lg border border-wall px-4 py-2 text-sm">Back</button>
                {mode === "changes"
                  ? <button disabled={busy || !notes.trim()} onClick={() => submit({ decision: "changes_requested", notes: notes.trim(), text: `Changes: ${notes.trim()}` })} className="flex-1 rounded-lg bg-paper py-2 text-sm font-semibold text-ink">Send to the studio</button>
                  : <button disabled={busy} onClick={() => submit({ decision: "rejected", notes: notes.trim(), text: `Rejected${notes.trim() ? `: ${notes.trim()}` : ""}` })} className="flex-1 rounded-lg bg-coral py-2 text-sm font-semibold text-ink">Reject</button>}
              </div>
            </>
          )}
          {error && <p className="text-sm text-coral">{error}</p>}
        </div>
      ) : (
        <p className="border-t border-wall px-4 py-3 text-sm">
          {decided?.decision === "approved" ? <span className="text-gold">Approved</span> : decided?.decision === "changes_requested" ? <>Sent back: <span className="text-dim">{decided.notes}</span></> : decided?.decision === "rejected" ? <span className="text-coral">Rejected</span> : <span className="text-dim">No longer pending</span>}
        </p>
      )}
    </div>
  );
}
