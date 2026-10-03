# DDS S05 Rev1 — QA / Reconciliation Report
**Lifecycle:** CANDIDATE  
**Date:** 2026-10-03

## Automated controls encoded
- 2F Peak Funding DSO45: 7,502,982.579450832
- 2F Peak Funding DSO60: 7,802,982.579450832
- 2F Peak Funding DSO90: 8,144,427.045176248
- 3F Peak Funding DSO90: 12,382,318.149388993
- Ramp Peak Funding DSO45: 19,253,216.92581714
- Ramp Peak Funding DSO60: 20,453,216.925817143
- Ramp Peak Funding DSO90: 22,960,556.247195095
- 2F FCF DSO90: +4,405,332.822590001
- Ramp FCF DSO90: -2,754,127.172319226
- Equipment: 2F 6,554,286; 3F 10,283,636; 10F 30,398,086
- Optional 4¾ default OFF; known CAPEX 179,603
- Leasing unresolved economics remain pending/null
- Hydrocarbon benefit ON remains pending formal validation
- LIH = NBV
- Gross Peak Funding is not Required Equity
- Austral confirmed credit 0 is worded as evidence status, not zero owned assets
- MWD KIT double-count control
- PR2 shared-backup and motor rotation-pool controls
- Crossovers have no invented asset_id/quantity/price
- UI does not import S04 raw data or scenario-core
- All nine core economic scenarios report S04_HANDOFF reconciliation

## Visual QA checklist
- desktop: no clipped KPI cards, selector readability, five-view navigation, funding bridge labels, source badges
- mobile/responsive: no horizontal page overflow; selector/KPI grids collapse; asset drilldown becomes single-column
- no raw JSON exposed
- 2F and Ramp values remain scenario-scoped
- 2F physical pools are distinguishable as active / backup / rotation / shared
- asset drilldown displays commercial and physical quantities separately
