-- DDS-VEN session signing key
-- The actual key is generated inside Neon and is never committed.
create table if not exists app_secrets (
  name text primary key,
  value text not null,
  created_at timestamptz not null default now(),
  rotated_at timestamptz
);

insert into app_secrets(name, value)
values ('session_hmac', encode(gen_random_bytes(32), 'hex'))
on conflict(name) do nothing;
