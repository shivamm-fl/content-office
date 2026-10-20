// A conversation with an agent, Claude Code style: streaming text, tool steps, teammate hand-offs,
// questions and approvals inline, Stop while it works.
import type { Ask, Message, OfficeState, Team } from "@office/protocol";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Delta, Office } from "../store";
import { AskCard } from "./AskCard";
import { AgentDot, Markdown, RunStatus, Screen, agentOf, clock, go, isActive } from "./ui";

function ToolLine({ m }: { m: Message }) {
  const [open, setOpen] = useState(false);
  const b = m.body as { name: string; summary: string; status: string; result?: string };
  const mark = b.status === "running" ? "…" : b.status === "error" ? "✕" : "✓";
  return (
    <div className="font-mono text-[12px] leading-relaxed text-dim">
      <button onClick={() => setOpen(!open)} className="flex w-full gap-2 text-left" aria-expanded={open}>
        <span className={`w-3 shrink-0 ${b.status === "error" ? "text-coral" : ""}`}>{mark}</span>
        <span className="min-w-0 flex-1 truncate">{b.summary || b.name}</span>
      </button>
      {open && b.result && <pre className="ml-5 mt-1 max-h-60 overflow-auto whitespace-pre-wrap rounded-md bg-ink/60 p-2 text-[11px]">{b.result}</pre>}
    </div>
  );
}

function AgentText({ team, author, text, streaming }: { team: Team; author: string; text: string; streaming?: boolean }) {
  const a = agentOf(team, author);
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs text-dim"><AgentDot color={a.color} size={7} />{a.name}</div>
      <div className={`text-[15px] ${streaming ? "caret" : ""}`}><Markdown>{text}</Markdown></div>
    </div>
  );
}

function Handoff({ m, team, children, live }: { m: Message; team: Team; children: Message[]; live: boolean }) {
  const [open, setOpen] = useState(false);
  const b = m.body as { from: string; to: string; agent: string; text: string };
  const to = agentOf(team, b.agent);
  const steps = children.filter((c) => c.kind === "tool").length;
  const last = [...children].reverse().find((c) => c.kind === "text");
  return (
    <div className="rounded-xl border border-wall bg-desk/70" style={{ borderLeft: `3px solid ${to.color}` }}>
      <button onClick={() => setOpen(!open)} className="w-full px-3 py-2.5 text-left" aria-expanded={open}>
        <div className="flex items-center gap-2 text-xs text-dim">
          <span>{b.from} asked {b.to}</span>
          <span className="ml-auto">{live ? "working" : `${steps} step${steps === 1 ? "" : "s"}`}</span>
        </div>
        <p className="mt-1 text-[14px] leading-snug">{b.text}</p>
        {!open && last && <p className="mt-1.5 line-clamp-2 text-[13px] text-dim">{String((last.body as { text?: string }).text ?? "")}</p>}
      </button>
      {open && (
        <div className="space-y-2.5 border-t border-wall px-3 py-3">
          {children.length === 0 && <p className="text-sm text-dim">Nothing yet.</p>}
          {children.map((c) => c.kind === "tool" ? <ToolLine key={c.id} m={c} /> : c.kind === "text" ? <AgentText key={c.id} team={team} author={c.author} text={String((c.body as { text?: string }).text ?? "")} /> : null)}
        </div>
      )}
    </div>
  );
}

/** Where each reel of a work day is: waiting, building, reviewing, fixing, ready for you, or not finished. */
export function dayReels(state: OfficeState, dayId: string) {
  return state.threads.filter((t) => t.kind === "build" && t.day === dayId).map((t) => {
    const run = state.runs.find((r) => r.thread_id === t.id);
    const ready = state.asks.some((a) => a.thread_id === t.id && a.meta?.type === "final");
    let label = "Not started";
    let tone = "text-dim";
    if (ready) { label = "Ready for you"; tone = "text-gold"; }
    else if (run && isActive(run)) {
      label = run.status === "queued" ? "Waiting for a studio slot" : run.status === "starting" ? "Starting the studio"
        : run.stage === "review" ? "Independent review" : run.stage === "fix" ? "Fixing" : "Building";
      tone = "text-paper";
    } else if (run?.status === "done") label = run.summary?.includes("passed") ? "Decided" : "Did not pass the gate";
    else if (run?.status === "cancelled") label = "Cancelled";
    else if (run) { label = "Did not finish"; tone = "text-coral"; }
    return { thread: t, label, tone, ready, active: !!run && isActive(run) };
  });
}

function DayBoard({ state, dayId }: { state: OfficeState; dayId: string }) {
  const reels = dayReels(state, dayId);
  if (!reels.length) return null;
  const ready = reels.filter((r) => r.ready).length;
  return (
    <div className="rounded-xl border border-wall bg-desk">
      <div className="flex items-baseline justify-between px-3.5 pt-3 text-xs text-dim">
        <span>Today's reels</span><span>{ready} of {reels.length} ready</span>
      </div>
      <ul className="divide-y divide-wall">
        {reels.map((r) => (
          <li key={r.thread.id}>
            <button onClick={() => go(`#/t/${r.thread.id}`)} className="flex w-full items-baseline gap-3 px-3.5 py-2.5 text-left">
              <span className="w-11 shrink-0 font-mono text-[12px] text-dim">{r.thread.item}</span>
              <span className="min-w-0 flex-1 truncate text-[14px]">{r.thread.title.replace(/^Build \w+:\s*/, "")}</span>
              <span className={`shrink-0 text-[12px] ${r.tone}`}>{r.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A desk handed a reel to the studio: the brief the studio works from. */
function Brief({ m, team }: { m: Message; team: Team }) {
  const [open, setOpen] = useState(false);
  const b = m.body as { text: string; item_id?: string; title?: string };
  const from = agentOf(team, m.author);
  return (
    <div className="rounded-xl border border-wall bg-desk/70" style={{ borderLeft: `3px solid ${from.color}` }}>
      <button onClick={() => setOpen(!open)} className="w-full px-3 py-2.5 text-left" aria-expanded={open}>
        <div className="flex items-center gap-2 text-xs text-dim"><AgentDot color={from.color} size={7} />{from.name} handed this reel to the studio<span className="ml-auto">{open ? "Hide" : "Brief"}</span></div>
        <p className="mt-1 text-[14px] font-medium">{b.item_id}: {b.title}</p>
      </button>
      {open && <pre className="max-h-96 overflow-auto whitespace-pre-wrap border-t border-wall px-3 py-2 font-sans text-[13px] leading-relaxed">{b.text}</pre>}
    </div>
  );
}

function AnsweredAsk({ m, team, answer }: { m: Message; team: Team; answer: Message | undefined }) {
  const [open, setOpen] = useState(false);
  const b = m.body as { title: string; text: string };
  const a = agentOf(team, m.author);
  const ans = answer?.body as { text?: string; decision?: string } | undefined;
  return (
    <div className="rounded-xl border border-wall bg-desk px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-dim"><AgentDot color={a.color} size={7} />{a.name} {m.kind === "approval" ? "asked for approval" : "asked"}</div>
      <p className="mt-1 font-semibold leading-snug">{b.title}</p>
      {b.text && (open ? <div className="mt-1.5 text-[14px]"><Markdown>{b.text.replace(/^\[(\w+)\]\s*/, "")}</Markdown></div>
        : <button onClick={() => setOpen(true)} className="mt-1 text-sm text-gold">Show</button>)}
      <p className="mt-2 text-sm">{ans ? <>You: <span className="text-gold">{ans.text ?? ans.decision}</span></> : <span className="text-dim">Not answered; the session ended.</span>}</p>
    </div>
  );
}

export function ChatView({ office, threadId, newAgent, initialText = "" }: { office: Office; threadId: string | null; newAgent: string | null; initialText?: string }) {
  const state = office.state!;
  const team = state.team;
  const data = threadId ? office.threads[threadId] : undefined;
  const [text, setText] = useState(initialText);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const stick = useRef(true);

  useEffect(() => {
    if (threadId) office.loadThread(threadId).catch((e) => setError((e as Error).message));
  }, [threadId, office.loadThread, office.connected]);

  const messages = data?.messages ?? [];
  const deltas: Delta[] = threadId ? office.deltas[threadId] ?? [] : [];
  const run = data ? [...data.runs].reverse().find(isActive) ?? data.runs[data.runs.length - 1] : undefined;
  const active = run && isActive(run);
  const agent = agentOf(team, data?.thread.agent ?? newAgent ?? team.lead);

  const { top, children, answers } = useMemo(() => {
    const children = new Map<string, Message[]>();
    const answers = new Map<string, Message>();
    const top: Message[] = [];
    for (const m of messages) {
      if (m.kind === "answer" || m.kind === "decision") { answers.set(String((m.body as { ask_id?: string }).ask_id), m); continue; }
      if (m.parent) { children.set(m.parent, [...(children.get(m.parent) ?? []), m]); continue; }
      top.push(m);
    }
    return { top, children, answers };
  }, [messages]);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages.length, deltas, state.asks.length]);

  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setError(null);
    try {
      const r = await office.send(threadId ? { thread_id: threadId, text: t } : { agent: agent.slug, text: t });
      setText("");
      stick.current = true;
      if (!threadId) go(`#/t/${r.thread.id}`);
      else await office.loadThread(threadId);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const pendingAsk = (m: Message): Ask | undefined => state.asks.find((a) => a.id === (m.body as { ask_id?: string }).ask_id);
  const activeSubagents = new Set(deltas.filter((d) => d.parent).map((d) => d.parent));

  return (
    <Screen
      back="#/"
      title={<span className="flex items-center gap-2"><AgentDot color={agent.color} />{data?.thread.title ?? `New chat with ${agent.name}`}</span>}
      right={run ? <span className="flex items-center gap-2"><RunStatus run={run} />
        {active && <button onClick={() => office.stop(run.id, run.status === "idle" ? "end" : "interrupt")} className="rounded-lg border border-wall px-2.5 py-1 text-xs">{run.status === "idle" ? "End" : "Stop"}</button>}
      </span> : null}
    >
      <div className="flex h-full flex-col">
        <div ref={scroller} onScroll={(e) => { const el = e.currentTarget; stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {team.scope !== "company" && data?.thread.kind === "workday" && threadId && <DayBoard state={state} dayId={threadId} />}
          {team.scope !== "company" && data?.thread.kind === "workday" && data.thread.done_at && <p className="text-center text-xs text-gold">This work day is finished.</p>}
          {!threadId && (
            <div className="rounded-xl border border-wall bg-desk p-4 text-[14px] leading-relaxed text-dim">
              <p className="font-semibold text-paper">{agent.name}</p>
              <p className="mt-1">{agent.title}. Your message wakes {agent.name}'s desk on GitHub; the first reply takes about a minute. After 15 minutes without a message the desk closes, and your next message opens it again with the conversation so far.</p>
            </div>
          )}
          {top.map((m) => {
            if (m.author === "owner") return (
              <div key={m.id} className="ml-10 rounded-2xl rounded-br-md bg-wall px-3.5 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap">{String((m.body as { text?: string }).text)}</div>
            );
            if (m.kind === "system") {
              const b = m.body as { text: string; error?: boolean };
              return <p key={m.id} className={`text-center text-xs leading-relaxed ${b.error ? "text-coral" : "text-dim"}`}>{b.text} <span className="opacity-60">{clock(m.created_at)}</span></p>;
            }
            if (m.kind === "tool") return <ToolLine key={m.id} m={m} />;
            if (m.kind === "brief") return <Brief key={m.id} m={m} team={team} />;
            if (m.kind === "dm") {
              const b = m.body as { from: string; to: string; text: string };
              const from = agentOf(team, b.from);
              const to = agentOf(team, b.to);
              return (
                <div key={m.id} className="ml-3 rounded-xl border border-wall bg-desk/60 px-3 py-2" style={{ borderLeft: `3px solid ${from.color}` }}>
                  <div className="flex items-center gap-1.5 text-xs text-dim">
                    <AgentDot color={from.color} size={7} />{from.name}<span aria-hidden>→</span><AgentDot color={to.color} size={7} />{to.name}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed">{b.text}</p>
                </div>
              );
            }
            if (m.kind === "handoff") {
              const id = String((m.body as { tool_id?: string }).tool_id);
              return <Handoff key={m.id} m={m} team={team} children={children.get(id) ?? []} live={activeSubagents.has(id) || (!!active && !(children.get(id) ?? []).length)} />;
            }
            if (m.kind === "question" || m.kind === "approval") {
              const ask = pendingAsk(m);
              return ask ? <AskCard key={m.id} ask={ask} team={team} onAnswer={async (ans) => { await office.answer(ask.id, ans); if (threadId) await office.loadThread(threadId); }} />
                : <AnsweredAsk key={m.id} m={m} team={team} answer={answers.get(String((m.body as { ask_id?: string }).ask_id))} />;
            }
            return <AgentText key={m.id} team={team} author={m.author} text={String((m.body as { text?: string }).text ?? "")} />;
          })}
          {deltas.filter((d) => !d.parent && d.text.trim()).map((d) => <AgentText key={d.key} team={team} author={d.agent} text={d.text} streaming />)}
          {active && deltas.every((d) => d.parent || !d.text.trim()) && run.status !== "idle" && (
            <p className="text-sm text-dim">{run.status === "starting" ? "Starting the desk on GitHub…" : run.status === "queued" ? "Waiting in the queue…" : "Working…"}</p>
          )}
        </div>
        <div className="safe-bottom border-t border-wall bg-ink px-3 pt-2">
          {error && <p className="px-1 pb-1.5 text-sm text-coral">{error}</p>}
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
              rows={Math.min(6, Math.max(1, text.split("\n").length))}
              placeholder={active ? `Message ${agent.name}` : `Message ${agent.name} (wakes the desk)`}
              className="max-h-40 min-w-0 flex-1 resize-none rounded-xl border border-wall bg-desk px-3.5 py-2.5 text-[15px] leading-snug outline-none focus:border-gold"
            />
            <button onClick={send} disabled={!text.trim() || sending} className="rounded-xl bg-gold px-4 py-2.5 text-[15px] font-semibold text-ink">Send</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
