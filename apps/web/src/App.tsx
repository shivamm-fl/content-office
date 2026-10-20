import { useCallback, useEffect, useState } from "react";
import type { Team } from "@office/protocol";
import { api, AuthError } from "./api";
import { CalendarView } from "./components/Calendar";
import { ChatView } from "./components/Chat";
import { InboxView } from "./components/Inbox";
import { Login } from "./components/Login";
import { OfficeView } from "./components/Office";
import { ProposalsView } from "./components/Proposals";
import { RunsView } from "./components/Runs";
import { go, isActive } from "./components/ui";
import { useOffice } from "./store";

function useHash() {
  const [hash, setHash] = useState(location.hash || "#/");
  useEffect(() => {
    const on = () => setHash(location.hash || "#/");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

type TeamInfo = { slug: string; name: string; scope?: Team["scope"] };

function Shell({ team, teams, onSwitch, onAuthLost }: { team: string; teams: TeamInfo[]; onSwitch: (slug: string) => void; onAuthLost: () => void }) {
  const office = useOffice(team, onAuthLost);
  const hash = useHash();
  const state = office.state;
  if (!state) return <p className="p-8 text-center text-dim">Opening the office…</p>;

  const thread = /^#\/t\/([\w-]+)/.exec(hash)?.[1] ?? null;
  const fresh = /^#\/new\/([\w-]+)/.exec(hash)?.[1] ?? null;
  const calendar = /^#\/calendar(?:\/([\w-]+))?/.exec(hash);
  const proposal = /^#\/proposals(?:\/([^/?#]+))?/.exec(hash);
  const tab = proposal ? "proposals" : calendar ? "calendar" : hash.startsWith("#/inbox") ? "inbox" : hash.startsWith("#/runs") ? "runs" : "office";
  const inChat = Boolean(thread || fresh);
  const company = state.team.scope === "company";
  const draft = fresh ? new URLSearchParams(hash.split("?")[1] ?? "").get("text") ?? "" : "";
  const waiting = state.asks.length + state.tasks.length;
  const running = state.runs.filter(isActive).length;
  const tabs: [string, string, string, number][] = [
    ["office", "#/", "Office", 0],
    company ? ["proposals", "#/proposals", "Proposals", 0] : ["calendar", "#/calendar", "Calendar", 0],
    ["inbox", "#/inbox", "Inbox", waiting],
    ["runs", "#/runs", "Runs", running],
  ];

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col">
      <main className="min-h-0 flex-1 overflow-y-auto">
        {inChat ? <ChatView key={thread ?? hash} office={office} threadId={thread} newAgent={fresh} initialText={draft} />
          : tab === "inbox" ? <InboxView office={office} />
          : tab === "proposals" ? <ProposalsView run={proposal?.[1] ?? null} />
          : tab === "calendar" && !company ? <CalendarView office={office} focus={calendar?.[1] ?? null} />
          : tab === "runs" ? <RunsView office={office} />
          : <OfficeView office={office} teams={teams} onSwitch={onSwitch} />}
      </main>
      {!inChat && (
        <nav className="safe-bottom grid grid-cols-4 border-t border-wall bg-ink pt-1.5 text-center text-[13px]">
          {tabs.map(([id, href, label, n]) => (
            <button key={id} onClick={() => go(href)} className={`py-2 ${tab === id ? "font-semibold text-paper" : "text-dim"}`} aria-current={tab === id ? "page" : undefined}>
              {label}{n > 0 && <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${id === "inbox" ? "bg-gold text-ink" : "bg-wall text-paper"}`}>{n}</span>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

// the floor the owner picked last (a per-device convenience: storage can be blocked, the office then opens on the first team)
const TEAM_KEY = "office.team";
const savedTeam = () => { try { return localStorage.getItem(TEAM_KEY); } catch { return null; } };

export function App() {
  const [auth, setAuth] = useState<"checking" | "out" | { team: string; teams: TeamInfo[] }>("checking");
  const check = useCallback(() => {
    api<{ owner: string; teams: TeamInfo[] }>("/api/me")
      .then((r) => {
        const saved = savedTeam();
        setAuth({ team: r.teams.find((t) => t.slug === saved)?.slug ?? r.teams[0]?.slug ?? "learnai", teams: r.teams });
      })
      .catch((e) => setAuth(e instanceof AuthError ? "out" : "out"));
  }, []);
  useEffect(check, [check]);
  const lost = useCallback(() => setAuth("out"), []);
  const switchTeam = useCallback((slug: string) => {
    try { localStorage.setItem(TEAM_KEY, slug); } catch { /* storage blocked: the pick lasts until reload */ }
    go("#/");   // a thread or calendar hash belongs to the floor we are leaving
    setAuth((a) => (typeof a === "object" ? { ...a, team: slug } : a));
  }, []);
  if (auth === "checking") return null;
  if (auth === "out") return <Login onDone={check} />;
  // key: a floor change remounts the shell, so no state of the old floor shows on the new one
  return <Shell key={auth.team} team={auth.team} teams={auth.teams} onSwitch={switchTeam} onAuthLost={lost} />;
}
