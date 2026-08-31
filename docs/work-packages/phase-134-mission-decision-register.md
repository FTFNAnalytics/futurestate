# Phase 134 — Mission decision register

**Version:** v0.7

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Give each priority mission a complete decision packet while keeping every answer unadjudicated until owner review.

## Upstream inputs

- `phase-121-priority-research-missions.json`
- `phase-133-requirement-adjudication-board.json`
- `preserved owner mission decisions, if present`

## Dataset contract

- Program ID: `FTFN-PHASE-134`
- Dataset: `phase_134_mission_decision_register`
- Record scope: Mission decision register records governed by the stated publication boundaries.
- Primary records: 6
- Primary record fields: mission_decision_id, mission_id, slug, title, question, upstream_answer_state, requirement_adjudication_ids, requirements_total, requirements_decided, mission_decision_state, answer, decision_date, decision_receipt_id, current_read, next_action, route

| Count | Value |
| --- | ---: |
| mission decision packets | 6 |
| answers adjudicated | 0 |
| owner decisions pending | 6 |
| canonical missions mutated | 0 |

## Reader integration

- Hub: `/review/v07/missions/`
- Public JSON: `/data/phase-134-mission-decision-register.json`
- Indexable phase routes: 7
- Six mission detail routes expose the answer-state packet and remain linked from canonical Phase 121 mission pages.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- A rebuild preserves a receipted mission answer and never mutates the canonical Phase 121 record.
- Requirement-decision counts are recalculated from Phase 133.
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

Answer a mission only after all three requirement decisions satisfy its completion rule.
