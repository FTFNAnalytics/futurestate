# Phase 16 Work Package: First Evidence-Backed Briefing Draft and Editorial Synthesis

## Goal

Create the first evidence-backed FTFN briefing draft by turning the placeholder briefing into an `In Review` synthesis built only from reviewed signals.

This phase tests whether FTFN can move from structured signal records into readable editorial intelligence while preserving evidence limits.

## Scope

- Confirm Phase 15 as the latest completed phase.
- Review the current briefing schema, briefing pages, and briefing checklist.
- Repair the existing placeholder briefing rather than creating a broad new publication cadence.
- Use only `In Review` signals as the briefing evidence base.
- Keep the briefing out of `Published`.
- Improve briefing pages only where needed to expose editorial status and referenced-signal context.
- Run validation and preview the briefing route.
- Update README, roadmap, decision log, content expansion plan, session brief, and this work package.

## Deliverables

- Repaired briefing record:
  - `app/src/content/briefings/briefing-stack-watch-001.mdx`
- Briefing UI updates:
  - `app/src/pages/briefings/index.astro`
  - `app/src/pages/briefings/[slug].astro`

## Briefing Decision

The first real briefing is:

```text
Stack Watch 001: Local constraints are where the future arrives
```

It is an `In Review` synthesis that connects:

- ENSO and climate-risk interpretation,
- critical minerals and material baselines,
- CHIPS and semiconductor capacity,
- AI electricity demand,
- Arizona power and water constraints,
- Ontario housing targets and delivery capacity,
- Statistics Canada building permits as construction intentions.

## Editorial Boundaries

The briefing can say:

- technologies move through local receiving systems,
- power, water, materials, compute, regulation, capital, infrastructure, data quality, and interpretation recur across reviewed signals,
- official sources can support constraint maps,
- local conclusions still require more granular municipal, utility, permitting, facility, financing, and completion evidence.

The briefing cannot say:

- a specific region is ready or unready for industrial growth,
- a specific project has sufficient power, water, capital, or permits,
- housing targets will become completed supply,
- permits equal completions,
- the 42/59 Index is ready for scoring.

## Implementation Notes

- The old placeholder briefing was moved from `briefing-sample-001.mdx` to `briefing-stack-watch-001.mdx`.
- The briefing ID changed from `briefing-sample-001` to `briefing-stack-watch-001`.
- The briefing status changed from `Draft Sample` to `In Review`.
- The briefing route changed from `/briefings/first-stack-watch/` to `/briefings/stack-watch-001-local-constraints/`.
- Briefing index cards now use editorial status styling.
- Briefing detail pages now show a status panel and referenced-signal status, verification, topic, signal type, and evidence quality.
- No new sources, signals, dependencies, automation, ingestion, or schema fields were added.

## Validation

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 63 pages generated
```

## Preview Notes

Preview after build:

- `/briefings/`
- `/briefings/stack-watch-001-local-constraints/`

Actual result:

- static build output includes `/briefings/stack-watch-001-local-constraints/index.html`,
- static HTML contains the Stack Watch title, `In Review` state, `Evidence Base`, `Publication Limit`, official-data labels, credible-analysis labels, and referenced signal links,
- direct in-app browser automation was not available because the Browser plugin cache was missing `browser-client.mjs`,
- the existing `4321` dev server was stale, so final verification used the built static output rather than visual browser inspection.

## Acceptance Criteria

- Phase 16 work package exists.
- The first briefing is a real evidence-backed synthesis, not a placeholder.
- The briefing uses only reviewed signals.
- The briefing remains `In Review`.
- Unsupported local conclusions are avoided.
- Briefing pages expose enough editorial state for prelaunch review.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Next Phase

Phase 17 should turn the first briefing's missing-data needs into a briefing template and evidence gap register.
