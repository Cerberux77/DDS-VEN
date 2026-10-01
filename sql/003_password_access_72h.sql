-- DDS-VEN production authentication transition
-- Applied 2026-10-01 under governed run DDS-PASSWORD-72H-01.
-- Existing password_hash values are preserved. Only the access window changes.

alter table users
  add column if not exists password_expires_at timestamptz;

-- One-time activation executed in Neon production:
--   update users
--   set password_expires_at = now() + interval '72 hours',
--       updated_at = now()
--   where password_hash is not null;
--
-- The one-time UPDATE is intentionally documented, not replayed automatically,
-- so future migrations do not extend credentials by accident.
