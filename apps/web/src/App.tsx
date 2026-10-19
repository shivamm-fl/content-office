import { useCallback, useEffect, useState } from "react";
import { api, AuthError } from "./api";
import { CalendarView } from "./components/Calendar";
import { ChatView } from "./components/Chat";
import { InboxView } from "./components/Inbox";
import { Login } from "./components/Login";
import { OfficeView } from "./components/Office";
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

type TeamInfo = { slug: string; name: string };

function Shell({ team, teams, onSwitch, onAuthLost }: { team: string; teams: TeamInfo[]; onSwitch: (slug: string) => void; onAuthLost: () => void }) {
  const office = useOffice(team, onAuthLost);
  const hash = useHash();
  const [approvalMoment, setApprovalMoment] = useState(false);
  useEffect(() => {
    const onApproved = () => setApprovalMoment(true);
    window.addEventListener("office:approved", onApproved);
    return () => window.removeEventListener("office:approved", onApproved);
  }, []);
  useEffect(() => { if (!approvalMoment) return; const t = setTimeout(() => setApprovalMoment(false), 3200); return () => clearTimeout(t); }, [approvalMoment]);
  const state = office.state;
  if (!state) return <p className="opening-screen">Opening the office…</p>;

  const thread = /^#\/t\/([\w-]+)/.exec(hash)?.[1] ?? null;
  const fresh = /^#\/new\/([\w-]+)/.exec(hash)?.[1] ?? null;
  const calendar = /^#\/calendar(?:\/([\w-]+))?/.exec(hash);
  const tab = calendar ? "calendar" : hash.startsWith("#/inbox") ? "inbox" : hash.startsWith("#/runs") ? "runs" : "office";
  const inChat = Boolean(thread || fresh);
  const waiting = state.asks.length + state.tasks.length;
  const running = state.runs.filter(isActive).length;

  return (
    <div className="app-shell">
      <main className="app-main">
        {inChat ? <ChatView key={thread ?? fresh} office={office} threadId={thread} newAgent={fresh} />
          : tab === "inbox" ? <InboxView office={office} />
          : tab === "calendar" ? <CalendarView office={office} focus={calendar?.[1] ?? null} />
          : tab === "runs" ? <RunsView office={office} />
          : <OfficeView office={office} teams={teams} onSwitch={onSwitch} />}
      </main>
      {!inChat && (
        <nav className="app-nav safe-bottom" aria-label="Main navigation">
          {([["office", "#/", "Office", "▦", 0], ["calendar", "#/calendar", "Calendar", "▤", 0], ["inbox", "#/inbox", "Inbox", "✉", waiting], ["runs", "#/runs", "Runs", "◈", running]] as const).map(([id, href, label, icon, n]) => (
            <button key={id} onClick={() => go(href)} className={tab === id ? "active" : ""} aria-current={tab === id ? "page" : undefined}>
              <span className="nav-icon" aria-hidden>{icon}</span><span>{label}</span>{n > 0 && <span className="nav-count">{n}</span>}
            </button>
          ))}
        </nav>
      )}
      {approvalMoment && <div className="office-celebration" role="status"><span>✦</span>Approved · the team can continue<i /><i /><i /></div>}
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
