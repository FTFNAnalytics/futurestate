# Phase 131 — Priority evidence admission dockets

**Version:** v0.7

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Assemble eighteen requirement-specific dockets for six high-value missions without treating a candidate artifact as admitted evidence.

## Upstream inputs

- `phase-126-mission-evidence-audits.json`
- `phase-121-priority-research-missions.json`
- `public source registry`

## Dataset contract

- Program ID: `FTFN-PHASE-131`
- Dataset: `phase_131_priority_evidence_admission_dockets`
- Record scope: Priority evidence admission dockets records governed by the stated publication boundaries.
- Primary records: 6
- Primary record fields: docket_id, mission_id, slug, title, question, completion_rule, upstream_answer_state, requirements, route

| Count | Value |
| --- | ---: |
| mission dockets | 6 |
| requirement dockets | 18 |
| candidate artifact links | 25 |
| owner decisions pending | 18 |
| artifacts admitted | 0 |

## Reader integration

- Hub: `/review/v07/admission-dockets/`
- Public JSON: `/data/phase-131-priority-evidence-admission-dockets.json`
- Indexable phase routes: 1
- Six mission cards expose all eighteen nested requirement dockets, candidate artifacts and acceptance tests.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- Six mission dockets contain eighteen requirement dockets and twenty-five candidate-source links.
- Every owner decision remains pending unless a preserved dated decision receipt exists.
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

Owner-review each requirement against its acceptance and rejection test.
