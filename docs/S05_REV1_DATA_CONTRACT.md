# DDS S05 Rev1 — Data Contract / Schema Consumed from S04
**Lifecycle:** CANDIDATE  
**Authority date:** 2026-10-03

## Boundary
S05 is a presentation / interaction layer. It does not calculate CAPEX, Peak Funding, DSO, AR, FCF, EBITDA, surety, customs, asset scaling economics or leasing.

Economic flow:
`S04 Rev1 machine handoff → server-side scenario resolver → typed FleetScenario DTO → authenticated UI`.

Physical flow:
`S01 architecture + S02 normalized Asset Register → server-side physical view model → authenticated UI`.

## Scenario selectors
- frontConfiguration: STATIC_2F | STATIC_3F | RAMP_3_TO_10
- technical: EWERT_LEAN | IDEAL | OPTIMIZED
- acquisition: PURCHASE | HYBRID_LEASE_18M | HYBRID_LEASE_24M
- dso: 45 | 60 | 90
- customsMode: TEMPORARY_ADMISSION | DEFINITIVE_IMPORT_STRESS
- customsValueFactor: 1.00 | 0.80 | 0.65 | CUSTOM
- suretyRate: 0.01 | 0.02 | 0.03 | CUSTOM
- guaranteeMode: SURETY_BOND | CASH_COLLATERAL_STRESS | CUSTOM
- hydrocarbonBenefit: OFF | ON
- optional475: NO | YES
- futureTechnicalFrontCount: 1..10, physical sensitivity only for IDEAL/OPTIMIZED

## Resolved economic snapshot matrix
The current S05 handoff contains exactly nine resolved PURCHASE / EWERT_LEAN / Temporary Admission / 65% customs value / 2% surety / Surety Bond / Optional 4¾ OFF scenarios:
- 2F at DSO45/60/90
- 3F at DSO45/60/90
- Ramp 3→10 at DSO45/60/90

Other schema-valid combinations remain selectable but S05 returns a pending state instead of recalculating economics.

## Funding labels
- `grossPeakFunding` is Gross Peak Funding Requirement, not Required Equity.
- Confirmed Austral Asset Contribution is currently USD 0 by evidence.
- `netPeakFunding = grossPeakFunding` only because confirmed contribution is currently zero.
- This does not mean Austral owns zero equipment.

## 2F AFE physical model
EWERT_LEAN 2F uses S02 asset-family records. Commercial KIT quantity and physical capacity are distinct. Example: MWD/PWD/Gamma each expose 2 commercial KIT and 4 physical systems; S05 never multiplies KIT purchase value by physical system count.

Crossovers are treated as S01 conceptual/included BHA components when no separate AFE line item exists. S05 assigns no invented quantity, price or asset_id.
