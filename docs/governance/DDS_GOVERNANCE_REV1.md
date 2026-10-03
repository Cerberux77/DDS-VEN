# DDS Governance Rev1 — Economic & Technical Rebase Release Candidate

**Lifecycle:** CANDIDATE  
**Communication state:** INTERNAL_MANAGEMENT_DRAFT  
**Control plane:** Cerberux77/oreshnik#233  
**Implementation:** DDS-VEN PR #6 / `run/dds-s06-governance-01`  
**Merge / production release:** NOT AUTHORIZED

## Executive delta

S06 now governs the executed S01→S05 Rev1 chain rather than the earlier pre-AFE state.

- S01 physical architecture is DDS Equipment Architecture v2.1 / EWERT_LEAN reconciled.
- S02 2F supplier AFE is source-backed: gross USD 6,733,889; optional 4¾ USD 179,603; required base USD 6,554,286.
- S03 computation is valid and reconciled; final Rev1 XLSX persistence/formula/visual gate remains open.
- S04 machine engine is computationally ready with 20/20 QA; final Excel Rev1 persistence remains open.
- S05 PR #7 is computationally reconciled, CI green and preview deployed; authorized visual QA remains open.
- S06 adds lifecycle, evidence, promotion, wording, LIH, outbound, PR merge and release gates.
- A new supplier 3F Rev0 AFE arrived on 2026-10-03. It is registered as CANDIDATE, not promoted.
- New 3F supplier gross = USD 9,590,365; required base ex optional 4¾ = USD 9,410,762.
- Current S04 3F control = USD 10,283,636 MODEL_DERIVED. Reconciliation delta = -USD 872,874; G12 is open.
- No new supplier input changes CURRENT silently.
- No economic/legal/contract/AFE/funding/partner outbound may send without Manuel approval.
- No PR merge or production release is performed by this release candidate.

## Governed chain

`SOURCE → NORMALIZATION → TECHNICAL RULE → ECONOMIC MODEL → SCENARIO ENGINE → UI → QA → APPROVAL → RELEASE`

| Stage | Rev1 authority | State |
|---|---|---|
| SOURCE | Ewert/Austral 2F Rev0 AFE; new 3F Rev0 candidate | 2F CURRENT source / 3F CANDIDATE |
| NORMALIZATION | S02 Rev0 AFE Asset Gap / Leasing | CANDIDATE |
| TECHNICAL RULE | S01 DDS Equipment Architecture v2.1 | CANDIDATE, reconciled |
| ECONOMIC MODEL | S03 Rev1 machine computation | COMPUTATION_VALID / artifact gate open |
| SCENARIO ENGINE | S04 Rev1 machine handoff | COMPUTATIONAL_READY / Excel gate open |
| UI | S05 PR #7 | CANDIDATE / visual access gate open |
| QA | S03/S04/S05 test evidence | computational PASS with disclosed open gates |
| APPROVAL | Manuel | REQUIRED for baseline promotion, merge, release and sensitive send |
| RELEASE | Not executed | BLOCKED by human gates |

## Canonical economic controls

| Control | USD |
|---|---:|
| AFE Rev0 Gross | 6,733,889 |
| Optional 4¾ | 179,603 |
| Required 2F Base | 6,554,286 |
| 2F Purchase Startup P50 | 6,789,881 |
| 2F Peak DSO45 | 7,502,983 |
| 2F Peak DSO60 | 7,802,983 |
| 2F Peak DSO90 | 8,144,427 |
| Current 3F Equipment — MODEL_DERIVED | 10,283,636 |
| 10F Equipment — MODEL_DERIVED | 30,398,086 |
| Ramp Peak DSO45 | 19,253,217 |
| Ramp Peak DSO60 | 20,453,217 |
| Ramp Peak DSO90 | 22,960,556 |
| Ramp Target Funding Capacity DSO90 | 23,134,273 |
| 2F FCF 24M | +4,405,333 |
| Ramp FCF 24M | -2,754,127 |

The USD 22.960556M control is **GROSS PEAK FUNDING REQUIREMENT**. It is not Required Equity or Equity Raise Required.

## Governance locks

### LIH

`LIH_BASIS_LOCK = NBV`.

- Desfase LIH without event: USD 78,000.
- Liquidity effect without event: USD 0.
- Any proposed customs/replacement/declared-value basis requires MANUAL_DECISION_GATE.

### Leasing

PURCHASE is an actionable management draft. Leasing remains PENDING_EXTERNAL/PENDING_LEASING until asset eligibility, principal, rate, term, deposit, payments, balloon, buyout, insurance, maintenance, replacement, prepayment and freight/customs treatment are documented.

### Customs

Working case: TEMPORARY_ADMISSION, 65% customs factor, 1–3% surety, P50 2%, hydrocarbon benefit OFF. The 65% factor remains reported practice / PENDING_CUSTOMS_VALIDATION and is not a legal conclusion.

### Austral contribution

Permitted wording: **“0 confirmed asset contribution in current evidence.”**  
Prohibited inference: “Austral owns zero assets.”

Gross funding closes computationally. Net funding remains open until asset-level contribution evidence exists.

## New 3F AFE event

Ewert supplied `DDS Equipment_ 3 Jobs_Rev0.xlsx` after the S04/S05 candidate handoffs.

| Item | Current control | New supplier candidate | Delta |
|---|---:|---:|---:|
| 3F equipment base | 10,283,636 MODEL_DERIVED | 9,410,762 supplier-backed ex optional 4¾ | -872,874 |
| 3F gross incl optional 4¾ | n/a | 9,590,365 | n/a |

The candidate does not rewrite S03/S04/S05. It opens G12 and requires controlled S02 normalization → S03/S04 delta → tests → downstream UI update only if approved.

## Release recommendation

S06 is technically ready for Manuel review when CI is green. The recommendation is:

1. Review PR #6 and its open-gate/evidence package.
2. If approved, merge PR #6.
3. Rebase PR #7 onto the resulting main.
4. Resolve only the deliberate `docs/ARCHITECTURE.md` composition.
5. Run full PR #7 CI.
6. Complete authorized S05 visual QA or explicitly waive that gate.
7. Separately decide release/merge of PR #7.
8. Process new 3F AFE through G12; do not inject it into #7 during the architecture rebase.
9. No sensitive external communication until its own Manuel approval.

## Readiness

- GOVERNANCE_IMPLEMENTATION: PASS.
- EVIDENCE_CHAIN: PASS with G12 newly opened.
- PR6_STATUS: DRAFT_READY_FOR_MANUEL_REVIEW / NOT MERGED.
- PR7_DEPENDENCY: REBASE_AFTER_PR6_MERGE.
- S03_XLSX_GATE: OPEN.
- S04_EXCEL_GATE: OPEN.
- S05_VISUAL_GATE: OPEN_ACCESS_GATE.
- EXTERNAL_PRESENTATION_READINESS: READY_AS_MANAGEMENT_DRAFT_WITH_DISCLOSED_GATES.
- TRANSVERSAL_AUDIT_READINESS: READY.


## Rev1 CI evidence

GitHub Actions run #51 completed SUCCESS on the Rev1 branch content: governance configuration gate, policy/source-boundary tests, typecheck and production build all passed. Vercel commit status also reported SUCCESS. A final status-only commit is revalidated before handoff.
