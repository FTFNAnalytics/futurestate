# Phase 133 — Requirement adjudication board

**Version:** v0.7

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Place all eighteen requirements on one decision board with acceptance tests, rejection risks, and explicit pending-owner states.

## Upstream inputs

- `phase-131-priority-evidence-admission-dockets.json`
- `phase-132-dated-source-check-receipts.json`
- `preserved owner decisions, if present`

## Dataset contract

- Program ID: `FTFN-PHASE-133`
- Dataset: `phase_133_requirement_adjudication_board`
- Record scope: Requirement adjudication board records governed by the stated publication boundaries.
- Primary records: 18
- Primary record fields: adjudication_id, mission_id, requirement_docket_id, source_check_receipt_id, requirement, candidate_source_ids, triage_state, acceptance_test, rejection_test, decision_state, accepted_source_ids, rejected_source_ids, decision_date, decision_receipt_id, next_action

| Count | Value |
| --- | ---: |
| requirements | 18 |
| pending owner adjudication | 18 |
| accepted | 0 |
| rejected | 0 |
| inadmissible | 0 |
| bounded gap decisions | 0 |

## Reader integration

- Hub: `/review/v07/requirements/`
- Public JSON: `/data/phase-133-requirement-adjudication-board.json`
- Indexable phase routes: 1
- The public board exposes acceptance/rejection tests, decision state and next action; priority mission pages join the exact adjudication IDs.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- A rebuild preserves non-pending owner fields and fails if a governed decision changes identity.
- Accepted, rejected, inadmissible and bounded-gap totals are derived from preserved decision states.
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

Record a dated authorized decision receipt for each requirement.
