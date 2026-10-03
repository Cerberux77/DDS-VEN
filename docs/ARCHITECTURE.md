# DDS Venezuela Controlled Deal Room — architecture

## Security boundary

The browser is never the authority. Every view/download decision is re-evaluated on the server against the active session, accepted terms, document release state and explicit per-user grant.

`PREVIEW` uses a derived representation (`preview_payload` or a separately rendered preview artifact). The original XLSX/PPTX/DOCX/model source is not placed under `public/`, not returned by the preview API and does not receive a stable public URL.

`SOURCE_RELEASED` is the only state in which the download route may read `source_storage_key`. Even then `can_download=true` is separately required.

## Phase semantics

- Phase 1: released contractual deliverables can be `RELEASED`; source only if explicitly agreed.
- Phase 2: starts `PREVIEW`; Houston package is a curated subset, not the whole phase.
- Milestones map to grants. Changing a document state alone cannot enlarge a user's grant.

## Screenshot control

A web app cannot guarantee screenshot prevention. The implemented control is attribution/deterrence: repeated dynamic watermark containing authenticated identity, UTC time and session ID, plus no-print CSS and restrictive browser policy. These client-side measures are not treated as the authorization boundary.

## Current source model

Drive baseline: `DDS_Venezuela_Modelo_Interactivo_24M.html`, last observed modified 2026-09-27. The source currently contains CSV export, scenario JSON save/import and print/PDF controls. Those capabilities are intentionally absent from PREVIEW.


## Cross-system governance

DDS-S06 adds a fail-closed governance layer without changing the browser security boundary described above. Drive originals are monitored through an explicit whitelist, Oreshnik records task/run/gate evidence, computational changes land in DDS-VEN through PRs, and sensitive outbound communication remains subject to a Manuel approval gate.

See:

- `docs/governance/ADR-0002-dds-governance-control-plane.md`
- `docs/governance/OPERATING_MANUAL.md`
- `config/governance/drive-whitelist.json`
- `schemas/governance/`


## Rev1 rebase governance

The governed economic/technical path is:

`supplier/Drive source → S02 normalization → S01 technical rules → S03 financial computation → S04 scenario engine → S05 presentation → QA → Manuel gate → release`.

The current repository topology remains a single `Cerberux77/DDS-VEN` application repository containing both computational and presentation domains. A separate deal-room repository is not part of Rev1.

A newer supplier source never mutates S03/S04/S05 by recency alone. The 2026-10-03 3F Rev0 AFE is a CANDIDATE under G12 and must traverse normalization/reconciliation before any downstream update.

PR #7's S05 architecture section must be composed with this document only after PR #6 is approved and merged. The deliberate procedure is recorded in `docs/governance/ARCHITECTURE_MERGE_PLAN.md`.


## S05 fleet configurator boundary

The repository currently contains both the controlled deal-room presentation layer and supporting server logic. S05 therefore introduces an explicit internal boundary rather than a third repository:

- `lib/dds/scenario-types.ts`: transport contract and selector enums only.
- `lib/dds/scenario-core.ts`: canonical S01/S04 physical fleet derivation, isolated from presentation.
- `lib/dds/scenario-engine.ts`: `server-only` entry point.
- `app/api/dds/scenario/route.ts`: authenticated derived-result endpoint.
- `app/deal-room/fleet/page.tsx` + `components/FleetConfigurator.tsx`: presentation only.

The client does not import the scenario core and does not calculate backup counts, CAPEX, funding or lease economics. S02 AFE values and S03 reconciled financial outputs are represented as explicit pending states until they are available. HYBRID 18M/24M does not assume an owned/leased split because that asset-by-asset rule is not frozen.

DDS-VEN is the current computational source and presentation/application repository. S05 is a logical presentation domain within DDS-VEN. A physical repository split requires the independent deployment/access/interface criteria in ADR-0002 and is not part of this release.
