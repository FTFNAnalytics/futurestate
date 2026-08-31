# FTFN v0.4 session handoff

**Handoff date:** 2026-08-30<br>
**Content milestone:** v0.4 Public Conversion Observatory<br>
**Completed phases:** 116–119
**Publication state:** Complete and release-validated locally. GitHub publication and hosted deployment are separate owner-controlled steps.

## Read first

1. `docs/roadmap-v0.4.md`
2. `docs/build-summary-v0.4.md`
3. `docs/work-packages/phase-116-v04-coverage-architecture-canonical-identity-quality-baseline.md`
4. `docs/work-packages/phase-117-v04-global-authority-graph.md`
5. `docs/work-packages/phase-118-canonical-living-encyclopedia.md`
6. `docs/work-packages/phase-119-v04-deep-project-place-atlas.md`
7. `app/src/data/v04-public-conversion-observatory.json`
8. `app/src/data/phase-60-operating-cycle.json`

## Current state

- Phase 116 establishes the shared topic, canonical identity, geography, claim-type, quality, and eight-stage conversion contracts.
- Phase 117 adds 20 international jurisdiction layers and 80 official source records. Every new source is `Candidate`; each still requires exact-artifact review before evidence use.
- Phase 118 publishes 17 topic chapters and ten foundation chapters, with 10,073 authored narrative words and explicit Published-signal/source lineage.
- Phase 119 publishes 24 project and 15 place files. Eight project files and five place files retain governed Tier A status; the rest are explicitly Tier B curated records.
- Phase 119 atlas record IDs resolve one-to-one to the Phase 116 canonical entity IDs; they do not create a competing identity layer.
- The v0.4 registry owns the complete public route and export inventories.

## Evidence-cycle boundary

Do not operate a dated evidence gate before its local calendar date. As of this handoff, eleven Phase 60 items remain future scheduled gates with no decision date or receipt. The next gate is `60-CYCLE-LOUISIANA-STARLINK-ADOPTION` on **2026-09-01**. Follow the exact-artifact, dated-receipt, and full-propagation contract in the Phase 60 work package and operating-cycle registry.

The v0.4 content release itself creates no observation, evidence decision, outcome, score, ranking, or translation promotion.

## Rebuild and verification

From `app/`:

```text
npm run build:v04-content
npm run validate:candidates
npm run validate:content
npm run source:health
npm run test:v04
npm run check
npm run build
npm run update:v04-manifest
npm run verify:v04
npm run verify:release
```

Finish with `git diff --check` and inspect `git status --short`. Preserve the unrelated user-owned `Fawcett_Visual_Review_Package.zip`, `fawcett_review_work/`, and `outputs/` paths.

## Next content operations

The highest-value continuation is not another architecture phase. It is evidence deepening against v0.4:

- acquire exact artifacts from the highest-priority Phase 117 Candidate rails;
- promote Tier B project/place files only when governed conversion relationships exist;
- deepen thin international/topic intersections while preserving jurisdiction and method differences;
- add longitudinal operating and outcome series only with compatible identities, dates, methods, and denominators; and
- keep encyclopedia chapters current through visible source refreshes, corrections, and unresolved-evidence statements.
