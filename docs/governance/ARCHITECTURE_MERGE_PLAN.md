# ARCHITECTURE_MERGE_PLAN — PR #6 + PR #7

## Conflict surface

The only verified shared changed file between PR #6 and PR #7 is:

`docs/ARCHITECTURE.md`

No branch merge is performed by this plan.

## Intended final composition after PR #6 is approved and merged

Use the new `main` (containing PR #6) as the base, then retain the S05 architecture content from PR #7 with one deliberate topology correction.

Final document order:

1. Existing Controlled Deal Room architecture/security boundary.
2. PR #6 **Cross-system governance** section.
3. PR #7 **S05 fleet configurator boundary** section.

## Preserve from PR #6

- Drive whitelist / documentary source boundary.
- Oreshnik control-plane role.
- Manuel baseline/outbound approval gates.
- No source credentials or originals in browser/public paths.

## Preserve from PR #7

- S05 is presentation/interaction only.
- `scenario-engine.ts` owns selector validation / lookup orchestration.
- `s04-rev1-data.ts` is the deterministic S04 lookup authority consumed by S05.
- `fleet-configurator.ts` composes physical layout and costs; no second financial engine.
- Browser client remains presentation-only.
- Optimized shared-backup visual semantics and BHA drilldown rules.

## Deliberate correction

Do **not** carry forward the PR #7 sentence that assigns presentation ownership to a separate `dds-venezuela-deal-room` repository.

Rev1 intended wording:

> DDS-VEN is the current computational source and presentation/application repository. S05 is a logical presentation domain within DDS-VEN. A physical repository split requires the independent deployment/access/interface criteria in ADR-0002 and is not part of this release.

## Resolution procedure

After PR #6 merge:

1. rebase/update PR #7 from `main`;
2. inspect the single architecture conflict;
3. take PR #6/main as structural base;
4. append/reapply the S05 boundary section with the correction above;
5. verify no duplicated economic formulas or contradictory repository ownership remain;
6. run full CI;
7. do not merge until visual/release gates and Manuel approval are satisfied.
