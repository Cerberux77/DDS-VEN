import "server-only";
import { sql } from "@/lib/db";
import { decideAccess, type AccessLevel, type Operation } from "@/lib/access-policy";
import type { SessionContext } from "@/lib/session";

export type ControlledDocument = {
  id: string;
  slug: string;
  title: string;
  phase: number;
  releaseState: Exclude<AccessLevel, "NONE">;
  classification: string;
  previewPayload: Record<string, unknown> | null;
  sourceStorageKey: string | null;
  previewStorageKey: string | null;
  grant: AccessLevel;
  canDownload: boolean;
  revoked: boolean;
};

export type DocumentListItem = Omit<
  ControlledDocument,
  "previewPayload" | "sourceStorageKey" | "previewStorageKey"
>;

function mapListRow(r: Record<string, unknown>): DocumentListItem {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    phase: Number(r.phase),
    releaseState: String(r.release_state) as ControlledDocument["releaseState"],
    classification: String(r.classification),
    grant: String(r.grant) as AccessLevel,
    canDownload: Boolean(r.can_download),
    revoked: Boolean(r.revoked),
  };
}

export async function listDocuments(session: SessionContext): Promise<DocumentListItem[]> {
  const db = sql();
  const rows = (await db`
    select d.id::text, d.slug, d.title, d.phase, d.release_state, d.classification,
           coalesce(ag.access_level::text, 'NONE') as grant,
           coalesce(ag.can_download, false) as can_download,
           (ag.revoked_at is not null or (ag.expires_at is not null and ag.expires_at <= now())) as revoked
    from documents d
    left join access_grants ag on ag.document_id = d.id and ag.user_id = ${session.userId}::uuid
    where d.active = true
    order by d.phase, d.sort_order, d.title
  `) as unknown as Array<Record<string, unknown>>;

  return rows.map(mapListRow);
}

export async function getDocument(
  session: SessionContext,
  id: string,
): Promise<ControlledDocument | null> {
  const db = sql();
  const rows = (await db`
    select d.id::text, d.slug, d.title, d.phase, d.release_state, d.classification,
           dv.preview_payload, dv.source_storage_key, dv.preview_storage_key,
           coalesce(ag.access_level::text, 'NONE') as grant,
           coalesce(ag.can_download, false) as can_download,
           (ag.revoked_at is not null or (ag.expires_at is not null and ag.expires_at <= now())) as revoked
    from documents d
    join document_versions dv on dv.document_id = d.id and dv.is_current = true
    left join access_grants ag on ag.document_id = d.id and ag.user_id = ${session.userId}::uuid
    where d.id = ${id}::uuid and d.active = true
    limit 1
  `) as unknown as Array<Record<string, unknown>>;

  const r = rows[0];
  if (!r) return null;

  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    phase: Number(r.phase),
    releaseState: String(r.release_state) as ControlledDocument["releaseState"],
    classification: String(r.classification),
    previewPayload: (r.preview_payload ?? null) as Record<string, unknown> | null,
    sourceStorageKey: r.source_storage_key ? String(r.source_storage_key) : null,
    previewStorageKey: r.preview_storage_key ? String(r.preview_storage_key) : null,
    grant: String(r.grant) as AccessLevel,
    canDownload: Boolean(r.can_download),
    revoked: Boolean(r.revoked),
  };
}

export function authorize(
  session: SessionContext,
  document: ControlledDocument,
  operation: Operation,
) {
  return decideAccess(
    {
      authenticated: true,
      termsAccepted: session.termsAccepted,
      grant: document.grant,
      documentState: document.releaseState,
      canDownload: document.canDownload,
      revoked: document.revoked,
    },
    operation,
  );
}
