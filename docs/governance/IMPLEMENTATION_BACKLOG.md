# DDS-S06 implementation backlog

## Implemented in branch

- [x] Oreshnik anchor issue #233.
- [x] Governed branch `run/dds-s06-governance-01`.
- [x] Drive whitelist with explicit lifecycle and Git-copy policy.
- [x] Executable baseline-promotion policy.
- [x] Executable sensitive-outbound approval policy.
- [x] Governance JSON schemas.
- [x] Mantis identity tokens derived from approved manual v1.0.
- [x] Unit tests for the S03 backup event, promotion gate and Gmail send gate.
- [x] ADR and operating manual.
- [x] Real Drive pilot evidence for 2026-10-02 S03 backup.

## P0 — integrate before automatic financial delta

- [ ] Land S01 technical architecture as canonical normalized configuration in DDS-VEN.
- [ ] Land S02 normalized AFE/asset-gap/leasing inputs with explicit assumption provenance.
- [ ] Land S03 24M financial engine in executable/testable form.
- [ ] Land S04 scenario selector/configuration schema.
- [ ] Land S05 visual configurator as a consumer of canonical outputs, not its own economics.
- [ ] Wire a Drive detector to create Oreshnik runs from whitelisted changes.
- [ ] Produce content hashes through a service account/API path that exposes checksum or controlled raw-byte hashing.
- [ ] Implement normalized-input diff with field-level economic impact.
- [ ] Bind model reconciliation output to a release manifest.

## P1 — release automation with human gates

- [ ] Add a release-manifest generator with source commit, source Drive versions, tests and affected outputs.
- [ ] Add Oreshnik gate adapter for SOURCE_WHITELIST / MODEL_TESTS / FINANCIAL_RECONCILIATION / MANUEL_BASELINE_APPROVAL.
- [ ] Add draft-only Gmail adapter that consumes approved release summaries.
- [ ] Add explicit send gate evidence and fail-closed enforcement.
- [ ] Add CI validation of governance JSON against schemas.
- [ ] Add scheduled drift report for whitelist vs observed Drive metadata.

## P2 — hardening

- [ ] Separate service identities for Drive read, GitHub PR, and Gmail draft scopes.
- [ ] Add immutable evidence retention policy.
- [ ] Add secret scanning and dependency review.
- [ ] Add branch protection / required checks for governance paths if not already configured.
- [ ] Define repository-split criteria and migration contract only if an independent deal-room repository becomes operationally necessary.

## Human-only actions

The system must escalate rather than automate:

- external credentials/consent;
- material baseline approval;
- contracts/legal acceptance;
- partner/economic commitments;
- final send of sensitive external communications;
- business decisions where source data remains ambiguous.
