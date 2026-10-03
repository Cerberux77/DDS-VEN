# DDS S05 Rev1 — Delta Report vs Previous S05
**Lifecycle:** CANDIDATE  
**Date:** 2026-10-03

## Executive delta
1. Existing PR #7 and branch were preserved; S05 was not rebuilt.
2. Economic selectors were rebased from generic Fronts 1–10 to the S04 Rev1 schema.
3. EWERT_LEAN is now distinct from IDEAL and OPTIMIZED.
4. S04 machine-handoff snapshots replaced prior pending S02/S03 financial placeholders.
5. 2F DSO45/60/90, 3F DSO45/60/90 and Ramp DSO45/60/90 now reconcile by exact lookup.
6. 2F supplier-backed AFE anchor remains prominent while the internal default remains Ramp 3→10.
7. Physical 2F rendering now uses AFE asset families, shared backups and rotation pools instead of identical sets.
8. MWD/PWD/Gamma commercial KIT quantity is separated from physical system capacity, preventing KIT double count.
9. Crossovers are shown only as conceptual/included/not separately priced; no asset economics are invented.
10. Optional 4¾ remains OFF by default; known CAPEX USD 179,603 is exposed only when selected, with unresolved logistics/customs flagged.
11. Leasing 18M/24M remains selectable but returns PENDING_LEASING.
12. Hydrocarbon Benefit ON returns PENDING_FORMAL_VALIDATION.
13. Gross Peak Funding is explicitly distinguished from Required Equity.
14. The Ramp funding residual is relabeled Operating Cash / Collections Reconciliation.
15. LIH remains NBV; the USD 78,000 desfase has no liquidity effect absent an event.

## No-second-engine check
The browser receives only a typed scenario view model through the authenticated API. It does not import S04 snapshot data or scenario-core. Economic values are not recomputed client-side.
