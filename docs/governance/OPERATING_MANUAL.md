# DDS Venezuela — Governance Operating Manual

## 1. Purpose

Operate DDS changes so every material technical, financial or documental change can be traced from source to release without silently replacing a baseline or sending a commitment without approval.

## 2. Daily source check

1. Inspect only Drive items/folders listed in `config/governance/drive-whitelist.json`.
2. Record observed `driveFileId`, path, version, modified time and hash when the source exposes one.
3. New unlisted items are candidates only. They do not enter the model automatically.
4. Classify lifecycle status: CURRENT, APPROVED, DRAFT, SUPERSEDED or ARCHIVE.
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

DRAFT, SUPERSEDED and ARCHIVE are fail-closed for baseline replacement.

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
