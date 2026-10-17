// Owner session cookies (HMAC-signed, no server state) and small crypto helpers.

const enc = new TextEncoder();

export function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function hmacHex(secret: string, data: string | Uint8Array): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), typeof data === "string" ? enc.encode(data) : data);
  return [...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function randomToken(bytes = 32): string {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export const SESSION_COOKIE = "office_session";
const SESSION_DAYS = 90;

export async function makeSession(secret: string, sub: string): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ sub, exp: Date.now() + SESSION_DAYS * 864e5 })));
  return `${payload}.${await hmacHex(secret, payload)}`;
}

export async function readSession(secret: string, cookieHeader: string | null): Promise<string | null> {
  if (!cookieHeader) return null;
  const m = cookieHeader.split(/;\s*/).find((c) => c.startsWith(SESSION_COOKIE + "="));
  if (!m) return null;
  const [payload, sig] = m.slice(SESSION_COOKIE.length + 1).split(".");
  if (!payload || !sig) return null;
  if (!timingSafeEqual(sig, await hmacHex(secret, payload))) return null;
  try {
    const { sub, exp } = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
    return typeof sub === "string" && exp > Date.now() ? sub : null;
  } catch {
    return null;
  }
}

export function sessionCookie(value: string, clear = false): string {
  const age = clear ? 0 : SESSION_DAYS * 86400;
  return `${SESSION_COOKIE}=${clear ? "" : value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
}
