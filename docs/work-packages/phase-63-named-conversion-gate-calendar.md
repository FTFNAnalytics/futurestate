# Phase 63 Work Package - Named Conversion Gate Calendar

Status: **Complete locally on August 11, 2026; owner-only deployment pending.**

## Objective

Join the Phase 60 operating cycle, Phase 61 named files, and Phase 62 event histories into one actionable next-evidence calendar. Every named file must expose its latest event, exact dated check or source-explicit trigger, eligible Phase 60 binding, required artifact, receipt state, stop rule, and propagation surfaces.

This phase schedules editorial review. It does not predict that an artifact will appear, manufacture a date for a trigger-based file, pre-complete a receipt, or assign an urgency or readiness score.

## 63A - Calendar Contract

The canonical register is `app/src/data/phase-63-conversion-gate-calendar.json`. Its schedule bands are:

- `Due This Week` for a dated check within the captured August 11 week;
- `Dated Later` for a later explicit Phase 61 date;
- `Trigger Based` when the file reopens only after a source-explicit artifact.

The bands are static as-of labels, not live countdowns. A dated item becomes invalid if it passes without a receipt; a trigger-based item does not receive an invented check date.

## 63B - Eight Named Gates

Four files have exact dates:

| File | Date | Schedule band | Phase 60 binding |
| --- | --- | --- | --- |
| Space Coast authority | 2026-08-15 | Due This Week | Bound to the Shuttle Landing Facility licence check |
| Toronto application `24 254930` | 2026-09-09 | Dated Later | No bound cycle item |
| TSMC Arizona | 2026-09-22 | Dated Later | Bound to the Arizona wastewater check |
| Northern Virginia large load | 2026-10-01 | Dated Later | Conditionally bound to Loudoun standards |

Four files reopen only on official downstream evidence:

- Nevada lithium on construction acceptance, commissioning, compliance, qualification, shipment, or recurring output;
- GSA PQC on a named agency procurement or migration artifact;
- NIST ARIA on a named system assurance, deployment, or outcome artifact;
- Waymo California on a current comparable official operator rollup.

## 63C - Receipt And Binding Boundary

The four allowed receipt types remain `Change Note`, `Watch Note`, `Correction`, and `No Material Change`. A gate advances only after an actual source check, decision date, receipt, and complete propagation.

Only the three Phase 62 same-entity bindings can append to named files. Loudoun remains conditional: its receipt must materially change the Golden-Mars or GS-5 receiving-system stage. The ten Phase 60 no-transfer decisions remain unchanged.

## 63D - Reader And Public Data Layer

Phase 63 adds:

- `Conversion Gate Calendar 001: What Can Move Next`;
- `/data/conversion-gates.json` with eight public gate records;
- a tenth card on the public data index;
- one public update.

## Verified Delta

| Measure | Phase 63 delta |
| --- | ---: |
| Named-file gates | 8 |
| Dated checks | 4 |
| Source-trigger gates | 4 |
| Due-this-week files | 1 |
| Same-entity Phase 60 bindings | 3 |
| Conditional bindings | 1 |
| Published briefings | 1 |
| Public JSON exports | 1 |
| Public updates | 1 |
| New sources or signals | 0 |
| Receipts created | 0 |
| Scores or outcome changes | 0 |

## Release Contract

The Phase 63 candidate contains 3,893 generated HTML pages, 89 briefings with 82 Published, 86 updates, ten public JSON exports, eight conversion-gate records, and all Phase 62 corpus counts unchanged.

Required checks add `npm.cmd run verify:phase63` to the existing Phase 58-62, content, candidate, source-health, Astro, build, release, and diff gates.

## Boundaries

Phase 63 does not:

- complete the August 14 or August 15 checks before their actual review;
- infer that a missing artifact does not exist;
- invent dates for trigger-based files;
- transfer evidence across entities;
- create urgency, maturity, readiness, probability, risk, value, or performance scores;
- deploy, commit, change access, synchronize GitHub, alter DNS, or launch publicly.

## Exit State

Phase 63 is complete locally when all eight files resolve to one bounded gate, four dated and four trigger-based states are preserved, the three allowed Phase 60 bindings remain exact, and the public export and release assertions pass.
