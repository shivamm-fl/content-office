// Each agent is a small robot in the LearnAI style (a cousin of Bit), tinted in the agent's colour.
import type { AgentStatus } from "@office/protocol";

export function Avatar({ color, status = "idle", size = 44 }: { color: string; status?: AgentStatus; size?: number }) {
  const eye = status === "waiting" ? "#F2B544" : status === "blocked" ? "#F07F6A" : "#F3EFE6";
  const asleep = status === "offline";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <line x1="24" y1="4.5" x2="24" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.6" fill={color} />
      <rect x="6" y="10" width="36" height="31" rx="11" fill={color} />
      <rect x="11" y="16" width="26" height="19" rx="7" fill="#0B1220" />
      {asleep ? (
        <>
          <path d="M16.5 25.5h5M26.5 25.5h5" stroke={eye} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="19" cy="24.5" r="2.7" fill={eye} />
          <circle cx="29" cy="24.5" r="2.7" fill={eye} />
          {status === "working"
            ? <path d="M20.5 30.5h7" stroke={eye} strokeWidth="1.8" strokeLinecap="round" />
            : <path d="M20 29.5q4 3 8 0" stroke={eye} strokeWidth="1.8" fill="none" strokeLinecap="round" />}
        </>
      )}
    </svg>
  );
}

const TITLES = ["Intern", "Junior", "Associate", "Senior", "Lead", "Principal", "Director"];

/** XP is finished work. Level n needs 2*(n-1)^2 pieces: 0, 2, 8, 18, 32, 50, 72. */
export function level(done = 0) {
  const lv = 1 + Math.floor(Math.sqrt(done / 2));
  const from = 2 * (lv - 1) ** 2;
  const to = 2 * lv ** 2;
  return { lv, title: TITLES[Math.min(lv, TITLES.length) - 1], progress: (done - from) / (to - from), toNext: to - done };
}
