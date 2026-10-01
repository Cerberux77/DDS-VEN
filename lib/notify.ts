import "server-only";

export async function notifyAccess(event: {
  type: "LOGIN" | "VIEW" | "DOWNLOAD_GRANTED" | "DOWNLOAD_DENIED";
  email: string;
  phone?: string;
  documentId?: string;
  sessionId: string;
}) {
  const webhook = process.env.ACCESS_NOTIFICATION_WEBHOOK;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...event, occurredAt: new Date().toISOString() }),
      cache: "no-store",
      signal: AbortSignal.timeout(2500)
    });
  } catch {
    // Notification delivery must never broaden or block access. Audit storage is authoritative.
  }
}
