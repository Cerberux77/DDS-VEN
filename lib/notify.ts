import "server-only";

export type NotificationEvent = {
  type: "REGISTER" | "LOGIN" | "VIEW" | "DOWNLOAD_GRANTED" | "DOWNLOAD_DENIED";
  email: string;
  phone?: string;
  documentId?: string;
  sessionId?: string;
};

async function postWebhook(payload: Record<string, unknown>) {
  const webhook = process.env.ACCESS_NOTIFICATION_WEBHOOK;
  if (!webhook) return false;
  await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(3500),
  });
  return true;
}

async function sendTransactionalEmail(payload: NotificationEvent & { occurredAt: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ACCESS_NOTIFICATION_EMAIL;
  const from = process.env.ACCESS_NOTIFICATION_FROM;
  if (!apiKey || !to || !from) return false;

  const label =
    payload.type === "REGISTER" ? "Nuevo registro" :
    payload.type === "LOGIN" ? "Nuevo acceso" :
    payload.type === "VIEW" ? "Documento visualizado" :
    payload.type === "DOWNLOAD_GRANTED" ? "Descarga autorizada" :
    "Descarga denegada";

  const lines = [
    label + " · DDS Venezuela Deal Room",
    "",
    "Usuario: " + payload.email,
    payload.phone ? "Teléfono: " + payload.phone : null,
    payload.documentId ? "Documento: " + payload.documentId : null,
    payload.sessionId ? "Sesión: " + payload.sessionId : null,
    "Fecha UTC: " + payload.occurredAt,
  ].filter(Boolean);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: "Bearer " + apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: label + " · DDS Venezuela Deal Room",
      text: lines.join("\n"),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Transactional email provider rejected notification");
  return true;
}

export async function notifyAccess(event: NotificationEvent) {
  const payload = { ...event, occurredAt: new Date().toISOString() };
  const results = await Promise.allSettled([
    postWebhook(payload),
    sendTransactionalEmail(payload),
  ]);
  return results.some((result) => result.status === "fulfilled" && result.value === true);
}

export function notificationChannels() {
  return {
    webhook: Boolean(process.env.ACCESS_NOTIFICATION_WEBHOOK),
    email: Boolean(
      process.env.RESEND_API_KEY &&
      process.env.ACCESS_NOTIFICATION_EMAIL &&
      process.env.ACCESS_NOTIFICATION_FROM
    ),
  };
}
