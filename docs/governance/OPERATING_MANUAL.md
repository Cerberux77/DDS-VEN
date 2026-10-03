# DDS Venezuela — Governance Operating Manual

## 1. Purpose

Operate DDS changes so every material technical, financial or documental change can be traced from source to release without silently replacing a baseline or sending a commitment without approval.

## 2. Daily source check

1. Inspect only Drive items/folders listed in `config/governance/drive-whitelist.json`.
2. Record observed `driveFileId`, path, version, modified time and hash when the source exposes one.
3. New unlisted items are candidates only. They do not enter the model automatically.
4. Classify lifecycle status: CURRENT, APPROVED, CANDIDATE, DRAFT, BLOCKED_EXTERNAL, SUPERSEDED or ARCHIVE.
5. Create/update an Oreshnik task/run with the source evidence.

## 3. Change handling

### Non-model document

Run SOURCE_WHITELIST, LIFECYCLE_STATUS and EVIDENCE_CAPTURE. If it changes an approved deliverable or release package, add PR/release review.

### Model-affecting document

Additionally normalize the input, compare against the previous normalized input, calculate financial delta, run model tests and reconcile affected outputs.

Never implement a new spreadsheet/HTML formula as a second independent economic model. The web layer consumes canonical scenario/model outputs.

## 4. Baseline promotion

A candidate may become CURRENT only when:

- its source is whitelisted;
- it is intentionally classified for promotion;
- required model/reconciliation gates pass when applicable;
- a PR/release record exists;
- Manuel explicitly approves promotion.

CANDIDATE, DRAFT, BLOCKED_EXTERNAL, SUPERSEDED and ARCHIVE are fail-closed for baseline replacement.

## 5. Drive and Git handling

Store originals in Drive. In Git store only:

- metadata;
- schemas;
- normalized non-sensitive inputs;
- tests;
- calculation logic;
- manifests;
- approved derived non-sensitive artifacts.

Default legal/contract/AFE original policy is DO_NOT_COPY unless an explicit exception is approved.

## 6. Deal-room publication

1. Publish only derived/released representations.
2. Keep private source files out of `public/`.
3. Re-evaluate document access server-side.
4. Preserve existing PREVIEW / RELEASED / SOURCE_RELEASED rules.
5. Never put Drive credentials, source storage keys or secrets into browser payloads.

## 7. Gmail workflow

Automation may create a Gmail draft after release evidence exists.

Before sending any economic, legal, contract, AFE or partner-commitment communication, capture explicit Manuel approval. The approval record must include actor, timestamp and evidence.

No background/automatic send is permitted for those classes.

## 8. Evidence package

A completed governed change must answer:

- Which source changed?
- What exact field/document changed?
- What is the financial impact?
- Which outputs are affected?
- Which tests passed/failed?
- Who approved?
- Which release/version contains the change?
- Where is the supporting evidence?

## 9. Recovery / rollback

If an incorrect baseline is promoted:

1. Block further release.
2. Mark the bad candidate SUPERSEDED or DRAFT as appropriate.
3. Restore the last approved CURRENT reference.
4. Open an Oreshnik corrective run.
5. Re-run reconciliation and tests.
6. Publish a corrected release only after Manuel gate.

Historical records are retained; do not delete evidence to make the history look clean.

## 10. Adding a new monitored source

1. Confirm business need and source owner.
2. Add the file/folder deliberately to the whitelist.
3. Set document type, lifecycle status, Git policy, related model input and release.
4. Add/extend tests if it can affect calculations.
5. Review least-privilege access.
6. Merge through PR; never edit main as an operational shortcut.

## 11. Brand use

Consume `config/brand/smsmantis.tokens.json` for reusable typography, palette, spacing, logo and voice rules. Do not inject the entire identity-manual PDF into every generation or runtime.


## 12. Rev1 source-to-release workflow

For supplier/AFE changes:

1. detect inbound source in Gmail/Drive;
2. persist/document source in the governed Drive area;
3. add only required source metadata to the whitelist;
4. classify it CURRENT source evidence or CANDIDATE;
5. normalize at S02;
6. compute field/economic delta;
7. run S03/S04 tests and reconciliation;
8. update S05 only from a governed machine handoff;
9. open/update a PR;
10. capture CI/QA evidence;
11. request Manuel promotion/merge/release approval;
12. prepare Gmail draft only after release evidence;
13. request a separate Manuel send approval.

A newer supplier file never bypasses steps 4–11.

## 13. Economic wording and basis locks

- LIH stays NBV; customs value, replacement value and declared value cannot overwrite it without MANUAL_DECISION_GATE.
- Gross Peak Funding is not equity. Financing structure is a separate business decision.
- “0 confirmed asset contribution in current evidence” describes evidence status; it is not an ownership conclusion.
- Pending leasing cannot emit a resolved NPV/payment/funding case.
- Pending customs assumptions cannot be promoted to legal/tax rules.

## 14. Artifact and UI gates

S03/S04 machine-readable computation can support downstream candidate work while XLSX/Excel persistence is open. Full financial artifact approval requires generated workbook, formula verification, visual QA and machine-handoff reconciliation.

S05 computational reconciliation and CI do not substitute for authorized visual browser QA. Production release requires visual PASS or explicit Manuel waiver plus separate release approval.

## 15. PR integration

For current PRs: PR #6 governance is reviewed first. Only after explicit approval/merge should PR #7 rebase onto new main. Resolve `docs/ARCHITECTURE.md` using `ARCHITECTURE_MERGE_PLAN.md`; do not use the rebase to inject new 3F economics.
