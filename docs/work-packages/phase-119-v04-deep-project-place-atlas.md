# Phase 119 — Deep Project and Place Atlas

**Status:** Complete locally on August 30, 2026; shared v0.4 release integration pending.

**Program:** FTFN v0.4 — Canonical authority and depth

## Objective

Graduate all twenty-four public casebooks and fifteen public place portraits into one canonical, inspectable relationship layer. Every entity must have a stable Atlas ID, aliases, explicit upstream relationships, an honest conversion boundary, a chronology, status-visible signal and source rails, an unresolved gate, an exact next editorial or evidence artifact, an update owner, an update state, and a visible coverage tier.

Phase 119 distinguishes governed depth from editorial breadth. It does not call every case equally mature:

- **Tier A projects:** eight named files backed by Phase 61 state, Phase 62 events, Phase 63 gates, and Phase 64 matrix rows.
- **Tier B projects:** sixteen Phase 113 casebooks with manually curated Published signal and source IDs but no governed Phase 61–64 conversion file.
- **Tier A places:** five canonical local-system content profiles with explicit sources, constraints, and evidence gaps.
- **Tier B places:** ten Phase 112 place portraits with manually curated Published evidence shelves but no canonical local-system content record or place-level gate.

Tier describes evidence architecture. It is not a readiness, quality, risk, value, performance, safety, or success score.

## Canonical registry

The generated registry is `app/src/data/phase-119-deep-project-place-atlas.json`. Its deterministic source builder is `app/scripts/build-phase119-deep-project-place-atlas.mjs`.

Phase 116 remains the canonical identity authority. Every Phase 119 record joins exactly to its Phase 116 `canonical_id`. The `119-PROJECT-*` and `119-PLACE-*` values are Phase 119 Atlas record IDs, not competing entity identities.

Each project record carries:

- the Phase 116 semantic `canonical_id`, a stable `119-PROJECT-*` record ID, prior IDs, aliases, slug, named entity, and case kind;
- Phase 61 file, Phase 62 event, Phase 63 gate, Phase 64 row, Phase 60 cycle, local-system, evidence-gap, briefing, pathway, dependency-map, and related-place relationships where established;
- current stage and its basis, unresolved claim, unresolved gate, exact next artifact, next date or source trigger, and stop rule;
- governed event chronology or explicitly bounded Published-signal chronology;
- stable signal and source rails;
- owner role, update status, review date, and prior/canonical routes.

Each place record carries the equivalent identity, coverage, relationship, chronology, evidence-rail, unresolved, next-artifact, owner, status, and route fields. A place explicitly refuses to inherit one linked project's conversion stage.

## Explicit selection repair

The sixteen expanded casebooks no longer use runtime substring matching over signal IDs, titles, and summaries. Their evidence shelves resolve through explicit curated signal IDs in Phase 119, and source rails are generated only from those Published signals.

The repair materially changes two empty keyword results:

- the Victorian Big Battery case now resolves to three exact Published signals;
- the Victoria grid-storage portrait now resolves to the same three exact Published signals.

The ten expanded place portraits also resolve through explicit IDs so the canonical Place Atlas and the prior editorial routes cannot silently drift when unrelated signal text changes.

## Public routes and export

Phase 119 adds forty-one HTML routes:

- `/atlas/projects/`;
- twenty-four `/atlas/projects/{slug}/` files;
- `/atlas/places/`;
- fifteen `/atlas/places/{slug}/` files.

The public registry export is `/data/deep-project-place-atlas.json`.

The existing sixteen expanded casebook routes and ten place-portrait routes remain available and now link to their canonical Atlas files.

## Verified counts

| Measure | Count |
| --- | ---: |
| Canonical projects | 24 |
| Tier A governed projects | 8 |
| Tier B curated projects | 16 |
| Canonical places | 15 |
| Tier A governed places | 5 |
| Tier B curated places | 10 |
| Explicit project-signal links | 118 |
| Explicit project-source links | 128 |
| Explicit place-signal links | 145 |
| Explicit place-source links | 237 |
| New HTML routes | 41 |
| New public JSON exports | 1 |
| Public updates | 1 |
| New source facts | 0 |
| New events or receipts | 0 |
| Conversion-stage advances | 0 |
| Scores or rankings | 0 |

## Verification

Phase-specific commands:

```text
node app/scripts/build-phase119-deep-project-place-atlas.mjs
node app/scripts/assert-phase119.mjs
npm.cmd run check
npm.cmd run build
node app/scripts/verify-phase119-build.mjs
git diff --check
```

The Phase 119 assertion verifies all upstream IDs, Published signal state, source existence, Tier A Phase 61–64 parity, Tier B non-invention, reciprocal project/place relationships, owner and next-artifact fields, exact record counts, future Phase 60 gate preservation, and removal of runtime keyword selection.

## Boundaries

Phase 119 does not:

- invent a cost, schedule, project event, stage, source, receipt, or outcome;
- convert a Phase 113 casebook into a governed conversion file without the required review;
- treat a place as one project or transfer one project's state to a region;
- infer external nonexistence from `Not established`;
- operate, predate, reschedule, or close a Phase 60 evidence gate;
- publish a score, ranking, recommendation, probability, or causal conclusion;
- alter shared release manifests, deployment configuration, navigation, or global verification owned by the v0.4 integration phase.

## Exit state

Phase 119 is complete when all thirty-nine entities resolve uniquely, all explicit evidence links validate, the forty-one public routes and JSON export build, the Victorian Big Battery empty-result regression is closed, future evidence gates remain untouched, and phase-specific assertions pass. Shared v0.4 navigation, sitemap, manifest, and release-contract integration remain the responsibility of the program integration layer.
