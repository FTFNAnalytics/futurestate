# Phase 137 — Place delivery ledgers

**Version:** v0.8

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Publish fifteen place ledgers that separate receiving-system context from the stages of projects located inside each place.

## Upstream inputs

- `phase-119-deep-project-place-atlas.json`
- `phase-127-project-place-conversion-biographies.json`

## Dataset contract

- Program ID: `FTFN-PHASE-137`
- Dataset: `phase_137_place_delivery_ledgers`
- Record scope: Place delivery ledgers records governed by the stated publication boundaries.
- Primary records: 15
- Primary record fields: ledger_id, atlas_place_id, slug, title, geography, system_type, coverage_tier, inherited_state, related_project_ids, signal_ids, source_ids, receiving_system_read, open_system_needs, exact_next_artifact, stop_rule, place_stage, interpretation_boundary, route

| Count | Value |
| --- | ---: |
| place ledgers | 15 |
| governed ledgers | 5 |
| curated ledgers | 10 |
| related project links | 16 |
| synthetic place stages | 0 |

## Reader integration

- Hub: `/review/v08/places/`
- Public JSON: `/data/phase-137-place-delivery-ledgers.json`
- Indexable phase routes: 16
- Fifteen detail routes and all canonical place pages expose receiving-system ledgers without a synthetic place stage.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- All fifteen place IDs and sixteen related-project links resolve reciprocally.
- place_stage remains null everywhere.
- All eleven post-2026-08-30 Phase 60 gates remain scheduled, undated and unreceipted.
- The corpus remains 795 sources and 1,406 signals: 1,121 Published and 285 In Review.

## Preservation and rebuild behavior

Phase 133 requirement decisions, Phase 134 mission answers and Phase 143 governed editions are preservation-safe. The generator retains any non-pending receipted record and fails on an identity conflict instead of silently replacing it. Phase 144 derives its two local validation gates only from a dated validation receipt.

## Publication boundaries

- AI-assisted source triage can map exact artifacts and expose their limits, but it cannot stand in for the repository's required human admissibility decision.
- A source-check receipt proves only that the named official artifact was inspected on the stated date; it does not admit the artifact, satisfy a requirement, or answer a mission.
- No project stage, place state, comparison verdict, observation, outcome, score, rank, causal finding, recommendation, or future Phase 60 decision is created.
- A repository-bounded gap says what this reviewed corpus has not established; it never asserts that qualifying evidence does not exist elsewhere.

## Next action

Update place context without inheriting the stage of any linked project.
