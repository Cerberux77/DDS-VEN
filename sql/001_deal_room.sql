create extension if not exists pgcrypto;

create type access_level as enum ('PREVIEW','RELEASED','SOURCE_RELEASED');
create type membership_role as enum ('ADMIN','VIEWER');

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  user_id uuid primary key references users(id) on delete cascade,
  organization_id uuid references organizations(id),
  role membership_role not null default 'VIEWER',
  created_at timestamptz not null default now()
);

create table invitations (
  id uuid primary key default gen_random_uuid(),
  email text,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table milestones (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  phase integer not null check (phase in (1,2)),
  satisfied_at timestamptz,
  evidence text,
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  phase integer not null check (phase in (1,2)),
  release_state access_level not null default 'PREVIEW',
  classification text not null default 'CONFIDENTIAL',
  sort_order integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  version text not null,
  sha256 text,
  preview_payload jsonb,
  preview_storage_key text,
  source_storage_key text,
  source_mime_type text,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  unique(document_id, version)
);
create unique index one_current_version_per_document on document_versions(document_id) where is_current;

create table access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  document_id uuid not null references documents(id) on delete cascade,
  milestone_id uuid references milestones(id),
  access_level access_level not null,
  can_download boolean not null default false,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  unique(user_id, document_id)
);

create table terms_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  body text not null,
  effective_at timestamptz not null,
  active boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index one_active_terms_version on terms_versions(active) where active;

create table access_sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create table terms_acceptances (
  user_id uuid not null references users(id) on delete cascade,
  terms_version_id uuid not null references terms_versions(id),
  session_id uuid references access_sessions(id),
  accepted_at timestamptz not null default now(),
  primary key(user_id, terms_version_id)
);

create table access_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  session_id uuid references access_sessions(id),
  user_id uuid references users(id),
  document_id uuid references documents(id),
  event_type text not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb
);
create index access_events_user_time on access_events(user_id, occurred_at desc);
create index access_events_document_time on access_events(document_id, occurred_at desc);

insert into organizations(name,slug) values ('SMSMantis','smsmantis') on conflict(slug) do nothing;
insert into terms_versions(version,body,effective_at,active)
values ('2026-10-01-v1', 'The materials presented in controlled-review sections are made available solely for evaluation and coordination. Access does not constitute contractual delivery, transfer of ownership, or release of underlying source materials. Redistribution is not authorized unless the relevant deliverable has been explicitly released.', now(), true)
on conflict(version) do nothing;

-- Curated Houston preview: no model source key is supplied.
insert into documents(slug,title,phase,release_state,classification,sort_order)
values ('houston-review-package','Houston Review Package',2,'PREVIEW','CONFIDENTIAL · CONTROLLED REVIEW',20)
on conflict(slug) do nothing;

insert into document_versions(document_id,version,preview_payload,is_current)
select id,'v1',jsonb_build_object(
 'heading','Houston Review Package',
 'summary','Curated Phase 2 material for executive review. Underlying formulas, editable workbooks and non-approved strategic materials remain restricted.',
 'items',jsonb_build_array('Economic case — approved review outputs','Operating ramp — selected assumptions','Organization and capability structure — review version','Decision points and open validations')
),true from documents where slug='houston-review-package'
on conflict(document_id,version) do nothing;

insert into documents(slug,title,phase,release_state,classification,sort_order)
values
 ('phase1-executive-report','Fase 1 · Resumen ejecutivo',1,'RELEASED','DELIVERED',1),
 ('phase1-economic-model','Fase 1 · Modelo económico aprobado',1,'RELEASED','DELIVERED',2),
 ('phase1-closing-package','Fase 1 · Paquete de cierre',1,'RELEASED','DELIVERED',3)
on conflict(slug) do nothing;

insert into document_versions(document_id,version,preview_payload,is_current)
select id,'v1',jsonb_build_object('heading',title,'summary','Entregable de Fase 1 identificado como RELEASED. La descarga sólo se habilita después de que el archivo final sea ingerido al almacenamiento privado y exista un grant explícito.'),true
from documents where slug in ('phase1-executive-report','phase1-economic-model','phase1-closing-package')
on conflict(document_id,version) do nothing;
