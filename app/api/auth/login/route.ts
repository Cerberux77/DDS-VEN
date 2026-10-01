import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { sql } from "@/lib/db";
import { signSession } from "@/lib/crypto";
import { verifyLegacyPassword } from "@/lib/password";
import { SESSION_COOKIE } from "@/lib/session";
import { audit } from "@/lib/audit";
import { notifyAccess } from "@/lib/notify";
import { ensureViewerAccess } from "@/lib/user-access";

const cleanEmail = (v: unknown) => String(v ?? "").trim().toLowerCase();

type LoginUser = {
  id: string;
  email: string;
  phone: string;
  password_hash: string | null;
  password_expires_at: string | null;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = cleanEmail(body?.email);
  const password = String(body?.password ?? "");

  if (!email.includes("@") || password.length < 1) {
    return NextResponse.json({ error: "Datos de acceso inválidos" }, { status: 400 });
  }

  const db = sql();
  const rows = (await db`
    select
      id::text,
      email,
      phone,
      password_hash,
      password_expires_at::text
    from users
    where lower(email) = ${email}
      and active = true
    limit 1
  `) as unknown as LoginUser[];

  const user = rows[0];
  if (!user?.password_hash || !verifyLegacyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 403 });
  }

  if (!user.password_expires_at || new Date(user.password_expires_at).getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Contraseña expirada. Regístrese nuevamente para renovar el acceso por 72 horas." },
      { status: 403 },
    );
  }

  await ensureViewerAccess(user.id);

  const sessionId = randomUUID();
  await db`
    insert into access_sessions(id, user_id, expires_at)
    values(
      ${sessionId}::uuid,
      ${user.id}::uuid,
      least(${user.password_expires_at}::timestamptz, now() + interval '72 hours')
    )
  `;

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, signSession(sessionId, user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 72,
  });

  await audit({
    sessionId,
    userId: user.id,
    event: "LOGIN",
    metadata: { email, auth: "password" },
  });
  await notifyAccess({
    type: "LOGIN",
    email: user.email,
    phone: user.phone,
    sessionId,
  });

  return response;
}
