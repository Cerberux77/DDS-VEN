# DDS Venezuela — PR Integration Plan #6 → #7

## Verified state

- PR #6 — S06 Governance: OPEN / DRAFT / MERGEABLE / NOT MERGED.
- PR #7 — S05 Fleet Configurator: OPEN / DRAFT / MERGEABLE / NOT MERGED.
- Both descend from the earlier main baseline.
- Verified common changed file: `docs/ARCHITECTURE.md` only.
- PR #7 CI at head `3b0f1739a1208548e5759264824c02494bab5248`: SUCCESS.
- No generalized source conflict is indicated by the changed-file sets.

## Recommended integration order

The proposed #6 → #7 order remains technically correct.

1. Finish the S06 Rev1 delta on PR #6.
2. Run PR #6 governance gate, tests, typecheck and production build.
3. Leave PR #6 DRAFT and present it for Manuel review.
4. **Stop.** Do not merge without explicit Manuel approval.
5. After approval/merge of PR #6, update/rebase PR #7 onto new `main`.
6. Resolve `docs/ARCHITECTURE.md` deliberately using `ARCHITECTURE_MERGE_PLAN.md`.
7. Do not alter S05 economic authority while rebasing; S05 remains lookup-only against its governed S04 handoff.
8. Run the full PR #7 CI after rebase.
9. Complete authorized browser visual QA or obtain a distinct explicit waiver.
10. Request Manuel approval for PR #7/release.
11. Only then merge PR #7.

## New 3F AFE isolation

The new supplier 3F Rev0 AFE is a separate S02 evidence event under G12. It **must not** be smuggled into PR #7 during the architecture rebase.

If G12 later changes S03/S04 economics, that should enter S05 through a separate governed machine-handoff delta with tests and evidence.

## Why #6 first

S06 establishes lifecycle, source, wording, release and outbound controls. Integrating it first makes the subsequent S05 rebase subject to the same explicit governance rather than relying on convention.
