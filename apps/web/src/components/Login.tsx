import { useState } from "react";
import { api } from "../api";

export function Login({ onDone }: { onDone: () => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try { await api("/api/login", { method: "POST", json: { key } }); onDone(); }
    catch (err) { setError((err as Error).message === "wrong key" ? "That key is not right." : (err as Error).message); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="safe-top mx-auto flex h-full max-w-sm flex-col justify-center px-6">
      <img src="/icon-192.png" alt="" className="h-16 w-16 rounded-2xl" />
      <h1 className="mt-5 text-2xl font-semibold">Content Office</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-dim">Enter your office key. You stay signed in on this phone for 90 days.</p>
      <input value={key} onChange={(e) => setKey(e.target.value)} type="password" autoComplete="current-password" placeholder="Office key"
        className="mt-6 rounded-xl border border-wall bg-desk px-4 py-3 text-[15px] outline-none focus:border-gold" />
      {error && <p className="mt-2 text-sm text-coral">{error}</p>}
      <button disabled={busy || !key} className="mt-4 rounded-xl bg-gold py-3 font-semibold text-ink">Sign in</button>
    </form>
  );
}
