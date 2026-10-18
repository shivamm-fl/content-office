// The content calendar of a floor: what is ready to post, what goes out in which slot, what is still being made,
// and the owner's buttons to post a reel now or put it on a slot (the publishing repo does the posting).
import type { CalendarCell, CalendarData, CalendarSlot, PostRecord, PreviewInfo, ReadyReel, Team } from "@office/protocol";
import { useCallback, useEffect, useState } from "react";
import type { Office } from "../store";
import { Empty, Screen, go, timeAgo } from "./ui";

const SHORT: Record<string, string> = { generic: "What's new", course: "Course", interview: "Interview", experiment: "Experiment" };
const trackName = (team: Team, id: string) => SHORT[id] ?? team.tracks.find((t) => t.id === id)?.name ?? "Reel";
const STAGE: Record<string, [string, string]> = {
  studio: ["In the studio", "text-paper"], approval: ["Waits for you", "text-gold"], failed: ["Did not pass the gate", "text-coral"],
  changes: ["Sent back", "text-dim"], rejected: ["Rejected", "text-dim"],
};

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`whitespace-nowrap rounded-full border border-wall px-2 py-0.5 text-[11px] ${className}`}>{children}</span>;
}

function CellRow({ c, team, paused, onPreview }: { c: CalendarCell; team: Team; paused: boolean; onPreview?: (item: string, title: string) => void }) {
  const word = c.state === "posted" ? `Posted ${c.at ?? ""}` : c.state === "scheduled" ? (paused ? "Scheduled, paused" : "Scheduled") : c.state === "auto" ? (paused ? "Paused" : "Next in line") : "No reel yet";
  const tone = c.state === "scheduled" ? "text-gold" : c.state === "posted" ? "text-paper" : "text-dim";
  const title = `min-w-0 flex-1 truncate text-left ${c.state === "auto" ? "text-dim" : ""}`;
  return (
    <li className="flex items-center gap-2 py-1.5 text-[13.5px]">
      <span className="w-[72px] shrink-0 text-[11px] text-dim">{trackName(team, c.track)}</span>
      {c.item && c.title && c.state !== "posted" && onPreview
        ? <button onClick={() => onPreview(c.item!, c.title!)} className={title} aria-label={`Preview ${c.title}`}>{c.title}</button>
        : <span className={title}>{c.title ?? ""}</span>}
      {c.link ? <a href={c.link} target="_blank" rel="noreferrer" className={`shrink-0 text-[11px] underline decoration-wall ${tone}`}>{word}</a> : <span className={`shrink-0 text-[11px] ${tone}`}>{word}</span>}
    </li>
  );
}

/** Watch a reel (and read the texts that would go out) before it is posted. */
function PreviewSheet({ office, item, title, reel, onClose, onPost }: { office: Office; item: string; title: string; reel: ReadyReel | null; onClose: () => void; onPost: (r: ReadyReel) => void }) {
  const { loadPreview } = office;
  const [info, setInfo] = useState<PreviewInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    let live = true;
    loadPreview(item).then((i) => { if (live) setInfo(i); }).catch((e: Error) => { if (live) setError(e.message); });
    return () => { live = false; };
  }, [loadPreview, item]);
  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={onClose}>
      <div className="safe-bottom mx-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-wall bg-desk" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Preview ${title}`}>
        <div className="px-4 pt-4">
          <p className="text-xs text-dim">{item}{info?.duration_s ? `, ${Math.round(info.duration_s)} s` : ""}</p>
          <p className="text-[15px] font-semibold leading-snug">{info?.title ?? title}</p>
        </div>
        {info ? (
          <video src={info.video_url} poster={info.cover_url ?? undefined} controls playsInline preload="metadata" onError={() => setBroken(true)} className="mx-auto mt-3 block h-[58vh] w-full bg-black object-contain" />
        ) : error ? <p className="px-4 py-6 text-sm text-coral">{error}</p> : <p className="px-4 py-10 text-center text-sm text-dim">Loading the reel…</p>}
        {broken && <p className="px-4 pt-2 text-sm text-coral">The video could not be played. Try again in a minute.</p>}
        {info && (
          <div className="mt-2 border-t border-wall">
            {([["Instagram caption", info.caption], ["YouTube title and description", info.youtube]] as const).filter(([, t]) => t.trim()).map(([label, t]) => (
              <details key={label} className="border-b border-wall px-4 py-2.5">
                <summary className="cursor-pointer text-sm">{label}</summary>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-paper/90">{t}</pre>
              </details>
            ))}
          </div>
        )}
        <div className="flex gap-2 px-4 py-3">
          {reel && <button onClick={() => onPost(reel)} className="flex-1 rounded-lg bg-gold py-2.5 text-sm font-semibold text-ink">Post this…</button>}
          <button onClick={onClose} className={`rounded-lg border border-wall py-2.5 text-sm ${reel ? "px-5" : "flex-1"}`}>Close</button>
        </div>
      </div>
    </div>
  );
}

function PostSheet({ cal, reel, office, onClose, onDone, onPreview }: { cal: CalendarData; reel: ReadyReel; office: Office; onClose: () => void; onDone: (p: PostRecord) => void; onPreview: () => void }) {
  const [mode, setMode] = useState<"now" | "slot">("now");
  const [slot, setSlot] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const options = cal.days.flatMap((d) => d.slots.filter((s) => !s.started && s.scheduled < cal.posts_per_slot).map((s) => ({ ...s, day: d.label, key: `${d.date} ${s.time}` })));
  const chosen = options.find((o) => o.key === slot) ?? options[0];

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      onDone(await office.publish(mode === "now" ? { item: reel.item, mode } : { item: reel.item, mode, date: chosen.date, time: chosen.time }));
    } catch (e) {
      setError((e as Error).message);
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={onClose}>
      <div className="safe-bottom mx-auto max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-wall bg-desk p-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Post ${reel.title}`}>
        <div className="flex items-start gap-3">
          {reel.cover_url && <img src={reel.cover_url} alt="" className="h-20 rounded-md border border-wall" />}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-dim">{reel.item}{reel.duration_s ? `, ${Math.round(reel.duration_s)} s` : ""}</p>
            <p className="text-[15px] font-semibold leading-snug">{reel.title}</p>
            <p className="mt-1 text-[12px] text-dim">{cal.last_post_hours != null ? `The last post went out ${cal.last_post_hours} h ago.` : "Nothing posted yet."}</p>
            <button onClick={onPreview} className="mt-1.5 text-[13px] text-gold">Watch it first</button>
          </div>
        </div>

        {reel.can_schedule && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm" role="tablist">
            {([["now", "Post now"], ["slot", "Put on a slot"]] as const).map(([id, label]) => (
              <button key={id} role="tab" aria-selected={mode === id} onClick={() => { setMode(id); setConfirm(false); }}
                className={`rounded-lg border py-2 ${mode === id ? "border-gold text-gold" : "border-wall text-dim"}`}>{label}</button>
            ))}
          </div>
        )}

        {mode === "now" ? (
          <div className="mt-4 space-y-2">
            <p className="text-[13px] leading-relaxed text-dim">The reel goes out on Instagram right away, then Facebook, then YouTube where the track is set up for it. It is public as soon as it is up.{!cal.can_post_now ? ` It is ${cal.clock} IST, outside the usual posting hours (${cal.window.join(" to ")}); it posts anyway.` : ""}</p>
            {confirm ? (
              <button disabled={busy} onClick={submit} className="w-full rounded-lg bg-coral py-3 text-sm font-semibold text-ink">{busy ? "Starting…" : "Yes, post it now"}</button>
            ) : (
              <button onClick={() => setConfirm(true)} className="w-full rounded-lg bg-gold py-3 text-sm font-semibold text-ink">Post now</button>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <p className="text-[13px] leading-relaxed text-dim">Only the reels you put on a slot go out in it; the automatic order is skipped for that slot.{cal.paused ? " Automatic posting is paused, so nothing goes out until you resume it." : ""}</p>
            {options.length === 0 ? <p className="text-sm text-coral">No free slot in the next days.</p> : (
              <ul className="max-h-56 space-y-1.5 overflow-y-auto" role="radiogroup">
                {options.map((o) => (
                  <li key={o.key}>
                    <button role="radio" aria-checked={chosen?.key === o.key} onClick={() => setSlot(o.key)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm ${chosen?.key === o.key ? "border-gold" : "border-wall"}`}>
                      <span>{o.day}, {o.time} IST</span>
                      <span className="text-[11px] text-dim">{o.scheduled ? `${o.scheduled} of ${cal.posts_per_slot} chosen` : o.cells.some((c) => c.state === "auto") ? "replaces the automatic reels" : "empty"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button disabled={busy || !chosen} onClick={submit} className="w-full rounded-lg bg-gold py-3 text-sm font-semibold text-ink">{busy ? "Starting…" : "Put on this slot"}</button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-coral">{error}</p>}
        <button onClick={onClose} className="mt-3 w-full rounded-lg border border-wall py-2.5 text-sm">Close</button>
      </div>
    </div>
  );
}

function PostLine({ p }: { p: PostRecord }) {
  const what = p.mode === "pause" ? "Pausing automatic posting" : p.mode === "resume" ? "Turning automatic posting on" : p.mode === "now" ? `Posting ${p.item} now` : `Putting ${p.item} on ${p.date} ${p.time}`;
  const tone = p.status === "failed" ? "text-coral" : p.status === "done" ? "text-dim" : "text-gold";
  return (
    <li className="flex items-start gap-2 text-[13px]">
      <span className="flex-1">{p.status === "done" ? what.replace(/^Posting/, "Posted").replace(/^Putting/, "Put").replace(/^Pausing/, "Paused").replace(/^Turning/, "Turned") : what}{p.status === "handing_over" ? "…" : ""}
        {p.error && <span className="block text-coral">{p.error}</span>}</span>
      <span className={`shrink-0 text-[11px] ${tone}`}>{p.status === "handing_over" ? "Working" : p.status === "done" ? "Done" : "Failed"}, {timeAgo(p.updated_at)}</span>
      {p.gh_url && <a href={p.gh_url} target="_blank" rel="noreferrer" className="shrink-0 text-[11px] text-dim underline">log</a>}
    </li>
  );
}

export function CalendarView({ office, focus }: { office: Office; focus: string | null }) {
  const { team } = office.state!;
  const { loadCalendar } = office;
  const [cal, setCal] = useState<CalendarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<ReadyReel | null>(null);
  const [preview, setPreview] = useState<{ item: string; title: string } | null>(null);
  const [opened, setOpened] = useState<string | null>(null);
  const [switching, setSwitching] = useState<"pause" | "resume" | null>(null);
  const [busy, setBusy] = useState(false);
  const approvals = office.state!.asks.length;

  const load = useCallback(() => loadCalendar().then((c) => { setCal(c); setError(null); }).catch((e: Error) => setError(e.message)), [loadCalendar]);
  const working = cal?.posts.some((p) => p.status === "handing_over") ?? false;
  useEffect(() => { void load(); }, [load, approvals]);
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === "visible") void load(); }, working ? 5000 : 30000);
    return () => clearInterval(t);
  }, [load, working]);
  useEffect(() => {   // "Post it" on an approved reel opens its sheet once
    if (!focus || !cal || opened === focus) return;
    const r = cal.ready.find((x) => x.item === focus);
    if (r) setSheet(r);
    setOpened(focus);
  }, [focus, cal, opened]);

  const flip = async (paused: boolean) => {
    setBusy(true);
    try { await office.setPosting(paused); setSwitching(null); await load(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const recentPosts = (cal?.posts ?? []).filter((p) => p.status === "handing_over" || Date.now() - p.updated_at < 3 * 3_600_000).slice(0, 4);

  return (
    <Screen title={`${team.name} calendar`} right={<span className="text-xs text-dim">{cal ? `${cal.clock} IST` : ""}</span>}>
      <div className="space-y-6 px-4 py-4">
        <div className="flex items-center gap-2 text-[13px]">
          <Pill className="border-gold/70 text-gold">{team.name} floor</Pill>
          <span className="text-dim">{team.handles.map((h) => h.handle).join(", ")}</span>
          <button onClick={() => go("#/")} className="ml-auto rounded-full border border-dashed border-wall px-2.5 py-0.5 text-[11px] text-dim">+ next floor</button>
        </div>

        {error && <p className="rounded-lg border border-coral/60 px-3 py-2 text-sm text-coral">{error}</p>}
        {!cal && !error && <p className="text-center text-sm text-dim">Opening the calendar…</p>}

        {cal && !cal.publishing && !cal.note && <Empty>This floor has no publishing repo yet, so there is nothing to post from here. Its reels still show up under "Being made".</Empty>}
        {cal?.note && <p className="rounded-lg border border-coral/60 px-3 py-2 text-sm text-coral">{cal.note}</p>}

        {cal?.publishing && (
          <>
            <section className={`rounded-xl border px-4 py-3 ${cal.paused ? "border-coral/60" : "border-wall"} bg-desk`}>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold">Automatic posting: {cal.paused ? "paused" : "on"}</span>
                {switching ? null : <button onClick={() => setSwitching(cal.paused ? "resume" : "pause")} className="ml-auto rounded-lg border border-wall px-3 py-1.5 text-xs">{cal.paused ? "Turn on" : "Pause"}</button>}
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-dim">
                {cal.paused ? "Reels on a slot will not go out until you turn it on. Post now still works." : `Slots ${cal.slot_times.join(", ")} IST, up to ${cal.posts_per_slot} reels each, between ${cal.window.join(" and ")}.`}
              </p>
              {switching && (
                <div className="mt-3 flex gap-2">
                  <button disabled={busy} onClick={() => flip(switching === "pause")} className={`flex-1 rounded-lg py-2 text-sm font-semibold text-ink ${switching === "resume" ? "bg-gold" : "bg-paper"}`}>
                    {busy ? "Working…" : switching === "resume" ? "Yes, turn automatic posting on" : "Yes, pause it"}
                  </button>
                  <button onClick={() => setSwitching(null)} className="rounded-lg border border-wall px-4 py-2 text-sm">Cancel</button>
                </div>
              )}
            </section>

            {recentPosts.length > 0 && (
              <section className="space-y-2 rounded-xl border border-wall bg-desk px-4 py-3">
                <h2 className="text-sm text-dim">Just now</h2>
                <ul className="space-y-1.5">{recentPosts.map((p) => <PostLine key={p.id} p={p} />)}</ul>
              </section>
            )}

            <section>
              <h2 className="mb-2 text-sm text-dim">Ready to post</h2>
              {cal.ready.length === 0 ? (
                <p className="rounded-xl border border-dashed border-wall px-4 py-5 text-center text-sm text-dim">
                  {approvals > 0 ? "A finished reel waits for your approval in the Inbox. Approve it and it shows up here." : "No approved reel is waiting. Start the day in the Office tab to make more."}
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {cal.ready.map((r) => (
                    <li key={r.item} className="flex items-center gap-3 rounded-xl border border-wall bg-desk p-3">
                      {r.cover_url ? <img src={r.cover_url} alt="" className="h-16 w-9 shrink-0 rounded border border-wall object-cover" loading="lazy" /> : <span className="h-16 w-9 shrink-0 rounded border border-dashed border-wall" aria-hidden />}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[14px] font-medium leading-snug">{r.title}</p>
                        <p className="mt-0.5 text-[11.5px] text-dim">{r.item}, {trackName(team, r.track)}{r.duration_s ? `, ${Math.round(r.duration_s)} s` : ""}{r.source === "office" ? ", from the office" : ", already released"}</p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1.5">
                        <button onClick={() => setSheet(r)} className="rounded-lg bg-gold px-3.5 py-2 text-sm font-semibold text-ink">Post</button>
                        <button onClick={() => setPreview({ item: r.item, title: r.title })} className="rounded-lg border border-wall px-3.5 py-1.5 text-xs">Preview</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm text-dim">Next days</h2>
                {cal.empty_slots > 0 && <span className="text-[11.5px] text-dim">{cal.empty_slots} open slot{cal.empty_slots === 1 ? "" : "s"} without a reel</span>}
              </div>
              {cal.days.map((d) => {
                const shown = d.slots.filter((s) => s.open || s.cells.length > 0);
                if (shown.length === 0 && d.extras.length === 0) return null;
                const bare = (s: CalendarSlot) => s.cells.every((c) => c.state === "empty");   // no reel for any track
                const bareTimes = shown.filter(bare).map((s) => s.time);
                const withReels = shown.filter((s) => !bare(s));
                return (
                  <div key={d.date} className="overflow-hidden rounded-xl border border-wall bg-desk">
                    <p className="border-b border-wall px-4 py-2 text-[13px] font-semibold">{d.label}</p>
                    <div className="divide-y divide-wall">
                      {withReels.map((s) => (
                        <div key={s.time} className="px-4 py-2">
                          <p className="text-[12px] text-dim">{s.time} IST{s.started && s.open ? ", slot is open now" : s.started ? ", over" : ""}</p>
                          <ul>{s.cells.map((c, i) => <CellRow key={`${c.item ?? c.track}-${i}`} c={c} team={team} paused={cal.paused} onPreview={(item, title) => setPreview({ item, title })} />)}</ul>
                        </div>
                      ))}
                      {bareTimes.length > 0 && (
                        <p className="px-4 py-2 text-[12.5px] text-dim">No reel yet for {bareTimes.join(", ")} IST</p>
                      )}
                      {d.extras.length > 0 && (
                        <div className="px-4 py-2">
                          <p className="text-[12px] text-dim">Posted outside a slot</p>
                          <ul>{d.extras.map((c) => <CellRow key={c.item ?? c.at} c={c} team={team} paused={cal.paused} />)}</ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}

        {cal && cal.pipeline.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm text-dim">Being made</h2>
            <ul className="divide-y divide-wall overflow-hidden rounded-xl border border-wall bg-desk">
              {cal.pipeline.map((p) => {
                const [word, tone] = STAGE[p.stage] ?? [p.stage, "text-dim"];
                return (
                  <li key={p.item}>
                    <button onClick={() => go(p.stage === "approval" ? "#/inbox" : p.thread_id ? `#/t/${p.thread_id}` : "#/")} className="flex w-full items-start gap-3 px-4 py-2.5 text-left">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px]">{p.title}</span>
                        <span className="block text-[11.5px] text-dim">{p.item}, {trackName(team, p.track)}{p.detail ? `, ${p.detail}` : ""}</span>
                      </span>
                      <span className={`shrink-0 text-[11.5px] ${tone}`}>{word}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {cal?.publishing && cal.recent.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm text-dim">Posted lately</h2>
            <ul className="divide-y divide-wall overflow-hidden rounded-xl border border-wall bg-desk">
              {cal.recent.map((r) => (
                <li key={r.item} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px]">{r.title}</span>
                    <span className="block text-[11.5px] text-dim">{r.item}, {trackName(team, r.track)}, {r.at} IST{r.facebook ? ", Facebook" : ""}{r.youtube ? ", YouTube" : ""}</span>
                  </span>
                  {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="shrink-0 text-[12px] text-gold">Open</a>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {sheet && cal && <PostSheet cal={cal} reel={sheet} office={office} onClose={() => setSheet(null)} onDone={() => { setSheet(null); void load(); }} onPreview={() => { setPreview({ item: sheet.item, title: sheet.title }); setSheet(null); }} />}
      {preview && cal && (
        <PreviewSheet office={office} item={preview.item} title={preview.title} reel={cal.ready.find((r) => r.item === preview.item) ?? null}
          onClose={() => setPreview(null)} onPost={(r) => { setPreview(null); setSheet(r); }} />
      )}
    </Screen>
  );
}
