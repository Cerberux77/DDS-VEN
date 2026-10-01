export function Watermark({ email, sessionId }: { email: string; sessionId: string }) {
  const stamp = new Intl.DateTimeFormat("en-CA", { dateStyle: "short", timeStyle: "medium", timeZone: "UTC" }).format(new Date());
  const label = `CONTROLLED REVIEW · ${email} · ${stamp} UTC · ${sessionId.slice(0, 8)}`;
  return (
    <div className="watermark" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => <span key={i}>{label}</span>)}
    </div>
  );
}
