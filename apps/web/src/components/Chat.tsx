// A conversation with an agent, Claude Code style: streaming text, tool steps, teammate hand-offs,
// questions and approvals inline, Stop while it works.
import type { Ask, Message, Team } from "@office/protocol";
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

export function ChatView({ office, threadId, newAgent }: { office: Office; threadId: string | null; newAgent: string | null }) {
  const state = office.state!;
  const team = state.team;
  const data = threadId ? office.threads[threadId] : undefined;
  const [text, setText] = useState("");
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
