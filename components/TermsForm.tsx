"use client";
import { useState } from "react";
export function TermsForm() {
  const [busy, setBusy] = useState(false);
  async function accept() {
    setBusy(true);
    const r = await fetch("/api/terms/accept", { method: "POST" });
    if (r.ok) location.assign("/deal-room"); else setBusy(false);
  }
  return <button onClick={accept} disabled={busy}>{busy ? "Registrando aceptación…" : "Acepto y continuar"}</button>;
}
