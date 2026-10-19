import type { OfficeState, Room, Run, TeamAgent } from "@office/protocol";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, level } from "./Avatar";
import { go, isActive } from "./ui";
import "./OfficeScene.css";

type Camera = { turn: number; tilt: number; zoom: number; x: number; y: number };
const initial: Camera = { turn: -12, tilt: 57, zoom: 1, x: 0, y: 0 };
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function Cuboid({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden className={`voxel ${className}`} style={style}><i className="voxel-top" /><i className="voxel-front" /><i className="voxel-side" /></span>;
}

function Plant({ x, y }: { x: number; y: number }) {
  return <span aria-hidden className="scene-plant" style={{ left: x, top: y }}><i /><b /><em /></span>;
}

function Character({ agent, status, activity, done, x, y, onClick }: {
  agent: TeamAgent; status: string; activity: string | null; done: number; x: number; y: number; onClick: () => void;
}) {
  return <button type="button" className={`scene-character status-${status}`} style={{ left: x, top: y, ["--agent" as string]: agent.color }}
    aria-label={`${agent.name}, ${status}${activity ? `, ${activity}` : ""}, level ${level(done).lv}`}
    onClick={(e) => { e.stopPropagation(); onClick(); }}>
    <span className="character-shadow" aria-hidden />
    <span className="character-body"><Avatar color={agent.color} status={status as "idle"} size={37} /></span>
    {status === "waiting" || status === "blocked" ? <span className="character-alert" aria-hidden>!</span> : null}
    <span className="character-label"><b>{agent.name}</b><small>LV {level(done).lv}{status === "working" ? " · WORKING" : status === "waiting" ? " · WAITING" : ""}</small></span>
    {status === "working" && activity && <span className="character-activity">{activity}</span>}
  </button>;
}

function Workstation({ x, y, lit }: { x: number; y: number; lit: boolean }) {
  return <span className="workstation" style={{ left: x, top: y }} aria-hidden>
    <Cuboid className="desk-box" /><Cuboid className="monitor-box" style={{ ["--monitor-glow" as string]: lit ? "#7cc4fa" : "#263950" }} />
    <span className="desk-chair" />
  </span>;
}

function RoomScene({ room, index, agents, state, syncRun, onOpenAgent, onFocus }: {
  room: Room; index: number; agents: TeamAgent[]; state: OfficeState; syncRun?: Run;
  onOpenAgent: (slug: string) => void; onFocus: (index: number) => void;
}) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const attendees = syncRun && isActive(syncRun)
    ? state.team.agents.filter((a) => a.slug === syncRun.agent || state.desks.some((d) => d.agent === a.slug && d.run_id === syncRun.id && d.status !== "idle")) : [];
  const members = room.kind === "meeting" ? attendees : agents;
  const waiting = state.asks.length + state.tasks.length;
  const studioRuns = state.runs.filter((r) => r.profile === "studio" && isActive(r));
  return <div className={`scene-room room-${room.kind ?? room.id} ${agents.length > 3 ? "room-dense" : ""}`} style={{ left: col * 210 + 8, top: row * 156 + 8 }}>
    <button type="button" className="room-hit" onClick={() => room.kind === "reception" ? go("#/inbox") : onFocus(index)}
      aria-label={room.kind === "reception" ? `Reception, ${waiting} waiting, open Inbox` : `Focus ${room.name}`} />
    <span className="room-floor" aria-hidden /><span className="room-wall room-wall-back" aria-hidden /><span className="room-wall room-wall-left" aria-hidden />
    <span className="room-title">{room.name}</span>
    {room.kind === "meeting" ? <>
      <Cuboid className="meeting-table" />
      {[0, 1, 2, 3].map((n) => <span key={n} className={`meeting-chair chair-${n}`} aria-hidden />)}
      {syncRun && isActive(syncRun) ? <span className="room-sign">SYNC LIVE</span> : <span className="room-sign dim">READY FOR SYNC</span>}
    </> : room.kind === "reception" ? <>
      <Cuboid className="reception-desk" /><span className="inbox-tray" aria-hidden>{waiting > 0 ? Array.from({ length: Math.min(waiting, 5) }, (_, i) => <i key={i} style={{ transform: `translateY(${-i * 3}px)` }} />) : <i />}</span>
      <span className="reception-count">{waiting} WAITING</span><Plant x={169} y={115} />
    </> : <>
      {agents.map((a, i) => {
        const d = state.desks.find((desk) => desk.agent === a.slug);
        const inSync = attendees.some((person) => person.slug === a.slug);
        return !inSync && <Workstation key={a.slug} x={agents.length === 1 ? 65 : 18 + (i % 3) * 61} y={agents.length > 3 ? 39 + Math.floor(i / 3) * 35 : 76} lit={d?.status === "working"} />;
      })}
      {room.id === "studio" && <><span className="conveyor" aria-hidden>{studioRuns.slice(0, 3).map((r, i) => <i key={r.id} style={{ left: 16 + i * 31 }} />)}</span><span className="studio-count">{studioRuns.length ? `${studioRuns.length} IN BUILD` : "STUDIO READY"}</span></>}
      {(room.id === "cabin" || room.id === "plan" || room.id === "growth") && <Plant x={177} y={119} />}
    </>}
    {members.map((a, i) => {
      const d = state.desks.find((desk) => desk.agent === a.slug);
      const isMeeting = room.kind === "meeting";
      const x = isMeeting ? 68 + (i % 4) * 28 : agents.length === 1 ? 86 : 39 + (i % 3) * 61;
      const y = isMeeting ? 52 + Math.floor(i / 4) * 42 : agents.length > 3 ? 48 + Math.floor(i / 3) * 35 : 89;
      return <Character key={a.slug} agent={a} status={d?.status ?? "idle"} activity={d?.activity ?? null} done={d?.done ?? 0} x={x} y={y} onClick={() => onOpenAgent(a.slug)} />;
    })}
  </div>;
}

export default function OfficeScene({ state, syncRun, onOpenAgent }: { state: OfficeState; syncRun?: Run; onOpenAgent: (slug: string) => void }) {
  const rooms = state.team.rooms ?? [{ id: "all", name: "Team floor", agents: state.team.agents.map((a) => a.slug) }];
  const [camera, setCamera] = useState<Camera>(initial);
  const [size, setSize] = useState(640);
  const [visible, setVisible] = useState(document.visibilityState === "visible");
  const view = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragged = useRef(false);
  const travel = useRef(0);
  const lastTap = useRef(0);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect.width));
    if (view.current) observer.observe(view.current);
    const change = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", change);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", change); };
  }, []);
  useEffect(() => {
    const el = view.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => { e.preventDefault(); setCamera((c) => ({ ...c, zoom: clamp(c.zoom * (e.deltaY > 0 ? .9 : 1.1), .72, 2.3) })); };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);
  const focusRoom = useCallback((index: number) => {
    setCamera({ turn: -12, tilt: 57, zoom: 1.38, x: (1 - index % 3) * 155, y: (1 - Math.floor(index / 3)) * 105 });
  }, []);
  const roomNodes = useMemo(() => rooms.map((room, i) => <RoomScene key={room.id} room={room} index={i}
    agents={(room.agents ?? []).map((slug) => state.team.agents.find((a) => a.slug === slug)).filter((a): a is TeamAgent => !!a)}
    state={state} syncRun={syncRun} onOpenAgent={onOpenAgent} onFocus={focusRoom} />), [rooms, state, syncRun, onOpenAgent, focusRoom]);
  const scale = (Math.min(size / 670, 1.2) * camera.zoom).toFixed(3);
  const pointerDown = (e: React.PointerEvent) => { dragged.current = false; travel.current = 0; pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (!(e.target as Element).closest("button,summary")) e.currentTarget.setPointerCapture(e.pointerId); };
  const pointerMove = (e: React.PointerEvent) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    travel.current += Math.abs(e.clientX - p.x) + Math.abs(e.clientY - p.y);
    if (travel.current > 8) dragged.current = true;
    const others = [...pointers.current.entries()].filter(([id]) => id !== e.pointerId);
    if (others.length) {
      const o = others[0][1];
      const before = Math.hypot(p.x - o.x, p.y - o.y);
      const after = Math.hypot(e.clientX - o.x, e.clientY - o.y);
      setCamera((c) => ({ ...c, zoom: clamp(c.zoom * (after / Math.max(before, 1)), .72, 2.3), x: clamp(c.x + (e.clientX - p.x) * .35, -230, 230), y: clamp(c.y + (e.clientY - p.y) * .35, -180, 180) }));
    } else if (e.buttons === 2 || e.shiftKey) {
      setCamera((c) => ({ ...c, x: clamp(c.x + e.clientX - p.x, -230, 230), y: clamp(c.y + e.clientY - p.y, -180, 180) }));
    } else {
      setCamera((c) => ({ ...c, turn: clamp(c.turn + (e.clientX - p.x) * .28, -60, 60), tilt: clamp(c.tilt - (e.clientY - p.y) * .18, 42, 72) }));
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const pointerUp = (e: React.PointerEvent) => { pointers.current.delete(e.pointerId); };
  return <div className={`scene-viewport ${visible ? "" : "scene-paused"}`} ref={view}
    onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}
    onClickCapture={(e) => { if (dragged.current) { e.stopPropagation(); e.preventDefault(); dragged.current = false; } }}
    onDoubleClick={() => setCamera(initial)} onTouchEnd={() => { const now = Date.now(); if (now - lastTap.current < 280) setCamera(initial); lastTap.current = now; }}>
    <div className="scene-sky" /><div className="scene-world" style={{ ["--counter-turn" as string]: `${-camera.turn}deg`, ["--counter-tilt" as string]: `${-camera.tilt}deg`, transform: `translate(calc(-50% + ${camera.x}px), calc(-50% + ${camera.y}px)) rotateX(${camera.tilt}deg) rotateZ(${camera.turn}deg) scale(${scale})` }}>
      <span className="world-base" aria-hidden />{roomNodes}
    </div>
    <div className="scene-corner scene-corner-tl"><span className="live-dot" /> LIVE FLOOR <b>{state.desks.filter((d) => d.status === "working").length} WORKING</b></div>
    <details className="scene-room-list"><summary>Rooms ▾</summary><div>{rooms.map((room, index) => <button key={room.id} onClick={() => room.kind === "reception" ? go("#/inbox") : focusRoom(index)}>{room.name}</button>)}</div></details>
    <div className="scene-corner scene-corner-bl">DRAG TO ORBIT · PINCH TO ZOOM</div>
    <button className="scene-reset" onClick={() => setCamera(initial)} aria-label="Reset office view">↺ <span>Reset view</span></button>
  </div>;
}
