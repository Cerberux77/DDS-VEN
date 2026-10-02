# DDS-S05 → S06 handoff

## Frozen interface from S05

S06 must consume the server-derived `FleetScenario` contract. Do not reproduce S01/S04 fleet formulas in the browser, Excel adapters, dashboards, or presentation code.

Canonical entry points:

- `lib/dds/scenario-types.ts` — selectors and scenario DTO.
- `lib/dds/scenario-core.ts` — physical fleet derivation.
- `lib/dds/scenario-engine.ts` — server-only boundary.
- `POST /api/dds/scenario` — authenticated derived scenario result.
- `/deal-room/fleet` — presentation layer.

## Reconciled physical rules

For each diameter (12 1/4 and 8 1/2):

- MAIN = F.
- IDEAL BACKUP = F.
- OPTIMIZED BACKUP = CEILING(F/2).
- Diameters are not interchangeable.
- Backup coverage is explicit in every asset record.

S05 QA covers Fronts 1–10 and validates required-set count, allocation count, and backup coverage.

## Financial gates intentionally left open

Do not replace these with estimates or hardcodes:

1. Normalized S02 AFE values by asset.
2. S02 asset-by-asset OWNED vs LEASED allocation for HYBRID 18M/24M.
3. Exact economic meaning of the stated 16% leasing CoC (APR/effective/nominal/flat).
4. Purchase/down-payment/import/commissioning/deposit/buyout/balloon terms where applicable.
5. S03 reconciled M1–M24 outputs for Peak Funding and 24M Financial Impact.
6. Location, owner evidence, surface/telemetry allocation, and minimum spares/support quantities.

Until those inputs are frozen, the API returns explicit `PENDING_AFE` / `PENDING_S03` states.

## S06 integration sequence

1. Add an S02 asset-register adapter behind the scenario engine; preserve the existing DTO.
2. Resolve HYBRID allocation asset-by-asset and enforce `owned + leased = available fleet`.
3. Add an S03 financial-output adapter for Equipment CAPEX, Upfront Cash, Peak Funding, Lease Cost, and 24M Financial Impact.
4. Add snapshot fixtures exported from the canonical Excel/scenario engine and test exact parity.
5. Extend reconciliation so economic status becomes PASS only when S02/S03 values have canonical evidence.
6. Keep the client presentation-only and retain the approved Mantis visual identity.
7. Do not expose source workbooks or editable model files through PREVIEW routes.

## Release gate for S06

A scenario may be labeled fully reconciled only when:

- physical set count matches the canonical engine;
- backup coverage is valid by diameter;
- owned + leased equals available fleet when acquisition allocation is applicable;
- all displayed financial values match canonical S02/S03/Excel outputs for the same selectors;
- no UI-only formula can change those values.

## S05 deployment note

S05 is isolated in draft PR #7 on branch `run/dds-s05-fleet-configurator`. Production is unchanged until the PR is reviewed/merged.
