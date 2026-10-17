// Live office state: one REST snapshot plus the team room's WebSocket events.
import type { Ask, Message, OfficeState, RoomEvent, Run, Task, Thread } from "@office/protocol";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { api } from "./api";

export interface ThreadData { thread: Thread; messages: Message[]; runs: Run[] }
export interface Delta { key: string; run_id: string; agent: string; parent: string | null; text: string }
interface S {
  state: OfficeState | null;
  threads: Record<string, ThreadData>;
  deltas: Record<string, Delta[]>;
  connected: boolean;
}
type A =
  | { type: "room"; ev: RoomEvent }
  | { type: "thread"; data: ThreadData }
  | { type: "connected"; value: boolean };

const upsert = <T extends { id: string }>(list: T[], item: T, sort?: (a: T, b: T) => number) => {
  const i = list.findIndex((x) => x.id === item.id);
  const next = i >= 0 ? list.map((x, j) => (j === i ? item : x)) : [item, ...list];
  return sort ? next.sort(sort) : next;
};

function reduce(s: S, a: A): S {
  if (a.type === "connected") return { ...s, connected: a.value };
  if (a.type === "thread") return { ...s, threads: { ...s.threads, [a.data.thread.id]: a.data } };
  const ev = a.ev;
  if (ev.t === "state") return { ...s, state: ev.state };
  if (ev.t === "delta") {
    const key = `${ev.run_id}|${ev.agent}|${ev.parent ?? ""}`;
    const list = s.deltas[ev.thread_id] ?? [];
    const i = list.findIndex((d) => d.key === key);
    const next = i >= 0 ? list.map((d, j) => (j === i ? { ...d, text: d.text + ev.text } : d)) : [...list, { key, run_id: ev.run_id, agent: ev.agent, parent: ev.parent, text: ev.text }];
    return { ...s, deltas: { ...s.deltas, [ev.thread_id]: next } };
  }
  if (ev.t === "message" || ev.t === "message_update") {
    const m = ev.message;
    const td = s.threads[m.thread_id];
    let deltas = s.deltas;
    if (m.kind === "text" && m.author.startsWith("agent:")) {
      const key = `${m.run_id}|${m.author.slice(6)}|${m.parent ?? ""}`;
      deltas = { ...deltas, [m.thread_id]: (deltas[m.thread_id] ?? []).filter((d) => d.key !== key) };
    }
    if (!td) return { ...s, deltas };
    const messages = ev.t === "message" && !td.messages.some((x) => x.id === m.id) ? [...td.messages, m] : td.messages.map((x) => (x.id === m.id ? m : x));
    return { ...s, deltas, threads: { ...s.threads, [m.thread_id]: { ...td, messages } } };
  }
  if (!s.state) return s;
  const st = s.state;
  switch (ev.t) {
    case "desk":
      return { ...s, state: { ...st, desks: [...st.desks.filter((d) => d.agent !== ev.desk.agent), ev.desk] } };
    case "run": {
      const runs = upsert(st.runs, ev.run, (x, y) => y.created_at - x.created_at);
      const td = ev.run.thread_id ? s.threads[ev.run.thread_id] : undefined;
      const threads = td ? { ...s.threads, [td.thread.id]: { ...td, runs: upsert(td.runs, ev.run, (x, y) => x.created_at - y.created_at) } } : s.threads;
      let deltas = s.deltas;
      if (ev.run.thread_id && !["live", "starting", "queued"].includes(ev.run.status)) deltas = { ...deltas, [ev.run.thread_id]: [] };
      return { ...s, threads, deltas, state: { ...st, runs } };
    }
    case "ask": {
      const asks: Ask[] = ev.ask.status === "pending" ? upsert(st.asks, ev.ask) : st.asks.filter((x) => x.id !== ev.ask.id);
      return { ...s, state: { ...st, asks } };
    }
    case "task": {
      const tasks: Task[] = ev.task.status === "proposed" ? upsert(st.tasks, ev.task) : st.tasks.filter((x) => x.id !== ev.task.id);
      return { ...s, state: { ...st, tasks } };
    }
    case "thread": {
      const threads = upsert(st.threads, ev.thread, (x, y) => y.updated_at - x.updated_at);
      const td = s.threads[ev.thread.id];
      return { ...s, state: { ...st, threads }, threads: td ? { ...s.threads, [ev.thread.id]: { ...td, thread: ev.thread } } : s.threads };
    }
    case "usage":
      return { ...s, state: { ...st, usage: ev.usage } };
  }
  return s;
}

export function useOffice(team: string, onAuthLost: () => void) {
  const [s, dispatch] = useReducer(reduce, { state: null, threads: {}, deltas: {}, connected: false });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let closed = false;
    let retry = 1000;
    let ping: ReturnType<typeof setInterval> | undefined;
    const connect = () => {
      const ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/api/teams/${team}/ws`);
      wsRef.current = ws;
      ws.onopen = () => { retry = 1000; dispatch({ type: "connected", value: true }); ping = setInterval(() => ws.readyState === 1 && ws.send("ping"), 25000); };
      ws.onmessage = (m) => { if (m.data !== "pong") dispatch({ type: "room", ev: JSON.parse(m.data) as RoomEvent }); };
      ws.onclose = async () => {
        clearInterval(ping);
        dispatch({ type: "connected", value: false });
        if (closed) return;
        const ok = await fetch("/api/me", { credentials: "same-origin" }).then((r) => r.status !== 401).catch(() => true);
        if (!ok) return onAuthLost();
        setTimeout(connect, (retry = Math.min(retry * 2, 15000)));
      };
    };
    connect();
    const onVisible = () => { if (document.visibilityState === "visible" && wsRef.current?.readyState !== 1) { wsRef.current?.close(); } };
    document.addEventListener("visibilitychange", onVisible);
    return () => { closed = true; document.removeEventListener("visibilitychange", onVisible); wsRef.current?.close(); };
  }, [team, onAuthLost]);

  const loadThread = useCallback(async (id: string) => {
    const data = await api<ThreadData>(`/api/teams/${team}/threads/${id}`);
    dispatch({ type: "thread", data });
    return data;
  }, [team]);

  const send = useCallback((body: { thread_id?: string; agent?: string; text: string }) =>
    api<{ thread: Thread; message: Message }>(`/api/teams/${team}/messages`, { method: "POST", json: body }), [team]);
  const answer = useCallback((askId: string, ans: Record<string, unknown>) =>
    api<Ask>(`/api/teams/${team}/asks/${askId}`, { method: "POST", json: ans }), [team]);
  const stop = useCallback((runId: string, mode: "interrupt" | "end") =>
    api<Run>(`/api/teams/${team}/runs/${runId}/stop`, { method: "POST", json: { mode } }), [team]);
  const startSync = useCallback(() => api<{ thread: Thread }>(`/api/teams/${team}/sync`, { method: "POST", json: {} }), [team]);
  const resume = useCallback(() => api<{ started: number }>(`/api/teams/${team}/resume`, { method: "POST", json: {} }), [team]);
  const startDay = useCallback(() => api<{ thread: Thread }>(`/api/teams/${team}/day`, { method: "POST", json: {} }), [team]);
  const taskAction = useCallback((taskId: string, action: "start" | "dismiss") =>
    api<Task>(`/api/teams/${team}/tasks/${taskId}`, { method: "POST", json: { action } }), [team]);

  return { ...s, loadThread, send, answer, stop, taskAction, startSync, startDay, resume };
}

export type Office = ReturnType<typeof useOffice>;
