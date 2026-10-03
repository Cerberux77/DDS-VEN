# DDS Source-of-Truth Map — Rev2 Addendum
**Lifecycle:** CANDIDATE  
**Date:** 2026-10-03

| Layer | Rev2 authority | Status |
|---|---|---|
| Supplier source | Ewert `DDS Equipment_ 3 Jobs_Rev0.xlsx` | CANDIDATE source evidence |
| Physical architecture | `lib/dds/ewert-lean-3f-data.ts` derived from supplier AFE | CANDIDATE normalized/derived |
| Financial liquidity | `DDS_Venezuela_Rev2_Cash_Ramp_CANDIDATE_2026-10-03.xlsx` | CANDIDATE |
| Scenario computation | `lib/dds/s04-rev2-engine.ts` | CANDIDATE server authority |
| Presentation | `/deal-room/fleet` | CANDIDATE |
| Governance | `rebase-controls.rev2.json`, `open-gates.rev2.json`, release matrix Rev2 | CANDIDATE |
| CURRENT financial baseline | existing Drive canonical financial workbook | CURRENT, not silently replaced |

## Boundaries
Drive remains documentary/commercial source of truth. Git stores normalized/derived logic and metadata, not confidential originals. Browser presentation never becomes the calculation authority. Sensitive Gmail outbound remains Manuel-gated.
