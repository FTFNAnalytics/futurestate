# FTFN v0.5 session handoff

**Handoff date:** 2026-08-30<br>
**Content milestone:** v0.5 Evidence Fieldbook<br>
**Completed phases:** 120–124
**Publication state:** Complete locally. GitHub publication, hosted deployment and public-access changes remain separate owner-controlled steps.

## Read first

1. `docs/roadmap-v0.5.md`
2. `docs/build-summary-v0.5.md`
3. `docs/work-packages/phase-120-v05-evidence-acquisition-packets.md`
4. `docs/work-packages/phase-121-v05-priority-research-missions.md`
5. `docs/work-packages/phase-122-verification-playbook-library.md`
6. `docs/work-packages/phase-123-v05-comparative-delivery-dossiers.md`
7. `docs/work-packages/phase-124-v05-topic-research-workbenches.md`
8. `app/src/data/v05-evidence-fieldbook.json`
9. `app/src/data/phase-60-operating-cycle.json`

## Current state

- Phase 120 prepares 80 acquisition packets and 320 artifact targets over the 80 Phase 117 Candidate rails. Every target remains unreviewed and every exact-artifact field remains null.
- Phase 121 publishes 68 missions, exactly four for each canonical topic. Fifty-six have exact topic-and-stage packet joins; twelve expose an acquisition coverage gap. Every answer state is `Research packet assembled — answer not adjudicated`.
- Phase 122 publishes 30 procedural guides: eight conversion-stage playbooks, twelve claim-review protocols and ten independent quality-audit cards.
- Phase 123 deepens the twelve existing Phase 105 cross-system routes into matched delivery dossiers with 149 existing Published-signal links, 124 resolved source links, and context-only comparison passports.
- Phase 124 publishes seventeen topic workbenches and links all applicable packets, missions, playbooks, dossiers, projects, places and contextual evidence by stable ID.
- The aggregate v0.5 catalogue records 213 substantive surfaces: 121 new HTML routes and 92 enhanced existing routes.
- v0.5 adds six public JSON exports.
- The underlying corpus remains 795 sources and 1,406 signals.
- v0.5 admits zero exact artifacts and creates zero observations, outcomes, scores, rankings, causal findings or future-gate decisions.

## Canonical route rule

Do not create duplicate detail routes for Phase 120 or Phase 123:

- the 80 packet details live on the existing `/review/authority/rails/{slug}/` canonical routes;
- the 12 dossier details live on the existing `/review/systems/{slug}/` canonical routes.

The new Phase 120 and Phase 123 pages are their Fieldbook hubs. In sitemap, manifest and release reporting, retain separate `new_routes` and `enhanced_routes` inventories so the 92 enhanced surfaces are never reported as newly generated pages.

## Evidence-cycle boundary

Do not operate a dated evidence gate before its America/Edmonton calendar date. As of this handoff, eleven Phase 60 items remain future scheduled gates without a decision date or receipt.

The next gate is `60-CYCLE-LOUISIANA-STARLINK-ADOPTION` on **2026-09-01**. On or after that date, browse current official primary sources for the exact artifact, preserve identity and denominator boundaries, create a dated receipt even for No Material Change, bounded blocker or contract-compliant reschedule, and propagate the decision through every assigned signal, dossier, pathway, dependency map, digest, public update and affected named file.

Do not infer nonexistence from a failed search. Do not use a Phase 120 portal or target description as the exact evidence artifact.

## Rebuild and verification

Run from `app/`:

```text
npm run build:v05-content
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
npm run check
npm run build
npm run update:v05-manifest
npm run verify:v031-content
npm run verify:v04
npm run verify:v05
npm run verify:release
```

Then run from the workspace root:

```text
git diff --check
git status --short
```

Expected invariants after a clean rebuild:

- 80 prepared packets and 320 unreviewed targets;
- 68 missions, of which 56 have packet joins and 12 expose coverage gaps;
- 30 playbooks, 12 dossiers and 17 workbenches;
- 213 substantive v0.5 surfaces split into 121 new and 92 enhanced routes;
- six v0.5 JSON exports;
- 795 sources and 1,406 signals;
- all Phase 120 Candidate sources still Candidate;
- zero exact artifacts admitted and zero outcome, score or ranking created; and
- eleven future Phase 60 gates still scheduled and undecided as of August 30.

Preserve the unrelated user-owned `Fawcett_Visual_Review_Package.zip`, `fawcett_review_work/`, and `outputs/` paths.

## Next evidence-deepening priorities

1. Operate the September 1 Louisiana Starlink adoption gate only on or after its due date.
2. Map official rails and prepare packets for the twelve visible topic-stage acquisition gaps.
3. Select a bounded first exact-artifact batch from packet targets tied to named projects, places and mission completion rules.
4. Admit artifacts only through dated human review with full metadata, acceptance/rejection reasoning and downstream propagation.
5. Adjudicate research missions one at a time as bounded answers, explicit gaps, inadmissibility decisions or blockers.
6. Promote Tier B project and place files only when governed Phase 61–64 relationships exist.
7. Add recurring-operation and outcome series only when identity, method, period and denominator remain compatible.

The next major content advance should be evidence deepening through this fieldbook, not another layer of generated architecture.
