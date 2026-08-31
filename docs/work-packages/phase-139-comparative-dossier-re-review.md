# Phase 139 — Comparative dossier re-review

**Version:** v0.8

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Re-review all twelve comparison passports against the new chronicles and ledgers while preserving Context only.

## Upstream inputs

- `phase-123-comparative-delivery-dossiers.json`
- `phase-129-cross-system-evidence-syntheses.json`
- `Phases 136–138`

## Dataset contract

- Program ID: `FTFN-PHASE-139`
- Dataset: `phase_139_comparative_dossier_rereview`
- Record scope: Comparative dossier re-review records governed by the stated publication boundaries.
- Primary records: 12
- Primary record fields: rereview_id, dossier_id, synthesis_id, slug, title, project_chronicle_ids, place_ledger_ids, longitudinal_eligibility_ids, identity_test, stage_test, period_test, denominator_test, inherited_verdict, rereview_verdict, verdict_changed, what_is_comparable, what_must_not_be_compared, decisive_next_evidence, route

| Count | Value |
| --- | ---: |
| dossier rereviews | 12 |
| context only | 12 |
| verdict changes | 0 |
| scores created | 0 |
| ranks created | 0 |
| causal findings created | 0 |

## Reader integration

- Hub: `/review/v08/comparisons/`
- Public JSON: `/data/phase-139-comparative-dossier-rereview.json`
- Indexable phase routes: 13
- Twelve detail routes join chronicles, ledgers and exact Phase 138 eligibility records while retaining Context only.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- All twelve inherited verdicts and re-review verdicts remain Context only.
- Every Phase 138 join resolves; no score, rank or causal finding is created.
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

Reopen comparison only when a common identity, stage, period and denominator are established.
