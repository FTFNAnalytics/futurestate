# Phase 10 Work Package: First Reviewed Content Batch

## Objective

Create the first reviewed content batch for FTFN by moving a small number of high-quality seed records from sample scaffolding toward publishable editorial intelligence.

Phase 10 does not publish the records. It moves the strongest samples to `In Review`, verifies their official source pages, documents the source choices, and avoids unsupported local or company claims.

## Inputs

- [README](../../README.md)
- [Documentation Map](../documentation-map.md)
- [Master Roadmap](../master-roadmap.md)
- [Decision Log](../decision-log.md)
- [Taxonomy](../taxonomy.md)
- [Content Model](../content-model.md)
- [Source Strategy](../source-strategy.md)
- [Editorial Method](../editorial-method.md)
- [Review Checklists](../review-checklists.md)
- [Content Expansion Plan](../content-expansion-plan.md)
- [Phase 09 Work Package](phase-09-editorial-readiness-and-content-expansion.md)
- `app/src/content.config.ts`
- `app/src/content/sources/`
- `app/src/content/signals/`
- `app/src/content/topics/`

## Deliverables

- [x] First reviewed signal batch
- [x] Official source URL checks
- [x] Source choice documentation
- [x] Supporting topic records for the reviewed batch
- [x] README update
- [x] Master roadmap update
- [x] Decision log update
- [x] Content expansion plan update
- [x] Validation and build results

## Reviewed Signal Decisions

| Signal | Source | Phase 10 status | Publication decision |
| --- | --- | --- | --- |
| `signal-sample-001` | NOAA CPC ENSO Diagnostic Discussion | `In Review` | Reviewed against official source; not published until final citation and regional caveats are checked. |
| `signal-sample-002` | USGS Mineral Commodity Summaries 2026 | `In Review` | Reviewed against official source; not published until commodity-specific follow-up scope is selected. |
| `signal-sample-003` | NIST CHIPS for America | `In Review` | Reviewed against official source; not published until tied to a specific award, facility, or program update. |
| `signal-sample-004` | FAA Advanced Air Mobility | `In Review` | Reviewed against official source; not published until paired with operator and local infrastructure sources. |
| `signal-sample-005` | NHTSA Automated Vehicle Safety | `In Review` | Reviewed against official source; not published until tied to a specific rule, reporting update, or deployment dataset. |
| `signal-sample-007` | NIST Post-Quantum Cryptography Project | `In Review` | Reviewed against official source; not published until public page copy links the standards and migration guidance cleanly. |

## Source Verification Notes

Official sources checked on 2026-05-27:

- [NOAA CPC ENSO Diagnostic Discussion](https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml) - current issue date observed as 14 May 2026.
- [USGS Mineral Commodity Summaries 2026](https://pubs.usgs.gov/publication/mcs2026) - official USGS publication page, first posted 2026-02-06 and revised 2026-05-27.
- [NIST CHIPS for America](https://www.nist.gov/chips) - official program page for CHIPS funding, R&D, implementation strategy, and news.
- [FAA Advanced Air Mobility](https://www.faa.gov/AAM) - official FAA AAM page supporting powered-lift and National Airspace System integration framing.
- [NHTSA Automated Vehicle Safety](https://www.nhtsa.gov/vehicle-safety/automated-vehicles-safety) - official NHTSA page supporting automation-level, safety, and cybersecurity framing.
- [NIST Post-Quantum Cryptography Project](https://csrc.nist.gov/Projects/post-quantum-cryptography) - official NIST CSRC project page supporting standards and migration framing.

## Content Changes

Signals repaired:

- Rewrote titles, summaries, dependency stacks, local caveats, and body copy for the six selected signals.
- Changed the six selected records from `Draft Sample` to `In Review`.
- Changed verification status from `Unreviewed` to `Reviewed`.
- Kept `published_date: null` for all six records.
- Added Phase 10 source-check notes to `editorial_notes`.

Sources updated:

- Updated `last_checked_date` to `2026-05-27` for the six official source records used in the reviewed batch.
- Added concise source-check notes to each source record.

Topics added:

- `Critical Minerals`
- `Quantum`
- `Mobility`

These topics directly support the reviewed batch and do not attempt to complete the full expansion plan.

## What Was Not Done

- No records were marked `Published`.
- No automation or ingestion was started.
- No dependencies were added.
- No company claims were promoted.
- No local system profile was treated as publish-ready.
- No local conclusion was added without local-system evidence.
- The full 30-record expansion plan was not created.

## Acceptance Criteria

- [x] Phase 10 work package exists.
- [x] First reviewed content batch is documented.
- [x] Selected seed signals are repaired or clearly marked for follow-up.
- [x] Source choices are documented.
- [x] No unsupported claims are elevated.
- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] Roadmap identifies the next phase.

## Validation Results

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 41 pages generated
```

## Recommended Next Phase

Phase 11 should make editorial state visible in the product UI before more records are promoted. The app currently renders sample, draft, and reviewed records through the same surfaces, so the next step should make status, verification, source dates, and evidence labels clearer.

Suggested title:

```text
Phase 11: Editorial State Visibility and Citation UI
```

## Open Questions

- Should `Draft Sample` records remain visible in public indexes during prelaunch?
- Should `In Review` be displayed to readers or treated as an internal status?
- Should signal pages show `last_checked_date` from source records?
- Should source credibility tier appear on every signal page or only on source profiles?
