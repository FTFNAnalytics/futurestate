# Phase 121 — Priority Research Missions

**Status:** Complete<br>
**Effective date:** 2026-08-30
**Program:** FTFN v0.5 — Evidence Fieldbook

## Objective

Turn all 68 Phase 116 priority questions into public, inspectable research missions without pretending that assembling a packet answers the question. Every mission preserves the upstream question, evidence requirements, geography and completion rule exactly while making its method, period, denominator, named files, contextual evidence, acquisition rails, acceptance rules, rejection rules and stop rule explicit.

## Delivered

- One mission for each of the 68 Phase 116 priority questions.
- Exactly four missions for each of the seventeen canonical topics: Baseline, Conversion, Operation and Outcome.
- Stable `121-MISSION-*` IDs and topic-horizon routes.
- Exact topic-and-stage joins to the 80 Phase 120 Candidate acquisition packets.
- Fifty-six missions have one or more exact packet joins; twelve preserve an explicit acquisition coverage gap because no Phase 120 packet shares both their topic and a target conversion stage.
- Exact canonical-identity joins from the Phase 116 coverage matrix to Phase 119 project and place files.
- Contextual Published signal shelves inherited unchanged from each Phase 118 topic chapter, with source IDs inherited only from those signals.
- Explicit method, period and denominator controls for every horizon.
- Visible missing-decisive-evidence, acceptance, rejection, stewardship, next-action and stop-rule fields.
- One hub, 68 mission routes, one public JSON export and one dated update.
- A deterministic builder and an independent assertion suite.

## Answer state

Every mission has one fixed state:

`Research packet assembled — answer not adjudicated`

This state is a positive statement about research infrastructure and a negative boundary on evidence interpretation. It does not mean that a qualifying artifact exists, that evidence is absent, that a claim is supported, or that a conversion stage has advanced.

## Join contract

Phase 121 permits only stable-ID joins:

1. Mission membership is one-to-one with `phase-116-coverage-architecture.json.priority_questions`.
2. Acquisition packets join when their exact `topic_ids` contain the mission topic and their exact `conversion_stage_ids` intersect the mission target stages.
3. Project and place files join through Phase 116 canonical casebook and local-system IDs and their one-to-one Phase 119 canonical identities.
4. Context signals are the exact Phase 118 topic-chapter evidence IDs.
5. Context sources are inherited only from those Published signals.

Titles, summaries, aliases, keywords, substrings and fuzzy similarity are not membership rules.

## Public routes

- `/review/fieldbook/missions/`
- 68 `/review/fieldbook/missions/{topic-horizon}/` routes
- `/data/phase-121-priority-research-missions.json`

The data route is not counted among the 69 HTML routes.

## Publication boundary

Phase 121 creates no new source or signal, admits no artifact, operates no evidence gate, changes no named file, creates no observation or outcome, and publishes no answer, score, ranking, forecast, recommendation or causal conclusion. A Phase 118 signal is contextual background, not proof that the mission-specific completion contract has been satisfied. A Phase 120 packet is acquisition infrastructure, not evidence.

The eleven Phase 60 gates scheduled after August 30, 2026 remain scheduled and undecided.

## Verification

Run from `app/`:

```text
node ./scripts/build-phase121-priority-research-missions.mjs
node ./scripts/assert-phase121.mjs
npm.cmd run check
```

Shared v0.5 integration owns package scripts, sitemap inclusion, review and data navigation, aggregate verification, release-manifest updates and the final production build.
