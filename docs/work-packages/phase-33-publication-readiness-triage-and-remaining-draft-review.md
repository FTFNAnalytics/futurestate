# Phase 33 Work Package: Publication-Readiness Triage and Remaining Draft Review

## Goal

Audit the current reviewed content base and identify which records are credible launch candidates, which should remain `In Review`, which need follow-up, and which should stay as draft samples.

This phase does not publish records. It creates a launch-readiness decision layer for `ftfn.io`.

## Generated Prompt

```text
Start Phase 33 for FTFN.

Read:
- README.md
- docs/session-brief.md
- docs/master-roadmap.md
- docs/decision-log.md
- docs/content-expansion-plan.md
- docs/source-strategy.md
- docs/editorial-method.md
- docs/review-checklists.md
- docs/publication-readiness-triage.md if it exists
- docs/work-packages/phase-32-source-backed-content-expansion-re-entry.md
- app/package.json
- app/src/content.config.ts
- app/src/content/sources/
- app/src/content/signals/
- app/src/content/briefings/
- app/src/content/dependency-maps/

Phase 33 goal:
Move from content expansion into publication-readiness triage for ftfn.io.

Implementation scope:
1. Create docs/work-packages/phase-33-publication-readiness-triage-and-remaining-draft-review.md.
2. Create or update docs/publication-readiness-triage.md.
3. Run npm run validate:content before content changes.
4. Audit all In Review signals for source quality, specificity, evidence limits, checked dates, and launch readiness.
5. Recheck a small official-source launch-candidate set where possible.
6. Identify records that are launch candidates, should remain In Review, need follow-up, or should stay Draft Sample.
7. Triage the Joby/eVTOL company-claim sample without promoting it.
8. Update content metadata only where triage reveals a clear stale or unsafe status.
9. Do not promote any records to Published.
10. Do not add dependencies, automation, ingestion, scoring, graph libraries, or a database.
11. Run npm run validate:content.
12. Run npm run check.
13. Run npm run build.
14. Update README.md, docs/master-roadmap.md, docs/decision-log.md, docs/content-expansion-plan.md, docs/session-brief.md, docs/documentation-map.md, docs/review-checklists.md, and this work package.

Preserve:
- FTFN public brand,
- ftfn.io domain direction,
- 42/59 framing,
- "Civilization is a choice,"
- the thesis: "The future is not a list of inventions. It is a stack of dependencies."
```

## Source Of Truth

Read before continuing:

- `README.md`
- `docs/session-brief.md`
- `docs/master-roadmap.md`
- `docs/decision-log.md`
- `docs/content-expansion-plan.md`
- `docs/source-strategy.md`
- `docs/editorial-method.md`
- `docs/review-checklists.md`
- `docs/work-packages/phase-32-source-backed-content-expansion-re-entry.md`
- `app/package.json`
- `app/src/content.config.ts`
- `app/src/content/sources/`
- `app/src/content/signals/`

## Scope

1. Audit current signal readiness.
2. Recheck a small official-source set.
3. Create a publication-readiness triage document.
4. Update source checked dates where official pages were checked.
5. Mark stale or unsafe records appropriately.
6. Keep records out of `Published`.

## Baseline Validation

Pre-change validation:

```text
npm run validate:content: passed
25 sources, 14 signals, 15 topics, 10 organizations, 5 technologies, 2 local systems, 1 briefings, 10 evidence gaps, 2 dependency maps
```

## Source Checks

Official pages checked on 2026-06-13:

- NOAA CPC ENSO Diagnostic Discussion,
- USGS Mineral Commodity Summaries 2026,
- NIST Post-Quantum Cryptography Project,
- EIA Arizona Electricity Profile,
- EIA Electricity Data,
- Arizona Department of Water Resources,
- ADWR Assured and Adequate Water Supply,
- Statistics Canada Building Permits Survey,
- CMHC Housing Market Data tables.

Important finding:

The NOAA CPC current discussion is now dated 11 June 2026 and lists El Nino Advisory status. The existing May 2026 El Nino Watch signal is stale and was moved to `record_status: "Needs Update"` with `verification_status: "Needs Follow-Up"`.

## Content Updates

Updated source checked dates:

- `source-noaa-cpc-enso`,
- `source-usgs-mineral-commodity-summaries`,
- `source-nist-pqc`,
- `source-eia-arizona-electricity-profile`,
- `source-eia-electricity-data`,
- `source-arizona-department-water-resources`,
- `source-arizona-adwr-assured-water-supply`,
- `source-statcan-building-permits-survey`,
- `source-cmhc-starts-completions-under-construction`.

Updated signal records:

- `signal-sample-001`: changed from `In Review` to `Needs Update` because the NOAA source has advanced from the May Watch record to the June Advisory record.
- `signal-sample-010`: kept as `Draft Sample` and clarified in editorial notes that it needs FAA, local, customer, airport, or independent evidence before review.

No records were promoted to `Published`.

## Triage Result

Launch candidates after Phase 33:

- `signal-sample-002`
- `signal-sample-007`
- `signal-arizona-electricity-profile-chip-corridor-power-constraint`
- `signal-arizona-water-resources-chip-corridor-constraint-map`
- `signal-statcan-building-permits-construction-intentions-signal`

Keep in review:

- `signal-sample-003`
- `signal-sample-004`
- `signal-sample-005`
- `signal-sample-006`
- `signal-sample-008`
- `signal-sample-009`
- `signal-ontario-housing-supply-progress-local-capacity-signal`

Needs follow-up:

- `signal-sample-001`

Keep draft sample:

- `signal-sample-010`

## Acceptance Criteria

- Phase 33 work package exists.
- Publication-readiness triage document exists.
- `In Review` signals are audited for source quality, specificity, evidence limits, and launch readiness.
- A small official-source launch-candidate set is rechecked.
- The remaining Joby/eVTOL company-claim sample is triaged without promotion.
- Stale or unsafe content metadata is repaired where obvious.
- No records are promoted to `Published`.
- No dependencies, automation, ingestion, scoring, graph libraries, or database work are added.
- `npm run validate:content` passes.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Validation Results

```text
npm run validate:content: passed
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 96 pages generated
```

## Next Phase Candidate

Phase 34 should create the publication policy and launch-readiness surface before any record promotion.

Recommended focus:

- create `docs/publication-policy.md`,
- decide whether source transparency needs a dedicated public page,
- define correction/update policy for `ftfn.io`,
- repair the NOAA ENSO signal or exclude it from launch candidates,
- add final launch-candidate copy checks,
- add metadata/social preview basics if small,
- keep all `Published` promotions gated.
