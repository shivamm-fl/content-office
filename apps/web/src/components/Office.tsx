import type { Usage } from "@office/protocol";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Office } from "../store";
import { AgentSheet } from "./AgentSheet";
import { Avatar, level } from "./Avatar";
import { dayReels } from "./Chat";
import { EmptyFloor, Floor } from "./Floor";
import { Empty, agentOf, go, isActive, timeAgo } from "./ui";
import "./OfficeScene.css";

const OfficeScene = lazy(() => import("./OfficeScene"));
const VIEW_KEY = "office.view";
const savedView = (): "2d" | "3d" => { try { return localStorage.getItem(VIEW_KEY) === "2d" ? "2d" : "3d"; } catch { return "3d"; } };
function canShow3D() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) || (nav.deviceMemory && nav.deviceMemory <= 2)) return false;
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch { return false; }
}

function UsageMeter({ usage, onResume }: { usage: Usage | null; onResume: () => Promise<unknown> }) {
  const [busy, setBusy] = useState(false);
  if (usage?.status === "rejected") return <section className="hud-panel usage-alert">
    <div className="eyebrow">POWER · LIMIT REACHED</div>
    <p>Claude usage limit reached{usage.five_hour_resets ? `, resets ${new Date(usage.five_hour_resets).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}` : ""}. New work waits until then.</p>
    <button disabled={busy} onClick={async () => { setBusy(true); try { await onResume(); } finally { setBusy(false); } }} className="hud-outline">{busy ? "Resuming…" : "I switched accounts: resume now"}</button>
  </section>;
  if (!usage || (usage.five_hour == null && usage.seven_day == null)) return null;
  return <section className="hud-panel power-panel" title="Claude subscription usage, as reported by the last run">
    <div className="eyebrow">◇ CLAUDE POWER</div>
    {([["5 hour energy", usage.five_hour, usage.five_hour_resets], ["Week reserve", usage.seven_day, usage.seven_day_resets]] as const).map(([label, value, reset]) => value == null ? null :
      <div className="power-row" key={label}><div><span>{label}</span><strong>{Math.round(value * 100)}%</strong></div><div className="power-track"><i style={{ width: `${Math.min(100, value * 100)}%`, background: value >= .9 ? "#f07f6a" : value >= .7 ? "#f2b544" : "#8bdfa9" }} /></div>{reset ? <small>Resets {new Date(reset).toLocaleTimeString(undefined, { weekday: label === "Week reserve" ? "short" : undefined, hour: "2-digit", minute: "2-digit" })}</small> : null}</div>)}
  </section>;
}

export function OfficeView({ office, teams, onSwitch }: { office: Office; teams: { slug: string; name: string }[]; onSwitch: (slug: string) => void }) {
  const state = office.state!;
  const { team } = state;
  const [sheet, setSheet] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [view, setView] = useState<"2d" | "3d">(savedView);
  const [available, setAvailable] = useState(false);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const prior = useRef<{ ready: number; levels: Record<string, number> } | null>(null);
  useEffect(() => {
    const test = () => setAvailable(canShow3D());
    test();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener?.("change", test);
    return () => media.removeEventListener?.("change", test);
  }, []);
  const setMode = (mode: "2d" | "3d") => { setView(mode); try { localStorage.setItem(VIEW_KEY, mode); } catch { /* session only */ } };
  const syncThreads = new Set(state.threads.filter((t) => t.kind === "sync").map((t) => t.id));
  const syncRun = state.runs.find((r) => r.thread_id && syncThreads.has(r.thread_id) && isActive(r));
  const openDay = state.threads.find((t) => t.kind === "workday" && !t.done_at && (state.runs.some((r) => r.thread_id === t.id && isActive(r)) || dayReels(state, t.id).some((x) => x.active)));
  const latestDay = openDay ?? state.threads.find((t) => t.kind === "workday");
  const dayProgress = latestDay ? dayReels(state, latestDay.id) : [];
  const ready = dayProgress.filter((x) => x.ready).length;
  const waiting = state.asks.length + state.tasks.length;
  const working = state.desks.filter((d) => d.status === "working").length;
  const studioRuns = state.runs.filter((r) => r.profile === "studio" && isActive(r));
  useEffect(() => {
    const levels = Object.fromEntries(state.desks.map((d) => [d.agent, level(d.done).lv]));
    if (prior.current) {
      const raised = state.desks.find((d) => level(d.done).lv > (prior.current!.levels[d.agent] ?? 1));
      if (raised) setCelebrate(`${agentOf(team, raised.agent).name} reached level ${level(raised.done).lv}`);
      else if (ready > prior.current.ready) setCelebrate("A reel is ready for your review");
    }
    prior.current = { ready, levels };
  }, [state.desks, ready, team]);
  useEffect(() => { if (!celebrate) return; const t = setTimeout(() => setCelebrate(null), 3200); return () => clearTimeout(t); }, [celebrate]);
  const startDay = async () => {
    if (openDay) return go(`#/t/${openDay.id}`);
    setStarting(true);
    try { const r = await office.startDay(); go(`#/t/${r.thread.id}`); }
    catch (e) { setNote((e as Error).message); }
    finally { setStarting(false); }
  };
  const callSync = async () => {
    if (syncRun?.thread_id) return go(`#/t/${syncRun.thread_id}`);
    setSyncing(true);
    try { const r = await office.startSync(); go(`#/t/${r.thread.id}`); }
    catch (e) { setNote((e as Error).message); }
    finally { setSyncing(false); }
  };
  return <div className="office-page">
    <header className="office-header safe-top">
      <div className="brand-lockup"><span className="brand-mark">▦</span><span><span className="eyebrow">YOUR COMPANY · CONTROL ROOM</span><h1>Content Office</h1></span></div>
      <span className={`connection-pill ${office.connected ? "online" : ""}`}><i />{office.connected ? "LIVE OFFICE" : "RECONNECTING"}</span>
    </header>
    <div className="floor-select"><div className="floor-select-label">SELECT FLOOR <span>↗</span></div><div className="floor-select-list" role="navigation" aria-label="Floors">{teams.map((t, i) => <button key={t.slug} onClick={() => onSwitch(t.slug)} aria-current={t.slug === team.slug ? "true" : undefined} className={t.slug === team.slug ? "active" : ""}><span>0{i + 1}</span>{t.name}</button>)}</div></div>
    <div className="office-heading"><div><div className="eyebrow">FLOOR / {team.slug.toUpperCase()}</div><h2>{team.name}</h2><p>{team.handles.map((h) => h.handle).join(" · ")}</p></div><div className="floor-stats"><span><b>{team.agents.length}</b> AGENTS</span><span><b>{working}</b> WORKING</span><span><b>{waiting}</b> WAITING</span></div></div>
    <div className="office-grid"><div className="office-main">
      <div className="scene-bar"><div><span className="eyebrow">01 / LIVE FLOOR</span><strong>Your office, right now</strong></div><div className="view-switch" aria-label="Office view"><button onClick={() => setMode("3d")} disabled={!available} aria-pressed={view === "3d" && available} title={!available ? "3D is unavailable on this device" : undefined}>3D</button><button onClick={() => setMode("2d")} aria-pressed={view === "2d" || !available}>2D</button></div></div>
      {view === "3d" && available ? <Suspense fallback={<div className="scene-loading">Opening the floor…</div>}><OfficeScene state={state} syncRun={syncRun} onOpenAgent={setSheet} /></Suspense> : <div className="flat-floor"><Floor state={state} onOpenAgent={setSheet} onSync={callSync} syncRun={syncRun} syncing={syncing} /><p className="flat-hint">{available ? "2D view" : "2D view for this device"} · Tap a teammate to open their profile.</p></div>}
      <div className="roster-wrap hud-panel"><div className="section-heading"><span><span className="eyebrow">02 / THE TEAM</span><h3>On this floor</h3></span><span className="section-count">{team.agents.length} teammates</span></div><div className="roster-list">{team.agents.map((a) => { const d = state.desks.find((desk) => desk.agent === a.slug); const lv = level(d?.done); return <button key={a.slug} onClick={() => setSheet(a.slug)} className="roster-person"><Avatar color={a.color} status={d?.status} size={35} /><span className="roster-name"><b>{a.name}</b><small>{d?.activity ?? a.title}</small></span><span className={`status-chip ${d?.status ?? "idle"}`}>{d?.status ?? "idle"}</span><span className="roster-level">LV {lv.lv}</span></button>; })}</div></div>
      <EmptyFloor onClick={() => setNote("Adding a team for another handle is the next step of the office. Tell me the handle when you are ready.")} />
    </div><aside className="office-sidebar">
      <button onClick={startDay} disabled={starting} className="start-action"><span className="start-symbol">✦</span><span><small>DAILY OPERATION</small><strong>{openDay ? "The work day is running" : starting ? "Starting the day…" : "Start the day"}</strong><em>{openDay ? (dayProgress.length ? `${ready} of ${dayProgress.length} reels ready · Open work day` : "Open the work day") : `${team.pace ?? 6} reels · Plan, write and build`}</em></span><b>↗</b></button>
      <section className="hud-panel quest-panel"><div className="section-heading"><span><span className="eyebrow">{openDay ? "TODAY'S QUEST" : latestDay ? "LATEST WORK DAY" : "DAILY QUEST"}</span><h3>Reel board</h3></span><span className="quest-progress">{ready}/{dayProgress.length || (team.daily ? Object.values(team.daily).reduce((a, b) => a + b, 0) : team.pace ?? 6)}</span></div><div className="quest-track"><i style={{ width: `${dayProgress.length ? ready / dayProgress.length * 100 : 0}%` }} /></div>{dayProgress.length ? <ul className="quest-items">{dayProgress.map((r) => <li key={r.thread.id}><button onClick={() => go(`#/t/${r.thread.id}`)}><span className={r.ready ? "quest-done" : "quest-dot"}>{r.ready ? "✓" : ""}</span><span><b>{r.thread.item ?? r.thread.title}</b><small>{r.thread.title.replace(/^Build \w+:\s*/, "")}</small></span><em>{r.label}</em></button></li>)}</ul> : <p className="quest-empty">{latestDay ? "The team is planning the reel slate." : "Start the day to fill this board."}</p>}</section>
      <div className="side-actions"><button onClick={callSync} disabled={syncing} className="hud-panel side-action"><span className="side-icon">◌</span><span><b>{syncRun ? "Join the sync" : syncing ? "Calling…" : "Call daily sync"}</b><small>{syncRun ? "Meeting in progress" : "Gather the team"}</small></span><em>↗</em></button><button onClick={() => go("#/inbox")} className="hud-panel side-action"><span className="side-icon inbox">▤</span><span><b>Reception inbox</b><small>{waiting ? `${waiting} need your decision` : "All clear"}</small></span><em>{waiting}</em></button></div>
      {studioRuns.length > 0 && <section className="hud-panel studio-panel"><div className="eyebrow">STUDIO CONVEYOR</div>{studioRuns.map((r) => <button key={r.id} onClick={() => r.thread_id && go(`#/t/${r.thread_id}`)}><b>{r.item ?? "Reel"}</b><span>{r.status === "queued" ? "waiting" : r.stage ?? "build"}</span></button>)}</section>}
      <UsageMeter usage={state.usage} onResume={office.resume} />
      <section className="hud-panel trophies"><div className="eyebrow">TROPHY SHELF · WORK DONE</div><div>{[...team.agents].sort((a, b) => (state.desks.find((d) => d.agent === b.slug)?.done ?? 0) - (state.desks.find((d) => d.agent === a.slug)?.done ?? 0)).slice(0, 3).map((a, i) => { const done = state.desks.find((d) => d.agent === a.slug)?.done ?? 0; return <button key={a.slug} onClick={() => setSheet(a.slug)}><span className="trophy-place">0{i + 1}</span><Avatar color={a.color} size={29} /><span><b>{a.name}</b><small>LV {level(done).lv} · {done} XP</small></span></button>; })}</div></section>
    </aside></div>
    <section className="hud-panel conversations"><div className="section-heading"><span><span className="eyebrow">03 / COMMS</span><h3>Conversations</h3></span><button onClick={() => go(`#/new/${team.lead}`)} className="hud-outline">+ New chat</button></div>{state.threads.length === 0 ? <Empty>No conversations yet. Tap the Producer and give the team its first job, for example “Plan three reels for this week”.</Empty> : <ul>{state.threads.map((t) => { const a = agentOf(team, t.agent); const run = state.runs.find((r) => r.id === t.last_run); const live = run && isActive(run); return <li key={t.id}><button onClick={() => go(`#/t/${t.id}`)}><Avatar color={a.color} size={32} /><span><b>{t.title}</b><small>{a.name}: {t.preview ?? ""}</small></span><em className={live ? "text-gold" : ""}>{live ? "OPEN" : timeAgo(t.updated_at)}</em></button></li>; })}</ul>}</section>
    {note && <p className="office-note" role="status">{note}</p>}
    {celebrate && <div className="office-celebration" role="status"><span>✦</span>{celebrate}<i /><i /><i /></div>}
    {sheet && <AgentSheet state={state} slug={sheet} onClose={() => setSheet(null)} />}
  </div>;
}
