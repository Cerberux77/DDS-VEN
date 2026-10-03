# DDS-S06 implementation backlog — Rev1

## Implemented in PR #6

- [x] Existing Oreshnik anchor #233 retained.
- [x] Existing branch `run/dds-s06-governance-01` retained.
- [x] No new repository and no new PR created.
- [x] Rev1 source-of-truth map and source→release chain.
- [x] Lifecycle extended with CANDIDATE and BLOCKED_EXTERNAL.
- [x] Explicit baseline-promotion and PR-merge Manuel gates.
- [x] Sensitive outbound send gate.
- [x] LIH=NBV manual-decision lock.
- [x] Gross Peak Funding wording lock.
- [x] Leasing/customs/Austral evidence guards.
- [x] S03/S04 artifact persistence and S05 visual release gates.
- [x] Rev1 Drive whitelist.
- [x] Evidence manifest S01→S05.
- [x] Open Gates Register G01–G12.
- [x] Executive Release Matrix.
- [x] PR #6→#7 integration plan.
- [x] ARCHITECTURE_MERGE_PLAN.
- [x] New supplier 3F AFE detected, persisted to Drive and classified CANDIDATE.
- [x] Final machine handoff and transversal audit input pack.
- [x] Automated governance tests expanded.

## Current candidate state

- S01: delta complete / Architecture v2.1.
- S02: 2F delta complete; new 3F AFE opens G12.
- S03: computation complete; final Rev1 XLSX G08 open.
- S04: computation complete / 20/20 QA; final Excel G09 open.
- S05: PR #7 candidate complete / CI green; visual access G10 open.
- S06: Rev1 implementation pending final CI and Manuel review.

## P0 — gates that affect promotion/release

- [ ] G01 obtain leasing provider terms.
- [ ] G02 formal customs/legal validation.
- [ ] G08 recover/persist/verify S03 Rev1 XLSX.
- [ ] G09 recover/persist/verify S04 Rev1 Excel.
- [ ] G10 authorized S05 visual QA or explicit approved waiver.
- [ ] G12 normalize/reconcile new supplier 3F AFE through S02→S04 before changing 3F/ramp outputs.
- [ ] Manuel review/approval of PR #6.
- [ ] After PR #6 merge only: rebase PR #7 and resolve architecture composition.
- [ ] Separate Manuel approval for PR #7/production release.

## P1 — evidence needed for stronger economics

- [ ] G03 Austral asset-level contribution schedule.
- [ ] G04 spares consumption/replenishment bridge.
- [ ] G05 support infrastructure scope.
- [ ] G06 accounting classification.
- [ ] G07 contract timing/payment schedule.
- [ ] G11 final packing list.

## P2 — hardening

- [ ] Automated scheduled whitelist drift detection.
- [ ] Controlled raw-byte hash capture for monitored Drive originals.
- [ ] Schema validation package in CI beyond semantic config checks.
- [ ] Separate least-privilege service identities where operationally justified.
- [ ] Immutable evidence-retention policy.
- [ ] Secret scanning/dependency review/required branch checks where not already enabled.

## Human-only actions

Never automate: material baseline promotion, PR merge approval, production release, legal/contract acceptance, material financing decisions, or final send of sensitive external communication.
