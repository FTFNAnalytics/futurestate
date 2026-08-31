# Phase 140 — Living topic desks

**Version:** v0.9

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Turn all seventeen topic reviews into maintained public desks with current reads, open missions, watch queues, and reader paths.

## Upstream inputs

- `phase-128-topic-state-of-evidence-reviews.json`
- `Phases 130–139`

## Dataset contract

- Program ID: `FTFN-PHASE-140`
- Dataset: `phase_140_living_topic_desks`
- Record scope: Living topic desks records governed by the stated publication boundaries.
- Primary records: 17
- Primary record fields: desk_id, topic_id, slug, title, desk_state, current_read, strongest_current_evidence, contested_reading, mission_ids, acquisition_gap_mission_ids, authority_gap_map_ids, admission_docket_ids, source_check_receipt_ids, requirement_adjudication_ids, mission_decision_ids, project_chronicle_ids, place_ledger_ids, comparison_rereview_ids, next_actions, cadence, route

| Count | Value |
| --- | ---: |
| living topic desks | 17 |
| mission links | 68 |
| acquisition gap links | 12 |
| desks in inaugural edition | 17 |

## Reader integration

- Hub: `/review/v09/desks/`
- Public JSON: `/data/phase-140-living-topic-desks.json`
- Indexable phase routes: 18
- Seventeen desk routes carry exact Phase 130–134 control IDs plus v0.8 project, place and comparison joins.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- Seventeen desks resolve all 68 missions and twelve acquisition gaps.
- Every v0.7 control ID is typed and resolves to the correct topic mission.
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

Operate the desk on material evidence or governed decision changes.
