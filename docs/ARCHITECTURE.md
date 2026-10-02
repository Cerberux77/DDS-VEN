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

## S05 fleet configurator boundary

The repository currently contains both the controlled deal-room presentation layer and supporting server logic. S05 therefore introduces an explicit internal boundary rather than a third repository:

- `lib/dds/scenario-types.ts`: transport contract and selector enums only.
- `lib/dds/scenario-core.ts`: canonical S01/S04 physical fleet derivation, isolated from presentation.
- `lib/dds/scenario-engine.ts`: `server-only` entry point.
- `app/api/dds/scenario/route.ts`: authenticated derived-result endpoint.
- `app/deal-room/fleet/page.tsx` + `components/FleetConfigurator.tsx`: presentation only.

The client does not import the scenario core and does not calculate backup counts, CAPEX, funding or lease economics. S02 AFE values and S03 reconciled financial outputs are represented as explicit pending states until they are available. HYBRID 18M/24M does not assume an owned/leased split because that asset-by-asset rule is not frozen.

Target repository ownership remains: DDS-VEN for rules/model/data and dds-venezuela-deal-room for UI/presentation/access. The current boundary is structured so the UI can be extracted when the separate deal-room repository is versioned and accessible.
