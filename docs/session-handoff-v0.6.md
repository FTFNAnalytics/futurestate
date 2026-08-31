# FTFN v0.6 session handoff

**Handoff date:** 2026-08-30<br>
**Content milestone:** v0.6 Open Evidence Review<br>
**Completed phases:** 125–129
**Publication state:** Complete locally. GitHub publication, hosted deployment and public-access changes remain separate owner-controlled steps.

## Read first

1. `docs/roadmap-v0.6.md`
2. `docs/build-summary-v0.6.md`
3. `docs/work-packages/phase-125-v06-evidence-annotation-ledger.md`
4. `docs/work-packages/phase-126-v06-mission-evidence-audits.md`
5. `docs/work-packages/phase-127-v06-project-place-conversion-biographies.md`
6. `docs/work-packages/phase-128-v06-topic-state-of-evidence-reviews.md`
7. `docs/work-packages/phase-129-v06-cross-system-evidence-syntheses.md`
8. `app/src/data/v06-open-evidence-review.json`
9. `app/src/data/phase-60-operating-cycle.json`

## Current state

- Phase 125 annotates all 82 Published mission-context signals, resolves 114 exact sources and preserves all 340 mission-context joins.
- Phase 126 screens all 204 copied requirements against exact Phase 125 title/factual-nucleus fields. Ninety tests have potentially relevant, unaccepted context; 114 have no screened-term overlap. Neither state is evidence acceptance or semantic adjudication.
- Phase 127 publishes 24 project and 15 place biographies. The 192 project-stage cells preserve Phase 119/64 state. The 90 place assessments contain 67 grounded Published-context states and 23 repository-bounded Not-established states; no fallback signal or project-stage inheritance is allowed.
- Phase 128 publishes 17 topic reviews and 68 horizon sections with exact annotation, audit, biography, dossier and workbench joins.
- Phase 129 publishes 12 compatibility syntheses and 60 determinations while preserving all 149 Phase 123 signal links, 124 source links and `Context only` verdicts.
- The aggregate catalogue records 224 substantive surfaces: six new HTML routes and 218 enhanced existing routes.
- v0.6 adds six public JSON exports.
- The corpus remains 795 sources and 1,406 signals: 1,121 Published and 285 In Review.

## Canonical route rule

Do not create duplicate detail routes for the 218 enhanced records. Evidence notes live on existing signal routes; mission screens live on existing mission routes; biographies live on existing project/place Atlas routes; topic reviews live on existing workbench routes; and compatibility syntheses live on existing system routes.

Keep new and enhanced route inventories separate in the sitemap, manifest and release reporting. Enhanced routes are substantive surfaces, not newly generated route pages.

## Interpretation and word-accounting rule

- A lexical match is only a candidate for later review. A non-match is only the result of the disclosed title/factual-nucleus screen.
- Do not rewrite either Phase 126 state as a mission answer, evidence decision or claim that evidence is unavailable externally.
- Preserve rendered, substantive, exact-passage-deduplicated and repetition metrics as separate fields. Do not report rendered totals as unique authored prose.
- Phase 127 project/place biography counts are checked against unique full narratives and unique section bodies; the phase does not publish an exact-passage-deduplicated aggregate.

## Evidence-cycle boundary

Do not operate a dated evidence gate before its America/Edmonton calendar date. As of this handoff, eleven Phase 60 items remain future scheduled gates without a decision date or receipt.

The next gate is `60-CYCLE-LOUISIANA-STARLINK-ADOPTION` on **2026-09-01**. On or after that date, browse current official primary sources for the exact artifact, preserve identity and denominator boundaries, create a dated receipt even for No Material Change, bounded blocker or contract-compliant reschedule, and propagate the decision through every assigned record and public surface.

Do not infer nonexistence from a failed search. Do not treat a Phase 120 portal, target description, Phase 125 annotation or Phase 126 lexical result as the exact evidence artifact.

## Rebuild and verification

Run from `app/`:

```text
npm run build:v06-content
npm run validate:candidates
npm run validate:content
npm run source:health
npm run test:phase58
npm run verify:phase58
npm run verify:phase59
npm run verify:phase60
npm run verify:phase60c
npm run verify:phase61
npm run verify:phase62
npm run verify:phase63
npm run verify:phase64
npm run verify:phase65
npm run verify:phase66
npm run test:phase67
npm run verify:phase67
npm run test:v04
npm run test:v05
npm run test:v06
npm run check
npm run build
npm run update:v06-manifest
npm run verify:v031-content
npm run verify:v04
npm run verify:v05
npm run verify:v06
npm run verify:release
```

Then run from the workspace root:

```text
git diff --check
git status --short
```

## Expected invariants

- 82 annotations / 114 sources / 340 mission joins;
- 68 audits / 204 lexical screens / 90 potential-context / 114 no-overlap findings;
- 24 project and 15 place biographies / 192 stage cells / 90 system assessments;
- 17 topic reviews / 68 horizons;
- 12 syntheses / 60 compatibility determinations;
- 224 substantive surfaces split into six new and 218 enhanced routes;
- six v0.6 JSON exports and 68 total public exports;
- 80 Candidate authority sources, 320 unreviewed targets and zero artifacts admitted;
- 56 covered missions, 12 visible acquisition gaps and zero mission answers;
- 12 `Context only` dossier/synthesis verdicts;
- 795 sources, 1,406 signals and 154 updates; and
- eleven future Phase 60 gates still scheduled and undecided as of August 30.

Preserve the unrelated user-owned `Fawcett_Visual_Review_Package.zip`, `fawcett_review_work/` and `outputs/` paths.

## Next evidence-deepening priorities

1. Operate the September 1 Louisiana Starlink gate only on or after its real date.
2. Run a dated, human-reviewed acquisition batch for the five gap missions with the strongest bounded-positive evidence shelves.
3. Seek genuinely mission-fit artifacts for AI-for-science, chips, cybersecurity, discovery technologies, mobility outcomes, space outcomes and quantum operation/outcome; do not promote topical adjacency.
4. Add evidence-admission receipts and requirement dispositions one artifact at a time.
5. Publish mission answers only after all copied requirements have dated acceptance, rejection, inadmissibility, gap or blocker states.
6. Add longitudinal operating/outcome series only where identity, period, method and denominator remain compatible.
