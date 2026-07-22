# Phase 47: Private Update Queue And Signal Repair Workflow

Date: 2026-07-21

## Goal

Start the v0.2 authority loop by creating:

- a private source-update queue,
- a repeatable signal-repair workflow,
- the first mapped v0.2 signal batch.

This phase moves FTFN from source monitor visibility toward human-reviewed update operations without starting automated ingestion or automated publishing.

## Implemented

- Created `docs/private-update-queue.md`.
- Created `docs/signal-repair-workflow.md`.
- Created `docs/v0.2-next-signal-set.md`.
- Added Batch 01 with 20 private source-review candidates.
- Identified the first repair priorities:
  - NOAA ENSO,
  - CHIPS,
  - FAA AAM,
  - NHTSA AV,
  - NASA Artemis,
  - USDA plant genomics,
  - AI/grid,
  - Arizona power,
  - Arizona water,
  - Ontario permits/completions.
- Mapped a 12 to 16 record next-signal set for v0.2.
- Spot-checked review-critical sources where available:
  - NOAA CPC ENSO Diagnostic Discussion now shows a 9 July 2026 discussion and next scheduled discussion of 13 August 2026.
  - City of Toronto AIC confirms active application data and daily refresh behavior.
  - ACC eDocket remains a manual portal review source in this environment.
  - Ontario Housing Supply Progress remains a manual recheck item before new claims.

## Boundary

This phase does not:

- add new signal records,
- change publication status,
- fetch or ingest source content automatically,
- publish claims,
- add a database,
- add a public API,
- add scoring,
- deploy the site.

## Next

Recommended next implementation step:

1. Repair or split the NOAA ENSO signal against the 9 July 2026 CPC discussion.
2. Select one cybersecurity source item from CISA KEV or NIST NVD.
3. Select one local record candidate from ACC eDocket or Toronto AIC.
4. Create the first 2 to 3 repaired/new `In Review` signal records.
5. Run `npm.cmd run validate:content`, `npm.cmd run source:health`, `npm.cmd run check`, and `npm.cmd run build`.
