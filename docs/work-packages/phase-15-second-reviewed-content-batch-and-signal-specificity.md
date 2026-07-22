# Phase 15 Work Package: Second Reviewed Content Batch and Signal Specificity

## Goal

Create a small second batch of evidence-aware `In Review` signals using the expanded official source base from Phases 12-14.

This phase should make FTFN's local constraint logic more concrete without overstating local conclusions.

## Scope

- Confirm the latest completed phase from the roadmap and session brief.
- Review the expanded source base for energy/grid, water, housing, building permits, and AI electricity demand.
- Repair one existing signal that needs stronger specificity.
- Add a small number of new signals only where official sources support the record.
- Keep all new or repaired signals in `In Review` unless the publication criteria are fully met.
- Run validation after content changes.
- Update the roadmap, decision log, content expansion plan, session brief, and README.

## Deliverables

- Repaired AI electricity demand signal:
  - `app/src/content/signals/signal-sample-009.mdx`
- New reviewed signal records:
  - `app/src/content/signals/signal-arizona-electricity-profile-chip-corridor-power-constraint.mdx`
  - `app/src/content/signals/signal-arizona-water-resources-chip-corridor-constraint-map.mdx`
  - `app/src/content/signals/signal-ontario-housing-supply-progress-local-capacity-signal.mdx`
  - `app/src/content/signals/signal-statcan-building-permits-construction-intentions-signal.mdx`
- Refreshed source check:
  - `app/src/content/sources/source-iea-ai.json`

## Source Choices

Phase 15 used official or primary institutional sources:

- International Energy Agency artificial intelligence analysis
- U.S. Energy Information Administration electricity data
- U.S. Energy Information Administration Arizona electricity profile
- Arizona Department of Water Resources
- Arizona Corporation Commission utilities division
- Government of Ontario housing supply progress tracker
- Canada Mortgage and Housing Corporation housing market information portal
- Statistics Canada Building Permits Survey

These sources support baseline context, evidence anchors, and constraint questions. They do not support facility-level, municipality-level, utility-service-territory, or project-financing conclusions by themselves.

## Implementation Notes

- `signal-sample-009` moved from `Draft Sample` to `In Review`.
- Four new signals were added as `In Review`.
- All five Phase 15 signals remain unpublished.
- Local implications were written cautiously and framed around evidence requirements.
- No automation, ingestion, dependencies, schema changes, or numeric 42/59 scoring were added.
- Company claims were not elevated.

## Validation

```text
npm run check: 0 errors, 0 warnings, 0 hints
npm run build: 63 pages generated
```

## Preview Notes

Preview the following routes after build:

- `/signals/`
- `/signals/ai-electricity-demand-compute-grid-constraint-signal/`
- `/signals/eia-arizona-electricity-profile-chip-corridor-power-questions/`
- `/signals/ontario-housing-supply-progress-local-capacity-signal/`

Actual result:

- signal index shows 14 signal cards and includes `In Review` records,
- AI electricity detail page shows `In Review`, 2 source links, and 1 receiving-system link,
- Arizona electricity detail page shows `In Review`, 3 source links, and 1 receiving-system link,
- Ontario housing detail page shows `In Review`, 2 source links, and 1 receiving-system link,
- no horizontal overflow appeared on the checked routes.

## Acceptance Criteria

- Phase 15 work package exists.
- A small second reviewed content batch exists.
- The AI electricity demand sample is repaired and more specific.
- Energy/grid, water, Ontario housing, and building permit signals are represented.
- All Phase 15 records remain `In Review`.
- Unsupported local conclusions are avoided.
- `npm run check` passes.
- `npm run build` passes.
- The roadmap identifies the next phase.

## Open Questions

- Which briefing should be the first real editorial synthesis piece?
- Should the first briefing remain internal until all referenced signals move from `In Review` to `Published`?
- Should FTFN add a formal `briefing_status` or reuse the current record-status approach for briefings?
- When should source cards become a reusable component across all record types?

## Next Phase

Phase 16 should create the first evidence-backed briefing draft and test how reviewed signals become editorial synthesis.
