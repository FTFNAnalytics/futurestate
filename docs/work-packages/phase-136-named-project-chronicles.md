# Phase 136 — Named project chronicles

**Version:** v0.8

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Publish twenty-four stage-bounded project chronicles with exact evidence rails, turning points, and next artifacts.

## Upstream inputs

- `phase-119-deep-project-place-atlas.json`
- `phase-127-project-place-conversion-biographies.json`
- `phase-62-conversion-event-ledgers.json`

## Dataset contract

- Program ID: `FTFN-PHASE-136`
- Dataset: `phase_136_named_project_chronicles`
- Record scope: Named project chronicles records governed by the stated publication boundaries.
- Primary records: 24
- Primary record fields: chronicle_id, atlas_project_id, slug, title, coverage_tier, inherited_stage, stage_basis, event_ids, signal_ids, source_ids, current_account, turning_points, unresolved_bridge, exact_next_artifact, stop_rule, reader_questions, route

| Count | Value |
| --- | ---: |
| project chronicles | 24 |
| governed chronicles | 8 |
| curated chronicles | 16 |
| event links | 17 |
| stage advances | 0 |

## Reader integration

- Hub: `/review/v08/projects/`
- Public JSON: `/data/phase-136-named-project-chronicles.json`
- Indexable phase routes: 25
- Twenty-four detail routes and all canonical project pages expose stage-bounded chronicles.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- All 192 inherited project-stage cells, seventeen event links and exact evidence rails remain unchanged.
- No chronicle contains broken because-clause or editorial-question prose.
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

Update a chronicle only from a dated upstream stage or evidence event.
