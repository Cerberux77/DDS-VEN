import "server-only";
import { sql } from "@/lib/db";

export type AuditEvent =
  | "LOGIN"
  | "LOGOUT"
  | "TERMS_ACCEPTED"
  | "VIEW"
  | "DOWNLOAD_GRANTED"
  | "DOWNLOAD_DENIED"
  | "ACCESS_DENIED";

export async function audit(input: {
  sessionId?: string | null;
  userId?: string | null;
  documentId?: string | null;
  event: AuditEvent;
  reason?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const db = sql();
  await db`
    insert into access_events(session_id, user_id, document_id, event_type, reason, metadata)
    values (${input.sessionId ?? null}::uuid, ${input.userId ?? null}::uuid, ${input.documentId ?? null}::uuid,
            ${input.event}, ${input.reason ?? null}, ${JSON.stringify(input.metadata ?? {})}::jsonb)
  `;
}
