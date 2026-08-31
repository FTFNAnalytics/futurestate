# Phase 144 — v1 launch-candidate audit

**Version:** v0.9

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Audit the complete v0.7-v0.9 system against evidence, conversion, longitudinal, editorial, accessibility, and release gates.

## Upstream inputs

- `Phases 130–143`
- `phase-144-local-validation-receipt.json when the local suite has passed`

## Dataset contract

- Program ID: `FTFN-PHASE-144`
- Dataset: `phase_144_v1_launch_candidate_audit`
- Record scope: v1 launch-candidate audit records governed by the stated publication boundaries.
- Primary records: 14
- Primary record fields: gate_id, label, state, reason

| Count | Value |
| --- | ---: |
| launch gates | 14 |
| passed | 10 |
| held | 4 |
| pending build | 0 |
| false passes | 0 |

## Reader integration

- Hub: `/review/v09/launch-audit/`
- Public JSON: `/data/phase-144-v1-launch-candidate-audit.json`
- Indexable phase routes: 1
- The public audit exposes fourteen gates; automated accessibility structure and release validation require a dated local receipt, while owner acceptance remains Held.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- The audit contains fourteen gates and zero false passes.
- A local validation receipt can pass structural accessibility and release validation, but cannot clear the four owner/evidence holds or promote v1.
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

Keep v1 Held until owner acceptance and the remaining evidence conditions are explicitly resolved.
