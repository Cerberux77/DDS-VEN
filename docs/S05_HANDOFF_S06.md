# DDS-S05 Rev1 → S06 handoff
**Lifecycle:** CANDIDATE  
**Date:** 2026-10-03

## Frozen S05 interface
S06 must consume the server-derived `FleetScenario` contract. Do not reproduce S04 economics in browser code, Excel adapters, dashboards or alternate HTML logic.

Canonical entry points:
- `lib/dds/scenario-types.ts` — S04 selector and view-model contract.
- `lib/dds/s04-rev1-data.ts` — exact S04 machine-handoff economic snapshots and control values.
- `lib/dds/ewert-lean-2f-data.ts` — S02 AFE-backed physical 2F asset-family view.
- `lib/dds/scenario-core.ts` — server resolver; lookup/presentation composition only.
- `lib/dds/scenario-engine.ts` — `server-only` boundary.
- `POST /api/dds/scenario` — authenticated derived scenario endpoint.
- `/deal-room/fleet` — Rev1 five-view presentation layer.
- `docs/S05_S06_MACHINE_HANDOFF.json` — machine-readable handoff summary.

## Resolved economic authority
S04 Rev1 provides nine exact resolved scenarios:
- STATIC_2F × DSO45/60/90
- STATIC_3F × DSO45/60/90
- RAMP_3_TO_10 × DSO45/60/90

All are EWERT_LEAN + PURCHASE + TEMPORARY_ADMISSION + customs factor 65% + surety 2% + SURETY_BOND + Hydrocarbon Benefit OFF + Optional 4¾ OFF.

S05 does not interpolate or extrapolate economics for other selector combinations.

## Physical authority
For STATIC_2F + EWERT_LEAN:
- render actual S02 AFE asset families and S01/S02 interpretations;
- commercial KIT quantity and physical capacity are separate dimensions;
- shared backup / rotation / base pools are explicit;
- Crossovers are S01 conceptual/included BHA components if no separate AFE line exists. No quantity, price or asset_id is created.

For STATIC_3F and RAMP:
- label physical/economic views MODEL DERIVED;
- do not present projected asset lines as supplier quotes;
- retain the 2F Asset Register as the detailed AFE-backed anchor.

IDEAL and OPTIMIZED remain conceptual physical sensitivities and must never be visually conflated with EWERT_LEAN.

## Funding semantics
- Gross Peak Funding ≠ Required Equity.
- Confirmed Austral Asset Contribution currently equals USD 0 based on current documentary evidence.
- This status does not mean Austral owns zero equipment.
- Default Ramp DSO90 residual is labeled `Operating Cash / Collections Reconciliation`, not “negative working capital cost”.
- Target Funding Capacity = authoritative S04 output; S05 does not rebuild the bridge formula.

## Open gates
- leasing commercial terms;
- final customs validation / packing list;
- confirmed Austral asset-level credit;
- spares consumption/replenishment;
- support infrastructure scope;
- accounting classification;
- contract timing risk;
- S04 Excel persistence tooling recovery.

These are not S05 computational blockers. Unresolved selector combinations return controlled PENDING states.

## Release controls
PR #7 remains DRAFT. No merge and no production release without Manuel approval.

## S06 acceptance
S06 may proceed when CI confirms the S05 resolver/tests. If preview remains protected, use `READY_WITH_OPEN_VISUAL_GATE` provided:
- computational UI reconciliation passes;
- browser/server source boundary passes;
- blocker is specifically documented;
- production remains unchanged.
