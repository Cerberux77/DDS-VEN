import "server-only";
import { sql } from "@/lib/db";

export async function ensureViewerAccess(userId: string) {
  const db = sql();

  await db`
    insert into memberships(user_id, organization_id, role)
    select ${userId}::uuid, id, 'VIEWER'
    from organizations
    where slug = 'smsmantis'
    on conflict(user_id) do nothing
  `;

  await db`
    insert into access_grants(user_id, document_id, access_level, can_download)
    select
      ${userId}::uuid,
      d.id,
      case
        when d.slug = 'houston-review-package' then 'PREVIEW'::access_level
        else 'RELEASED'::access_level
      end,
      false
    from documents d
    where d.active = true
      and d.slug in (
        'houston-review-package',
        'phase1-executive-report',
        'phase1-economic-model',
        'phase1-closing-package'
      )
    on conflict(user_id, document_id) do update
      set access_level = excluded.access_level,
          can_download = false,
          revoked_at = null,
          expires_at = null,
          granted_at = now()
  `;
}
