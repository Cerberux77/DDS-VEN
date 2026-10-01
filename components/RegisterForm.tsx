"use client";
import { FormEvent, useState } from "react";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setDone(false);

    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "No fue posible completar el registro");
      setBusy(false);
      return;
    }

    setBusy(false);
    setDone(true);
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Teléfono
        <input name="phone" type="tel" required autoComplete="tel" />
      </label>
      <label>
        Contraseña
        <input name="password" type="password" required minLength={8} autoComplete="new-password" />
      </label>
      <label>
        Confirmar contraseña
        <input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
      </label>
      <p className="meta">
        El registro crea o renueva su acceso por 72 horas. Si el correo ya existe, el teléfono debe coincidir con el registrado.
      </p>
      {error && <p className="error">{error}</p>}
      {done && (
        <div className="successBox">
          Registro completado. Su contraseña quedó activa por 72 horas.
        </div>
      )}
      <div className="formActions">
        <button disabled={busy}>{busy ? "Registrando…" : "Registrar / Renovar acceso"}</button>
        <a className="secondaryButton" href="/login">Volver a iniciar sesión</a>
      </div>
    </form>
  );
}
