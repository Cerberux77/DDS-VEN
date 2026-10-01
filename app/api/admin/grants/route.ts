import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/session";
import { sql } from "@/lib/db";
import { ACCESS_LEVELS, type AccessLevel } from "@/lib/access-policy";

export async function POST(req: Request) {
  const session = await getSessionContext();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null) as null | {
    email?: string; documentId?: string; accessLevel?: AccessLevel; canDownload?: boolean; milestoneCode?: string; expiresAt?: string | null;
  };
  const email = String(body?.email ?? "").trim().toLowerCase();
  const documentId = String(body?.documentId ?? "");
  const level = body?.accessLevel;
  if (!email.includes("@") || !documentId || !level || level === "NONE" || !ACCESS_LEVELS.includes(level)) {
    return NextResponse.json({ error: "Invalid grant request" }, { status: 400 });
  }
  const db = sql();
  const users = await db`select id::text from users where email=${email} and active=true limit 1` as unknown as Array<{id:string}>;
  if (!users[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const milestones = body?.milestoneCode
    ? await db`select id::text from milestones where code=${body.milestoneCode} and satisfied_at is not null limit 1` as unknown as Array<{id:string}>
    : [];
  if (body?.milestoneCode && !milestones[0]) return NextResponse.json({ error: "Milestone not satisfied" }, { status: 409 });
  const expires = body?.expiresAt ? new Date(body.expiresAt) : null;
  if (expires && Number.isNaN(expires.valueOf())) return NextResponse.json({ error: "Invalid expiry" }, { status: 400 });
  await db`
    insert into access_grants(user_id,document_id,milestone_id,access_level,can_download,expires_at,revoked_at)
    values(${users[0].id}::uuid,${documentId}::uuid,${milestones[0]?.id ?? null}::uuid,${level}::access_level,${Boolean(body?.canDownload)},${expires?.toISOString() ?? null}::timestamptz,null)
    on conflict(user_id,document_id) do update set milestone_id=excluded.milestone_id, access_level=excluded.access_level,
      can_download=excluded.can_download, expires_at=excluded.expires_at, revoked_at=null, granted_at=now()
  `;
  return NextResponse.json({ ok: true, email, documentId, accessLevel: level, canDownload: Boolean(body?.canDownload) });
}
