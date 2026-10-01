import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "@/lib/db";

let cachedSecret: string | null = null;

async function secret() {
  if (cachedSecret) return cachedSecret;

  const fromEnv = process.env.DEALROOM_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 32) {
    cachedSecret = fromEnv;
    return fromEnv;
  }

  const db = sql();
  const rows = (await db`
    select value
    from app_secrets
    where name = 'session_hmac'
    limit 1
  `) as unknown as Array<{ value: string }>;

  const value = rows[0]?.value;
  if (!value || value.length < 32) {
    throw new Error("Session signing secret is not configured");
  }

  cachedSecret = value;
  return value;
}

async function signature(payload: string) {
  return createHmac("sha256", await secret()).update(payload).digest("base64url");
}

export async function signSession(sessionId: string, userId: string) {
  const payload = Buffer.from(JSON.stringify({ sessionId, userId }), "utf8").toString("base64url");
  return `${payload}.${await signature(payload)}`;
}

export async function verifySessionCookie(value: string | undefined) {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = await signature(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sessionId: string;
      userId: string;
    };
  } catch {
    return null;
  }
}
