# DDS Venezuela — Lifecycle / Promotion Matrix Rev1

| State | Meaning | Can feed analysis? | Can replace CURRENT? | Can be externally definitive? |
|---|---|---:|---:|---:|
| CURRENT | Active baseline | Yes | Only through Manuel promotion gate | Only if release/communication gates permit |
| APPROVED | Approved artifact, not active baseline | Yes | No, until explicitly promoted | Context-dependent |
| CANDIDATE | Reconciled or incoming release candidate | Yes, with provenance | **No** | No; management draft/caveat only |
| DRAFT | Work in progress | Limited | **No** | No |
| BLOCKED_EXTERNAL | Requires unavailable external evidence | No resolved output | **No** | No |
| SUPERSEDED | Replaced historical evidence | Historical only | **No** | No |
| ARCHIVE | Non-operational history | No | **No** | No |

## Promotion invariant

No file becomes CURRENT because it is newer, located in an active folder, attached by a supplier, or used in a meeting.

Promotion requires:

1. whitelisted source;
2. lifecycle classification;
3. normalization/provenance where applicable;
4. model tests and reconciliation for economic inputs;
5. affected-output identification;
6. release evidence;
7. explicit Manuel approval.

## Communication states

### INTERNAL_MANAGEMENT_DRAFT

May contain CANDIDATE calculations and disclosed open gates. Suitable for internal management/review, not definitive external representation.

### EXTERNAL_PRESENTATION_READY

Requires at minimum:

- financial XLSX persistence/formula verification where the financial workbook is presented as final;
- visual QA or explicit approved waiver for S05 release;
- all material open gates disclosed or closed;
- Manuel approval.

The current Rev1 rebase remains **INTERNAL_MANAGEMENT_DRAFT / CANDIDATE**.
