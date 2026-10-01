import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const v = process.env.DEALROOM_SESSION_SECRET;
  if (!v || v.length < 32) throw new Error("DEALROOM_SESSION_SECRET must be at least 32 characters");
  return v;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signSession(sessionId: string, userId: string) {
  const payload = Buffer.from(JSON.stringify({ sessionId, userId }), "utf8").toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifySessionCookie(value: string | undefined) {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = signature(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sessionId: string; userId: string };
  } catch {
    return null;
  }
}
