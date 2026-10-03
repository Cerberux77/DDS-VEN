# DDS Governance Rev1 — Release Candidate Checklist

## Evidence

- [x] S01→S05 source/evidence chain registered.
- [x] Supplier 2F AFE persisted in governed S02 Drive folder.
- [x] New supplier 3F AFE persisted and classified CANDIDATE.
- [x] S02 normalized candidate evidence located.
- [x] S03 machine/reconciliation artifacts located.
- [x] S04 machine handoff / QA artifacts located.
- [x] S05 PR #7 / CI / handoff evidence located.
- [x] Oreshnik #233 remains the single S06 control anchor.

## Governance controls

- [x] CURRENT / APPROVED / CANDIDATE / DRAFT / BLOCKED_EXTERNAL / SUPERSEDED / ARCHIVE supported.
- [x] CANDIDATE cannot replace CURRENT.
- [x] LIH basis lock = NBV.
- [x] Gross Peak Funding wording lock.
- [x] Leasing pending cannot emit approved resolved economics.
- [x] Customs pending cannot auto-promote.
- [x] Austral zero-confirmed wording guard.
- [x] S03/S04 artifact-persistence gates visible.
- [x] S05 visual QA/release gate visible.
- [x] PR merge requires Manuel approval.
- [x] Sensitive outbound requires Manuel approval.

## Open release gates

- [ ] G01 Leasing terms.
- [ ] G02 Formal customs validation.
- [ ] G03 Asset contribution evidence for net funding.
- [ ] G04 Spares consumption/replenishment.
- [ ] G05 Support infrastructure scope.
- [ ] G06 Accounting classification.
- [ ] G07 Contract timing.
- [ ] G08 S03 Rev1 XLSX/tool recovery.
- [ ] G09 S04 final Excel/tool recovery.
- [ ] G10 S05 authorized visual QA.
- [ ] G11 Final packing list.
- [ ] G12 New supplier 3F AFE normalization/reconciliation.

## Human gates — intentionally not executed

- [ ] Manuel approval to merge PR #6.
- [ ] Manuel approval to merge/release PR #7.
- [ ] Production release approval.
- [ ] Sensitive outbound communication approval.

## Current release classification

This package may be promoted to **DRAFT_READY_FOR_MANUEL_REVIEW** after final PR #6 CI passes. It is not a production release and does not make the economic rebase externally definitive.
