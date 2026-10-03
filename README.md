# SMSMantis · DDS Venezuela Controlled Deal Room

Governed DDS Venezuela Controlled Deal Room. Application source is canonical in `Cerberux77/DDS-VEN`; Oreshnik issue `Cerberux77/oreshnik#232` is the governance anchor for task `S-SM-DDS-DEALROOM-01`.

## What is implemented

- Next.js 16 App Router shell for Vercel.
- Neon/Postgres schema for identity, invitations, milestones, documents/versions, grants, terms, sessions and audit events.
- Three access levels: `PREVIEW`, `RELEASED`, `SOURCE_RELEASED`.
- Server-side access policy with fail-closed tests.
- Per-user registration with email + phone + single-use invitation token; no shared password stored.
- Versioned Controlled Review Terms gate.
- Dynamic watermark with email + UTC timestamp + session ID.
- Preview endpoint returns only derived payloads.
- Source download endpoint requires `SOURCE_RELEASED` + `can_download=true`.
- `Cache-Control: private, no-store`, frame denial, restrictive CSP and no-print CSS.
- Audit events for views, accepts, login/logout and download decisions.

## Critical design rule

Do not put the current economic-model HTML, XLSX, PPTX, DOCX or PDFs in `public/` for Phase 2. The present standalone economic-model HTML executes formulas in the browser and therefore its JavaScript is itself source material. In PREVIEW, publish only curated/derived outputs. If an interactive browser model must be exposed before source release, its calculations must first be moved server-side.

## Local setup

1. Create a Neon development branch/project and run `sql/001_deal_room.sql` there.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and `DEALROOM_SESSION_SECRET`.
3. Create an invitation token by inserting its SHA-256 hash into `invitations`.
4. Install dependencies with `npm install` and run `npm run verify`.
5. Run `npm run dev`.

Example invite hash (do not use a real token on the command line in shared logs): compute SHA-256 locally and insert only the hash.

## Oreshnik governance

The application repository is `Cerberux77/DDS-VEN`. Oreshnik remains the governance/control-plane layer through task `S-SM-DDS-DEALROOM-01` and issue `Cerberux77/oreshnik#232`; application source must not be copied into the Oreshnik repository. Governed changes are developed on a task branch, validated through the task gates, reviewed through a PR in `DDS-VEN`, and only then integrated/deployed.

Current governed branch: `run/dds-vercel-link-trigger-01`.

## Deployment

The Vercel project `dds-venezuela-portal` is connected to `Cerberux77/DDS-VEN`. Production deployments are expected from the `main` branch after the Git integration is connected. This repository-level metadata update is intentionally harmless and may be used to trigger the first deployment after linking the repository.

## Access notifications

Set `ACCESS_NOTIFICATION_WEBHOOK` to a private server endpoint to receive LOGIN/VIEW/download-decision notifications. Notification failure never changes authorization; the Neon audit log remains authoritative. This avoids coupling access security to email/WhatsApp availability.

## Progressive release administration

`POST /api/admin/grants` is restricted to an authenticated `ADMIN`. It can raise or lower a user's explicit document grant without a deployment. If a `milestoneCode` is supplied, that milestone must already be marked satisfied. A broad user grant still cannot exceed the document's own release state.


## DDS-S06 governance layer

Cross-system change governance is defined by `docs/governance/ADR-0002-dds-governance-control-plane.md`.

Key invariants:

- Google Drive remains the source of truth for commercial/documental originals.
- Drive ingestion is whitelist-based; folder membership or recency never promotes a file automatically.
- `CURRENT` baseline replacement requires an explicit Manuel approval gate.
- Model-affecting changes require normalization, tests and financial reconciliation before release.
- Mantis identity rules are consumed from `config/brand/smsmantis.tokens.json`; the complete manual stays in Drive.
- Economic, legal, contract, AFE and partner-commitment Gmail messages may be drafted automatically but may not be sent without explicit Manuel approval.
- Oreshnik governance anchor for S06: `Cerberux77/oreshnik#233`.
