# Phase 142 — Topic delivery roadmaps

**Version:** v0.9

**Effective date:** 2026-08-30

**Status:** Complete locally

## Objective

Give every topic a four-horizon evidence roadmap with exact missions, stopping rules, and next editorial actions.

## Upstream inputs

- `phase-121-priority-research-missions.json`
- `phase-134-mission-decision-register.json`
- `phase-140-living-topic-desks.json`

## Dataset contract

- Program ID: `FTFN-PHASE-142`
- Dataset: `phase_142_topic_delivery_roadmaps`
- Record scope: Topic delivery roadmaps records governed by the stated publication boundaries.
- Primary records: 17
- Primary record fields: roadmap_id, topic_id, desk_id, slug, title, horizon_milestones, delivery_sequence, success_definition, route

| Count | Value |
| --- | ---: |
| topic roadmaps | 17 |
| horizon milestones | 68 |
| numeric rankings | 0 |

## Reader integration

- Hub: `/review/v09/roadmaps/`
- Public JSON: `/data/phase-142-topic-delivery-roadmaps.json`
- Indexable phase routes: 18
- Seventeen roadmap routes resolve current state and next action from Phase 134 when a governed mission packet exists.

Hub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.

## Acceptance and assertion matrix

- Every upstream ID must resolve to the exact record kind declared by the phase.
- Every route must build with `index, follow`, the exact `https://ftfn.io` canonical URL and one sitemap entry.
- Seventeen roadmaps contain 68 horizon milestones.
- Priority current states are read from Phase 134 rather than a hard-coded label.
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

Propagate later Phase 134 decisions into the matching horizon milestone.
