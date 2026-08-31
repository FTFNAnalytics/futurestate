# Phase 138 — Longitudinal evidence eligibility

**Version:** v0.8

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Test all thirty-nine Atlas records for stable identity, period, measure, and denominator prerequisites without manufacturing a series.

## Upstream inputs

- `phase-119-deep-project-place-atlas.json`
- `phase-56b/56e entity panels`
- `phase-69 measurement registry`
- `phase-70 observation/admission registry`

## Dataset contract

- Program ID: `FTFN-PHASE-138`
- Dataset: `phase_138_longitudinal_evidence_eligibility`
- Record scope: Longitudinal evidence eligibility records governed by the stated publication boundaries.
- Primary records: 39
- Primary record fields: eligibility_id, entity_kind, entity_id, slug, title, legacy_panel_id, legacy_panel_record_status, legacy_observation_count, governed_file_id, measurement_specification_ids, series_admission_docket_id, tests, candidate_state, eligibility_outcome, series_admitted, observation_values, next_record

| Count | Value |
| --- | ---: |
| eligibility reviews | 39 |
| candidate shelves | 38 |
| legacy panel joins | 12 |
| governed file joins | 8 |
| admitted series | 0 |
| observation values created | 0 |
| outcome claims created | 0 |

## Reader integration

- Hub: `/review/v08/longitudinal/`
- Public JSON: `/data/phase-138-longitudinal-evidence-eligibility.json`
- Indexable phase routes: 1
- The hub exposes every four-test eligibility record; all canonical project and place pages show their exact eligibility ID and next record.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- Twelve curated Phase 56 panel joins and eight governed Phase 69/70 file joins are explicit and non-transferable.
- All 39 reviews retain zero admitted series, observation values and outcome claims.
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

Acquire and independently review a compatible repeated observation before admission.
