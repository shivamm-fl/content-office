import type { Run, Team, TeamAgent } from "@office/protocol";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const go = (hash: string) => { location.hash = hash; };

export function agentOf(team: Team, slugOrAuthor: string): TeamAgent {
  const slug = slugOrAuthor.replace(/^agent:/, "");
  return team.agents.find((a) => a.slug === slug) ?? { slug, name: slug.replace(/-/g, " "), title: "", color: "#98a3b8", desk: "desk" };
}

export function AgentDot({ color, size = 10 }: { color: string; size?: number }) {
  return <span aria-hidden className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: color }} />;
}

export function timeAgo(ms: number): string {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function clock(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function duration(from: number, to: number | null): string {
  const s = Math.max(0, Math.round(((to ?? Date.now()) - from) / 1000));
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  return `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min`;
}

const RUN_WORDS: Record<Run["status"], [string, string]> = {
  queued: ["Queued", "text-dim"],
  starting: ["Starting on GitHub", "text-paper"],
  live: ["Working", "text-paper"],
  idle: ["In chat", "text-dim"],
  blocked_limit: ["Usage limit", "text-coral"],
  done: ["Finished", "text-dim"],
  failed: ["Failed", "text-coral"],
  cancelled: ["Cancelled", "text-dim"],
  lost: ["Lost contact", "text-coral"],
};
export const isActive = (r: Run) => ["queued", "starting", "live", "idle", "blocked_limit"].includes(r.status);

export function RunStatus({ run }: { run: Run }) {
  const [word, cls] = RUN_WORDS[run.status];
  return <span className={`text-xs ${cls}`}>{word}</span>;
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-chat">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children: c }) => <a href={href} target="_blank" rel="noreferrer">{c}</a> }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function Screen({ title, back, right, children }: { title: ReactNode; back?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="screen flex h-full flex-col">
      <header className="screen-header safe-top sticky top-0 z-10 flex items-center gap-2 border-b border-wall bg-ink/95 px-4 pb-3 backdrop-blur">
        {back !== undefined && (
          <button onClick={() => (back ? go(back) : history.back())} className="-ml-2 rounded-lg px-2 py-1 text-lg text-dim" aria-label="Back">‹</button>
        )}
        <div className="min-w-0 flex-1 truncate text-[17px] font-semibold">{title}</div>
        {right}
      </header>
      <div className="screen-body min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="px-6 py-10 text-center text-sm leading-relaxed text-dim">{children}</p>;
}
