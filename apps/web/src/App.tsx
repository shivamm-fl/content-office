import { useCallback, useEffect, useState } from "react";
import { api, AuthError } from "./api";
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

function Shell({ team, onAuthLost }: { team: string; onAuthLost: () => void }) {
  const office = useOffice(team, onAuthLost);
  const hash = useHash();
  const state = office.state;
  if (!state) return <p className="p-8 text-center text-dim">Opening the office…</p>;

  const thread = /^#\/t\/([\w-]+)/.exec(hash)?.[1] ?? null;
  const fresh = /^#\/new\/([\w-]+)/.exec(hash)?.[1] ?? null;
  const tab = hash.startsWith("#/inbox") ? "inbox" : hash.startsWith("#/runs") ? "runs" : "office";
  const inChat = Boolean(thread || fresh);
  const waiting = state.asks.length + state.tasks.length;
  const running = state.runs.filter(isActive).length;

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col">
      <main className="min-h-0 flex-1 overflow-y-auto">
        {inChat ? <ChatView key={thread ?? fresh} office={office} threadId={thread} newAgent={fresh} />
          : tab === "inbox" ? <InboxView office={office} />
          : tab === "runs" ? <RunsView office={office} />
          : <OfficeView state={state} connected={office.connected} />}
      </main>
      {!inChat && (
        <nav className="safe-bottom grid grid-cols-3 border-t border-wall bg-ink pt-1.5 text-center text-[13px]">
          {([["office", "#/", "Office", 0], ["inbox", "#/inbox", "Inbox", waiting], ["runs", "#/runs", "Runs", running]] as const).map(([id, href, label, n]) => (
            <button key={id} onClick={() => go(href)} className={`py-2 ${tab === id ? "font-semibold text-paper" : "text-dim"}`} aria-current={tab === id ? "page" : undefined}>
              {label}{n > 0 && <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${id === "inbox" ? "bg-gold text-ink" : "bg-wall text-paper"}`}>{n}</span>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export function App() {
  const [auth, setAuth] = useState<"checking" | "out" | { team: string }>("checking");
  const check = useCallback(() => {
    api<{ owner: string; teams: { slug: string }[] }>("/api/me")
      .then((r) => setAuth({ team: r.teams[0]?.slug ?? "learnai" }))
      .catch((e) => setAuth(e instanceof AuthError ? "out" : "out"));
  }, []);
  useEffect(check, [check]);
  const lost = useCallback(() => setAuth("out"), []);
  if (auth === "checking") return null;
  if (auth === "out") return <Login onDone={check} />;
  return <Shell team={auth.team} onAuthLost={lost} />;
}
