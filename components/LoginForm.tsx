"use client";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Acceso no autorizado");
      setBusy(false);
      return;
    }
    location.assign("/terms");
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Contraseña
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      <p className="meta">La contraseña vigente caduca 72 horas después de la activación de esta revisión.</p>
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? "Validando…" : "Entrar al Deal Room"}</button>
    </form>
  );
}
