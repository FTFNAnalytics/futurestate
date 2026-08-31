# Phase 130 — Authority-gap closure maps

**Version:** v0.7

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Map every uncovered mission to its present official-source shelf, missing authority role, and next acquisition action.

## Upstream inputs

- `phase-121-priority-research-missions.json`
- `phase-120-evidence-acquisition-packets.json`

## Dataset contract

- Program ID: `FTFN-PHASE-130`
- Dataset: `phase_130_authority_gap_closure_maps`
- Record scope: Authority-gap closure maps records governed by the stated publication boundaries.
- Primary records: 12
- Primary record fields: gap_map_id, mission_id, topic_id, slug, title, gap_type, current_source_ids, current_signal_ids, priority_docket, map_state, missing_authority_role, next_action, route

| Count | Value |
| --- | ---: |
| gap missions | 12 |
| priority paths | 6 |
| acquisition paths open | 12 |
| artifacts admitted | 0 |
| mission answers created | 0 |

## Reader integration

- Hub: `/review/v07/authority-gaps/`
- Public JSON: `/data/phase-130-authority-gap-closure-maps.json`
- Indexable phase routes: 1
- Expanded authority-gap cards on the v0.7 hub and exact backlinks from canonical mission files.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- Twelve and only twelve Phase 121 acquisition gaps remain open.
- The six priority paths are flagged without implying an admission.
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

Acquire an exact topic-and-stage authority rail or retain the bounded gap.
