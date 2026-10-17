// The team's floor, seen from above: rooms with walls, agents at their desks, the sync room, the reception.
import type { Desk, OfficeState, Room, Run, TeamAgent } from "@office/protocol";
import { Avatar, level } from "./Avatar";
import { go, isActive } from "./ui";

function Bubble({ status }: { status: Desk["status"] }) {
  if (status === "working") return <span className="bubble bubble-dots" aria-label="working"><i /><i /><i /></span>;
  if (status === "waiting") return <span className="bubble bg-gold text-ink" aria-label="waiting for you">!</span>;
  if (status === "blocked") return <span className="bubble bg-coral text-ink" aria-label="blocked">!</span>;
  return null;
}

export function Seat({ agent, desk, onOpen, small = false }: { agent: TeamAgent; desk?: Desk; onOpen: (slug: string) => void; small?: boolean }) {
  const status = desk?.status ?? "idle";
  const { lv } = level(desk?.done);
  return (
    <button onClick={() => onOpen(agent.slug)} className="group relative flex w-[76px] flex-col items-center pt-2 text-center" aria-label={`${agent.name}, ${status}`}>
      <span className="relative" style={{ ["--agent" as string]: agent.color }}>
        <span className={`block rounded-full ${status === "working" ? "seat-working" : ""}`}><Avatar color={agent.color} status={status} size={small ? 34 : 42} /></span>
        <Bubble status={status} />
      </span>
      {!small && <span className="-mt-1 block h-2 w-14 rounded-sm bg-wall shadow-[inset_0_-2px_0_rgba(0,0,0,.25)]" aria-hidden />}
      <span className="mt-1 line-clamp-2 w-full break-words text-[11.5px] font-medium leading-tight">{agent.name}</span>
      {!small && <span className="text-[10px] text-dim">Lv {lv}</span>}
    </button>
  );
}

function RoomBox({ room, children, wide, onClick, dashed, highlight }: { room: { name: string }; children: React.ReactNode; wide?: boolean; onClick?: () => void; dashed?: boolean; highlight?: boolean }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={`room relative rounded-lg border-[1.5px] px-2 pb-2 pt-6 text-left ${wide ? "col-span-2" : ""} ${dashed ? "border-dashed border-wall/80" : highlight ? "border-gold/80" : "border-wall"} bg-ink/55`}>
      <span className="absolute left-2.5 top-1.5 text-[11px] text-dim">{room.name}</span>
      {children}
    </Tag>
  );
}

export function Floor({ state, onOpenAgent, onSync, syncRun, syncing }: {
  state: OfficeState; onOpenAgent: (slug: string) => void; onSync: () => void; syncRun: Run | undefined; syncing: boolean;
}) {
  const { team } = state;
  const deskOf = (slug: string) => state.desks.find((d) => d.agent === slug);
  const agent = (slug: string) => team.agents.find((a) => a.slug === slug);
  const rooms: Room[] = team.rooms ?? [{ id: "all", name: `${team.name} desks`, agents: team.agents.map((a) => a.slug) }];
  const inSync = new Set(syncRun && isActive(syncRun) ? state.desks.filter((d) => d.run_id === syncRun.id && d.status !== "idle").map((d) => d.agent) : []);
  if (syncRun && isActive(syncRun)) inSync.add(syncRun.agent);
  const waiting = state.asks.length + state.tasks.length;

  return (
    <div className="floor rounded-2xl border border-wall p-2.5">
      <div className="mb-2 flex items-baseline justify-between px-1">
        <span className="text-sm font-semibold">{team.name} floor</span>
        <span className="text-[11px] text-dim">{state.desks.filter((d) => d.status === "working").length} at work</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {rooms.map((room) => {
          if (room.kind === "meeting") {
            const live = syncRun && isActive(syncRun);
            const attendees = [...inSync].map(agent).filter(Boolean) as TeamAgent[];
            return (
              <RoomBox key={room.id} room={room} highlight={live} onClick={live && syncRun?.thread_id ? () => go(`#/t/${syncRun.thread_id}`) : undefined}>
                <div className="relative mx-auto mt-1 flex h-[86px] w-full items-center justify-center">
                  <span className="absolute h-12 w-20 rounded-[50%] border border-wall bg-desk" aria-hidden />
                  {attendees.length > 0 ? (
                    <span className="relative flex flex-wrap justify-center gap-0.5">
                      {attendees.slice(0, 6).map((a) => <span key={a.slug}><Avatar color={a.color} status={deskOf(a.slug)?.status} size={24} /></span>)}
                    </span>
                  ) : (
                    <span className="relative text-[11px] text-dim">empty</span>
                  )}
                </div>
                {live ? <span className="block text-center text-[12px] text-gold">Sync in progress, tap to join</span> : (
                  <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); if (!syncing) onSync(); }} onKeyDown={(e) => { if (e.key === "Enter") onSync(); }}
                    className="mt-0.5 block rounded-md bg-wall py-1.5 text-center text-[12px] font-medium">{syncing ? "Calling…" : "Call daily sync"}</span>
                )}
              </RoomBox>
            );
          }
          if (room.kind === "reception") {
            return (
              <RoomBox key={room.id} room={room} wide onClick={() => go("#/inbox")} highlight={waiting > 0}>
                <div className="flex items-center gap-3 px-1 pt-1">
                  <span className={`text-2xl font-semibold ${waiting ? "text-gold" : "text-dim"}`}>{waiting}</span>
                  <span className="flex-1 text-[13px] leading-tight text-dim">{waiting === 1 ? "thing waits for you: a question or an approval" : waiting ? "things wait for you: questions and approvals" : "Nothing waits for you. Questions and approvals land here."}</span>
                  <span className="text-[13px] text-gold">Inbox</span>
                </div>
              </RoomBox>
            );
          }
          const seated = (room.agents ?? []).map(agent).filter(Boolean) as TeamAgent[];
          return (
            <RoomBox key={room.id} room={room}>
              <div className="flex min-h-[86px] items-start justify-center">
                {seated.map((a) => (
                  inSync.has(a.slug)
                    ? <div key={a.slug} className="flex w-[76px] flex-col items-center pt-4 text-[10.5px] text-dim"><span className="h-[42px] w-[42px] rounded-full border border-dashed border-wall" />in sync</div>
                    : <Seat key={a.slug} agent={a} desk={deskOf(a.slug)} onOpen={onOpenAgent} />
                ))}
              </div>
            </RoomBox>
          );
        })}
      </div>
    </div>
  );
}

/** The next team's empty floor: one team per handle. */
export function EmptyFloor({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="floor mt-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-wall p-4 text-left">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-wall text-xl text-dim">+</span>
      <span>
        <span className="block text-sm font-semibold">Empty floor</span>
        <span className="block text-[12.5px] leading-snug text-dim">Room for your next handle. Each handle gets its own team and floor.</span>
      </span>
    </button>
  );
}
