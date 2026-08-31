# Phase 143 — Editorial cadence and editions

**Version:** v0.9

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Publish the inaugural v0.9 desk edition and a transparent four-edition forward schedule without predating future content.

## Upstream inputs

- `phase-140-living-topic-desks.json`
- `preserved governed edition records, if present`

## Dataset contract

- Program ID: `FTFN-PHASE-143`
- Dataset: `phase_143_editorial_cadence_editions`
- Record scope: Editorial cadence and editions records governed by the stated publication boundaries.
- Primary records: 5
- Primary record fields: edition_id, slug, title, publication_date, state, focus, included_desk_ids, editorial_sections, desk_dispatches, boundary, route

| Count | Value |
| --- | ---: |
| editions | 5 |
| published editions | 1 |
| scheduled editions | 4 |
| desks in inaugural edition | 17 |
| future content predated | 0 |

## Reader integration

- Hub: `/review/v09/editions/`
- Public JSON: `/data/phase-143-editorial-cadence-editions.json`
- Indexable phase routes: 6
- Five edition routes include one authored current edition, seventeen desk dispatches and four empty future schedules.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- The inaugural edition contains six authored sections and seventeen desk dispatches.
- A rebuild preserves any later governed edition and never prepublishes a scheduled edition.
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

Write each scheduled edition only on or after its date and preserve its governed content.
