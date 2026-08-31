# FTFN v0.9 session handoff

**Effective date:** 2026-08-30

**Local state:** Complete locally

## Read first

1. `docs/roadmap-v0.7.md` — evidence-admission control.
2. `docs/roadmap-v0.8.md` — conversion and longitudinal boundaries.
3. `docs/roadmap-v0.9.md` — living publication and v1 gates.
4. `app/src/data/phase-144-v1-launch-candidate-audit.json` — current launch truth.
5. `app/src/data/phase-60-operating-cycle.json` — lawful dated evidence operations.

## Current release inventory

- Fifteen complete content phases: 130–144.
- 170 unique v0.7–v0.9 public HTML routes and eighteen new JSON exports.
- Cumulative verified local build: 6,504 HTML pages, 86 exports and 169 update records.
- v0.7: twelve acquisition-gap maps, six mission dockets, eighteen source checks, eighteen requirement adjudications and six mission decisions.
- v0.8: 39 readiness audits, 24 project chronicles, 15 place ledgers, 39 longitudinal reviews and twelve comparison re-reviews.
- v0.9: seventeen desks, 56 almanac entries, seventeen roadmaps, one authored current edition, four empty future schedules and fourteen launch gates.

## Open owner queue

Requirement decisions (18):

- `133-ADJUDICATION-001` — 121-MISSION-004: Stable product and facility denominator
- `133-ADJUDICATION-002` — 121-MISSION-004: Multi-period operating series
- `133-ADJUDICATION-003` — 121-MISSION-004: Revision, downtime and attribution notes
- `133-ADJUDICATION-004` — 121-MISSION-013: Tail, fleet, airport or route identity
- `133-ADJUDICATION-005` — 121-MISSION-013: Capacity and readiness definitions
- `133-ADJUDICATION-006` — 121-MISSION-013: Current operating period
- `133-ADJUDICATION-007` — 121-MISSION-016: Exposure-compatible safety measures
- `133-ADJUDICATION-008` — 121-MISSION-016: Route or fleet operating periods
- `133-ADJUDICATION-009` — 121-MISSION-016: Environmental and access denominators
- `133-ADJUDICATION-010` — 121-MISSION-025: Asset and material identity
- `133-ADJUDICATION-011` — 121-MISSION-025: Resource, reserve and capacity definitions
- `133-ADJUDICATION-012` — 121-MISSION-025: Current environmental and operating state
- `133-ADJUDICATION-013` — 121-MISSION-049: Operator, route, fleet or service identity
- `133-ADJUDICATION-014` — 121-MISSION-049: Exposure and service denominator
- `133-ADJUDICATION-015` — 121-MISSION-049: Current reliability and access baseline
- `133-ADJUDICATION-016` — 121-MISSION-060: Stable task and system denominator
- `133-ADJUDICATION-017` — 121-MISSION-060: Multi-period accepted-use evidence
- `133-ADJUDICATION-018` — 121-MISSION-060: Explicit forecast-versus-observation boundary

Mission decisions (6):

- `134-MISSION-001` — 121-MISSION-004: Advanced Manufacturing: outcome research mission
- `134-MISSION-002` — 121-MISSION-013: Aviation: baseline research mission
- `134-MISSION-003` — 121-MISSION-016: Aviation: outcome research mission
- `134-MISSION-004` — 121-MISSION-025: Critical Minerals: baseline research mission
- `134-MISSION-005` — 121-MISSION-049: Mobility: baseline research mission
- `134-MISSION-006` — 121-MISSION-060: Quantum: outcome research mission

## Future Phase 60 calendar

- 2026-09-01: `60-CYCLE-LOUISIANA-STARLINK-ADOPTION` — scheduled; no decision date or receipt.
- 2026-09-09: `60-CYCLE-LOUISIANA-NEXTLINK-ADOPTION` — scheduled; no decision date or receipt.
- 2026-09-10: `60-CYCLE-AMTRAK-PIDS-CLOSEOUT` — scheduled; no decision date or receipt.
- 2026-09-10: `60-CYCLE-HANFORD-MATERIAL-BALANCE` — scheduled; no decision date or receipt.
- 2026-09-10: `60-CYCLE-NNSA-GAO-BASELINE` — scheduled; no decision date or receipt.
- 2026-09-15: `60-CYCLE-MONTANA-COMPLETED-QUARTER` — scheduled; no decision date or receipt.
- 2026-09-22: `60-CYCLE-ARIZONA-WASTEWATER` — scheduled; no decision date or receipt.
- 2026-09-24: `60-CYCLE-NNSA-ACCEPTED-CAPACITY` — scheduled; no decision date or receipt.
- 2026-10-01: `60-CYCLE-LOUDOUN-STANDARDS` — scheduled; no decision date or receipt.
- 2026-10-09: `60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY` — scheduled; no decision date or receipt.
- 2026-10-09: `60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE` — scheduled; no decision date or receipt.

The next legal gate is 2026-09-01. Never predate a gate or infer nonexistence from a bounded search.

## Rebuild and verification

Run from `app/`:

```text
npm run build:phase127-content
npm run build:v09-content
npm run validate:candidates
npm run validate:content
npm run source:health
npm run test:v09
npm run check
npm run build
npm run verify:v09
npm run update:v09-manifest
npm run verify:release
```

Receipt `144-LOCAL-VALIDATION-2026-08-30` is embedded, and the final production/manifest/global release checks passed on 2026-08-31. Its stored `next_action` is the immutable instruction recorded when the receipt was issued; that follow-up is complete. Do not silently reuse the receipt after governed content changes; rerun the full suite and handle any replacement as an explicit receipt correction before rebuilding.

## Preservation rules

- The generator preserves receipted Phase 133 decisions, Phase 134 answers and governed Phase 143 editions.
- It aborts on identity conflicts rather than overwriting governed state.
- Phase 56 observations remain legacy context and never enter Phase 68–74 by implication.
- Owner acceptance, public launch and v1 promotion cannot be derived from automated validation.

## Recovery

If a check fails, leave the Phase 144 receipt absent or remove only the invalid receipt file, fix the defect, rebuild and rerun the full suite. Do not reset unrelated user work or edit an owner decision back to Pending.

## Git and deployment state

No Git commit, push, merge, Sites deployment, public-access change, custom-domain action or DNS mutation is part of this build.
