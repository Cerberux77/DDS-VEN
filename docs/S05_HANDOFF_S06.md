# DDS-S05 Rev2 → Governance / Release handoff
**Lifecycle:** CANDIDATE  
**Date:** 2026-10-03

## Rev2 management base
The current management base is no longer the Rev1 gross-purchase case.

- Installed capacity: **3F capable**.
- Revenue fronts at startup: **2**.
- Ewert/Austral contributes the technical fleet in kind, including the **PR2 6¾** production/lateral resistivity package.
- Panthers funds the **PR2 8¼** intermediate resistivity package, infrastructure, workshop/breakout tooling, operation office/IT, vehicles, forklift and all import/logistics cash.
- PR2 8¼ tools: **USD 2,481,500**, paid **50% M0 / 50% M6**.
- PR2 8¼ peripherals / shared support provisioned for M6: **USD 339,500**.
- Full resistivity revenue begins **M7**.
- M4–M6 bridge: 12¼ directional service without resistivity; 8½ production/lateral with Ewert-contributed PR2 6¾.

## Supplier-backed 3F asset base
- Required 3F Base AFE: **USD 9,410,762**.
- Austral/Ewert in-kind contribution: **USD 5,988,435**.
- Panthers cash uses before operating working capital: **USD 5,151,092.51**.

The old statement **“Austral confirmed contribution = USD 0”** is superseded.

## Liquidity controls
| DSO | Peak Funding before floor | Target Liquid Capacity |
|---|---:|---:|
| 45 | USD 5,285,982 | USD 5,446,179 |
| 60 | USD 5,573,254 | USD 5,733,450 |
| 90 | USD 6,147,796 | **USD 6,307,993** |

Peak occurs at **M6**, driven by the PR2 8¼ balance, peripherals and late import/surety.

## Well geometry / sliders
S04 Rev2 owns the calculations. The browser remains presentation-only.

- Intermediate 12¼ default: **1,800 ft**, slider 1,200–5,500 ft.
- Production/lateral 8½ default: **4,400 ft**, slider 3,000–6,500 ft.
- Full-service revenue at default geometry: **USD 600,000/well**.
- Bridge revenue at default geometry: **USD 574,542.86/well**.
- The server recalculates revenue and cash when either slider changes.

## Physical architecture correction
The new 3 Jobs AFE confirms a **shared directional core + diameter-specific packages** architecture.

- MWD: 2.5 commercial KIT = 5 physical strings = 3 main + 2 backup.
- PWD/Gamma core follows the shared directional pool.
- PR2, pressure subs, mud motors, float subs, jars, NMDC, stabilizers and UBHO remain diameter-specific.
- PR2 8¼: Panthers-funded, 5 tools = 3 operating + 2 backup.
- PR2 6¾: Ewert/Austral contribution, 5 tools = 3 operating + 2 backup.
- 4¾ capability remains optional and excluded from base.
- Crossovers remain conceptual/included/not separately priced.

## Base infrastructure
- Warehouse slab / building: **60m × 40m = 2,400 m²**.
- 3-month construction ramp M1–M3.
- Includes slab, reasonable external concrete yard, 5t bridge crane, 150–200A three-phase power, backup generation, office/AC/bathrooms and IT.
- Four pickups are purchased progressively from M2 to M4.
- 5t forklift is cash CAPEX.
- Chuto + batea is **rented OPEX**, contract reference **2 ACT/well**.

## Superseded Rev1 management outputs
Do not present these as current:
- 3F equipment = USD 10,283,636 MODEL_DERIVED.
- Ramp 3→10 = USD 22,960,556 Gross Peak Funding as management base.
- Austral asset contribution = USD 0 confirmed.
- Separate USD 200k crusher placeholder.

Growth beyond the supplier-backed 3F package now returns **PENDING_S04_RESOLUTION** until partner-contribution scaling is rebuilt.

## Release controls
PR #7 remains the only S05 branch/PR. No second economic engine is permitted in the browser.

Open gates:
- leasing terms;
- final customs validation / packing list;
- spares consumption and replenishment;
- accounting classification;
- canonical S03/S04 Excel integration;
- protected Vercel visual QA.

LIH remains **NBV**.

## Merge gate
PR #7 may be reviewed after Rev2 CI is green and the persisted evidence/handoff is reconciled. Production release remains a separate manual gate.
