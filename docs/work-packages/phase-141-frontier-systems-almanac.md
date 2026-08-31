# Phase 141 — Frontier systems almanac

**Version:** v0.9

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Create one inspectable almanac entry for every topic, project, and place in the v0.9 public intelligence layer.

## Upstream inputs

- `Phases 136, 137 and 140 with typed mission, signal and source references`

## Dataset contract

- Program ID: `FTFN-PHASE-141`
- Dataset: `phase_141_frontier_systems_almanac`
- Record scope: Frontier systems almanac records governed by the stated publication boundaries.
- Primary records: 56
- Primary record fields: almanac_id, kind, canonical_id, slug, title, state, current_read, mission_ids, signal_ids, source_ids, open_boundary, route

| Count | Value |
| --- | ---: |
| almanac entries | 56 |
| topics | 17 |
| projects | 24 |
| places | 15 |

## Reader integration

- Hub: `/review/v09/almanac/`
- Public JSON: `/data/phase-141-frontier-systems-almanac.json`
- Indexable phase routes: 57
- Fifty-six detail routes separate mission IDs, signal IDs and source IDs by record kind.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- The 56 entries remain exactly 17 topics, 24 projects and 15 places.
- Mission contracts are never labeled as evidence IDs.
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

Keep typed references and current boundaries synchronized with their canonical files.
