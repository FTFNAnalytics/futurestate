# Phase 35 Work Package: Final Launch-Candidate Copy, Citation, and Public-Page QA

## Objective

Review the first FTFN launch-candidate signal set for publication readiness, source currency, citation visibility, caveats, and public-page clarity.

This phase is the first explicit publication gate. It should move only records that pass the full policy from `In Review` to `Published`.

## Source Of Truth

- `docs/publication-policy.md`
- `docs/publication-readiness-triage.md`
- `docs/launch-candidate-review.md`
- `docs/review-checklists.md`
- `docs/source-strategy.md`
- `app/src/content/signals/`
- `app/src/content/sources/`

## Deliverables

- Final review of six launch-candidate signals.
- Source checked dates refreshed for the official source set reviewed in this phase.
- `docs/launch-candidate-review.md`.
- Publication-date visibility on signal detail pages.
- Updated README, roadmap, decision log, documentation map, content expansion plan, session brief, and publication triage.
- Validation/build results.

## Checklist

- [x] Recheck official or primary source pages for the six launch candidates.
- [x] Review signal copy, caveats, source cards, checked dates, evidence labels, and claim scope.
- [x] Move only qualifying records to `Published`.
- [x] Keep local constraint records in `In Review` where local evidence is still insufficient.
- [x] Set `published_date` for any newly published signals.
- [x] Refresh source `last_checked_date` values for the source pages rechecked in this phase.
- [x] Add public publication-date visibility to signal detail pages.
- [x] Document record-by-record publish-or-hold decisions.
- [x] Keep automation, ingestion, scoring, graph libraries, CMS, and database migration out of scope.
- [x] Run `npm run validate:content`.
- [x] Run `npm run check`.
- [x] Run `npm run build`.
- [x] Smoke test representative local preview routes.

## Publication Decisions

Published on 2026-06-14:

- `signal-sample-001`: NOAA ENSO Diagnostic Discussion.
- `signal-sample-002`: USGS Mineral Commodity Summaries 2026.
- `signal-sample-007`: NIST post-quantum cryptography standards and migration.

Held in `In Review`:

- `signal-arizona-electricity-profile-chip-corridor-power-constraint`.
- `signal-arizona-water-resources-chip-corridor-constraint-map`.
- `signal-statcan-building-permits-construction-intentions-signal`.

Rationale:

The three published records are bounded source updates or official baselines with clear caveats. The three held records are useful local constraint signals, but they still need specific project, provider, utility, municipal, monthly-release, or geography-level evidence before publication.

## Validation Results

Commands run from `app/`:

```text
npm.cmd run validate:content
npm.cmd run check
npm.cmd run build
```

Results:

```text
validate:content: passed
check: 0 errors, 0 warnings, 0 hints
build: passed, 97 pages generated
```

Note:

An initial parallel run of `check` and `build` caused a temporary Vite cache cleanup collision. Running `npm.cmd run build` by itself passed cleanly.

Local route smoke test:

```text
/ -> 200
/method/ -> 200
/atlas/sources/source-noaa-cpc-enso/ -> 200
/signals/noaa-enso-discussion-el-nino-advisory-climate-risk-clock/ -> 200
/signals/usgs-mineral-commodity-summaries-2026-critical-materials-baseline/ -> 200
/signals/nist-pqc-standards-quantum-risk-migration-work/ -> 200
/signals/arizona-water-resources-chip-corridor-governance-question/ -> 200
```

First-hit note:

Several representative dev-server routes timed out on the first parallel request, then returned 200 when retried sequentially. Treat Phase 36 as the place for final live-browser responsive QA.

## Acceptance Criteria

- Phase 35 work package exists.
- Launch-candidate review exists.
- Source checks are documented.
- Published promotions are explicit and reversible.
- Local constraint records remain cautious.
- Publication dates are visible on signal detail pages.
- No unsupported local claims are promoted.
- Validation, check, and build pass.
- Representative local preview routes return 200.
- Roadmap identifies the next phase.

## Open Questions

- Should public indexes default to `Published` only after actual launch, while keeping `In Review` available through filtered or clearly labeled routes?
- Should FTFN add a public correction/update log before launch, or is the Method page enough for the first release?
- Should a launch essay be a short public note first, or a longer thesis piece?

## Next Phase

Phase 36 completed the launch package and static deployment-readiness path for `ftfn.io` without deploying.

Current follow-up:

Phase 37 should run final browser QA and deployment preview preparation. It should not attach `ftfn.io` or change DNS until explicitly approved.
