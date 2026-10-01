import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { audit } from "@/lib/audit";
import { notifyAccess } from "@/lib/notify";
import { ensureViewerAccess } from "@/lib/user-access";

const cleanEmail = (v: unknown) => String(v ?? "").trim().toLowerCase();
const cleanPhone = (v: unknown) => String(v ?? "").replace(/[^+0-9]/g, "").slice(0, 24);

type ExistingUser = {
  id: string;
  email: string;
  phone: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; phone?: string; password?: string; confirmPassword?: string }
    | null;

  const email = cleanEmail(body?.email);
  const phone = cleanPhone(body?.phone);
  const password = String(body?.password ?? "");
  const confirmPassword = String(body?.confirmPassword ?? "");

  if (!email.includes("@") || phone.length < 7) {
    return NextResponse.json({ error: "Correo o teléfono inválidos" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
  }

  const db = sql();
  const existingRows = (await db`
    select id::text, email, phone
    from users
    where lower(email) = ${email}
    limit 1
  `) as unknown as ExistingUser[];

  let userId: string;
  let mode: "created" | "renewed";

  const existing = existingRows[0];
  if (existing) {
    if (cleanPhone(existing.phone) !== phone) {
      return NextResponse.json(
        { error: "El correo ya está registrado con otro teléfono" },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(password);
    const updated = (await db`
      update users
      set password_hash = ${passwordHash},
          password_expires_at = now() + interval '72 hours',
          active = true,
          updated_at = now()
      where id = ${existing.id}::uuid
      returning id::text
    `) as unknown as Array<{ id: string }>;
    userId = updated[0].id;
    mode = "renewed";
  } else {
    const passwordHash = hashPassword(password);
    const created = (await db`
      insert into users(email, phone, password_hash, password_expires_at, active)
      values(${email}, ${phone}, ${passwordHash}, now() + interval '72 hours', true)
      returning id::text
    `) as unknown as Array<{ id: string }>;
    userId = created[0].id;
    mode = "created";
  }

  await ensureViewerAccess(userId);

  await audit({
    userId,
    event: "REGISTER",
    metadata: { email, mode },
  });

  await notifyAccess({
    type: "REGISTER",
    email,
    phone,
  });

  return NextResponse.json({ ok: true, mode });
}
