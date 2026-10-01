import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { verifySessionCookie } from "@/lib/crypto";

export const SESSION_COOKIE = "dr_session";

export type SessionContext = {
  sessionId: string;
  userId: string;
  email: string;
  phone: string;
  role: "ADMIN" | "VIEWER";
  termsAccepted: boolean;
};

export async function getSessionContext(): Promise<SessionContext | null> {
  const jar = await cookies();
  const token = verifySessionCookie(jar.get(SESSION_COOKIE)?.value);
  if (!token) return null;
  const db = sql();
  const rows = await db`
    select s.id::text as session_id, u.id::text as user_id, u.email, u.phone, m.role,
      exists(
        select 1 from terms_acceptances ta
        join terms_versions tv on tv.id = ta.terms_version_id
        where ta.user_id = u.id and tv.active = true
      ) as terms_accepted
    from access_sessions s
    join users u on u.id = s.user_id
    join memberships m on m.user_id = u.id
    where s.id = ${token.sessionId}::uuid
      and u.id = ${token.userId}::uuid
      and s.revoked_at is null
      and s.expires_at > now()
      and u.active = true
    limit 1
  ` as unknown as Array<Record<string, unknown>>;
  const row = rows[0];
  if (!row) return null;
  return {
    sessionId: String(row.session_id),
    userId: String(row.user_id),
    email: String(row.email),
    phone: String(row.phone),
    role: row.role === "ADMIN" ? "ADMIN" : "VIEWER",
    termsAccepted: Boolean(row.terms_accepted)
  };
}

export async function requireSession(requireTerms = true) {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  if (requireTerms && !session.termsAccepted) redirect("/terms");
  return session;
}
